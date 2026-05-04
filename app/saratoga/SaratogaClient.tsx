"use client";

import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  FileSearch,
  FileText,
  Layout,
  Lightbulb,
  Mail,
  MapPin,
  PenTool,
  Shield,
  Sparkles,
  Table2,
  XCircle,
} from "lucide-react";
import "./saratoga.css";

export default function SaratogaClient() {
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
    <div className="saratoga-body">
      <div className="fixed inset-0 pointer-events-none opacity-30 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-electric blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <nav className="saratoga-navbar">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a
              href="/"
              className="text-2xl font-black tracking-tighter gradient-text"
            >
              DQ
            </a>
            <a
              href="/#projects"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-electric transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Projects
            </a>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-widest text-electric uppercase bg-electric/10 border border-electric/20 rounded-full">
              <Lightbulb className="w-3.5 h-3.5" />
              Case Study · Lighting Industry
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-widest text-white/40 uppercase bg-white/5 border border-white/10 rounded-full">
              Saratoga Springs, Utah · USA
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Saratoga <span className="gradient-text">Public Lighting</span>
            <br />
            Proposal
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl leading-relaxed font-light mb-12">
            A weak lighting bid with no regulatory backing became a technically
            solid, compliance-ready proposal for Saratoga Springs&apos; public
            parks — giving the client a real competitive edge in the tender.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-xl">
            {[
              { n: "3", l: "Standards reviewed" },
              { n: "100%", l: "Municipal compliant" },
              { n: "1", l: "Winning bid" },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl font-black text-white mb-1">
                  {s.n}
                </div>
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
              src="/assets/projects/submittal-sample.png"
              alt="Saratoga public lighting proposal submittal"
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
                A lighting contractor was bidding on a public parks illumination
                project for Saratoga Springs, Utah. The initial proposal existed
                — but it was thin: product specs from a datasheet, a rough
                layout, and no engagement with the city&apos;s actual
                requirements.
              </p>
              <p>
                Municipal public lighting tenders in the US require more than
                product specs. They need compliance with local ordinances, IES
                (Illuminating Engineering Society) photometric standards, and
                often NFPA electrical codes. Without that, a bid reads as
                amateur — regardless of product quality.
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
                    A proposal that couldn&apos;t win
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    The original submittal had no reference to Saratoga
                    Springs&apos; municipal lighting ordinances, no photometric
                    analysis, and no structured compliance argument. Against
                    competitors who include these elements, it had no chance of
                    standing out.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {[
                  "No municipal ordinance analysis",
                  "No technical compliance argument",
                  "Visually undifferentiated from generic bids",
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
                title="Municipal standards research"
                copy="Used Claude Code to research and extract Saratoga Springs' specific municipal lighting ordinances, cross-referencing with IES RP-8 (roadway & parking lighting) and NFPA 70 (NEC) electrical requirements for outdoor public installations."
                chips={[
                  { icon: <Sparkles className="w-3 h-3" />, label: "Claude Code" },
                  { icon: <FileSearch className="w-3 h-3" />, label: "Municipal Ordinances" },
                  { icon: <BookOpen className="w-3 h-3" />, label: "IES / NFPA Standards" },
                ]}
              />
              <Step
                n="02"
                title="Product data mapping & compliance alignment"
                copy="Built an Excel model mapping each product's technical specs (lumen output, CCT, CRI, IP rating, wattage) against the specific ordinance requirements for each park zone. This created the compliance evidence layer that the original proposal lacked entirely."
                chips={[
                  { icon: <Table2 className="w-3 h-3" />, label: "Excel" },
                  { icon: <CheckCircle className="w-3 h-3" />, label: "Compliance Matrix" },
                ]}
                delay={100}
              />
              <Step
                n="03"
                title="Visual redesign with data integration"
                copy="Redesigned the full submittal in Adobe Illustrator — structured as a professional tender document with a clear compliance argument: ordinance requirement → product spec → justification. Every visual decision was made to reduce friction for the evaluating committee."
                chips={[
                  { icon: <PenTool className="w-3 h-3" />, label: "Adobe Illustrator" },
                  { icon: <Layout className="w-3 h-3" />, label: "Technical Layout" },
                  { icon: <FileText className="w-3 h-3" />, label: "Submittal Design" },
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
                  t: "Fully compliant with Saratoga Springs municipal standards",
                  c: "Every product selection and installation detail referenced the applicable local ordinance — the proposal could be evaluated against specific criteria, not vague claims.",
                },
                {
                  t: "Data-backed visual submittal that reads as professional",
                  c: "Redesigned in Adobe Illustrator with integrated compliance data — the committee receives a document that looks and reads like the work of a serious contractor, not a product catalog printout.",
                },
                {
                  t: "Client enters the bid with a real technical edge",
                  c: "Where competitors submitted generic proposals, this one addressed the municipality's specific requirements directly. Technical credibility is the differentiator in public tenders.",
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
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Tools Used</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Sparkles className="w-3.5 h-3.5 text-electric" />, label: "Claude Code" },
                { icon: <PenTool className="w-3.5 h-3.5 text-electric" />, label: "Adobe Illustrator" },
                { icon: <Table2 className="w-3.5 h-3.5 text-electric" />, label: "Excel" },
                { icon: <BookOpen className="w-3.5 h-3.5 text-electric" />, label: "IES Standards" },
                { icon: <Shield className="w-3.5 h-3.5 text-electric" />, label: "NFPA 70 / NEC" },
                { icon: <MapPin className="w-3.5 h-3.5 text-electric" />, label: "Municipal Ordinances" },
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
                Need a technical proposal that wins?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                If you&apos;re working on a lighting bid, submittal, or
                compliance catalog for the US market — I can help you build the
                technical argument that separates you from the competition.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:diegoaquinde@gmail.com?subject=Lighting%20Proposal%20Inquiry"
                  className="inline-flex items-center justify-center gap-2 bg-electric text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-colors shadow-2xl"
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </a>
                <a
                  href="/#projects"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:border-electric/50 hover:text-electric transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  All Projects
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <p className="text-gray-700 text-xs uppercase tracking-[0.4em]">
          © 2026 DIEGO QUINDE ·{" "}
          <a href="/" className="hover:text-electric transition-colors">
            diegoquinde.com
          </a>
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
