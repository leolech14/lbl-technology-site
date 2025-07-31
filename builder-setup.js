// Builder.io Setup Script
// Run this after adding your API key to .env.local

const YOUR_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'your-public-api-key-here';

console.log('🚀 Setting up Builder.io integration...\n');

console.log('Steps to complete setup:');
console.log('1. ✅ Get your API key from: https://builder.io/account/space');
console.log('2. ✅ Add it to .env.local file');
console.log('3. ✅ Run: npm install @builder.io/sdk @builder.io/react');
console.log('4. ✅ Run: builder connect');
console.log('5. ✅ Run: builder import ./index.html\n');

console.log('Quick links:');
console.log('- Dashboard: https://builder.io/content');
console.log('- Visual Editor: https://builder.io/editor');
console.log('- API Keys: https://builder.io/account/space\n');

// Initialize Builder
if (YOUR_API_KEY !== 'your-public-api-key-here') {
  console.log('✅ API Key detected! Ready to connect.');
} else {
  console.log('⚠️  Please add your API key to .env.local first');
}