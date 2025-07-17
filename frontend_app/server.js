const express = require('express');
const path = require('path');
const openaiProxy = require('./src/openaiProxy');

const app = express();
app.use(express.json());

app.use('/api/openai', openaiProxy);

// Serve React static files (in production)
// app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`OpenAI proxy/Express server running on port ${PORT}`);
});

// PUBLIC_INTERFACE
/**
 * Dev/local usage:
 *   node server.js
 * Proxy endpoint available at http://localhost:5001/api/openai/chat
 */
