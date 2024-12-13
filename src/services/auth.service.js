import bcrypt from 'bcryptjs';
import db from '../database/connection.js';

export class AuthService {
  async validateCredentials(email, password) {
    const user = await db('users').where({ email, active: true }).first();
    if (!user) return null;
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async updateLastLogin(userId) {
    await db('users')
      .where({ id: userId })
      .update({ last_login: db.fn.now() });
  }
}