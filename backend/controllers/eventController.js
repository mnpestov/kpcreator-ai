const { Event, Contractor, Kp } = require('../models/models');
const sequelize = require('../db');
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
            { eventPlace: { [Op.iLike]: `%${search}%` } }
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
      const { 
        title, contractorId, status, notes, eventPlace,
        eventDate, startTime, endTime,
        startEvent, endEvent, 
        startTimeStartEvent, endTimeStartEvent, 
        startTimeEndEvent, endTimeEndEvent,
        countOfPerson
      } = req.body;
      
      // Lightweight validation
      if (!title) {
        return res.status(400).json({ message: 'Название события обязательно для заполнения' });
      }

      const normalizeTime = (v) => v === '' ? null : v;

      // Backward compatibility logic
      const finalStartEvent = normalizeTime(startEvent || eventDate);
      if (!finalStartEvent) {
        return res.status(400).json({ message: 'Дата события обязательна для заполнения' });
      }
      
      const finalEventDate = finalStartEvent;
      const finalEndEvent = normalizeTime(endEvent || finalStartEvent);

      const finalStartTimeStartEvent = normalizeTime(startTimeStartEvent || startTime);
      const finalStartTime = finalStartTimeStartEvent;

      const finalEndTimeEndEvent = normalizeTime(endTimeEndEvent || endTime);
      const finalEndTime = finalEndTimeEndEvent;
      
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
        eventPlace: eventPlace || null,
        status: finalStatus,
        notes: notes || null,
        
        // New schedule fields
        startEvent: finalStartEvent,
        endEvent: finalEndEvent,
        startTimeStartEvent: finalStartTimeStartEvent,
        endTimeStartEvent: normalizeTime(endTimeStartEvent),
        startTimeEndEvent: normalizeTime(startTimeEndEvent),
        endTimeEndEvent: finalEndTimeEndEvent,
        
        // Compatibility fields
        eventDate: finalEventDate,
        startTime: finalStartTime,
        endTime: finalEndTime,
        
        countOfPerson: countOfPerson === '' ? null : countOfPerson
      });

      const responseEvent = await Event.findByPk(event.id, {
        include: [{ model: Contractor, attributes: ['id', 'companyName', 'contactPerson'] }]
      });
      return res.json(responseEvent);
    } catch (e) {
      console.error(e);
      console.error("error.message:", e.message);
      console.error("error.errors:", e.errors);
      console.error("error.parent:", e.parent);
      console.error("error.original:", e.original);
      return res.status(500).json({ message: 'Ошибка при создании события', error: e.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { 
        title, contractorId, status, notes, eventPlace,
        eventDate, startTime, endTime,
        startEvent, endEvent, 
        startTimeStartEvent, endTimeStartEvent, 
        startTimeEndEvent, endTimeEndEvent,
        countOfPerson
      } = req.body;
      
      // Lightweight validation
      if (!title) {
        return res.status(400).json({ message: 'Название события обязательно для заполнения' });
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

      const normalizeTime = (v) => v === '' ? null : v;

      // Backward compatibility logic
      // Prefer new fields if provided; fallback to old fields; fallback to existing DB values
      const finalStartEvent = normalizeTime(startEvent || eventDate || event.startEvent || event.eventDate);
      if (!finalStartEvent) {
        return res.status(400).json({ message: 'Дата события обязательна для заполнения' });
      }
      const finalEventDate = finalStartEvent;
      const finalEndEvent = normalizeTime(endEvent || finalStartEvent);

      const inputStartTimeStartEvent = startTimeStartEvent !== undefined ? startTimeStartEvent : startTime;
      const finalStartTimeStartEvent = normalizeTime(inputStartTimeStartEvent !== undefined ? inputStartTimeStartEvent : event.startTimeStartEvent);
      const finalStartTime = finalStartTimeStartEvent;

      const inputEndTimeEndEvent = endTimeEndEvent !== undefined ? endTimeEndEvent : endTime;
      const finalEndTimeEndEvent = normalizeTime(inputEndTimeEndEvent !== undefined ? inputEndTimeEndEvent : event.endTimeEndEvent);
      const finalEndTime = finalEndTimeEndEvent;

      await event.update({
        title,
        contractorId: contractorId !== undefined ? contractorId : event.contractorId,
        eventPlace: eventPlace !== undefined ? eventPlace : event.eventPlace,
        status: status !== undefined ? status : event.status,
        notes: notes !== undefined ? notes : event.notes,

        // New schedule fields
        startEvent: finalStartEvent,
        endEvent: finalEndEvent,
        startTimeStartEvent: finalStartTimeStartEvent,
        endTimeStartEvent: normalizeTime(endTimeStartEvent !== undefined ? endTimeStartEvent : event.endTimeStartEvent),
        startTimeEndEvent: normalizeTime(startTimeEndEvent !== undefined ? startTimeEndEvent : event.startTimeEndEvent),
        endTimeEndEvent: finalEndTimeEndEvent,
        
        // Compatibility fields
        eventDate: finalEventDate,
        startTime: finalStartTime,
        endTime: finalEndTime,
        
        countOfPerson: countOfPerson === '' ? null : (countOfPerson !== undefined ? countOfPerson : event.countOfPerson)
      });

      const responseEvent = await Event.findByPk(id, {
        include: [{ model: Contractor, attributes: ['id', 'companyName', 'contactPerson'] }]
      });
      return res.json(responseEvent);
    } catch (e) {
      console.error(e);
      console.error("error.message:", e.message);
      console.error("error.errors:", e.errors);
      console.error("error.parent:", e.parent);
      console.error("error.original:", e.original);
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

  async propagate(req, res) {
    try {
      const { id } = req.params;
      const { 
        startEvent, endEvent, 
        startTimeStartEvent, endTimeStartEvent, 
        startTimeEndEvent, endTimeEndEvent, 
        eventPlace 
      } = req.body;
      
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({ message: 'Событие не найдено' });
      }

      // Update related Kp records
      await Kp.update({
        startEvent: startEvent || null,
        endEvent: endEvent || null,
        eventPlace: eventPlace || null,
      }, {
        where: { eventId: id }
      });

      // Find all linked KPs to update their legacy List records
      const linkedKps = await Kp.findAll({ where: { eventId: id }, attributes: ['id'] });
      const kpIds = linkedKps.map(kp => kp.id);

      if (kpIds.length > 0) {
        // We ensure times are sliced if they are passed as full time strings, 
        // but prefer direct copy if they are already in HH:MM format as the domain expects.
        // Actually, Sequelize handles TIME correctly, but we'll ensure we pass them directly.
        await sequelize.models.list.update({
          startEvent: startEvent || null,
          endEvent: endEvent || null,
          startTimeStartEvent: startTimeStartEvent || null,
          endTimeStartEvent: endTimeStartEvent || null,
          startTimeEndEvent: startTimeEndEvent || null,
          endTimeEndEvent: endTimeEndEvent || null,
          eventPlace: eventPlace || null
        }, {
          where: { kpId: kpIds }
        });
      }

      return res.json({ message: 'Данные события успешно синхронизированы со связанными КП' });
    } catch (e) {
      return res.status(500).json({ message: 'Ошибка при синхронизации события', error: e.message });
    }
  }
}

module.exports = new EventController();
