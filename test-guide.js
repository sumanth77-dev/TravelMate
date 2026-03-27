const http = require('http');

async function test() {
    const fetch = (await import('node-fetch')).default;

    // 1. Register Guide
    const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            full_name: 'Test Guide 2',
            email: 'guide2@test.com',
            phone_number: '1234567890',
            password: 'password',
            role: 'Guide',
            city_location: 'Berlin',
            short_bio: 'Test bio'
        })
    });
    const data = await res.json();
    console.log('Register:', data);
    const token = data.token;

    if (!token) return;

    // 2. Fetch /me
    const res2 = await fetch('http://localhost:5000/api/guides/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('GET /me status:', res2.status);
    console.log('GET /me body:', await res2.json());

    // 3. PUT /me
    const res3 = await fetch('http://localhost:5000/api/guides/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ city_location: 'Munich' })
    });
    console.log('PUT /me status:', res3.status);
    console.log('PUT /me body:', await res3.json());
}
test();
