"""
utils/pdf_reader.py
──────────────────
Módulo para leer PDFs y extraer texto para el chatbot RAG.
"""

import os
from pathlib import Path
from typing import List, Dict

from pypdf import PdfReader


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extrae todo el texto de un archivo PDF.

    Args:
        pdf_path: Ruta al archivo PDF.

    Returns:
        Texto extraído del PDF.
    """
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error al leer PDF {pdf_path}: {e}")
        return ""


def load_pdfs_from_directory(directory: str) -> List[Dict[str, str]]:
    """
    Carga todos los PDFs de un directorio y extrae su texto.

    Args:
        directory: Ruta al directorio que contiene los PDFs.

    Returns:
        Lista de diccionarios con nombre del archivo y texto extraído.
    """
    pdfs = []
    dir_path = Path(directory)
    
    if not dir_path.exists():
        print(f"Directorio no existe: {directory}")
        return pdfs
    
    for pdf_file in dir_path.glob("*.pdf"):
        text = extract_text_from_pdf(str(pdf_file))
        if text.strip():
            pdfs.append({
                "filename": pdf_file.name,
                "text": text
            })
    
    return pdfs


def get_combined_context(directory: str) -> str:
    """
    Combina el texto de todos los PDFs en un solo contexto.

    Args:
        directory: Ruta al directorio que contiene los PDFs.

    Returns:
        Texto combinado de todos los PDFs.
    """
    pdfs = load_pdfs_from_directory(directory)
    combined = ""
    
    for pdf in pdfs:
        combined += f"\n\n=== {pdf['filename']} ===\n{pdf['text']}\n"
    
    return combined


def search_in_pdfs(query: str, directory: str, max_results: int = 3) -> List[Dict[str, str]]:
    """
    Busca texto relevante en los PDFs basado en una consulta.

    Args:
        query: Consulta de búsqueda.
        directory: Ruta al directorio que contiene los PDFs.
        max_results: Máximo de resultados a retornar.

    Returns:
        Lista de diccionarios con fragmentos relevantes.
    """
    pdfs = load_pdfs_from_directory(directory)
    results = []
    
    query_lower = query.lower()
    
    for pdf in pdfs:
        text = pdf['text']
        # Buscar fragmentos que contengan palabras de la consulta
        sentences = text.split('\n')
        for sentence in sentences:
            if query_lower in sentence.lower() and len(sentence.strip()) > 20:
                results.append({
                    "filename": pdf['filename'],
                    "text": sentence.strip()
                })
                if len(results) >= max_results:
                    return results
    
    return results
