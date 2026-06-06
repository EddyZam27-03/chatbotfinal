import { Outlet, useLocation } from "react-router";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";
import { ChatbotWidget } from "./chatbot/ChatbotWidget";

export function Root() {
  const location = useLocation();
  
  // Don't show widget on the chatbot full page to avoid duplication
  const showWidget = location.pathname !== "/chatbot";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showWidget && <ChatbotWidget />}
    </div>
  );
}
