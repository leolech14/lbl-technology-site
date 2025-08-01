#!/usr/bin/env node

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY || '7cc2cecd-62ee-422d-9252-f9073c5d2b25';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.SORA_API_KEY;

console.log('🔍 Testing API Connections...\n');

// Test Leonardo AI
async function testLeonardo() {
    console.log('Testing Leonardo AI...');
    try {
        const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/me', {
            headers: {
                'Authorization': `Bearer ${LEONARDO_API_KEY}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Leonardo AI: Connected');
            console.log(`   User: ${data.user?.username || 'Unknown'}`);
            console.log(`   API Tokens: ${data.user?.apiConcurrencySlots || 'Unknown'}`);
        } else {
            console.log('❌ Leonardo AI: Failed -', response.status, response.statusText);
        }
    } catch (error) {
        console.log('❌ Leonardo AI: Error -', error.message);
    }
}

// Test OpenAI/Sora
async function testOpenAI() {
    console.log('\nTesting OpenAI/Sora...');
    
    if (!OPENAI_API_KEY) {
        console.log('❌ OpenAI: No API key found');
        console.log('   Run with Doppler: doppler run -- node test-apis.js');
        return;
    }
    
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ OpenAI: Connected');
            
            // Check for Sora model
            const soraModels = data.data.filter(m => m.id.includes('sora'));
            if (soraModels.length > 0) {
                console.log('✅ Sora models available:');
                soraModels.forEach(m => console.log(`   - ${m.id}`));
            } else {
                console.log('⚠️  No Sora models found. Available models:', 
                    data.data.slice(0, 5).map(m => m.id).join(', '), '...');
            }
        } else {
            console.log('❌ OpenAI: Failed -', response.status, response.statusText);
        }
    } catch (error) {
        console.log('❌ OpenAI: Error -', error.message);
    }
}

// Run tests
async function runTests() {
    await testLeonardo();
    await testOpenAI();
    
    console.log('\n📝 Summary:');
    console.log('- Leonardo AI key:', LEONARDO_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('- OpenAI key:', OPENAI_API_KEY ? '✅ Set' : '❌ Missing (use Doppler)');
}

runTests();