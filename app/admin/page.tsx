import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Shield } from "lucide-react"
import { UsersManagement } from "@/components/admin/users-management"
import { RulesManagement } from "@/components/admin/rules-management"
import { AdminStats } from "@/components/admin/admin-stats"

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (!userData || userData.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users and forwarding rules</p>
          </div>
        </div>

        <AdminStats />

        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <UsersManagement />
          <RulesManagement />
        </div>
      </div>
    </div>
  )
}
