import { prisma } from "..";

type Quote = {
  text: string;
  author: string;
}

async function main() {
  const response = await fetch("https://thequoteshub.com/api/tags/programming?page=1&page_size=5000")
  if (response.ok) {
    const data = await response.json() as { quotes: Quote[] };
    await prisma.quote.createMany({
      data: data.quotes.map(quote => ({
        text: quote.text,
        author: quote.author,
      }))
    })
  } else {
    throw new Error("Failed to fetch data!")
  }
}


main().then(() => console.log("Successfully seeded quotes!"))
