"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function GmailConnection() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  const handleGmailAuth = async () => {
    setIsConnecting(true)
    try {
      // Redirect to Gmail OAuth
      window.location.href = "/api/auth/gmail"
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Gmail. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      const response = await fetch("/api/auth/gmail/disconnect", {
        method: "POST",
      })

      if (response.ok) {
        setIsConnected(false)
        toast({
          title: "Disconnected",
          description: "Gmail account has been disconnected.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect Gmail account.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail Connection
        </CardTitle>
        <CardDescription>Connect your Gmail account to monitor incoming emails</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Connected</span>
                <Badge variant="default">Active</Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Not Connected</span>
                <Badge variant="destructive">Inactive</Badge>
              </>
            )}
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Gmail is connected and monitoring for new emails.</p>
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect Gmail
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Connect your Gmail account to start monitoring emails with specific subjects.
            </p>
            <Button onClick={handleGmailAuth} disabled={isConnecting} className="w-full">
              {isConnecting ? "Connecting..." : "Connect Gmail"}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Read access to monitor incoming emails</p>
          <p>• Real-time notifications via Gmail API</p>
          <p>• Secure OAuth 2.0 authentication</p>
        </div>
      </CardContent>
    </Card>
  )
}
