import weatherData from "./weather-data";
import { emitter, newMessageRecieved } from "./event";
import { sse } from "./server-sent-events";
const server = Bun.serve({
  development: true,
  hostname: "0.0.0.0",
  async fetch(req) {
    const path = new URL(req.url).pathname;
    if (path === "/") {
      return sse(req);
    }
    if (req.method === "POST" && path === "/recieve-ecowitt-data") {
      const data = await req.formData();
      weatherData.data = weatherData.sanitize(data);
      emitter.dispatchEvent(newMessageRecieved);
      console.log("RECIEVED:", weatherData.data.dateutc);
      return Response.json({ success: true, data });
    }
    return NotFound;
  },
  error() {
    return NotFound;
  },
});

console.log(`Server listening on ${server.hostname}:${server.port}`);

const NotFound = new Response("Not Found", { status: 404 });
