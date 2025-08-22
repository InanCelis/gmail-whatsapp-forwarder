"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ForwardingRule {
  id: string
  subjectFilter: string
  isActive: boolean
  messageTemplate: string
}

export function EmailForwardingRules() {
  const [rules, setRules] = useState<ForwardingRule[]>([])
  const [newRule, setNewRule] = useState({
    subjectFilter: "",
    messageTemplate: "New email received:\n\nSubject: {subject}\nFrom: {from}\nBody: {body}",
  })
  const { toast } = useToast()

  const handleAddRule = () => {
    if (!newRule.subjectFilter.trim()) {
      toast({
        title: "Invalid Rule",
        description: "Please enter a subject filter.",
        variant: "destructive",
      })
      return
    }

    const rule: ForwardingRule = {
      id: Date.now().toString(),
      subjectFilter: newRule.subjectFilter,
      isActive: true,
      messageTemplate: newRule.messageTemplate,
    }

    setRules([...rules, rule])
    setNewRule({
      subjectFilter: "",
      messageTemplate: "New email received:\n\nSubject: {subject}\nFrom: {from}\nBody: {body}",
    })

    toast({
      title: "Rule Added",
      description: "Forwarding rule has been created successfully.",
    })
  }

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
    toast({
      title: "Rule Deleted",
      description: "Forwarding rule has been removed.",
    })
  }

  const handleToggleRule = (id: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, isActive: !rule.isActive } : rule)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Email Forwarding Rules
        </CardTitle>
        <CardDescription>Configure which emails to forward to WhatsApp based on subject filters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Rule */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-medium">Add New Rule</h3>

          <div className="space-y-2">
            <Label htmlFor="subject-filter">Subject Filter</Label>
            <Input
              id="subject-filter"
              placeholder="e.g., 'URGENT', 'Invoice', 'Alert'"
              value={newRule.subjectFilter}
              onChange={(e) => setNewRule({ ...newRule, subjectFilter: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Emails containing this text in the subject will be forwarded
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-template">WhatsApp Message Template</Label>
            <Textarea
              id="message-template"
              placeholder="Customize your WhatsApp message..."
              value={newRule.messageTemplate}
              onChange={(e) => setNewRule({ ...newRule, messageTemplate: e.target.value })}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Use {"{subject}"}, {"{from}"}, and {"{body}"} as placeholders
            </p>
          </div>

          <Button onClick={handleAddRule} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Rule
          </Button>
        </div>

        {/* Existing Rules */}
        <div className="space-y-4">
          <h3 className="font-medium">Active Rules ({rules.length})</h3>

          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No forwarding rules configured yet.</p>
              <p className="text-sm">Add a rule above to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">"{rule.subjectFilter}"</span>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{rule.messageTemplate.substring(0, 60)}...</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch checked={rule.isActive} onCheckedChange={() => handleToggleRule(rule.id)} />
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
