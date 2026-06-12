require('dotenv').config();
const express = require('express');
const { connectToWhatsApp } = require('./waClient');
const { sendWishMessage } = require('./sendMessage');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const FLASK_SECRET = process.env.FLASK_SECRET;

// Middleware for API Key protection
function authenticateKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== FLASK_SECRET) {
        return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
    next();
}

// --- GET /status ---
app.get('/status', (req, res) => {
    const waClient = require('./waClient');
    res.json({
        connected: waClient.isReady,
        qr: !waClient.isReady ? waClient.currentQR : null
    });
});

// --- GET /qr ---
app.get('/qr', (req, res) => {
    const waClient = require('./waClient');
    if (waClient.isReady) {
        return res.json({ connected: true });
    }
    res.json({ qr: waClient.currentQR });
});

// --- POST /send ---
app.post('/send', authenticateKey, async (req, res) => {
    const waClient = require('./waClient');
    if (!waClient.isReady) {
        return res.status(503).json({ error: 'WhatsApp not connected' });
    }

    const { whatsapp_number, wish_message } = req.body;
    if (!whatsapp_number || !wish_message) {
        return res.status(400).json({ error: 'Missing required fields: whatsapp_number or wish_message' });
    }

    try {
        const result = await sendWishMessage(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- GET /health ---
app.get('/health', (req, res) => {
    const waClient = require('./waClient');
    res.json({ status: 'ok', whatsapp: waClient.isReady });
});

// Start the server and initialize WhatsApp client
const server = app.listen(PORT, () => {
    console.log(`WhatsApp Microservice running on port ${PORT}`);
    console.log('Initializing WhatsApp client (Baileys)...');
    connectToWhatsApp();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing server');
    server.close(() => {
        console.log('Express server closed');
        const waClient = require('./waClient');
        const sock = waClient.getSocket();
        if (sock) {
            console.log('Closing WhatsApp connection');
            sock.end();
        }
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing server');
    server.close(() => {
        console.log('Express server closed');
        const waClient = require('./waClient');
        const sock = waClient.getSocket();
        if (sock) {
            console.log('Closing WhatsApp connection');
            sock.end();
        }
        process.exit(0);
    });
});
