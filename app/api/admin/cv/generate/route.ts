import { NextRequest, NextResponse } from "next/server";
import { generateCv, type AiProvider } from "@/lib/ai";
import { insforge } from "@/lib/insforge";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { CvTemplate } from "@/lib/cv-template";
import React from "react";

export async function POST(req: NextRequest) {
  const { job_title, company, job_description, provider } = await req.json();
  if (!job_description?.trim()) {
    return NextResponse.json({ error: "job_description required" }, { status: 400 });
  }

  // Load cv_base from Insforge
  const { data: baseData, error: baseError } = await insforge.database
    .from("cv_base")
    .select("*")
    .eq("id", 1);
  if (baseError || !baseData?.[0]) {
    return NextResponse.json({ error: "cv_base not found — add your base CV in Insforge" }, { status: 404 });
  }

  // Generate tailored CV JSON with Claude or OpenAI
  const { cvJson, providerUsed } = await generateCv(
    JSON.stringify(baseData[0]),
    job_description,
    (provider as AiProvider) ?? "auto"
  );

  // Render PDF
  const pdfBuffer = await renderToBuffer(
    React.createElement(CvTemplate, { cv: cvJson }) as React.ReactElement<DocumentProps>
  );

  // Upload PDF to Insforge storage
  const filename = `cv_${Date.now()}.pdf`;
  const pdfFile = new File([new Uint8Array(pdfBuffer)], filename, { type: "application/pdf" });
  const { data: uploadData } = await insforge.storage.from("cvs").upload(filename, pdfFile);
  const pdfUrl = (uploadData as { url?: string })?.url ?? "";

  // Save history record
  const { data: record } = await insforge.database
    .from("cv_generated")
    .insert([{ job_title, company, job_description, selected_json: cvJson, pdf_url: pdfUrl, provider: providerUsed }]);

  return NextResponse.json({
    id: (record as unknown as { id?: string }[])?.[0]?.id,
    pdf_url: pdfUrl,
    cv_json: cvJson,
    provider: providerUsed,
  });
}
