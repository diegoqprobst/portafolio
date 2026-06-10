"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Fila de proyecto del portafolio — observer propio para la animación de entrada. */
export default function ProjectRow({
  id,
  num,
  title,
  tags,
  metricVal,
  metricLbl,
  isOpen,
  onToggle,
  delay,
  descEn,
  descEs,
  resultsEn,
  resultsEs,
  imgSrc,
  imgAlt,
  caseStudyHref,
  docHref,
}: {
  id: string;
  num: string;
  title: string;
  tags: string[];
  metricVal: string;
  metricLbl: { en: string; es: string };
  isOpen: boolean;
  onToggle: () => void;
  delay?: string;
  descEn: string;
  descEs: string;
  resultsEn: string[];
  resultsEs: string[];
  imgSrc: string;
  imgAlt: string;
  caseStudyHref?: string;
  docHref?: string;
}) {
  const [isIn, setIsIn] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el || isIn) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isIn]);

  return (
    <div
      ref={rowRef}
      className={`project-row reveal${isIn ? " in" : ""}${isOpen ? " open" : ""}`}
      id={`row-${id}`}
      style={delay ? { transitionDelay: delay } : undefined}
    >
      <div className="project-header" onClick={onToggle}>
        <div className="project-num">{num}</div>
        <div>
          <div className="project-title">{title}</div>
          <div className="project-tags">
            {tags.map((t) => (
              <span key={t} className="project-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="project-metric">
          <div className="val">{metricVal}</div>
          <div className="lbl">
            <span data-en="">{metricLbl.en}</span>
            <span data-es="">{metricLbl.es}</span>
          </div>
        </div>
        <div className="project-expand-btn">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="project-body" id={`body-${id}`}>
        <div className="project-body-inner">
          <div className="project-body-content">
            <div>
              <p className="project-desc">
                <span data-en="">{descEn}</span>
                <span data-es="">{descEs}</span>
              </p>
              <div className="project-results">
                {resultsEn.map((r, i) => (
                  <div key={i} className="project-result">
                    <span data-en="">{r}</span>
                    <span data-es="">{resultsEs[i]}</span>
                  </div>
                ))}
              </div>
              {caseStudyHref && (
                <a href={caseStudyHref} className="project-link">
                  <span data-en="">Read full case study</span>
                  <span data-es="">Leer caso de estudio completo</span>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    viewBox="0 0 24 24"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              )}
              {docHref && (
                <a href={docHref} className="project-link" target="_blank" rel="noopener noreferrer">
                  <span data-en="">View full document</span>
                  <span data-es="">Ver documento completo</span>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    viewBox="0 0 24 24"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              )}
            </div>
            <div className="project-img-wrap">
              <Image
                src={imgSrc}
                alt={imgAlt}
                width={320}
                height={220}
                style={{ width: "100%", height: 220, objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
