const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

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

            const cleanPassword = password ? String(password).trim() : '';
            const cleanNewPassword = newPassword ? String(newPassword).trim() : '';

            // если указали смену пароля — проверим старый
            if (cleanPassword || cleanNewPassword) {
                if (!cleanPassword || !cleanNewPassword) {
                    return res.status(400).json({ message: 'Для смены пароля необходимо указать и текущий, и новый пароль' });
                }
                const isMatch = await bcrypt.compare(cleanPassword, user.password);
                if (!isMatch) {
                    return res.status(403).json({ message: 'Неверный текущий пароль' });
                }
                user.password = await bcrypt.hash(cleanNewPassword, 5);
            }

            // обновляем другие поля
            user.name = name !== undefined ? name : user.name;
            user.email = email !== undefined ? email : user.email;
            user.job = job !== undefined ? job : user.job;
            user.tel = tel !== undefined ? tel : user.tel;
            user.photo = photo !== undefined ? photo : user.photo;

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

            // Extract the timestamp part from multer's generated filename
            const timestamp = req.file.filename.split('-')[0];
            const newFilename = `${timestamp}-avatar.webp`;
            const newPath = path.resolve(req.file.destination, newFilename);

            // Process image with sharp
            await sharp(req.file.path)
                .resize({
                    width: 300,
                    height: 300,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 80 })
                .toFile(newPath);

            // Remove the original file
            fs.unlinkSync(req.file.path);

            // Update user record
            user.photo = newFilename;
            await user.save();

            return res.json({ message: 'Фото обновлено', filename: newFilename });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
