const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const { User } = require('../models/models');

const validateTelegramInitData = (telegramInitData) => {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.error('[TMA_AUTH] TELEGRAM_BOT_TOKEN не задан в окружении — Telegram-авторизация отключена');
      return false;
    }

    const urlParams = new URLSearchParams(telegramInitData);
    const hash = urlParams.get('hash');
    if (!hash) return false;
    urlParams.delete('hash');

    const keys = Array.from(urlParams.keys()).sort();
    const dataCheckString = keys.map(key => `${key}=${urlParams.get(key)}`).join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(process.env.TELEGRAM_BOT_TOKEN)
      .digest();

    const calculatedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    const hashBuffer = Buffer.from(hash, 'hex');
    const calculatedHashBuffer = Buffer.from(calculatedHash, 'hex');
    const isSignatureValid = hashBuffer.length === calculatedHashBuffer.length
      && crypto.timingSafeEqual(hashBuffer, calculatedHashBuffer);

    if (!isSignatureValid) {
      console.warn(`[TMA_AUTH] INVALID_SIGNATURE`);
      return false;
    }

    const authDate = parseInt(urlParams.get('auth_date'), 10);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      console.warn(`[TMA_AUTH] TOKEN_EXPIRED`);
      return false;
    }

    const rawUser = urlParams.get('user');
    if (!rawUser) return false;

    return JSON.parse(rawUser);
  } catch (e) {
    return false;
  }
};

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

      // Очищаем телефон от маски перед поиском в базе (оставляем только цифры)
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

  async telegramAuth(req, res, next) {
    try {
      const { initData } = req.body;
      if (!initData) {
        return res.status(400).json({ message: 'Отсутствуют данные Telegram' });
      }

      const tgUser = validateTelegramInitData(initData);
      if (!tgUser) return res.status(403).json({ message: 'Недействительные или устаревшие данные Telegram' });

      const user = await User.findOne({ where: { telegramId: String(tgUser.id) } });
      if (!user) {
        console.info(`[TMA_AUTH] NOT_BOUND telegramId=${tgUser.id}`);
        return res.status(404).json({ message: 'Пользователь не привязан к Telegram' });
      }

      console.info(`[TMA_AUTH] LOGIN telegramId=${tgUser.id}`);
      const token = generateJwt(user.id, user.email, user.name, user.role, user.job, user.tel, user.photo);
      return res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  async telegramBind(req, res, next) {
    try {
      const { tel, password, initData } = req.body;
      if (!tel || !password || !initData) {
        return res.status(400).json({ message: 'Телефон, пароль и данные Telegram обязательны' });
      }

      const cleanTel = tel.replace(/\D/g, '');

      const tgUser = validateTelegramInitData(initData);
      if (!tgUser) return res.status(403).json({ message: 'Недействительные или устаревшие данные Telegram' });

      const existingTgUser = await User.findOne({ where: { telegramId: String(tgUser.id) } });
      if (existingTgUser) {
        console.warn(`[TMA_AUTH] TELEGRAM_ALREADY_BOUND telegramId=${tgUser.id} to another user`);
        return res.status(409).json({ message: 'Этот Telegram аккаунт уже привязан к другому профилю' });
      }

      const user = await User.findOne({ where: { tel: cleanTel } });
      if (!user) return res.status(401).json({ message: 'Неверный телефон или пароль' });

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) return res.status(401).json({ message: 'Неверный логин или пароль' });

      if (user.telegramId) {
        console.warn(`[TMA_AUTH] USER_ALREADY_BOUND telegramId=${tgUser.id} attempted to bind to user ${user.id} who has ${user.telegramId}`);
        return res.status(409).json({ message: 'К этому профилю уже привязан Telegram аккаунт' });
      }

      user.telegramId = String(tgUser.id);
      try {
        await user.save();
      } catch (saveErr) {
        if (saveErr instanceof Sequelize.UniqueConstraintError) {
          console.warn(`[TMA_AUTH] TELEGRAM_ALREADY_BOUND_RACE telegramId=${tgUser.id}`);
          return res.status(409).json({ message: 'Этот Telegram аккаунт уже привязан к другому профилю' });
        }
        throw saveErr;
      }

      console.info(`[TMA_AUTH] BIND telegramId=${tgUser.id} to user ${user.id}`);
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
