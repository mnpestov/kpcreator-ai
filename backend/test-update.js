async function test() {
  const loginRes = await fetch('http://127.0.0.1:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin' })
  });
  const { token } = await loginRes.json();
  const createRes = await fetch('http://127.0.0.1:3000/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title: 'Test', startEvent: '2025-01-01', location: 'test', countOfPerson: '' })
  });
  const data = await createRes.json();
  console.log(data);
}
test();
