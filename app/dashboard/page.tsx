export const dynamic = "force-dynamic" // SSR

async function getServerTime() {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata", {
            cache: "no-store",
            signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        if (!res.ok) {
            throw new Error(`API responded with status ${res.status}`)
        }
        
        return await res.json()
    } catch (error) {
        console.error("Failed to fetch server time:", error)
        // Return fallback data
        return {
            datetime: new Date().toISOString(),
            timezone: "Asia/Kolkata",
            error: "Failed to fetch from API"
        }
    }
}

export default async function DashboardPage() {
    const data = await getServerTime()

    console.log("Dashboard rendered at REQUEST time")

    return (
        <main className="p-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4 text-gray-600">
            This page is rendered on every request (SSR).
        </p>
        <p className="mt-2 text-sm text-gray-500">
            Current Server Time: {data.datetime}
        </p>
        </main>
    )
}
