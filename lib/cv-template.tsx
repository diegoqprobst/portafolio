import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CvJson } from "./ai";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 700,
    },
  ],
});

const ELECTRIC = "#1E90FF";
const DARK = "#0D1117";
const GRAY = "#6B7280";

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    backgroundColor: "#ffffff",
    paddingHorizontal: 48,
    paddingVertical: 44,
    fontSize: 9,
    color: "#111827",
  },
  header: { marginBottom: 20 },
  name: { fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 4 },
  contact: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 8,
    color: GRAY,
  },
  contactItem: { flexDirection: "row", gap: 4 },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: ELECTRIC,
    marginVertical: 12,
    width: 40,
  },
  summary: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: ELECTRIC,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
  },
  expRow: { marginBottom: 10 },
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  expRole: { fontWeight: 700, fontSize: 10 },
  expCompany: { color: GRAY, fontSize: 9 },
  expPeriod: { color: GRAY, fontSize: 8 },
  bullet: { flexDirection: "row", gap: 6, marginBottom: 3 },
  bulletDot: { color: ELECTRIC, fontWeight: 700, fontSize: 10, marginTop: -1 },
  bulletText: { flex: 1, color: "#374151", lineHeight: 1.5 },
  skillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 6 },
  skillCat: { fontWeight: 700, fontSize: 8, color: DARK, minWidth: 90 },
  skillChip: {
    backgroundColor: "#EFF6FF",
    color: ELECTRIC,
    fontSize: 7.5,
    fontWeight: 700,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  highlightRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
    backgroundColor: "#F0F9FF",
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: ELECTRIC,
  },
  highlightTitle: { fontWeight: 700, fontSize: 9, color: DARK, marginBottom: 1 },
  highlightImpact: { color: GRAY, fontSize: 8, lineHeight: 1.4 },
  eduRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  certChip: {
    backgroundColor: "#F3F4F6",
    color: "#374151",
    fontSize: 7.5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  certsWrap: { flexDirection: "row", flexWrap: "wrap" },
});

export function CvTemplate({ cv }: { cv: CvJson }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.name}>{cv.name}</Text>
          <View style={s.contact}>
            {[
              cv.contact.email,
              cv.contact.phone,
              cv.contact.location,
              cv.contact.linkedin,
            ]
              .filter(Boolean)
              .map((c) => (
                <Text key={c}>{c}</Text>
              ))}
          </View>
          <View style={s.divider} />
        </View>

        {/* Summary */}
        <Text style={s.summary}>{cv.summary}</Text>

        {/* Highlights */}
        {cv.highlights?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Key Impact</Text>
            {cv.highlights.map((h, i) => (
              <View key={i} style={s.highlightRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.highlightTitle}>{h.title}</Text>
                  <Text style={s.highlightImpact}>{h.impact}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Experience</Text>
          {cv.experience.map((exp, i) => (
            <View key={i} style={s.expRow}>
              <View style={s.expHeader}>
                <View>
                  <Text style={s.expRole}>{exp.role}</Text>
                  <Text style={s.expCompany}>{exp.company}</Text>
                </View>
                <Text style={s.expPeriod}>{exp.period}</Text>
              </View>
              {exp.bullets.map((b, j) => (
                <View key={j} style={s.bullet}>
                  <Text style={s.bulletDot}>·</Text>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Skills</Text>
          {cv.skills.map((sk, i) => (
            <View key={i} style={s.skillRow}>
              <Text style={s.skillCat}>{sk.category}:</Text>
              {sk.items.map((item) => (
                <Text key={item} style={s.skillChip}>{item}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Education</Text>
          {cv.education.map((ed, i) => (
            <View key={i} style={s.eduRow}>
              <View>
                <Text style={{ fontWeight: 700, fontSize: 9 }}>{ed.degree}</Text>
                <Text style={{ color: GRAY, fontSize: 8 }}>{ed.institution}</Text>
              </View>
              <Text style={{ color: GRAY, fontSize: 8 }}>{ed.year}</Text>
            </View>
          ))}
        </View>

        {/* Certifications */}
        {cv.certifications?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Certifications</Text>
            <View style={s.certsWrap}>
              {cv.certifications.map((c) => (
                <Text key={c} style={s.certChip}>{c}</Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
