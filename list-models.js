const https = require('https');
const fs = require('fs');

const key = 'AIzaSyDvRNHF8wD3hhWh1arlPNYvD_nxwsUI0ag';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            const genModels = parsed.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
            fs.writeFileSync('models.txt', genModels.map(m => m.name).join('\n'));
        } catch (e) {
            fs.writeFileSync('models.txt', "Error: " + e.message + "\nData: " + data);
        }
    });
}).on('error', (e) => fs.writeFileSync('models.txt', "Error: " + e.message));
