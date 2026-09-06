const isAdmin = require('../lib/isAdmin');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

async function downloadMediaMessage(message, mediaType) {
    const stream = await downloadContentFromMessage(message, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    const filePath = path.join(__dirname, '../temp/', `${Date.now()}.${mediaType}`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
}

async function hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message) {
    try {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(chatId, { text: '❌ .hidetag inaweza kutumika kwenye group pekee.' }, { quoted: message });
            return;
        }

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { text: 'Please make the bot an admin first.' }, { quoted: message });
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { text: 'Only admins can use the .hidetag command.' }, { quoted: message });
            return;
        }

        const { proto, generateWAMessageFromContent } = await import('@whiskeysockets/baileys');
        const metadata = await sock.groupMetadata(chatId);
        const mentionedJid = (metadata.participants || [])
            .map(participant => participant.id)
            .filter(Boolean);

        const generated = generateWAMessageFromContent(
            chatId,
            proto.Message.create({
                albumMessage: {
                    contextInfo: { mentionedJid },
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                    },
                },
            }),
            {
                userJid: sock.user?.id,
                quoted: message,
            }
        );

        await sock.relayMessage(chatId, generated.message, {
            messageId: generated.key.id,
        });
    } catch (error) {
        console.error('HideTag error:', error?.message || error);
        await sock.sendMessage(chatId, {
            text: `❌ Imeshindwa kutuma invisible hidetag.\n\n${error?.message || error}`,
        }, { quoted: message });
    }
}

module.exports = hideTagCommand;


