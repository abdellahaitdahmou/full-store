const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyDvRNHF8wD3hhWh1arlPNYvD_nxwsUI0ag');

async function testModel(modelName) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const res = await model.generateContent('Hello');
        console.log(`[SUCCESS] ${modelName} works. Response: ${res.response.text()}`);
    } catch (e) {
        console.log(`[FAILED] ${modelName}: ${e.message}`);
    }
}

async function runTests() {
    await testModel('gemini-2.5-flash');
    await testModel('gemini-2.0-flash-lite');
    await testModel('gemini-flash-latest');
}

runTests();
