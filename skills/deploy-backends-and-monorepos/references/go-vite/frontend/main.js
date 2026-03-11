const el = document.getElementById('status')

try {
  const res = await fetch('/api/health')
  const data = await res.json()
  el.innerHTML = `<span>Backend says: ${data.message} (status: ${data.status})</span>`
} catch (err) {
  el.innerHTML = `<span>Failed to reach backend: ${err.message}</span>`
}
