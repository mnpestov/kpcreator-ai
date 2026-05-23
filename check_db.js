const sequelize = require('./backend/db');
const { Kp } = require('./backend/models/models');

async function check() {
  const kp = await Kp.findOne({ where: { kpNumber: 'TEST-1234' } });
  console.log('Contractor ID in DB:', kp ? kp.contractorId : 'not found');
  process.exit();
}
check();
