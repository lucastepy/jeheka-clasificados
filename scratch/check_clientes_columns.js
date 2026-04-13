
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({
  connectionString: 'postgresql://service_public:PASSWORD@ep-misty-paper-anerfiw9-pooler.c-6.us-east-1.aws.neon.tech/jeheka-prd?sslmode=require',
});
async function check() {
  const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'clientes' AND table_schema = 'public'");
  console.log(res.rows);
  process.exit(0);
}
check();
