const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Game State Schema
const GameStateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  player: { type: Object, required: true },
  skills: { type: Array, required: true },
  quests: { type: Array, required: true },
  dungeons: { type: Array, required: true },
  shadows: { type: Array, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const GameState = mongoose.model('GameState', GameStateSchema);

// GET Hunter State
app.get('/api/state/:name', async (req, res) => {
  try {
    const state = await GameState.findOne({ name: req.params.name });
    if (!state) {
      console.log(`[Database] Query for Hunter "${req.params.name}" -> NOT FOUND (404)`);
      return res.status(404).json({ message: 'State not found' });
    }
    console.log(`[Database] Query for Hunter "${req.params.name}" -> SUCCESS (Loaded)`);
    res.json(state);
  } catch (err) {
    console.error('[Database] Query error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST Hunter State Sync
app.post('/api/state/:name', async (req, res) => {
  try {
    const { player, skills, quests, dungeons, shadows } = req.body;
    const updatedState = await GameState.findOneAndUpdate(
      { name: req.params.name },
      { 
        player, 
        skills, 
        quests, 
        dungeons, 
        shadows,
        updatedAt: Date.now()
      },
      { new: true, upsert: true }
    );
    console.log(`[Database] Sync updated for Hunter "${req.params.name}" -> SAVED SUCCESSFUL`);
    res.json({ message: 'State synced successfully', state: updatedState });
  } catch (err) {
    console.error('[Database] Sync error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
