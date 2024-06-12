import { emitter } from "./event";
import Database from "./database";

export function sendSSEMessage(controller, data) {
  controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
}

export function sse(req) {
  const { signal } = req;
  return new Response(
    new ReadableStream({
      start(controller) {
        sendSSEMessage(controller, Database.allRows()); //send one to start
        function send() {
          sendSSEMessage(controller, Database.allRows());
        }
        emitter.addEventListener("ecowitt-message", send);
        signal.onabort = () => {
          emitter.removeEventListener("ecowitt-message", send);
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
