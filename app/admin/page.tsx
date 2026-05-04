import { Home, FolderOpen, FileText } from "lucide-react";

const cards = [
  {
    href: "/admin/home",
    icon: Home,
    title: "Editar Home",
    desc: "Taglines, about, métricas, servicios, tech stack",
    color: "from-blue-500/10 to-transparent",
    border: "border-blue-500/20",
  },
  {
    href: "/admin/projects",
    icon: FolderOpen,
    title: "Proyectos",
    desc: "Crear, editar y reordenar proyectos del portafolio",
    color: "from-purple-500/10 to-transparent",
    border: "border-purple-500/20",
  },
  {
    href: "/admin/cv",
    icon: FileText,
    title: "Generar CV",
    desc: "Genera un CV personalizado con IA a partir de una job description",
    color: "from-green-500/10 to-transparent",
    border: "border-green-500/20",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black gradient-text">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">
          Panel de administración de diegoquinde.com
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ href, icon: Icon, title, desc, color, border }) => (
          <a
            key={href}
            href={href}
            className={`bg-gradient-to-br ${color} border ${border} rounded-3xl p-8 hover:scale-[1.02] transition-all group`}
          >
            <Icon className="w-10 h-10 text-electric mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-white/40">{desc}</p>
          </a>
        ))}
      </div>

      <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">
          Setup rápido
        </h3>
        <ol className="space-y-2 text-sm text-white/50 list-decimal list-inside">
          <li>
            Configura <code className="text-electric">.env.local</code> con{" "}
            <code className="text-electric">INSFORGE_URL</code>,{" "}
            <code className="text-electric">JWT_SECRET</code> y{" "}
            <code className="text-electric">ADMIN_PASSWORD_HASH</code>
          </li>
          <li>
            Genera el hash de tu contraseña:{" "}
            <code className="text-electric text-xs">
              node -e &quot;require(&apos;bcryptjs&apos;).hash(&apos;TU_PASS&apos;,12).then(console.log)&quot;
            </code>
          </li>
          <li>Crea las tablas en Insforge y corre el seed inicial</li>
          <li>
            Para el generador de CV agrega{" "}
            <code className="text-electric">ANTHROPIC_API_KEY</code>
          </li>
        </ol>
      </div>
    </div>
  );
}
