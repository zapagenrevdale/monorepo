import { BookOpen, Code, Copy, ExternalLink, Menu, Search, X } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiDocsPage() {
  return (
    <div>
      <div className="mx-auto container flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Button className="md:hidden" size="icon" variant="outline">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              <Link className="flex items-center space-x-2" href="/">
                <BookOpen className="h-5 w-5" />
                <span className="font-semibold">Example API Docs</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <div className="h-full py-6 pr-2 pl-2 lg:py-8">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <h4 className="font-medium">API Reference</h4>
                  <Button asChild className="justify-start font-medium" size="sm" variant="ghost">
                    <Link href="/">Health Check</Link>
                  </Button>
                  <Button asChild className="justify-start pl-6" size="sm" variant="ghost">
                    <Link href="/">Ping Health Check</Link>
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="relative py-6 lg:gap-10 lg:py-8">
            <div className="mx-auto w-full min-w-0">
              <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">API Reference</div>
                <span>/</span>
                <div className="font-medium text-foreground">Health Check</div>
              </div>

              <div className="space-y-2 mb-12">
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">API Health</h1>
                <p className="text-lg text-muted-foreground">API endpoint to check health.</p>
              </div>

              {/* Endpoint: List all users */}
              <section className="scroll-mt-20 space-y-6">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 hover:bg-green-600/80">GET</Badge>
                  <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">health check</h2>
                </div>
                <p className="mt-2 text-muted-foreground">Returns a message if api is running</p>

                <div className="mt-4 flex items-center rounded-md bg-muted p-2">
                  <code className="text-sm font-mono flex-1">GET https://stage.host.com/api</code>
                  <Button className="h-8 w-8 p-0" size="sm" variant="ghost">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium">Response</h3>
                  <Tabs className="mt-2" defaultValue="200">
                    <TabsList>
                      <TabsTrigger value="200">200: OK</TabsTrigger>
                    </TabsList>
                    <TabsContent className="mt-2 rounded-md bg-muted p-4" value="200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Response body</span>
                        <Button className="h-8 w-8 p-0" size="sm" variant="ghost">
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy</span>
                        </Button>
                      </div>
                      <pre className="mt-2 overflow-x-auto rounded-md bg-black p-4 text-sm text-white">
                        My API 1.0.0
                      </pre>
                    </TabsContent>
                  </Tabs>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
