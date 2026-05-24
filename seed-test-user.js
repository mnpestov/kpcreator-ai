const { User } = require('./backend/models/models');
const bcrypt = require('bcrypt');
async function seed() {
  const hash = await bcrypt.hash('123456', 5);
  await User.findOrCreate({
    where: { email: 'admin@example.com' },
    defaults: { password: hash, role: 'ADMIN' }
  });
  console.log('Seeded admin@example.com');
  process.exit(0);
}
seed().catch(console.error);
