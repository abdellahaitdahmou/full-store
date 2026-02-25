fetch('http://localhost:3000/api/seed')
    .then(res => res.text())
    .then(body => console.log('API RESPONSE BODY:', body))
    .catch(err => console.error('API ERROR:', err));
