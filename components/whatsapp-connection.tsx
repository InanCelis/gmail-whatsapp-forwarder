"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function WhatsAppConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [phoneNumberId, setPhoneNumberId] = useState("")
  const [targetNumber, setTargetNumber] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSaveConfig = async () => {
    if (!accessToken || !phoneNumberId || !targetNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken,
          phoneNumberId,
          targetNumber,
        }),
      })

      if (response.ok) {
        setIsConnected(true)
        toast({
          title: "Configuration Saved",
          description: "WhatsApp configuration has been saved successfully.",
        })
      } else {
        throw new Error("Failed to save configuration")
      }
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Failed to save WhatsApp configuration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestMessage = async () => {
    try {
      const response = await fetch("/api/whatsapp/test", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Test Message Sent",
          description: "Check your WhatsApp for the test message.",
        })
      } else {
        throw new Error("Failed to send test message")
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test message. Please check your configuration.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          WhatsApp Configuration
        </CardTitle>
        <CardDescription>Configure WhatsApp Business API to send forwarded emails</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Configured</span>
                <Badge variant="default">Ready</Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Not Configured</span>
                <Badge variant="destructive">Setup Required</Badge>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="access-token">Access Token</Label>
            <Input
              id="access-token"
              type="password"
              placeholder="Your WhatsApp Business API access token"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-number-id">Phone Number ID</Label>
            <Input
              id="phone-number-id"
              placeholder="Your WhatsApp Business phone number ID"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-number">Target WhatsApp Number</Label>
            <Input
              id="target-number"
              placeholder="e.g., +1234567890"
              value={targetNumber}
              onChange={(e) => setTargetNumber(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveConfig} disabled={isSaving} className="flex-1">
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>

            {isConnected && (
              <Button variant="outline" onClick={handleTestMessage}>
                Test
              </Button>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Get your access token from Meta Business</p>
          <p>• Phone Number ID from WhatsApp Business API</p>
          <p>• Target number must include country code</p>
        </div>
      </CardContent>
    </Card>
  )
}
