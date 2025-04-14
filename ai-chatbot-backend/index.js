require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

app.post('/api/chat', async (req, res) => {
  const userMessages = req.body.messages;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct', // ✅ Use free OpenRouter model
        messages: userMessages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173', // ✅ Set to your frontend deployed URL
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('🔥 Error talking to OpenRouter:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Error fetching response from OpenRouter',
      details: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
