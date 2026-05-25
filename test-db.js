const { Event, Kp } = require('./backend/models/models');
Event.findOne({ include: [{ model: Kp }] }).then(e => console.log(e ? e.toJSON() : 'No event')).catch(console.error);
