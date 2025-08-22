import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Please log in first" }, { status: 401 })
    }

    let userId: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as {
        userId: string
        email: string
      }
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Generate the OAuth URL
    const scopes = ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.modify"]

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    )

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      state: userId,
    })

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("Gmail auth error:", error)
    return NextResponse.json({ error: "Failed to initiate Gmail authentication" }, { status: 500 })
  }
}
