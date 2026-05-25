const sequelize = require('./db');
async function fix() {
  try {
    await sequelize.query('ALTER TABLE "Events" ADD CONSTRAINT "Events_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractors"("id") ON DELETE SET NULL ON UPDATE CASCADE');
    console.log("Constraint added!");
  } catch (e) {
    console.error(e);
  }
  process.exit();
}
fix();
