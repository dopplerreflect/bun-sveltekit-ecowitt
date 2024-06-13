import processWeatherData from "./weather-data";
import { emitter } from "./event";
import { serverSentEvents } from "./server-sent-events";
const server = Bun.serve({
  development: true,
  hostname: "0.0.0.0",
  async fetch(req) {
    const path = new URL(req.url).pathname;
    // client connects to / for server-sent-events
    if (path === "/serverSentEvents") {
      return serverSentEvents(req);
    }
    // weather station hub sends data here
    if (req.method === "POST" && path === "/ecowitt-endpont") {
      const formData = await req.formData();
      let weatherData = processWeatherData(formData);
      emitter.dispatchEvent(new CustomEvent("ecowitt-message"));
      console.log("DATA:", weatherData.dateutc);
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
