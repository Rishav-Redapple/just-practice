import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { NGramPrediction } from "./algo/n-gram";
import { codeToHtml } from "shiki";
import { TFIDF } from "./algo/tf-idf";

const shikiConfig = (lang = "ts") => ({
  lang,
  theme: "tokyo-night",
});

const body = (s: TemplateStringsArray, ...a: unknown[]) => `
  <html>
    <head>
      <title>Elysia.HTMX.HyperScript</title>
      <meta name="theme" content="light-dark">
      <script src="https://unpkg.com/hyperscript.org@0.9.14"></script>
      <script src="https://unpkg.com/htmx.org@2.0.4"></script>
    </head>
    <body>${s.map((str, i) => `${str}${a[i] ?? ""}`).join("")}</body>
  </html>
`;

const app = new Elysia();
app.use(html());

app.get("/on-page-load", () => {
  return "Okay, page loaded!";
});

app.get(
  "/weather",
  async ({ query }) => {
    const res = await fetch("https://wttr.in/?format=" + (query.format ?? "1"));
    const text = await res.text();
    return text;
  },
  {
    query: t.Object({
      format: t.Optional(t.String()),
    }),
  }
);

app.get("/algo/ngram", async () => {
  const str = "helo helo  hell";
  const nextChar = NGramPrediction(str);
  const file = Bun.file("./src/algo/n-gram.ts");
  const text = await file.text();
  const html = await codeToHtml(text, shikiConfig());

  return body`
    <nav>
      <a href="/">&larr; Back</a>
    </nav>
    <h1>N-Gram model statistical prediction</h1>
    <p>
      This algorithm relies on the last N-1 character of the string and to check the
      highest frequency of possible recurring N-grams from a bi-gram model. Now I have used
      a bigram model.
    </p>
    <br>
    <p>For string "${str}" the next possible character is "${nextChar}".</p>
    <p>So it becomes "${str + nextChar}".</p>
    <p>
      Note: I have to use "helo" instead of "hello" since it relies on the maximum
      frequency of last pairs, so having "ll" in both the two words would make the
      highest frequency character to be "l".
    </p>
    <br>
    <h3>Source code</h3>
    <p>TypeScript</p>
    <pre><code>${html}</code></pre>
  `;
});

app.get("/algo/tf-idf", async () => {
  const documents = ["The cat", "The cat sat on the mat", "My name is Mat"];
  const frequency = TFIDF(documents);
  const file = Bun.file("./src/algo/tf-idf.ts");
  const text = await file.text();
  const html = await codeToHtml(text, shikiConfig());

  return body`
    <nav>
      <a href="/">&larr; Back</a>
    </nav>
    <h1>Using TF-IDF to find out the importance of word frequency</h1>
    <p>
      This algorithm first creates the frequency of a word in a corpus text or document (TF).
      Then measures how important the term is in the document (IDF).
      And lastly we print the final score by using dot product of both TF &bull; IDF.
    </p>
    <br>
    <p>
      The frequency for the corpus "The cat", "The cat sat on the mat" & "My name is Mat" is:
      <pre><code>${await codeToHtml(
        JSON.stringify(frequency, null, 2),
        shikiConfig("json")
      )}</code></pre>
    </p>
    <br>
    <h3>Source code</h3>
    <p>TypeScript</p>
    <pre><code>${html}</code></pre>
  `;
});

app.get(
  "/",
  () => body`
    <h1>Today's weather</h1>
    <p hx-get="/weather" hx-trigger="load delay:1s">Loading weather...</p>
    <button hx-get="/weather?format=4" hx-trigger="click" hx-target="previous p">More details</button>
    <button _="on click location.reload()">Refresh</button>
    <br>
    <h3>Here are some word processing algorithms I have tried</h3>
    <ul>
      <li><a href="/algo/ngram">Predict next character using N-Gram model</a></li>
      <li><a href="/algo/tf-idf">Find the frequent words in a text using TF-IDF</a></li>
    </ul>
  `
);

app.listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
