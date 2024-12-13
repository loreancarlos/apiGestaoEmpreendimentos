import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.validateCredentials(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      await this.authService.updateLastLogin(user.id);

      return res.json({
        token, user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}