import Link from "next/link"
import type { ReactNode } from "react"

interface LegalPageLayoutProps {
  children: ReactNode
  title: string
  lastUpdated: string
}

export function LegalPageLayout({ children, title, lastUpdated }: LegalPageLayoutProps) {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-4">{children}</div>

        <div className="pt-6 border-t">
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
