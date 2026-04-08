import { db } from "../src/lib/db";

async function test() {
  try {
    console.log("Checking rubros table columns...");
    const sql = `SELECT * FROM rubros LIMIT 1`;
    const result = await db.query(sql);
    console.log("Columns:", Object.keys(result.rows[0] || {}));
    console.log("Sample row:", result.rows[0]);

    console.log("\nChecking sub_rubros table columns...");
    const sql2 = `SELECT * FROM sub_rubros LIMIT 1`;
    const result2 = await db.query(sql2);
    console.log("Columns:", Object.keys(result2.rows[0] || {}));
    console.log("Sample row:", result2.rows[0]);
  } catch (error) {
    console.error("Query failed:", error);
  }
}

test();
