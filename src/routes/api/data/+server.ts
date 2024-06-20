import Database from "$lib/server/database";

export async function GET() {
  let data = await JSON.stringify(Database.allRows("/api/data"));
  // console.log("/api/data", data);
  return new Response(data, { status: 200 });
}
