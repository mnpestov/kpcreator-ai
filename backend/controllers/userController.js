const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

class UserController {

    async getUser(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            res.json({ message: 'Пользователь найден', user });
        } catch (e) {
            next(e);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { name, email, job, tel, photo, password, newPassword } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // если указали смену пароля — проверим старый
            if (password && newPassword) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(403).json({ message: 'Неверный текущий пароль' });
                }
                user.password = await bcrypt.hash(newPassword, 5);
            }

            // обновляем другие поля
            user.name = name || user.name;
            user.email = email || user.email;
            user.job = job || user.job;
            user.tel = tel || user.tel;
            user.photo = photo || user.photo;

            await user.save();

            res.json({ message: 'Профиль обновлён', user });
        } catch (e) {
            next(e);
        }
    }

    async uploadAvatar(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id);
            if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

            if (!req.file) return res.status(400).json({ message: 'Файл не загружен' });

            user.photo = req.file.filename;
            // user.photo = filename;
            await user.save();

            return res.json({ message: 'Фото обновлено', filename: req.file.filename });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
