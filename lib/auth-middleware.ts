import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export function withAuth(
  handler: (request: NextRequest, context: { user: { id: string; email: string } }) => Promise<NextResponse>,
) {
  return async (request: NextRequest) => {
    try {
      const authHeader = request.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as {
        userId: string
        email: string
      }

      return handler(request, { user: { id: decoded.userId, email: decoded.email } })
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }
}
