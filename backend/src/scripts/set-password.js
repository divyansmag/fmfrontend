// Usage: node src/scripts/set-password.js <email> <new-password>
// Seeded demo users keep whatever password existed on first boot; use this to change one afterwards.
import bcrypt from 'bcryptjs';
import { pool, query } from '../db.js';

const [email, password] = process.argv.slice(2);
if (!email || !password || password.length < 8) {
  console.error('Usage: node src/scripts/set-password.js <email> <new-password (min 8 chars)>');
  process.exit(1);
}
const { rowCount } = await query('update users set password_hash = $2 where lower(email) = lower($1)', [
  email,
  await bcrypt.hash(password, 10),
]);
console.log(rowCount ? `Password updated for ${email}` : `No user found with email ${email}`);
await pool.end();
process.exit(rowCount ? 0 : 1);
