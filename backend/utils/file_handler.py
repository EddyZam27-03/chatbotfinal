"""
utils/file_handler.py
──────────────────────
Utilidades para leer y escribir archivos JSON.
Toda la persistencia del sistema pasa por estas funciones.
Incluye manejo de errores, bloqueo de concurrencia básico
y auto-inicialización de archivos vacíos.
"""

import json
import os
import threading
from pathlib import Path
from typing import Any

# Lock global para evitar corrupción por escrituras concurrentes
_file_locks: dict[str, threading.Lock] = {}
_lock_registry = threading.Lock()


def _get_lock(filepath: str) -> threading.Lock:
    """
    Retorna un lock único por archivo.
    Garantiza que solo un hilo escriba al mismo tiempo.
    """
    with _lock_registry:
        if filepath not in _file_locks:
            _file_locks[filepath] = threading.Lock()
        return _file_locks[filepath]


def read_json(filepath: Path) -> list[dict]:
    """
    Lee un archivo JSON y retorna su contenido como lista.

    - Si el archivo no existe, lo crea vacío automáticamente.
    - Si el JSON está corrupto, retorna lista vacía y registra el error.

    Args:
        filepath: Ruta al archivo JSON.

    Returns:
        Lista de diccionarios con los registros.
    """
    filepath = Path(filepath)

    if not filepath.exists():
        write_json(filepath, [])
        return []

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                return []
            return json.loads(content)
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON corrupto en {filepath}: {e}")
        return []
    except Exception as e:
        print(f"[ERROR] No se pudo leer {filepath}: {e}")
        return []


def write_json(filepath: Path, data: list[dict]) -> bool:
    """
    Escribe una lista de diccionarios en un archivo JSON.

    Usa un lock por archivo para evitar condiciones de carrera.
    Escribe primero en un archivo temporal y luego hace
    reemplazo atómico para evitar corrupción.

    Args:
        filepath: Ruta al archivo JSON.
        data: Lista de registros a escribir.

    Returns:
        True si la escritura fue exitosa, False si falló.
    """
    filepath = Path(filepath)
    lock = _get_lock(str(filepath))

    with lock:
        temp_path = filepath.with_suffix(".tmp")
        try:
            # Escribe en temporal primero
            with open(temp_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2, default=str)

            # Reemplazo atómico
            os.replace(temp_path, filepath)
            return True

        except Exception as e:
            print(f"[ERROR] No se pudo escribir {filepath}: {e}")
            if temp_path.exists():
                temp_path.unlink()
            return False


def find_by_id(filepath: Path, record_id: str) -> dict | None:
    """
    Busca un registro por su campo 'id'.

    Args:
        filepath: Ruta al archivo JSON.
        record_id: UUID del registro a buscar.

    Returns:
        El diccionario del registro o None si no existe.
    """
    records = read_json(filepath)
    return next((r for r in records if r.get("id") == record_id), None)


def insert_record(filepath: Path, record: dict) -> bool:
    """
    Agrega un nuevo registro al archivo JSON.

    Args:
        filepath: Ruta al archivo JSON.
        record: Diccionario con el nuevo registro.

    Returns:
        True si se insertó correctamente.
    """
    records = read_json(filepath)
    records.append(record)
    return write_json(filepath, records)


def update_record(filepath: Path, record_id: str, updates: dict) -> dict | None:
    """
    Actualiza campos de un registro existente.

    Solo actualiza los campos presentes en 'updates'.
    No borra campos existentes que no estén en 'updates'.

    Args:
        filepath: Ruta al archivo JSON.
        record_id: UUID del registro a actualizar.
        updates: Diccionario con los campos a modificar.

    Returns:
        El registro actualizado o None si no se encontró.
    """
    records = read_json(filepath)
    updated = None

    for i, record in enumerate(records):
        if record.get("id") == record_id:
            records[i] = {**record, **updates}
            updated = records[i]
            break

    if updated is None:
        return None

    write_json(filepath, records)
    return updated


def delete_record(filepath: Path, record_id: str) -> bool:
    """
    Elimina un registro del archivo JSON por su ID.

    Args:
        filepath: Ruta al archivo JSON.
        record_id: UUID del registro a eliminar.

    Returns:
        True si se eliminó, False si no se encontró.
    """
    records = read_json(filepath)
    original_count = len(records)
    records = [r for r in records if r.get("id") != record_id]

    if len(records) == original_count:
        return False

    write_json(filepath, records)
    return True


def bulk_delete(filepath: Path, ids: list[str]) -> int:
    """
    Elimina múltiples registros del archivo JSON.

    Args:
        filepath: Ruta al archivo JSON.
        ids: Lista de UUIDs a eliminar.

    Returns:
        Cantidad de registros eliminados efectivamente.
    """
    records = read_json(filepath)
    ids_set = set(ids)
    original_count = len(records)
    records = [r for r in records if r.get("id") not in ids_set]
    deleted_count = original_count - len(records)
    write_json(filepath, records)
    return deleted_count


def count_records(filepath: Path) -> int:
    """Retorna la cantidad total de registros en el archivo."""
    return len(read_json(filepath))
