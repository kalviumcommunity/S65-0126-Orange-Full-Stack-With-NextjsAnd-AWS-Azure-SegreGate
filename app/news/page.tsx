export const revalidate = 60 // ISR 

async function getNews() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1")
    return res.json()
}

export default async function NewsPage() {
    const news = await getNews()

    console.log("News page regenerated (ISR)")

    return (
        <main className="p-10">
        <h1 className="text-3xl font-bold">Latest News</h1>
        <p className="mt-4 font-semibold">{news.title}</p>
        <p className="mt-2 text-gray-600">{news.body}</p>
        <p className="mt-4 text-sm text-gray-500">
            Revalidated every 60 seconds
        </p>
        </main>
    )
}
