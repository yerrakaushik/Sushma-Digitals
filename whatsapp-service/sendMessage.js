const axios = require('axios');
const { getSocket } = require('./waClient');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function sendWishMessage(data) {
    const waClient = require('./waClient');
    if (!waClient.isReady) {
        throw new Error('WhatsApp client is not ready');
    }

    const sock = getSocket();
    const { whatsapp_number, wish_message, media_url, media_type, client_name } = data;

    // Format number: strip all non-digits, then add @s.whatsapp.net
    const cleanNumber = whatsapp_number.replace(/\D/g, '');
    const jid = `${cleanNumber}@s.whatsapp.net`;

    try {
        if (media_url) {
            // Download the media from Cloudinary URL
            const response = await axios.get(media_url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);

            if (media_type === 'video') {
                await sock.sendMessage(jid, {
                    video: buffer,
                    caption: wish_message,
                    mimetype: 'video/mp4',
                });
            } else {
                // Default to image
                const mimetype = media_url.endsWith('.png') ? 'image/png' : 'image/jpeg';
                await sock.sendMessage(jid, {
                    image: buffer,
                    caption: wish_message,
                    mimetype,
                });
            }
        } else {
            // Send text only
            await sock.sendMessage(jid, { text: wish_message });
        }

        console.log(`Wish sent successfully to ${client_name || 'client'} at ${whatsapp_number}`);
        return { success: true, message: `Wish sent to ${client_name || 'client'}` };
    } catch (error) {
        console.error(`Failed to send wish to ${whatsapp_number}:`, error.message);
        throw error;
    }
}

module.exports = { sendWishMessage };
