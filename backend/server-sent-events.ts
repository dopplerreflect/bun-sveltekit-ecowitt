import weatherData from "./weather-data";
import { emitter } from "./event";
import { allRows } from "./database";

export function sendSSEMessage(controller, data) {
  controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
}

export function sse(req) {
  const { signal } = req;
  return new Response(
    new ReadableStream({
      start(controller) {
        function send() {
          // sendSSEMessage(controller, weatherData.data);
          sendSSEMessage(controller, allRows());
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
