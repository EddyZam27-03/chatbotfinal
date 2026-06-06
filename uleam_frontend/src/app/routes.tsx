import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/pages/Home";
import { ChatbotPage } from "./components/pages/ChatbotPage";
import { FAQ } from "./components/pages/FAQ";
import { Contact } from "./components/pages/Contact";
import { NotFound } from "./components/pages/NotFound";
import { AdminLogin } from "./components/admin/AdminLogin";
import { Dashboard } from "./components/admin/Dashboard";
import { DocumentManagement } from "./components/admin/DocumentManagement";
import { DocumentForm } from "./components/admin/DocumentForm";
import { ChatbotManagement } from "./components/admin/ChatbotManagement";
import { FAQManagement } from "./components/admin/FAQManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "chatbot", Component: ChatbotPage },
      { path: "faq", Component: FAQ },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/app-admin",
    Component: AdminLogin,
  },
  {
    path: "/app-admin/dashboard",
    Component: Dashboard,
  },
  {
    path: "/app-admin/documents",
    Component: DocumentManagement,
  },
  {
    path: "/app-admin/documents/add",
    Component: DocumentForm,
  },
  {
    path: "/app-admin/chatbot",
    Component: ChatbotManagement,
  },
  {
    path: "/app-admin/faq",
    Component: FAQManagement,
  },
]);