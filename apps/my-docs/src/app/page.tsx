"use client"

export default function ApiDocsPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6">
      <h1 className="text-7xl font-bold">
        My Docs
      </h1>
      <p>
        running at <code className="text-white bg-primary px-2 py-1">{window.location.host}</code>
      </p>
    </div>
  )
}
