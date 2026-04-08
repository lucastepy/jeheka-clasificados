
import { db } from "../src/lib/db";

async function inspectTable(tableName: string) {
  try {
    const sql = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `;
    const result = await db.query(sql, [tableName]);
    console.log(`Columns for table ${tableName}:`);
    console.table(result.rows);
  } catch (error) {
    console.error(`Error inspecting table ${tableName}:`, error);
  }
}

async function main() {
  await inspectTable('rubros');
  await inspectTable('sub_rubros');
  process.exit(0);
}

main();
