import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'scores.json');

app.use(cors());
app.use(express.json());

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ scores: [], ghosts: {} }));
}

// Get scores
app.get('/api/scores', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data.scores.sort((a, b) => b.score - a.score).slice(0, 10));
});

// Post score
app.post('/api/scores', (req, res) => {
    const { player, score, ghostData } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    const newScore = { id: Date.now(), player, score };
    data.scores.push(newScore);

    if (ghostData) {
        data.ghosts[newScore.id] = ghostData;
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newScore);
});

// Get ghost
app.get('/api/ghost/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const ghost = data.ghosts[req.params.id];
    if (ghost) {
        res.json(ghost);
    } else {
        res.status(404).json({ error: 'Ghost not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Neon Highway Backend running at http://localhost:${PORT}`);
});
