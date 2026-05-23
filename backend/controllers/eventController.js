const { Event, Contractor, Kp } = require('../models/models');
const { Op } = require('sequelize');

const ALLOWED_STATUSES = ['Draft', 'Approved', 'Preparation', 'Scheduled', 'Completed', 'Cancelled'];

class EventController {
  async getAll(req, res) {
    try {
      const { search } = req.query;
      let where = {};
      if (search) {
        where = {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { location: { [Op.iLike]: `%${search}%` } }
          ]
        };
      }
      const events = await Event.findAll({
        where,
        include: [{ model: Contractor, attributes: ['id', 'companyName', 'contactPerson'] }],
        order: [['eventDate', 'ASC'], ['startTime', 'ASC']]
      });
      return res.json(events);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при получении списка событий', error: e.message });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id, {
        include: [
          { model: Contractor, attributes: ['id', 'companyName', 'contactPerson'] },
          { model: Kp, attributes: ['id', 'kpNumber', 'listTitle', 'kpDate'] }
        ]
      });
      if (!event) {
        return res.status(404).json({ message: 'Событие не найдено' });
      }
      return res.json(event);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при получении данных события', error: e.message });
    }
  }

  async create(req, res) {
    try {
      const { title, contractorId, eventDate, startTime, endTime, location, status, notes } = req.body;
      
      // Lightweight validation
      if (!title) {
        return res.status(400).json({ message: 'Название события обязательно для заполнения' });
      }
      if (!eventDate) {
        return res.status(400).json({ message: 'Дата события обязательна для заполнения' });
      }
      
      // Status validation
      const finalStatus = status || 'Draft';
      if (!ALLOWED_STATUSES.includes(finalStatus)) {
        return res.status(400).json({ 
          message: `Недопустимый статус события. Разрешенные статусы: ${ALLOWED_STATUSES.join(', ')}` 
        });
      }

      const event = await Event.create({
        title,
        contractorId: contractorId || null,
        eventDate,
        startTime: startTime || null,
        endTime: endTime || null,
        location: location || null,
        status: finalStatus,
        notes: notes || null
      });

      const responseEvent = await Event.findByPk(event.id, {
        include: [{ model: Contractor, attributes: ['id', 'companyName', 'contactPerson'] }]
      });
      return res.json(responseEvent);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при создании события', error: e.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, contractorId, eventDate, startTime, endTime, location, status, notes } = req.body;
      
      // Lightweight validation
      if (!title) {
        return res.status(400).json({ message: 'Название события обязательно для заполнения' });
      }
      if (!eventDate) {
        return res.status(400).json({ message: 'Дата события обязательна для заполнения' });
      }
      
      // Status validation
      if (status && !ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ 
          message: `Недопустимый статус события. Разрешенные статусы: ${ALLOWED_STATUSES.join(', ')}` 
        });
      }

      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({ message: 'Событие не найдено' });
      }

      await event.update({
        title,
        contractorId: contractorId !== undefined ? contractorId : event.contractorId,
        eventDate,
        startTime: startTime !== undefined ? startTime : event.startTime,
        endTime: endTime !== undefined ? endTime : event.endTime,
        location: location !== undefined ? location : event.location,
        status: status !== undefined ? status : event.status,
        notes: notes !== undefined ? notes : event.notes
      });

      const responseEvent = await Event.findByPk(id, {
        include: [{ model: Contractor, attributes: ['id', 'companyName', 'contactPerson'] }]
      });
      return res.json(responseEvent);
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при обновлении события', error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({ message: 'Событие не найдено' });
      }
      await event.destroy();
      return res.json({ message: 'Событие успешно удалено' });
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при удалении события', error: e.message });
    }
  }
}

module.exports = new EventController();
