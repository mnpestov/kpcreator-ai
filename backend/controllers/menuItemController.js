const { MenuItem } = require('../models/models');
const { Op } = require('sequelize');
const sequelize = require('../db');

class MenuItemController {
  async getAll(req, res) {
    try {
      const { search } = req.query;
      let where = {};
      if (search) {
        where = {
          [Op.or]: [
            sequelize.where(sequelize.literal(`"title" COLLATE "und-x-icu"`), 'ILIKE', `%${search}%`),
            sequelize.where(sequelize.literal(`"category" COLLATE "und-x-icu"`), 'ILIKE', `%${search}%`)
          ]
        };
      }
      const menuItems = await MenuItem.findAll({
        where,
        order: [['title', 'ASC']]
      });
      return res.json(menuItems);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при получении списка меню', error: e.message });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const menuItem = await MenuItem.findByPk(id);
      if (!menuItem) {
        return res.status(404).json({ message: 'Позиция меню не найдена' });
      }
      return res.json(menuItem);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при получении данных меню', error: e.message });
    }
  }

  async create(req, res) {
    try {
      const { title, description, category, weight, price, active } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'Название обязательно для заполнения' });
      }

      const menuItem = await MenuItem.create({
        title,
        description: description || null,
        category: category || null,
        weight: weight !== undefined ? weight : null,
        price: price !== undefined ? price : null,
        active: active !== undefined ? active : true
      });

      return res.json(menuItem);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при создании позиции меню', error: e.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category, weight, price, active } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'Название обязательно для заполнения' });
      }

      const menuItem = await MenuItem.findByPk(id);
      if (!menuItem) {
        return res.status(404).json({ message: 'Позиция меню не найдена' });
      }

      await menuItem.update({
        title,
        description: description !== undefined ? description : menuItem.description,
        category: category !== undefined ? category : menuItem.category,
        weight: weight !== undefined ? weight : menuItem.weight,
        price: price !== undefined ? price : menuItem.price,
        active: active !== undefined ? active : menuItem.active
      });

      return res.json(menuItem);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при обновлении позиции меню', error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const menuItem = await MenuItem.findByPk(id);
      if (!menuItem) {
        return res.status(404).json({ message: 'Позиция меню не найдена' });
      }
      await menuItem.destroy();
      return res.json({ message: 'Позиция меню успешно удалена' });
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при удалении позиции меню', error: e.message });
    }
  }
}

module.exports = new MenuItemController();
