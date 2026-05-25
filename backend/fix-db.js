const sequelize = require('./db');
async function fix() {
  try {
    await sequelize.query('ALTER TABLE "Events" DROP CONSTRAINT IF EXISTS "Events_contractorId_fkey"');
    console.log("Constraint dropped!");
  } catch (e) {
    console.error(e);
  }
  process.exit();
}
fix();
