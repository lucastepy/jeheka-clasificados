import { db } from "./src/lib/db.js";

async function run() {
  try {
    const res = await db.query(
      `SELECT column_name, data_type, character_maximum_length 
       FROM information_schema.columns 
       WHERE table_name = 'avisos';`
    );
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
