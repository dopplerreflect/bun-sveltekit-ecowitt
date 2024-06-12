import processWeatherData from "./weather-data";
import { emitter, newMessageRecieved } from "./event";
import { sse } from "./server-sent-events";
const server = Bun.serve({
  development: true,
  hostname: "0.0.0.0",
  async fetch(req) {
    const path = new URL(req.url).pathname;
    // client connects to / for server-sent-events
    if (path === "/") {
      return sse(req);
    }
    // weather station hub sends data here
    if (req.method === "POST" && path === "/recieve-ecowitt-data") {
      const formData = await req.formData();
      let weatherData = processWeatherData(formData);
      emitter.dispatchEvent(newMessageRecieved);
      console.log("RECIEVED:", weatherData.dateutc);
      return Response.json({ success: true }, { status: 201 });
    }
    return NotFound;
  },
  error() {
    return NotFound;
  },
});

console.log(`Server listening on ${server.hostname}:${server.port}`);

const NotFound = new Response("Not Found", { status: 404 });
