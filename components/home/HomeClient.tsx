"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/home-content";
import { DEFAULT_METRICS, DEFAULT_SERVICES, DEFAULT_ABOUT } from "@/lib/home-defaults";
import Navbar from "@/components/home/sections/Navbar";
import Hero from "@/components/home/sections/Hero";
import Clients from "@/components/home/sections/Clients";
import Story from "@/components/home/sections/Story";
import About from "@/components/home/sections/About";
import Projects from "@/components/home/sections/Projects";
import Services from "@/components/home/sections/Services";
import Testimonials from "@/components/home/sections/Testimonials";
import LeadMagnet from "@/components/home/sections/LeadMagnet";
import Stack from "@/components/home/sections/Stack";
import Contact from "@/components/home/sections/Contact";
import Footer from "@/components/home/sections/Footer";

export default function HomeClient({ content }: { content?: HomeContent | null }) {
  // Cada campo cae a su default si la DB no tiene contenido → la home se ve
  // idéntica a antes hasta que se edite desde /admin/home.
  const metrics =
    content?.metrics && content.metrics.length > 0 ? content.metrics : DEFAULT_METRICS;
  const services =
    content?.services && content.services.length > 0 ? content.services : DEFAULT_SERVICES;
  const about = content?.about ?? DEFAULT_ABOUT;
  const aboutParasEn = about.body_en.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  const aboutParasEs = about.body_es.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

  const [lang, setLangState] = useState<"en" | "es">("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [contactStatus, setContactStatus] = useState<{ kind: "ok" | "error"; msg: string } | null>(null);

  useEffect(() => {
    const saved = (localStorage.getItem("lang") as "en" | "es") || "en";
    setLangState(saved);
  }, []);

  useEffect(() => {
    document.body.className = `lang-${lang}`;
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function toggleProject(id: string) {
    setOpenProject((prev) => (prev === id ? null : id));
  }

  async function handleLeadSubmit() {
    if (!leadEmail || !leadEmail.includes("@")) {
      setLeadError("Please enter a valid email. / Ingresa un email válido.");
      return;
    }
    if (!leadConsent) {
      setLeadError(
        "Please check the consent box to continue. / Marca la casilla de consentimiento para continuar."
      );
      return;
    }
    setLeadError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, source: "lead-magnet" }),
      });
      if (!res.ok) throw new Error();
      setLeadEmail("");
      setLeadConsent(false);
      setLeadDone(true);
    } catch {
      setLeadError(
        "No se pudo enviar. Inténtalo de nuevo o escríbeme por email. / Couldn't send. Try again or email me."
      );
    }
  }

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Honeypot: si 'website' viene relleno, es un bot.
    if (fd.get("website")) return;
    const payload = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      project_type: String(fd.get("project_type") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    if (!payload.name || !payload.email.includes("@")) {
      setContactStatus({
        kind: "error",
        msg: "Completa tu nombre y un email válido. / Add your name and a valid email.",
      });
      return;
    }
    setContactStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setContactStatus({
        kind: "ok",
        msg: "¡Mensaje enviado! Te respondo en menos de 24h. / Message sent — I'll reply within 24h.",
      });
      form.reset();
    } catch {
      setContactStatus({
        kind: "error",
        msg: "No se pudo enviar. Inténtalo de nuevo o escríbeme por email. / Couldn't send. Try again or email me.",
      });
    }
  }

  return (
    <>
      <Navbar
        lang={lang}
        setLangState={setLangState}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Hero />
      <Clients />
      <Story />
      <About metrics={metrics} aboutParasEn={aboutParasEn} aboutParasEs={aboutParasEs} />
      <Projects openProject={openProject} toggleProject={toggleProject} />
      <Services services={services} />
      <Testimonials />
      <LeadMagnet
        leadEmail={leadEmail}
        setLeadEmail={setLeadEmail}
        leadConsent={leadConsent}
        setLeadConsent={setLeadConsent}
        leadDone={leadDone}
        leadError={leadError}
        handleLeadSubmit={handleLeadSubmit}
      />
      <Stack />
      <Contact handleContactSubmit={handleContactSubmit} contactStatus={contactStatus} />
      <Footer />
    </>
  );
}
