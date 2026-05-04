"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, FolderOpen, FileText, LogOut, Zap } from "lucide-react";

const links = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  { href: "/admin/home", icon: Home, label: "Editar Home" },
  { href: "/admin/projects", icon: FolderOpen, label: "Proyectos" },
  { href: "/admin/cv", icon: FileText, label: "Generar CV" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white/5 border-r border-white/10 flex flex-col z-50">
      <div className="p-6 border-b border-white/10">
        <a href="/" className="text-2xl font-black tracking-tighter gradient-text">
          DQ
        </a>
        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-white/30 uppercase tracking-widest">
          <Zap className="w-3 h-3 text-electric" />
          Admin Panel
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, icon: Icon, label }) => (
          <a
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === href
                ? "bg-electric/10 text-electric border border-electric/20"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
