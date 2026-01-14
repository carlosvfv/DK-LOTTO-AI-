// Test de nueva API Key
const axios = require('axios');

const API_KEY = 'sk-78346dc91ddf46a49f25f191f43dd473';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

console.log('🧪 Testing NEW DeepSeek API Key...\n');

async function testAPI() {
    try {
        console.log('📡 Sending test request...');

        const response = await axios.post(
            API_URL,
            {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'user',
                        content: 'Respond with: {"status": "API Working!"}'
                    }
                ],
                temperature: 0.7,
                max_tokens: 50
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        console.log('✅✅✅ SUCCESS! NEW API KEY IS WORKING! ✅✅✅\n');
        console.log('Response:', response.data.choices[0].message.content);
        console.log('\n🎉 API Key is valid and has credits!');
        console.log('📝 Updating .env file with new key...');

    } catch (error) {
        console.log('❌ FAILED with new key');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data?.error?.message || error.message);
    }
}

testAPI();
