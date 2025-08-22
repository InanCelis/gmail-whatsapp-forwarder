import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

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
                  <Badge variant="outline">{formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</Badge>
                  <span className="text-xs text-muted-foreground mt-1">
                    Updated: {formatDistanceToNow(new Date(user.updated_at), { addSuffix: true })}
                  </span>
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
