"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [status, setStatus] = useState("loading...")

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"))
  }, [])

  return (
    <div>
      <h1>Next.js + FastAPI</h1>
      <p>Backend status: {status}</p>
    </div>
  )
}
