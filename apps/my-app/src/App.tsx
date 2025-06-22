import { useEffect, useState } from "react"

const BACKEND_API = import.meta.env.VITE_API_URL;

type Quote = { text: string; author: string; }

function App() {
  const [quote, setQuote] = useState<Quote>()

  useEffect(() => {
    async function fetchQuote() {
      try {
        const url = `${BACKEND_API}/quotes`
        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json() as Quote;
          setQuote(data)
        } else {
          console.log(response)
        }
      } catch (e) {
        console.log(e)
      }
    }

    void fetchQuote()

    const intervalId = setInterval(() => {
      void fetchQuote()
    }, 15000)

    return () => clearInterval(intervalId)

  }, [])

  return (
    <main className="flex flex-col justify-center items-center h-screen gap-6">
      <h1 className="text-7xl font-bold">
        My App - Preview
      </h1>
      <p>
        running at <code className="text-white bg-primary px-2 py-1">{window.location.host}</code>
      </p>
      {quote ? <section className="flex flex-col gap-4 font-light justify-center items-center mt-6 italic max-w-lg text-center">
        <p className="">
          {quote?.text}
        </p>
        <small>
          - {quote?.author}
        </small>
      </section> : null}

    </main>
  )
}

export default App
