import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { isConfigured } from "@/lib/env";
import { listSubmissions } from "@/lib/submissions";
import AdminDashboard from "@/components/AdminDashboard";
import BrandMark from "@/components/BrandMark";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isConfigured.auth()) {
    return (
      <main className="mx-auto w-full max-w-md px-5 py-20">
        <BrandMark className="mb-6" />
        <p className="label">ADMIN</p>
        <h1 className="heading mt-3 text-2xl">Not configured</h1>
        <p className="mt-3 text-sm leading-relaxed text-inkSoft">
          Set <code className="font-mono text-blueprintDeep">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="font-mono text-blueprintDeep">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
          <code className="font-mono text-blueprintDeep">SUPABASE_SERVICE_ROLE_KEY</code> to enable
          the dashboard. See <code className="font-mono">SETUP.md</code>.
        </p>
      </main>
    );
  }

  const supabase = getServerClient();
  const {
    data: { user },
  } = (await supabase!.auth.getUser()) ?? { data: { user: null } };

  if (!user) redirect("/admin/login");

  const rows = await listSubmissions();
  return <AdminDashboard rows={rows} email={user.email ?? ""} dbConfigured={isConfigured.db()} />;
}
