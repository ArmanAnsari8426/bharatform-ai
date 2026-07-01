import { AppProvider } from "./lib/context";
import { useEffect, useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import { seedDefaultAdmin } from "./lib/adminAuth";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import AnalysisModal from "./components/AnalysisModal";
import ApiKeyModal from "./components/ApiKeyModal";
import UpdatePasswordModal from "./components/UpdatePasswordModal";
import Toast from "./components/Toast";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Impact from "./components/Impact";
import EmergencyHelplines from "./components/EmergencyHelplines";
import HowItWorks from "./components/HowItWorks";
import ReadinessChecker from "./components/ReadinessChecker";
import AnalyzeCTA from "./components/AnalyzeCTA";
import GovernmentPulse from "./components/GovernmentPulse";
import ServicesDirectory from "./components/ServicesDirectory";
import IndiaHeatMap from "./components/IndiaHeatMap";
import Scholarships from "./components/Scholarships";
import Schemes from "./components/Schemes";
import Services from "./components/Services";
import AskBharatAI from "./components/AskBharatAI";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import Launch from "./components/Launch";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import AccessibilityPanel from "./components/AccessibilityPanel";
import CalendarWidget from "./components/CalendarWidget";
import FloatingChatbot from "./components/FloatingChatbot";
import Pages, { PAGE_ROUTES } from "./components/Pages";

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const route = hash.replace("#", "");
  const isPage = PAGE_ROUTES.includes(route);

  useEffect(() => {
    // Ensure admin accounts always exist (super_001 + admin_001) on every page load
    seedDefaultAdmin().catch(console.error);
  }, []);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <AppProvider>
      {hash === "#admin" ? (
        <AdminDashboard />
      ) : isPage ? (
        <>
          <Pages route={route} />
          <AuthModal />
          <AnalysisModal />
          <ApiKeyModal />
          <Toast />
          <AccessibilityPanel />
          <CalendarWidget />
          <FloatingChatbot />
        </>
      ) : (
        <div className="min-h-screen antialiased" style={{ background: "var(--bg)", color: "var(--text)" }}>
          <Navbar />
          <main>
            <Hero />
            <GovernmentPulse />
            <Features />
            <Impact />
            <EmergencyHelplines />
            <HowItWorks />
            <AnalyzeCTA />
            <IndiaHeatMap />
            <ReadinessChecker />
            <Scholarships />
            <Schemes />
            <ServicesDirectory />
            <Services />
            <AskBharatAI />
            <Testimonials />
            <Pricing />
            <Launch />
            <FAQ />
          </main>
          <Footer />

          {/* Global Modals & Notifications */}
          <AuthModal />
          <UpdatePasswordModal />
          <AnalysisModal />
          <ApiKeyModal />
          <Toast />
          <AccessibilityPanel />
          <CalendarWidget />
          <FloatingChatbot />
        </div>
      )}
    </AppProvider>
  );
}
