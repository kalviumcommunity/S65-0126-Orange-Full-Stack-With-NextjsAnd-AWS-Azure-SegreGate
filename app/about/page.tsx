export const revalidate = false //(SSG)

export default function AboutPage() {
    console.log("About page rendered at BUILD time")

    return (
        <main className="p-10">
        <h1 className="text-3xl font-bold">About This App</h1>
        <p className="mt-4 text-gray-600">
            This page is statically generated at build time using SSG.
        </p>
        <p className="mt-2 text-sm text-gray-500">
            Build Time: {new Date().toISOString()}
        </p>
        </main>
    )
}
