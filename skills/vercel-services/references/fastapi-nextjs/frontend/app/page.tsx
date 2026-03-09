export default async function Home() {
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/health`)
  const data = await res.json()

  return (
    <div>
      <h1>Next.js + FastAPI</h1>
      <p>Backend status: {data.status}</p>
    </div>
  )
}
