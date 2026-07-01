const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const ADMIN_FILE = path.join(__dirname, '..', 'data', 'admin.json');
const SALT_ROUNDS = 10;

function ensureAdminSeeded() {
  if (fs.existsSync(ADMIN_FILE)) return;

  const rawPassword = process.env.ADMIN_PASSWORD;
  if (!rawPassword) {
    throw new Error('ADMIN_PASSWORD is not set in .env — cannot seed admin.json');
  }

  const passwordHash = bcrypt.hashSync(rawPassword, SALT_ROUNDS);
  fs.writeFileSync(
    ADMIN_FILE,
    JSON.stringify({ passwordHash, updatedAt: new Date().toISOString() }, null, 2) + '\n'
  );
}

module.exports = { ensureAdminSeeded };
