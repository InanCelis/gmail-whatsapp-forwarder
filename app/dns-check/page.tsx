"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface DNSResult {
  domain: string
  records: {
    type: string
    value: string
  }[]
  error?: string
}

export default function DNSCheck() {
  const [domain, setDomain] = useState("notify.internationalpropertyalerts.com")
  const [result, setResult] = useState<DNSResult | null>(null)
  const [loading, setLoading] = useState(false)

  const checkDNS = async () => {
    if (!domain) return

    setLoading(true)
    try {
      // Using a public DNS API service
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=CNAME`)
      const data = await response.json()

      console.log("[v0] DNS API response:", data)

      if (data.Answer) {
        setResult({
          domain,
          records: data.Answer.map((record: any) => ({
            type: record.type === 5 ? "CNAME" : `Type ${record.type}`,
            value: record.data,
          })),
        })
      } else {
        setResult({
          domain,
          records: [],
          error: "No DNS records found",
        })
      }
    } catch (error) {
      console.log("[v0] DNS lookup error:", error)
      setResult({
        domain,
        records: [],
        error: "Failed to lookup DNS records",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">DNS Lookup Tool</h1>
            <p className="text-muted-foreground">Check DNS records for your domain</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                DNS Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter domain name (e.g., notify.internationalpropertyalerts.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && checkDNS()}
                />
                <Button onClick={checkDNS} disabled={loading || !domain}>
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? "Checking..." : "Lookup"}
                </Button>
              </div>

              {result && (
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Results for: {result.domain}</h3>

                    {result.error ? (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-destructive">{result.error}</p>
                      </div>
                    ) : result.records.length > 0 ? (
                      <div className="space-y-2">
                        {result.records.map((record, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <Badge variant="secondary" className="mb-1">
                                {record.type}
                              </Badge>
                              <p className="font-mono text-sm">{record.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No records found</p>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Expected for Vercel:</strong> CNAME → cname.vercel-dns.com
                    </p>
                    <p>
                      <strong>If redirecting:</strong> Check your main domain's server configuration
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  setDomain("notify.internationalpropertyalerts.com")
                  setTimeout(checkDNS, 100)
                }}
              >
                Test: notify.internationalpropertyalerts.com
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  setDomain("internationalpropertyalerts.com")
                  setTimeout(checkDNS, 100)
                }}
              >
                Test: internationalpropertyalerts.com
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
