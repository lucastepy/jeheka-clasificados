
const { Pool } = require('pg');

async function getColumns() {
  const pool = new Pool({
    connectionString: "postgresql://service_public:PASSWORD@ep-misty-paper-anerfiw9-pooler.c-6.us-east-1.aws.neon.tech/jeheka-prd?sslmode=require"
  });
  
  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'avisos'
    `);
    console.log(JSON.stringify(res.rows.map(r => r.column_name), null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

getColumns();
