const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// PUBLIC_INTERFACE
/**
 * Proxy endpoint for OpenAI Chat API
 * Receives POST { messages: [...], model?: string }
 * Forwards to OpenAI API with API key from env (never sent to client)
 *
 * Usage:
 *   POST /api/openai/chat { messages: [...] }
 */
router.post('/chat', async (req, res) => {
  try {
    // Use OPENAI_API_KEY from env (never expose REACT_APP_ keys in backend)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured in backend (set OPENAI_API_KEY env var)' });
    }
    const { messages, model = "gpt-3.5-turbo" } = req.body;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
      })
    });
    const result = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: result.error || 'OpenAI error' });
    } else {
      res.json(result);
    }
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

module.exports = router;
