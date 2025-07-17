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

/**
 * PUBLIC_INTERFACE
 * 
 * Dev/local usage:
 *   node server.js
 * 
 * Proxy endpoint available at http://localhost:5001/api/openai/chat
 * 
 * - Place your OpenAI API key into a `.env` file in the project root as:
 *     OPENAI_API_KEY=sk-...
 * - Do NOT use REACT_APP_OPENAI_API_KEY for backend; that's only for frontend build use.
 * - The backend reads only OPENAI_API_KEY from the process environment.
 * 
 * You must run both:
 *   npm run backend    # Starts Express proxy at :5001 with OpenAI access
 *   npm start          # Starts React frontend at :3000 (which proxies API calls to backend)
 */
