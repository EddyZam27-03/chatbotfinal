"""
utils/uuid_helper.py
─────────────────────
Generación de identificadores únicos.
No depende de ninguna base de datos.
"""

import uuid


def generate_uuid() -> str:
    """
    Genera un UUID v4 único como string.

    Ejemplo de salida: '550e8400-e29b-41d4-a716-446655440000'

    Returns:
        String con UUID v4.
    """
    return str(uuid.uuid4())


def is_valid_uuid(value: str) -> bool:
    """
    Verifica si un string es un UUID v4 válido.

    Args:
        value: String a verificar.

    Returns:
        True si es UUID válido, False en caso contrario.
    """
    try:
        uuid.UUID(str(value), version=4)
        return True
    except ValueError:
        return False
