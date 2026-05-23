const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'V1541r1410261',
  host: 'localhost',
  port: 5433,
  database: 'KURGI_KP',
});
client.connect().then(() => {
  return client.query("SELECT id, \"companyName\" FROM \"Contractors\";");
}).then(res => {
  console.log(res.rows);
  client.end();
}).catch(console.error);
