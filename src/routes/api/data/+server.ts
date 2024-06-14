import Database from "$lib/server/database";

export async function GET({ request }) {
  return new Response(JSON.stringify(Database.allRows()), { status: 200 });
}
