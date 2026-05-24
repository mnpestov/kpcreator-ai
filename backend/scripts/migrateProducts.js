const { MenuItem } = require('../models/models');
const products = require('../../frontend/src/data/products.json');
const sequelize = require('../db');

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    let createdCount = 0;
    
    for (const prod of products) {
      if (prod.type === 'organisation') {
        console.log(`Skipped organisation: ${prod.name}`);
        continue;
      }
      
      let desc = prod.composition ? prod.composition.trim() : '';
      if (desc.startsWith('(') && desc.endsWith(')')) {
        desc = desc.slice(1, -1).trim();
      }
      
      const payload = {
        title: prod.name,
        description: desc || null,
        category: prod.type,
        weight: null, // Will let the user edit this via UI
        price: null,
        active: true
      };

      const existing = await MenuItem.findOne({ where: { title: payload.title } });
      if (!existing) {
        await MenuItem.create(payload);
        console.log(`Created: ${payload.title}`);
        createdCount++;
      } else {
        console.log(`Skipped duplicate: ${payload.title}`);
      }
    }
    
    console.log(`Migration completed successfully. Migrated ${createdCount} items.`);
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
