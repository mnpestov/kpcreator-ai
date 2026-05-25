
async function run() {
  try {
    const res = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '[SMOKE] Test',
        startEvent: '2025-01-01',
        location: 'Test'
      })
    });
    const data = await res.text();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', data);
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}
run();
