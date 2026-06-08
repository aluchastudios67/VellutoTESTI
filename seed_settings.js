const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const SETTINGS_PATH = path.join(process.cwd(), 'src', 'styles', 'settings_config.json');

async function main() {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
      await prisma.storeSettings.upsert({
        where: { id: 'global' },
        update: { data: settings },
        create: { id: 'global', data: settings },
      });
      console.log('Successfully seeded settings from settings_config.json to database.');
    } else {
      console.log('No settings_config.json found. Skipping seed.');
    }
  } catch (e) {
    console.error('Error seeding settings:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
