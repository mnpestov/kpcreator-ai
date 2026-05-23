const { Kp, Event, Contractor, List, Row } = require('./models/models');
const kpController = require('./controllers/kpController');
const eventController = require('./controllers/eventController');

async function test() {
  console.log("Testing KpController.getLastFive()...");
  const req1 = {};
  const res1 = { json: (data) => console.log("getLastFive OK", data.length, "items") };
  await kpController.getLastFive(req1, res1, console.error);

  console.log("Testing KpController.getOne(518)...");
  const req2 = { params: { id: "518" } };
  const res2 = { json: (data) => console.log("getOne OK, event is:", data.formData.event) };
  await kpController.getOne(req2, res2, console.error);

  console.log("Testing EventController.getAll()...");
  const req3 = { query: {} };
  const res3 = { json: (data) => console.log("getAll OK, count:", data.length) };
  await eventController.getAll(req3, res3, console.error);

  // If there are events, let's get one
  const events = await Event.findAll();
  if (events.length > 0) {
    const req4 = { params: { id: events[0].id } };
    const res4 = { json: (data) => console.log("EventController.getOne OK, kps included:", data.kps ? data.kps.length : 0) };
    await eventController.getOne(req4, res4, console.error);
  }

  process.exit(0);
}

test().catch(console.error);
