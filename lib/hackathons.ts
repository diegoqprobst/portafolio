export type Hackathon = {
  title: string;
  event: string;
  year: string;
  role: { en: string; es: string };
  summary: { en: string; es: string };
  highlights: { en: string[]; es: string[] };
  stack: string;
  links: { label: { en: string; es: string }; href: string }[];
};

export const HACKATHONS: Hackathon[] = [
  {
    title: "Solar Proposal Agent",
    event: "Meta Global AI Developer Hackathon · Remote",
    year: "2026",
    role: {
      en: "Solo project, built in nine days",
      es: "Proyecto individual, construido en nueve días",
    },
    summary: {
      en: "An agent that sizes solar + storage for rural infrastructure and never invents a number: every input quotes its source, code does the math, and what cannot be proven goes to a person.",
      es: "Un agente que dimensiona solar + almacenamiento para infraestructura rural y nunca inventa un número: cada dato cita su fuente, el código hace las cuentas y lo que no se puede probar pasa a una persona.",
    },
    highlights: {
      en: [
        "Quote-checked inputs: a value taken from a datasheet must quote it exactly and appear inside the quote, or it is rejected in code.",
        "On a real datasheet it declined to invent a design and returned eight questions about what must be measured on site.",
        "Live runs exposed three defects (percentages recorded as 45, a status loop, a false “finished”). All fixed and covered by 44 offline tests.",
      ],
      es: [
        "Datos con cita verificada: un valor tomado de una ficha debe citarla exactamente y aparecer dentro de la cita, o el código lo rechaza.",
        "Con una ficha técnica real se negó a inventar un diseño y devolvió ocho preguntas sobre lo que hay que medir en sitio.",
        "Las corridas en vivo revelaron tres fallos (porcentajes como 45, un bucle de estado, un falso “terminado”). Corregidos y cubiertos por 44 pruebas offline.",
      ],
    },
    stack: "Python · Muse Spark 1.3 (Meta Model API) · NASA POWER · pypdf · pytest",
    links: [
      {
        label: { en: "View repository", es: "Ver repositorio" },
        href: "https://github.com/diegoqprobst/solar-proposal-agent",
      },
    ],
  },
  {
    title: "Between Sessions",
    event: "Agents, Everywhere · AI Tinkerers × OpenAI · Miami",
    year: "2026",
    role: {
      en: "Built in one day with a team",
      es: "Construido en un día con un equipo",
    },
    summary: {
      en: "Mental health for remote workers, inside the tool they already live in: an agent in Slack DMs that accompanies the person between therapy sessions, guided by Apple Watch signals.",
      es: "Salud mental para trabajadores remotos, dentro de la herramienta donde ya viven: un agente en mensajes directos de Slack que acompaña a la persona entre sesiones de terapia, guiado por señales del Apple Watch.",
    },
    highlights: {
      en: [
        "Privacy by control: the clinical note stays on the clinician's Mac; only a structured plan reaches the cloud.",
        "The agent speaks when sleep, HRV or mood justify it, never on a schedule; the clinician's brief is sent only after the person approves it.",
        "Guided practices are deterministic and cited to NHS, APA and CDC. The tool accompanies and summarizes; it never diagnoses.",
      ],
      es: [
        "Privacidad por diseño: la nota clínica se queda en el Mac del terapeuta; solo un plan estructurado llega a la nube.",
        "El agente habla cuando el sueño, la HRV o el ánimo lo justifican, nunca por horario; el resumen para el terapeuta se envía solo si la persona lo aprueba.",
        "Las prácticas guiadas son deterministas y citan NHS, APA y CDC. La herramienta acompaña y resume; nunca diagnostica.",
      ],
    },
    stack: "OpenAI Agents SDK · FastAPI · Slack · Trigger.dev · Exa · Auth0 · Cloud Run",
    links: [
      {
        label: { en: "View repository", es: "Ver repositorio" },
        href: "https://github.com/diegoqprobst/between-sessions",
      },
    ],
  },
  {
    title: "LATAM Bank Dispute Agent",
    event: "Factored AI & Data Hackathon",
    year: "2026",
    role: {
      en: "AI-first customer-service agent",
      es: "Agente de servicio al cliente AI-first",
    },
    summary: {
      en: "A bank agent that takes in card and account transaction disputes in Spanish and Portuguese, with a deterministic policy, permissions enforced in the service layer and structured human handoff.",
      es: "Un agente bancario que recibe disputas de transacciones de tarjeta y cuenta en español y portugués, con política determinística, permisos aplicados en la capa de servicio y traspaso estructurado a humanos.",
    },
    highlights: {
      en: [
        "The model only understands; it never acts or writes the customer-facing replies. Every write is confirmed and read back before the agent claims it happened.",
        "Evaluated on a sealed set of 230 conversations: 0 unsafe outcomes, 100% safe resolution and 100% escalation when required (offline, synthetic data).",
        "About 5% of the cost of a human-handled contact, at $0.00055 of LLM cost per resolution.",
      ],
      es: [
        "El modelo solo entiende; nunca actúa ni redacta las respuestas al cliente. Cada escritura se confirma y se verifica antes de afirmar que ocurrió.",
        "Evaluado en un set sellado de 230 conversaciones: 0 resultados inseguros, 100 % de resolución segura y 100 % de escalamiento cuando correspondía (offline, datos sintéticos).",
        "Cerca del 5 % del costo de un contacto atendido por una persona, con $0,00055 de costo de LLM por resolución.",
      ],
    },
    stack: "Python · FastAPI · TF-IDF router · Gemma 4 · SQLite · Render",
    links: [
      {
        label: { en: "Live demo", es: "Demo en vivo" },
        href: "https://latam-dispute-agent.onrender.com",
      },
      {
        label: { en: "View repository", es: "Ver repositorio" },
        href: "https://github.com/diegoqprobst/factored-hackathon-2026-diegoqprobst",
      },
    ],
  },
];
