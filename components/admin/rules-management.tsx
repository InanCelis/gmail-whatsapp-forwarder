"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Settings, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ForwardingRule {
  id: string
  name: string
  gmail_filter: string
  whatsapp_message_template: string
  is_active: boolean
  created_at: string
  user_id: string
  users: {
    email: string
  }
}

export function RulesManagement() {
  const [rules, setRules] = useState<ForwardingRule[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchRules()
  }, [])

  async function fetchRules() {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("forwarding_rules")
        .select(`
          *,
          users (
            email
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRules(data || [])
    } catch (error) {
      console.error("Error fetching rules:", error)
      toast({
        title: "Error",
        description: "Failed to fetch forwarding rules",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function toggleRuleStatus(ruleId: string, isActive: boolean) {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("forwarding_rules")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("id", ruleId)

      if (error) throw error

      setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, is_active: isActive } : rule)))

      toast({
        title: "Success",
        description: `Rule ${isActive ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating rule status:", error)
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive",
      })
    }
  }

  async function deleteRule(ruleId: string) {
    if (!confirm("Are you sure you want to delete this rule?")) return

    const supabase = createClient()

    try {
      const { error } = await supabase.from("forwarding_rules").delete().eq("id", ruleId)

      if (error) throw error

      setRules(rules.filter((rule) => rule.id !== ruleId))

      toast({
        title: "Success",
        description: "Rule deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting rule:", error)
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Rules Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading rules...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Rules Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{rule.name}</p>
                    <p className="text-sm text-muted-foreground">by {rule.users.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={rule.is_active ? "default" : "secondary"}>
                    {rule.is_active ? "Active" : "Inactive"}
                  </Badge>

                  <Switch checked={rule.is_active} onCheckedChange={(checked) => toggleRuleStatus(rule.id, checked)} />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteRule(rule.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Filter:</span> {rule.gmail_filter}
                </p>
                <p>
                  <span className="font-medium">Template:</span> {rule.whatsapp_message_template}
                </p>
              </div>
            </div>
          ))}

          {rules.length === 0 && <p className="text-center text-muted-foreground py-8">No forwarding rules found</p>}
        </div>
      </CardContent>
    </Card>
  )
}
