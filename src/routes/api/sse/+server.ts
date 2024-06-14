import Database from "$lib/server/database.js";
import { emitter } from "$lib/server/event.js";

export async function GET({ request }) {
  const { signal } = request;
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(`data: ${JSON.stringify(Database.allRows())}\n\n`);
        function send() {
          controller.enqueue(`data: ${JSON.stringify(Database.allRows())}\n\n`);
        }
        const timer = setInterval(send, 8000);
        signal.onabort = () => {
          emitter.removeEventListener("ecowitt-message", send);
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
