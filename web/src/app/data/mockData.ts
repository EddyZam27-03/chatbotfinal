// ===================================
// DATOS CENTRALIZADOS DEL SISTEMA
// ===================================
// Este archivo contiene TODOS los datos mock del sistema.
// Tanto admin como páginas públicas usan estos datos.

export interface Docente {
  id: string;
  nombre: string;
  foto: string;
  materias: string;
  email?: string;
  especialidad?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  imagen: string;
  descripcion: string;
  categoria: string;
  activo: boolean;
  fecha: string;
  createdAt: string;
  updatedAt: string;
}

export interface Documento {
  id: string;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileSize: string;
  active: boolean;
  uploadDate: string;
  lastModified: string;
}

// ===================================
// DOCENTES
// ===================================
export const DOCENTES_DATA: Docente[] = [
  {
    id: '1',
    nombre: 'Dr. Carlos Mendoza Paredes',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    materias: 'Administración Estratégica, Gestión Empresarial',
    email: 'carlos.mendoza@uleam.edu.ec',
    especialidad: 'Administración Estratégica',
    activo: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    nombre: 'Msc. Ana María Torres',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    materias: 'Contabilidad General, Auditoría Financiera',
    email: 'ana.torres@uleam.edu.ec',
    especialidad: 'Contabilidad y Auditoría',
    activo: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-03-05',
  },
  {
    id: '3',
    nombre: 'Ing. Roberto Salazar Cruz',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    materias: 'Economía Empresarial, Microeconomía, Macroeconomía',
    email: 'roberto.salazar@uleam.edu.ec',
    especialidad: 'Economía Empresarial',
    activo: true,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
  {
    id: '4',
    nombre: 'Dra. Patricia Gómez Valdez',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    materias: 'Marketing Digital, Investigación de Mercados',
    email: 'patricia.gomez@uleam.edu.ec',
    especialidad: 'Marketing y Comunicación',
    activo: false,
    createdAt: '2023-12-01',
    updatedAt: '2024-01-10',
  },
  {
    id: '5',
    nombre: 'Msc. Fernando Ochoa Ramírez',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    materias: 'Gestión de Recursos Humanos, Comportamiento Organizacional',
    email: 'fernando.ochoa@uleam.edu.ec',
    especialidad: 'Recursos Humanos',
    activo: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '6',
    nombre: 'Ing. María Fernanda Loor',
    foto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    materias: 'Matemáticas Financieras, Análisis Cuantitativo',
    email: 'maria.loor@uleam.edu.ec',
    especialidad: 'Finanzas Cuantitativas',
    activo: true,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
  },
];

// ===================================
// NOTICIAS
// ===================================
export const NOTICIAS_DATA: Noticia[] = [
  {
    id: '1',
    titulo: 'Inauguración de Nuevas Instalaciones de la Carrera de Administración',
    imagen: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop',
    descripcion: 'La Universidad ULEAM Extensión El Carmen celebró la inauguración de modernas instalaciones equipadas con tecnología de punta para mejorar la experiencia académica de los estudiantes de Administración. Las nuevas aulas cuentan con proyectores 4K, sistemas de audio envolvente y mobiliario ergonómico que facilita el aprendizaje colaborativo. Este proyecto representa una inversión significativa en la educación superior de la región.',
    categoria: 'Infraestructura',
    activo: true,
    fecha: '2024-04-15',
    createdAt: '2024-04-15',
    updatedAt: '2024-04-15',
  },
  {
    id: '2',
    titulo: 'Estudiantes de Administración Ganan Concurso Nacional de Emprendimiento',
    imagen: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop',
    descripcion: 'Un grupo de estudiantes de tercer nivel obtuvo el primer lugar en el Concurso Nacional de Emprendimiento Universitario con su innovador proyecto de gestión sostenible para pequeñas empresas. El proyecto "EcoGestión" propone un modelo de negocio que integra principios de economía circular y responsabilidad social empresarial. Los ganadores recibirán un premio de $5,000 USD y asesoría empresarial durante un año.',
    categoria: 'Logros Estudiantiles',
    activo: true,
    fecha: '2024-03-28',
    createdAt: '2024-03-28',
    updatedAt: '2024-03-28',
  },
  {
    id: '3',
    titulo: 'Convenio de Cooperación con Cámara de Comercio Local',
    imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
    descripcion: 'La carrera firmó un importante convenio con la Cámara de Comercio de El Carmen para ofrecer prácticas preprofesionales y oportunidades laborales a nuestros estudiantes. Este acuerdo permitirá que más de 50 estudiantes por semestre realicen pasantías en empresas locales, fortaleciendo el vínculo entre la academia y el sector productivo. Además, se desarrollarán programas de capacitación conjunta para empresarios de la zona.',
    categoria: 'Convenios',
    activo: true,
    fecha: '2024-03-10',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
  },
  {
    id: '4',
    titulo: 'Seminario Internacional de Gestión Empresarial 2024',
    imagen: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=450&fit=crop',
    descripcion: 'Se llevó a cabo exitosamente el Seminario Internacional con la participación de reconocidos expertos en administración y gestión empresarial de Ecuador y Latinoamérica. Durante tres días, más de 300 participantes asistieron a conferencias magistrales, talleres prácticos y paneles de discusión sobre temas como transformación digital, liderazgo 4.0 y gestión de la innovación. El evento contó con la presencia de directivos de empresas Fortune 500.',
    categoria: 'Eventos',
    activo: false,
    fecha: '2024-02-20',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-01',
  },
  {
    id: '5',
    titulo: 'Proceso de Matrícula para el Período 2024-2025',
    imagen: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
    descripcion: 'Inician las matrículas ordinarias para el nuevo período académico. Los estudiantes pueden realizar su inscripción a través del sistema en línea hasta el 15 de mayo. El proceso incluye la selección de asignaturas, confirmación de datos personales y pago de aranceles. Se recomienda a los estudiantes revisar los prerequisitos de cada materia y planificar su carga académica con anticipación. La plataforma estará disponible 24/7 durante el período de matrículas.',
    categoria: 'Académico',
    activo: true,
    fecha: '2024-04-01',
    createdAt: '2024-04-01',
    updatedAt: '2024-04-01',
  },
  {
    id: '6',
    titulo: 'Docentes de ULEAM Publican Investigación sobre Gestión Sostenible',
    imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop',
    descripcion: 'Un grupo de docentes de la carrera publicó un importante estudio sobre prácticas de gestión sostenible en empresas ecuatorianas en una revista internacional indexada. La investigación analizó 120 empresas medianas del país y encontró que aquellas que implementan prácticas sostenibles tienen un 23% más de rentabilidad a largo plazo. El artículo fue publicado en el Journal of Sustainable Business Management.',
    categoria: 'Investigación',
    activo: true,
    fecha: '2024-02-15',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
  },
  {
    id: '7',
    titulo: 'Feria de Emprendimiento Estudiantil 2024',
    imagen: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=450&fit=crop',
    descripcion: 'Los estudiantes presentaron más de 30 proyectos innovadores de emprendimiento en la feria anual, destacando soluciones tecnológicas para problemáticas locales. Entre los proyectos más destacados se encuentran una aplicación móvil para gestión de residuos, una plataforma de comercio electrónico para agricultores locales, y un sistema de logística colaborativa para pequeños transportistas. Los tres mejores proyectos recibieron financiamiento inicial.',
    categoria: 'Eventos',
    activo: true,
    fecha: '2024-01-20',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '8',
    titulo: 'Actualización del Plan de Estudios de la Carrera',
    imagen: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop',
    descripcion: 'El Consejo Académico aprobó la actualización del plan de estudios incorporando nuevas asignaturas de marketing digital, analítica de datos y gestión de proyectos ágiles. Los cambios entrarán en vigor a partir del próximo período académico y buscan alinear la formación con las demandas actuales del mercado laboral. Se mantiene la duración de la carrera en 8 semestres y se fortalece el componente práctico.',
    categoria: 'Académico',
    activo: true,
    fecha: '2024-01-10',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
];

// ===================================
// DOCUMENTOS
// ===================================
export const DOCUMENTOS_DATA: Documento[] = [
  {
    id: '1',
    title: 'Reglamento Académico 2024',
    description: 'Normativa académica vigente para el período 2024',
    category: 'Reglamentos',
    fileName: 'reglamento-academico-2024.pdf',
    fileSize: '2.3 MB',
    active: true,
    uploadDate: '2024-01-15',
    lastModified: '2024-01-15',
  },
  {
    id: '2',
    title: 'Malla Curricular Administración',
    description: 'Plan de estudios completo de la carrera',
    category: 'Mallas',
    fileName: 'malla-administracion.pdf',
    fileSize: '1.8 MB',
    active: true,
    uploadDate: '2024-02-10',
    lastModified: '2024-03-05',
  },
  {
    id: '3',
    title: 'Calendario Académico 2024-2025',
    description: 'Fechas importantes del año académico',
    category: 'Calendarios',
    fileName: 'calendario-2024-2025.xlsx',
    fileSize: '456 KB',
    active: true,
    uploadDate: '2024-03-20',
    lastModified: '2024-03-20',
  },
  {
    id: '4',
    title: 'Guía de Admisión',
    description: 'Proceso completo de admisión a la universidad',
    category: 'Admisión',
    fileName: 'guia-admision.pdf',
    fileSize: '3.1 MB',
    active: false,
    uploadDate: '2023-12-01',
    lastModified: '2024-01-10',
  },
];

// ===================================
// CATEGORÍAS
// ===================================
export const CATEGORIAS_DOCUMENTOS = [
  'Reglamentos',
  'Mallas',
  'Calendarios',
  'Admisión',
  'Aranceles',
  'Otros'
];

export const CATEGORIAS_NOTICIAS = [
  'Infraestructura',
  'Logros Estudiantiles',
  'Convenios',
  'Eventos',
  'Académico',
  'Investigación'
];
