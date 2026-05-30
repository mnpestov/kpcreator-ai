const { Contractor } = require('../models/models');
const { Op } = require('sequelize');

class ContractorController {
  async getAll(req, res) {
    try {
      const { search } = req.query;
      let where = {};
      if (search) {
        where = {
          [Op.or]: [
            { companyName: { [Op.iLike]: `%${search}%` } },
            { contactPerson: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }
      const contractors = await Contractor.findAll({
        where,
        order: [['companyName', 'ASC']]
      });
      return res.json(contractors);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при получении списка контрагентов', error: e.message });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const contractor = await Contractor.findByPk(id, {
        include: [{
          model: require('../models/models').Kp,
          as: 'kps',
          attributes: ['kpNumber', 'listTitle', 'eventPlace', 'status', 'createdAt', 'totalAmount'],
          include: [{
            model: require('../models/models').Event,
            as: 'event',
            attributes: ['title']
          }]
        }]
      });
      if (!contractor) {
        return res.status(404).json({ message: 'Контрагент не найден' });
      }
      return res.json(contractor);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при получении данных контрагента', error: e.message });
    }
  }

  async create(req, res) {
    try {
      const { companyName, contactPerson, phone, email, notes } = req.body;
      if (!companyName) {
        return res.status(400).json({ message: 'Название компании обязательно для заполнения' });
      }
      const contractor = await Contractor.create({
        companyName,
        contactPerson,
        phone,
        email,
        notes
      });
      return res.json(contractor);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при создании контрагента', error: e.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { companyName, contactPerson, phone, email, notes } = req.body;
      if (!companyName) {
        return res.status(400).json({ message: 'Название компании обязательно для заполнения' });
      }
      const contractor = await Contractor.findByPk(id);
      if (!contractor) {
        return res.status(404).json({ message: 'Контрагент не найден' });
      }
      await contractor.update({
        companyName,
        contactPerson,
        phone,
        email,
        notes
      });
      return res.json(contractor);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при обновлении контрагента', error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const contractor = await Contractor.findByPk(id);
      if (!contractor) {
        return res.status(404).json({ message: 'Контрагент не найден' });
      }
      await contractor.destroy();
      return res.json({ message: 'Контрагент успешно удален' });
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при удалении контрагента', error: e.message });
    }
  }
}

module.exports = new ContractorController();
