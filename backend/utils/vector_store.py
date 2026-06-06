"""
utils/vector_store.py
──────────────────────
Búsqueda semántica con embeddings para el chatbot RAG.
Indexa PDFs en ChromaDB y busca por similitud coseno.
Usa modelo multilingüe con soporte para español.
"""

import hashlib
from pathlib import Path
from typing import List, Dict

import chromadb
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer

MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
CHROMA_PATH = "./chroma_db"

_client = None
_model = None
_collection = None


def _get_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(path=CHROMA_PATH)
    return _client


def _get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model


def _get_collection():
    global _collection
    if _collection is None:
        client = _get_client()
        _collection = client.get_or_create_collection(
            name="uleam_docs",
            metadata={"hnsw:space": "cosine"}
        )
    return _collection


def index_pdf(pdf_path: str) -> int:
    """Indexa un PDF dividiéndolo en chunks con overlap. Retorna chunks indexados."""
    try:
        reader = PdfReader(pdf_path)
    except Exception as e:
        print(f"[ERROR] No se pudo leer {pdf_path}: {e}")
        return 0

    collection = _get_collection()
    model = _get_model()
    filename = Path(pdf_path).name
    chunks = []
    ids = []

    for page_num, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        words = text.split()
        chunk_size = 80
        overlap = 15
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size]).strip()
            if len(chunk) < 50:
                continue
            chunk_id = hashlib.md5(
                f"{filename}_{page_num}_{i}".encode()
            ).hexdigest()
            chunks.append(chunk)
            ids.append(chunk_id)

    if not chunks:
        return 0

    embeddings = model.encode(chunks).tolist()
    collection.upsert(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
        metadatas=[{"filename": filename} for _ in chunks],
    )
    return len(chunks)


def index_directory(directory: str) -> Dict[str, int]:
    """Indexa todos los PDFs de un directorio. Retorna dict {filename: chunks}."""
    results = {}
    for pdf_file in Path(directory).glob("*.pdf"):
        count = index_pdf(str(pdf_file))
        results[pdf_file.name] = count
        print(f"[INDEX] {pdf_file.name}: {count} chunks")
    return results


def semantic_search(query: str, max_results: int = 5) -> List[Dict]:
    """
    Busca chunks semánticamente similares a la query.
    Retorna lista de {text, filename, score}.
    """
    collection = _get_collection()

    if collection.count() == 0:
        return []

    model = _get_model()
    query_embedding = model.encode([query]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=min(max_results, collection.count()),
    )

    if not results["documents"] or not results["documents"][0]:
        return []

    output = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        output.append({
            "text": doc,
            "filename": meta.get("filename", ""),
            "score": round(1 - dist, 3),
        })

    return output
