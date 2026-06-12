const { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { useSupabaseAuthState } = require('./supabaseAuthStore');

let sock = null;
let isReady = false;
let currentQR = null;
let reconnectAttempts = 0;

async function connectToWhatsApp() {
    console.log('Initializing Supabase Auth Store...');
    const { state, saveCreds } = await useSupabaseAuthState();

    // Fetch the latest WhatsApp Web version to avoid 405 errors
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`Using WhatsApp Web version: ${version.join('.')} (latest: ${isLatest})`);

    sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false, // We handle QR ourselves
        logger: pino({ level: 'silent' }),
    });

    // Save credentials whenever they update
    sock.ev.on('creds.update', saveCreds);

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            currentQR = qr;
            isReady = false;
            qrcode.generate(qr, { small: true });
            console.log('QR code generated! Scan it with WhatsApp.');
        }

        if (connection === 'close') {
            isReady = false;
            currentQR = null;
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log(`WhatsApp disconnected (status: ${statusCode}). Reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) {
                reconnectAttempts++;
                const delay = Math.min(5000 * reconnectAttempts, 60000); // Max 60s delay
                console.log(`Reconnecting in ${delay / 1000}s (attempt ${reconnectAttempts})...`);
                setTimeout(() => connectToWhatsApp(), delay);
            } else {
                console.log('Logged out. Please delete auth_info folder and restart to re-authenticate.');
            }
        } else if (connection === 'open') {
            isReady = true;
            currentQR = null;
            reconnectAttempts = 0;
            console.log('WhatsApp client is ready!');
        }
    });
}

module.exports = {
    connectToWhatsApp,
    getSocket: () => sock,
    get isReady() { return isReady; },
    get currentQR() { return currentQR; },
};
