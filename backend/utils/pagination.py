"""
utils/pagination.py
────────────────────
Utilidades para paginar, filtrar y ordenar
listas de registros en memoria (sin BD).
"""

from typing import Any


def paginate(
    items: list[dict],
    page: int = 1,
    limit: int = 10,
) -> dict:
    """
    Pagina una lista de elementos.

    Args:
        items: Lista completa de registros.
        page: Número de página (empieza en 1).
        limit: Cantidad de items por página.

    Returns:
        Diccionario con 'items' paginados y 'pagination' con metadata.
    """
    page = max(1, page)
    limit = max(1, min(100, limit))  # Entre 1 y 100

    total = len(items)
    total_pages = (total + limit - 1) // limit if total > 0 else 0
    start = (page - 1) * limit
    end = start + limit

    return {
        "items": items[start:end],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": total_pages,
            "hasNextPage": page < total_pages,
            "hasPrevPage": page > 1,
        },
    }


def filter_by_field(
    items: list[dict],
    field: str,
    value: Any,
) -> list[dict]:
    """
    Filtra registros por un campo y valor exacto.

    Args:
        items: Lista de registros.
        field: Nombre del campo a filtrar.
        value: Valor exacto que debe tener el campo.

    Returns:
        Lista filtrada.
    """
    return [item for item in items if item.get(field) == value]


def search_in_fields(
    items: list[dict],
    query: str,
    fields: list[str],
) -> list[dict]:
    """
    Filtra registros buscando 'query' en los campos indicados.
    La búsqueda es case-insensitive y parcial.

    Args:
        items: Lista de registros.
        query: Texto a buscar.
        fields: Lista de campos donde buscar.

    Returns:
        Lista de registros que contienen el texto en alguno de los campos.
    """
    if not query or not query.strip():
        return items

    query_lower = query.lower().strip()

    def matches(item: dict) -> bool:
        for field in fields:
            value = item.get(field)
            if value and query_lower in str(value).lower():
                return True
        return False

    return [item for item in items if matches(item)]


def sort_items(
    items: list[dict],
    sort_field: str = "created_at",
    order: str = "desc",
) -> list[dict]:
    """
    Ordena una lista de registros por un campo.

    Args:
        items: Lista de registros.
        sort_field: Campo por el que ordenar.
        order: 'asc' para ascendente, 'desc' para descendente.

    Returns:
        Lista ordenada.
    """
    reverse = order.lower() == "desc"

    def sort_key(item: dict):
        value = item.get(sort_field, "")
        return value if value is not None else ""

    try:
        return sorted(items, key=sort_key, reverse=reverse)
    except TypeError:
        return items


def filter_by_date_range(
    items: list[dict],
    date_field: str,
    fecha_desde: str | None = None,
    fecha_hasta: str | None = None,
) -> list[dict]:
    """
    Filtra registros dentro de un rango de fechas.
    Las fechas deben estar en formato ISO 'YYYY-MM-DD'.

    Args:
        items: Lista de registros.
        date_field: Campo de fecha a comparar.
        fecha_desde: Fecha inicial (inclusive).
        fecha_hasta: Fecha final (inclusive).

    Returns:
        Lista filtrada.
    """
    result = items

    if fecha_desde:
        result = [r for r in result if r.get(date_field, "") >= fecha_desde]

    if fecha_hasta:
        result = [r for r in result if r.get(date_field, "") <= fecha_hasta]

    return result
