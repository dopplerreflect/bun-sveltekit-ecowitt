import Database from "$lib/server/database.js";

export async function GET({ request }) {
  let remoteSSE = Bun.env.USE_REMOTE_SSE;

  if (remoteSSE) {
    console.log(`using remote sse: ${remoteSSE}`);
    try {
      return fetch(remoteSSE);
    } catch (error) {
      console.log(error);
    }
  }
  const { signal } = request;
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(
          `data: ${JSON.stringify(Database.allRows("/api/sse:start()"))}\n\n`,
        );
        function send() {
          controller.enqueue(
            `data: ${JSON.stringify(Database.allRows("/api/sse:send()"))}\n\n`,
          );
        }
        const timer = setInterval(send, 8000);
        signal.onabort = () => {
          clearInterval(timer);
          controller.close();
        };
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        Connection: "keep-alive",
      },
    },
  );
}
