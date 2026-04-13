
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({
  connectionString: 'postgresql://service_public:PASSWORD@ep-misty-paper-anerfiw9-pooler.c-6.us-east-1.aws.neon.tech/jeheka-prd?sslmode=require',
});
async function check() {
  const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log(res.rows.map(r => r.table_name));
  process.exit(0);
}
check();
