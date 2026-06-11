"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  CheckCircle,
  Code2,
  Database,
  FileSearch,
  Globe,
  Languages,
  Mail,
  Quote,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import "./luxarmonie.css";

export default function LuxarmonieClient() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );
    document
      .querySelectorAll(".scroll-animate")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="luxarmonie-body">
      <div className="fixed inset-0 pointer-events-none opacity-30 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-electric blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <nav className="luxarmonie-navbar">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter gradient-text"
            >
              DQ
            </Link>
            <Link
              href="/lumen#projects"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-electric transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Projects
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-widest text-electric uppercase bg-electric/10 border border-electric/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Case Study · Lighting E-commerce
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-widest text-white/40 uppercase bg-white/5 border border-white/10 rounded-full">
              France · Europe
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Luxarmonie <span className="gradient-text">Product</span>
            <br />
            Intelligence
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl leading-relaxed font-light mb-12">
            A French lighting e-commerce was spending 40 hours a month
            hand-extracting specs from inconsistent supplier catalogs. We turned
            that into an automated extraction pipeline — and an ongoing technical
            review that keeps the catalog accurate as new products arrive.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-xl">
            {[
              { n: "−75%", l: "Manual load" },
              { n: "99.2%", l: "Data integrity" },
              { n: "30h", l: "Reclaimed / month" },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl font-black text-white mb-1">{s.n}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-gray-500">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/projects/1.jpg"
              alt="Luxarmonie product-data pipeline dashboard"
              className="w-full object-cover max-h-[500px] object-top group-hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-24">
          <section className="scroll-animate">
            <div className="divider" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 text-lg leading-relaxed">
              <p>
                Luxarmonie is a French e-commerce brand selling professional and
                commercial lighting, sourced largely from manufacturers in China.
                Their growth depended on listing products fast — but every new
                product first had to be understood, technically, before it could
                be sold.
              </p>
              <p>
                Supplier data arrived in whatever format each factory used: PDFs,
                spreadsheets, mixed languages and units, specs buried in product
                images. Someone had to read all of it, extract the real technical
                values, and turn them into clean listings a buyer could trust.
              </p>
            </div>
          </section>

          <section className="scroll-animate">
            <div className="divider" />
            <h2 className="text-3xl md:text-4xl font-bold mb-8">The Problem</h2>
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    40 hours a month that couldn&apos;t scale
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Extracting specs by hand took roughly 40 hours every month —
                    slow, draining, and impossible to grow without hiring. Worse,
                    manual transcription introduced errors into technical specs,
                    and in lighting an inaccurate lumen, CCT, or IP rating quietly
                    erodes buyer trust.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {[
                  "Supplier formats inconsistent and unstructured",
                  "Manual extraction error-prone and slow",
                  "No way to scale listings without scaling headcount",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-start gap-3 text-sm text-gray-500"
                  >
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="scroll-animate">
            <div className="divider" />
            <h2 className="text-3xl md:text-4xl font-bold mb-10">The Process</h2>
            <div className="space-y-6">
              <Step
                n="01"
                title="A canonical spec model"
                copy="Before automating anything, we defined the single source of truth: a normalized schema for every value that matters in a lighting listing — lumen output, CCT, CRI, IP rating, wattage, beam angle, dimensions, materials. Inconsistent supplier data now had one target to map to."
                chips={[
                  { icon: <Database className="w-3 h-3" />, label: "Data Modeling" },
                  { icon: <Boxes className="w-3 h-3" />, label: "Spec Normalization" },
                ]}
              />
              <Step
                n="02"
                title="An intelligent extraction pipeline"
                copy="Built in Python with the Claude API: the pipeline reads supplier PDFs and documents, extracts the technical specs wherever they hide, normalizes them into the schema, and flags anything ambiguous for human review instead of guessing. What took a day now runs in minutes."
                chips={[
                  { icon: <Code2 className="w-3 h-3" />, label: "Python" },
                  { icon: <Sparkles className="w-3 h-3" />, label: "Claude API" },
                  { icon: <ScanLine className="w-3 h-3" />, label: "PDF Extraction" },
                ]}
                delay={100}
              />
              <Step
                n="03"
                title="E-commerce output + ongoing technical review"
                copy="The clean data feeds straight into e-commerce-ready product descriptions. And because new products keep arriving, the engagement didn't end at delivery — it became a continuous technical review, validating specs against the suppliers in China so the catalog stays accurate as it grows."
                chips={[
                  { icon: <Languages className="w-3 h-3" />, label: "Description Gen" },
                  { icon: <RefreshCw className="w-3 h-3" />, label: "Continuous Review" },
                  { icon: <Globe className="w-3 h-3" />, label: "Supplier Validation" },
                ]}
                delay={200}
              />
            </div>
          </section>

          <section className="scroll-animate">
            <div className="divider" />
            <h2 className="text-3xl md:text-4xl font-bold mb-8">The Results</h2>
            <div className="space-y-4">
              {[
                {
                  t: "Manual load cut from 40h to 10h per month (−75%)",
                  c: "The bulk of spec extraction now runs automatically. The team spends its time reviewing edge cases and selling — not transcribing datasheets.",
                },
                {
                  t: "99.2% data integrity across the catalog",
                  c: "Normalized extraction plus human-in-the-loop validation removed the silent transcription errors that used to slip into technical specs.",
                },
                {
                  t: "Listings that scale with the catalog, not the headcount",
                  c: "New products are processed in minutes, and ongoing technical review keeps the data trustworthy as the catalog grows — a relationship, not a one-off delivery.",
                },
              ].map((r) => (
                <div key={r.t} className="result-item">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-1">{r.t}</div>
                    <div className="text-sm text-gray-400">{r.c}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="scroll-animate">
            <div className="divider" />
            <div className="testimonial-card">
              <Quote className="w-8 h-8 text-electric mb-5" />
              <p className="testimonial-quote mb-6">
                Diego transformed our product documentation process. What used to
                take our team 40 hours a month now runs automatically. The
                accuracy is remarkable — no more manual errors in technical specs.
              </p>
              <div className="text-sm font-bold text-white">
                CEO ·{" "}
                <span className="text-electric">Luxarmonie</span>, France
              </div>
            </div>
          </section>

          <section className="scroll-animate">
            <div className="divider" />
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Tools Used</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Code2 className="w-3.5 h-3.5 text-electric" />, label: "Python" },
                { icon: <Sparkles className="w-3.5 h-3.5 text-electric" />, label: "Claude API" },
                { icon: <ScanLine className="w-3.5 h-3.5 text-electric" />, label: "PDF Extraction" },
                { icon: <Database className="w-3.5 h-3.5 text-electric" />, label: "Data Normalization" },
                { icon: <FileSearch className="w-3.5 h-3.5 text-electric" />, label: "Spec Validation" },
                { icon: <ShieldCheck className="w-3.5 h-3.5 text-electric" />, label: "Technical Review" },
              ].map((c) => (
                <span key={c.label} className="tool-chip">
                  {c.icon} {c.label}
                </span>
              ))}
            </div>
          </section>

          <section className="scroll-animate pb-24">
            <div className="bg-electric/5 border border-electric/20 rounded-3xl p-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Drowning in supplier catalogs?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                If your lighting catalog grows faster than your team can keep its
                specs accurate, I build the pipeline — and stay on as the ongoing
                technical review that keeps it trustworthy. Let&apos;s talk about a
                monthly partnership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:diegoaquinde@gmail.com?subject=Catalog%20Automation%20%26%20Technical%20Review"
                  className="inline-flex items-center justify-center gap-2 bg-electric text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-colors shadow-2xl"
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </a>
                <Link
                  href="/lumen#projects"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:border-electric/50 hover:text-electric transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  All Projects
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <p className="text-gray-700 text-xs uppercase tracking-[0.4em]">
          © 2026 DIEGO QUINDE ·{" "}
          <Link href="/" className="hover:text-electric transition-colors">
            diegoquinde.com
          </Link>
        </p>
      </footer>
    </div>
  );
}

function Step({
  n,
  title,
  copy,
  chips,
  delay = 0,
}: {
  n: string;
  title: string;
  copy: string;
  chips: { icon: React.ReactNode; label: string }[];
  delay?: number;
}) {
  return (
    <div
      className="step-card flex gap-6"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="step-number">{n}</div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed mb-4">{copy}</p>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <span key={c.label} className="tool-chip">
              {c.icon} {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
