const { Organisation } = require('../models/models');
const { Op } = require('sequelize');
const sequelize = require('../db');

class OrganisationController {
  async getAll(req, res) {
    try {
      const { search } = req.query;
      let where = {};
      if (search) {
        where = {
          title: sequelize.where(sequelize.literal(`"title" COLLATE "und-x-icu"`), 'ILIKE', `%${search}%`)
        };
      }
      const organisations = await Organisation.findAll({
        where,
        order: [['title', 'ASC']]
      });
      return res.json(organisations);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при получении списка услуг', error: e.message });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const organisation = await Organisation.findByPk(id);
      if (!organisation) {
        return res.status(404).json({ message: 'Услуга не найдена' });
      }
      return res.json(organisation);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при получении данных услуги', error: e.message });
    }
  }

  async create(req, res) {
    try {
      const { title, description, price, active } = req.body;
      const organisation = await Organisation.create({
        title,
        description,
        price,
        active
      });
      return res.json(organisation);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при создании услуги', error: e.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, price, active } = req.body;
      const organisation = await Organisation.findByPk(id);
      if (!organisation) {
        return res.status(404).json({ message: 'Услуга не найдена' });
      }

      organisation.title = title !== undefined ? title : organisation.title;
      organisation.description = description !== undefined ? description : organisation.description;
      organisation.price = price !== undefined ? price : organisation.price;
      organisation.active = active !== undefined ? active : organisation.active;

      await organisation.save();
      return res.json(organisation);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при обновлении услуги', error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const organisation = await Organisation.findByPk(id);
      if (!organisation) {
        return res.status(404).json({ message: 'Услуга не найдена' });
      }
      await organisation.destroy();
      return res.json({ message: 'Услуга удалена' });
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при удалении услуги', error: e.message });
    }
  }
}

module.exports = new OrganisationController();
