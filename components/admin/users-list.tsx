import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export async function UsersList() {
  const supabase = await createClient()

  // Get all users from the database
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching users:", error)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than an hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks} weeks ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex flex-col">
                  <span className="font-medium">{user.email}</span>
                  <span className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</span>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline">{getTimeAgo(user.created_at)}</Badge>
                  <span className="text-xs text-muted-foreground mt-1">Updated: {getTimeAgo(user.updated_at)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No users found in the database</p>
              <p className="text-sm mt-2">Users will appear here after they sign up</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
