"use client";

import { useEffect, useState } from "react";

type Quote = { author: string; text: string; };

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [host, setHost] = useState("");
  const [quote, setQuote] = useState<Quote>();

  useEffect(() => { }, []);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const url = `${BACKEND_URL}/quotes`;

        const response = await fetch(url);

        if (response.ok) {
          const data = (await response.json()) as Quote;
          setQuote(data);
        } else {
          console.log(response);
        }
      } catch (e) {
        console.log(e);
      }
    }

    void fetchQuote();

    setHost(window.location.host);

    const intervalId = setInterval(() => {
      void fetchQuote();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6">
      <h1 className="text-7xl font-bold">My Docs - Preview</h1>
      <p>
        running at <code className="text-white bg-primary px-2 py-1">{host}</code>
      </p>
      {quote ? (
        <section className="flex flex-col gap-4 font-light justify-center items-center mt-6 italic max-w-lg text-center">
          <p className="">{quote?.text}</p>
          <small>- {quote?.author}</small>
        </section>
      ) : null}
    </div>
  );
}
