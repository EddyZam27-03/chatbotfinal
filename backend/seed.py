"""
seed.py
────────
Inicializa los archivos JSON con datos de ejemplo.
Ejecutar UNA SOLA VEZ antes de arrancar el backend por primera vez.

Uso:
    python seed.py

Genera:
  - Un usuario administrador por defecto
  - 3 noticias de ejemplo
  - 4 docentes de ejemplo
  - 5 preguntas FAQ de ejemplo
  - 5 entradas en la knowledge base del chatbot
"""

from datetime import datetime, timezone
from pathlib import Path
import bcrypt

from config import settings
from utils.file_handler import write_json
from utils.uuid_helper import generate_uuid


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_password_simple(plain_password: str) -> str:
    """Genera hash bcrypt directamente sin passlib."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def seed_admin_users():
    print("→ Creando usuario administrador...")

    admin_id = generate_uuid()
    users = [
        {
            "id": admin_id,
            "username": "admin",
            "email": "admin@uleam.edu.ec",
            "password_hash": hash_password_simple("admin123"),
            "nombre_completo": "Administrador del Sistema",
            "rol": "superadmin",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "ultimo_acceso": None,
        }
    ]

    write_json(settings.FILE_USERS, users)
    print(f"  ✓ Usuario: admin | Contraseña: admin123 | Rol: superadmin")
    return admin_id


def seed_noticias(admin_id: str):
    print("→ Creando noticias de ejemplo...")

    noticias = [
        {
            "id": generate_uuid(),
            "titulo": "Inauguración de Nuevas Instalaciones en El Carmen",
            "imagen_url": None,
            "descripcion": (
                "La ULEAM Extensión El Carmen celebró la inauguración de sus nuevas "
                "instalaciones académicas, que incluyen laboratorios equipados, aulas "
                "interactivas y espacios de estudio colaborativo para los estudiantes "
                "de la carrera de Administración de Empresas."
            ),
            "categoria": "Infraestructura",
            "activo": True,
            "fecha": "2026-03-15",
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "titulo": "Estudiantes ULEAM Ganan Concurso Nacional de Emprendimiento",
            "imagen_url": None,
            "descripcion": (
                "Un equipo de cinco estudiantes de la carrera de Administración de "
                "Empresas representó a la ULEAM en el Concurso Nacional de Emprendimiento "
                "Universitario, obteniendo el primer lugar con su proyecto de agricultura "
                "sostenible para la zona tropical húmeda de Manabí."
            ),
            "categoria": "Logros Estudiantiles",
            "activo": True,
            "fecha": "2026-02-28",
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "titulo": "Proceso de Admisión 2026 — Segunda Fase Abierta",
            "imagen_url": None,
            "descripcion": (
                "La ULEAM Extensión El Carmen anuncia la apertura de la segunda fase "
                "del proceso de admisión para el ciclo académico 2026. Los aspirantes "
                "pueden presentar su documentación en secretaría hasta el 30 de junio. "
                "Se ofrecen 60 cupos para la carrera de Administración de Empresas."
            ),
            "categoria": "Académico",
            "activo": True,
            "fecha": "2026-06-01",
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
    ]

    write_json(settings.FILE_NOTICIAS, noticias)
    print(f"  ✓ {len(noticias)} noticias creadas")


def seed_docentes(admin_id: str):
    print("→ Creando docentes de ejemplo...")

    docentes = [
        {
            "id": generate_uuid(),
            "nombre": "Dr. Carlos Mendoza Zambrano",
            "email": "carlos.mendoza@uleam.edu.ec",
            "foto_url": None,
            "materias": "Administración Estratégica, Gestión Empresarial",
            "especialidad": "Administración Estratégica",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "nombre": "Mgs. Ana Lucía Torres Ponce",
            "email": "ana.torres@uleam.edu.ec",
            "foto_url": None,
            "materias": "Contabilidad General, Finanzas Empresariales",
            "especialidad": "Contabilidad y Finanzas",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "nombre": "Ing. Roberto Cedeño Alcívar",
            "email": "roberto.cedeno@uleam.edu.ec",
            "foto_url": None,
            "materias": "Marketing Digital, Investigación de Mercados",
            "especialidad": "Marketing y Comercio",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
        {
            "id": generate_uuid(),
            "nombre": "Mgs. Patricia Vera Intriago",
            "email": "patricia.vera@uleam.edu.ec",
            "foto_url": None,
            "materias": "Recursos Humanos, Comportamiento Organizacional",
            "especialidad": "Gestión del Talento Humano",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
            "created_by": admin_id,
        },
    ]

    write_json(settings.FILE_DOCENTES, docentes)
    print(f"  ✓ {len(docentes)} docentes creados")


def seed_faq():
    print("→ Creando preguntas frecuentes...")

    faqs = [
        {
            "id": generate_uuid(),
            "pregunta": "¿Cuáles son los requisitos para ingresar a la carrera?",
            "respuesta": (
                "Para ingresar a la carrera de Administración de Empresas necesitas:\n\n"
                "- **Bachillerato completo** (título de bachiller o acta de grado)\n"
                "- **Cédula de identidad** vigente\n"
                "- **Certificado de votación** (si aplica)\n"
                "- **Puntaje SENESCYT** vigente\n"
                "- **2 fotografías** tamaño carnet en fondo blanco\n\n"
                "Presentar la documentación original y una copia en secretaría."
            ),
            "categoria": "Admisión",
            "orden": 1,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "pregunta": "¿Cuál es el costo de la matrícula?",
            "respuesta": (
                "La ULEAM es una institución de educación superior pública, por lo tanto "
                "**la matrícula es gratuita** para todos los estudiantes regulares.\n\n"
                "Sin embargo, existen algunos costos administrativos mínimos:\n"
                "- Derecho de matrícula: $25 USD\n"
                "- Seguro estudiantil: $15 USD\n"
                "- Materiales de laboratorio (si aplica): variable\n\n"
                "Para información actualizada sobre aranceles, consulta en secretaría."
            ),
            "categoria": "Pagos",
            "orden": 2,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "pregunta": "¿Cuánto dura la carrera de Administración de Empresas?",
            "respuesta": (
                "La carrera de **Administración de Empresas** tiene una duración de:\n\n"
                "- **8 semestres** (4 años) para obtener el título de Tecnólogo\n"
                "- **10 semestres** (5 años) para obtener la Licenciatura\n\n"
                "Más el tiempo dedicado al trabajo de titulación y prácticas preprofesionales.\n\n"
                "El plan de estudios incluye materias de formación básica, profesional "
                "y optativas de especialización."
            ),
            "categoria": "Académico",
            "orden": 3,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "pregunta": "¿Cuáles son los horarios de atención en secretaría?",
            "respuesta": (
                "La secretaría de la ULEAM Extensión El Carmen atiende:\n\n"
                "📅 **Lunes a Viernes:**\n"
                "- Mañana: 8:00 AM – 12:30 PM\n"
                "- Tarde: 2:30 PM – 6:00 PM\n\n"
                "📅 **Sábados:** 8:00 AM – 12:00 PM\n\n"
                "📍 **Ubicación:** Av. Universitaria, El Carmen, Manabí\n"
                "📞 **Teléfono:** (05) 276-xxxx"
            ),
            "categoria": "Horarios",
            "orden": 4,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "pregunta": "¿Cómo puedo obtener mi certificado de matrícula?",
            "respuesta": (
                "Para obtener tu certificado de matrícula:\n\n"
                "1. Acércate a **secretaría** con tu cédula de identidad\n"
                "2. Solicita el certificado indicando el período académico\n"
                "3. El trámite demora **1 a 2 días hábiles**\n"
                "4. El costo es de **$2 USD** por certificado\n\n"
                "También puedes solicitarlo por correo a: secretaria.elcarmen@uleam.edu.ec"
            ),
            "categoria": "Trámites",
            "orden": 5,
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
    ]

    write_json(settings.FILE_FAQ, faqs)
    print(f"  ✓ {len(faqs)} preguntas FAQ creadas")


def seed_chatbot():
    print("→ Creando knowledge base del chatbot...")

    knowledge = [
        {
            "id": generate_uuid(),
            "keywords": ["matricula", "matricular", "inscripcion", "inscribir", "registro", "registrar"],
            "respuesta": (
                "Para **matricularte** en la ULEAM Extensión El Carmen necesitas:\n\n"
                "📋 **Documentos requeridos:**\n"
                "- Título de bachiller o acta de grado\n"
                "- Cédula de identidad\n"
                "- Puntaje SENESCYT vigente\n"
                "- Certificado de votación\n"
                "- 2 fotos tamaño carnet\n\n"
                "📍 Preséntate en secretaría de lunes a viernes de 8:00 AM a 6:00 PM."
            ),
            "categoria": "Matrícula",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "keywords": ["requisito", "ingreso", "admision", "ingresar", "postular"],
            "respuesta": (
                "Los **requisitos de admisión** para la ULEAM son:\n\n"
                "✅ Bachillerato completo\n"
                "✅ Cédula de identidad vigente\n"
                "✅ Puntaje SENESCYT\n"
                "✅ Certificado de votación\n"
                "✅ 2 fotografías carnet fondo blanco\n\n"
                "El proceso de admisión se abre dos veces al año. "
                "Consulta las fechas en nuestras [noticias](/noticias)."
            ),
            "categoria": "Admisión",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "keywords": ["malla", "materias", "plan", "pensum", "asignaturas", "curriculum"],
            "respuesta": (
                "La **malla curricular** de Administración de Empresas incluye:\n\n"
                "📚 **Área Básica (1-2 semestre):**\n"
                "- Matemáticas, Estadística, Comunicación\n\n"
                "📚 **Área Profesional (3-8 semestre):**\n"
                "- Administración, Finanzas, Marketing, RRHH\n\n"
                "📚 **Área de Especialización (9-10 semestre):**\n"
                "- Optativas según tu perfil profesional\n\n"
                "Descarga la malla completa en nuestra sección de [Documentos](/documentos)."
            ),
            "categoria": "Malla Curricular",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "keywords": ["costo", "precio", "pagar", "arancel", "cuanto", "valor", "gratuito"],
            "respuesta": (
                "La ULEAM es una **universidad pública**, por lo que la educación "
                "es gratuita para los estudiantes regulares.\n\n"
                "💰 **Costos administrativos aproximados:**\n"
                "- Derecho de matrícula: $25 USD\n"
                "- Seguro estudiantil: $15 USD\n\n"
                "Para información exacta y actualizada, consulta en secretaría "
                "o revisa los [Aranceles oficiales](/documentos)."
            ),
            "categoria": "Costos",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
        {
            "id": generate_uuid(),
            "keywords": ["contacto", "telefono", "correo", "email", "direccion", "donde", "ubicacion"],
            "respuesta": (
                "📍 **ULEAM Extensión El Carmen**\n\n"
                "**Dirección:** Av. Universitaria s/n, El Carmen, Manabí, Ecuador\n\n"
                "📞 **Teléfono:** (05) 276-xxxx\n\n"
                "📧 **Email:** extensionelcarmen@uleam.edu.ec\n\n"
                "🕐 **Horario de atención:**\n"
                "Lunes a Viernes: 8:00 AM – 12:30 PM y 2:30 PM – 6:00 PM\n"
                "Sábados: 8:00 AM – 12:00 PM"
            ),
            "categoria": "Contacto",
            "activo": True,
            "created_at": now(),
            "updated_at": now(),
        },
    ]

    write_json(settings.FILE_CHATBOT, knowledge)
    print(f"  ✓ {len(knowledge)} entradas de chatbot creadas")


def seed_documentos():
    """Crea un archivo JSON vacío para documentos."""
    write_json(settings.FILE_DOCUMENTOS, [])
    print("  ✓ Archivo de documentos inicializado (vacío)")


if __name__ == "__main__":
    print("\n🌱 Iniciando seed de datos para ULEAM Backend...\n")

    admin_id = seed_admin_users()
    seed_noticias(admin_id)
    seed_docentes(admin_id)
    seed_faq()
    seed_chatbot()
    seed_documentos()

    print("\n✅ Seed completado exitosamente.\n")
    print("Credenciales del administrador:")
    print("  Usuario:    admin")
    print("  Contraseña: admin123")
    print("\nAhora puedes ejecutar el backend con:")
    print("  uvicorn main:app --host 0.0.0.0 --port 8000 --reload\n")
