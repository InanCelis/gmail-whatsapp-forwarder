import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageCircle, Settings } from 'lucide-react'
import { GmailConnection } from "@/components/gmail-connection"
import { WhatsAppConnection } from "@/components/whatsapp-connection"
import { EmailForwardingRules } from "@/components/email-forwarding-rules"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function DashboardContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gmail to WhatsApp Forwarder</h1>
            <p className="text-muted-foreground">Automatically forward specific Gmail messages to WhatsApp</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin Panel
              </Button>
            </Link>
            <UserMenu />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gmail Status</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Disconnected</div>
              <Badge variant="destructive" className="mt-2">
                Not Connected
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WhatsApp Status</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Disconnected</div>
              <Badge variant="destructive" className="mt-2">
                Not Connected
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-2">Forwarding rules configured</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <GmailConnection />
            <WhatsAppConnection />
          </div>

          <div>
            <EmailForwardingRules />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
