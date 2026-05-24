const { User } = require('./backend/models/models');
async function check() {
  const user = await User.findOne();
  console.log('User email:', user ? user.email : 'not found');
  process.exit();
}
check();
