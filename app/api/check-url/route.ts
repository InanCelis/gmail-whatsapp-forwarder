import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const host = request.headers.get("host")
  const protocol = request.headers.get("x-forwarded-proto") || "https"
  const currentUrl = `${protocol}://${host}`

  return NextResponse.json({
    currentDeploymentUrl: currentUrl,
    host: host,
    protocol: protocol,
    requiredGoogleCloudSettings: {
      authorizedJavaScriptOrigins: currentUrl,
      authorizedRedirectUris: `${currentUrl}/api/auth/google/callback`,
    },
  })
}
