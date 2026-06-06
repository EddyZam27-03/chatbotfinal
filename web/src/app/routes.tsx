import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/pages/Home";
import { ChatbotPage } from "./components/pages/ChatbotPage";
import { FAQ } from "./components/pages/FAQ";
import { Contact } from "./components/pages/Contact";
import { Docentes } from "./components/pages/Docentes";
import { Noticias } from "./components/pages/Noticias";
import { NotFound } from "./components/pages/NotFound";
import NoticiaDetail from "./components/pages/NoticiaDetail";
import { AdminLogin } from "./components/admin/AdminLogin";
import { Dashboard } from "./components/admin/Dashboard";
import { DocumentManagement } from "./components/admin/DocumentManagement";
import { DocumentForm } from "./components/admin/DocumentForm";
import { ChatbotManagement } from "./components/admin/ChatbotManagement";
import { FAQManagement } from "./components/admin/FAQManagement";
import { DocenteManagement } from "./components/admin/DocenteManagement";
import { DocenteForm } from "./components/admin/DocenteForm";
import { NoticiaManagement } from "./components/admin/NoticiaManagement";
import { NoticiaForm } from "./components/admin/NoticiaForm";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "docentes", Component: Docentes },
      { path: "noticias", Component: Noticias },
      { path: "noticias/:id", Component: NoticiaDetail },
      { path: "chatbot", Component: ChatbotPage },
      { path: "faq", Component: FAQ },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: Dashboard,
  },
  {
    path: "/admin/documents",
    Component: DocumentManagement,
  },
  {
    path: "/admin/documents/add",
    Component: DocumentForm,
  },
  {
    path: "/admin/documents/:id/editar",
    Component: DocumentForm,
  },
  {
    path: "/admin/chatbot",
    Component: ChatbotManagement,
  },
  {
    path: "/admin/faq",
    Component: FAQManagement,
  },
  {
    path: "/admin/docentes",
    Component: DocenteManagement,
  },
  {
    path: "/admin/docentes/add",
    Component: DocenteForm,
  },
  {
    path: "/admin/docentes/:id/editar",
    Component: DocenteForm,
  },
  {
    path: "/admin/noticias",
    Component: NoticiaManagement,
  },
  {
    path: "/admin/noticias/add",
    Component: NoticiaForm,
  },
  {
    path: "/admin/noticias/:id/editar",
    Component: NoticiaForm,
  },
]);
