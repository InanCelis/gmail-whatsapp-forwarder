import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export async function DatabaseStats() {
  const supabase = await createClient()

  // Get database statistics
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  // Get recent users (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { count: recentUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString())

  const recentUserPercentage = totalUsers ? ((recentUsers || 0) / totalUsers) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Total Records</span>
            <span className="text-sm text-muted-foreground">{totalUsers || 0}</span>
          </div>
          <Progress value={totalUsers ? Math.min((totalUsers / 100) * 100, 100) : 0} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Recent Activity (7 days)</span>
            <span className="text-sm text-muted-foreground">{recentUsers || 0} new</span>
          </div>
          <Progress value={recentUserPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalUsers || 0}</div>
            <div className="text-xs text-muted-foreground">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{recentUsers || 0}</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Database Schema</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>users table</span>
              <span className="text-muted-foreground">4 columns</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Columns: id (uuid), email (text), created_at, updated_at
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
