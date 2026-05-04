import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: "Admin · DQ Portfolio" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark text-white flex">
      <AdminNav />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
