const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

const generateJwt = (id, email, name, role, job, tel, photo) => {
  return jwt.sign({ id, email, name, role, job, tel, photo }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '120h'
  });
};

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, name, job, tel, photo } = req.body;
      if (!tel || !password || !name) {
        return res.status(400).json({ message: 'Телефон, имя и пароль обязательны' });
      }

      const cleanTel = tel.replace(/\D/g, '');
      const existingUser = await User.findOne({ where: { tel: cleanTel } });
      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({
        email,
        password: hashPassword,
        name,
        job,
        tel: cleanTel,
        photo
      });

      const token = generateJwt(user.id, user.email, user.name, user.role, user.job, user.tel, user.photo);
      return res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { tel, password } = req.body;
      const cleanTel = tel.replace(/\D/g, '');
      const user = await User.findOne({ where: { tel: cleanTel } });
      if (!user) {
        return res.status(401).json({ message: 'Неверный телефон или пароль' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Неверный логин или пароль' });
      }

      const token = generateJwt(user.id, user.email, user.name, user.role, user.job, user.tel, user.photo);
      return res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  async check(req, res) {
    const token = generateJwt(req.user.id, req.user.email, req.user.name, req.user.role, req.user.job, req.user.tel, req.user.photo);
    return res.json({ token });
  }
}

module.exports = new AuthController();
