'use strict';

const JOIN_URL = 'https://chat.whatsapp.com/IbQcd51ItVU8ABnvGMXA8q?s=cl&p=a&ilr=0';
const COMMUNITY_IMAGE = 'https://litter.catbox.moe/cenuvu.jpg';

function resolveBloksWidget(proto) {
    const candidates = [
        proto?.Message?.InteractiveMessage?.BloksWidget,
        proto?.Message?.BloksWidget,
        proto?.BloksWidget,
    ];

    return candidates.find(type => typeof type?.create === 'function');
}

async function blockCommand(sock, chatId, message) {
    try {
        const { proto } = await import('@whiskeysockets/baileys/WAProto/index.js');
        const crypto = await import('crypto');
        const interactiveMessage = proto.Message.InteractiveMessage;
        const bloksWidgetType = resolveBloksWidget(proto);

        if (!bloksWidgetType) {
            await sock.sendMessage(chatId, {
                text: '⚠️ BloksWidget haipo kwenye WAProto ya Baileys iliyosakinishwa.\n\n' +
                    'Tafadhali tumia Baileys build yenye BloksWidget schema; kwa sasa nimeacha command isi-crash.',
            }, { quoted: message });
            return;
        }

        const uuid = crypto.randomUUID();
        const widgetData = {
            version: 'v0.9',
            createSurface: {
                surfaceId: `community-${uuid}`,
                catalogId: 'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json',
                sendDataModel: false,
                components: [
                    {
                        id: 'root',
                        component: 'Column',
                        children: ['login_image', 'login_title', 'login_description'],
                    },
                    {
                        id: 'login_image',
                        component: 'Image',
                        url: COMMUNITY_IMAGE,
                        variant: 'header',
                        fit: 'cover',
                    },
                    {
                        id: 'login_title',
                        component: 'Text',
                        text: 'Code Community',
                        variant: 'h1',
                    },
                    {
                        id: 'login_description',
                        component: 'Text',
                        text: '* No Rasis\n* No 18+\n* No Spam teks/stc/sw gc\n* Promosi 1x sehari\n* Fun and Learning\n\nSilakan kenalan, sharing ilmu, dan belajar bareng.',
                        variant: 'body',
                    },
                ],
            },
        };

        const widget = bloksWidgetType.create({
            uuid,
            type: 'im_a2ui',
            data: JSON.stringify(widgetData),
        });

        const content = proto.Message.create({
            interactiveMessage: interactiveMessage.create({
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: 'Join',
                                url: JOIN_URL,
                            }),
                        },
                    ],
                    messageParamsJson: '{}',
                    messageVersion: 1,
                },
                bloksWidget: widget,
            }),
        });

        const encoded = proto.Message.encode(content).finish();
        const decoded = proto.Message.decode(encoded);
        if (!decoded.interactiveMessage?.bloksWidget) {
            throw new Error('BloksWidget imepotea baada ya encode/decode');
        }

        await sock.relayMessage(chatId, content, {
            messageId: crypto.randomBytes(16).toString('hex'),
        });
    } catch (error) {
        console.error('Block command error:', error?.message || error);
        await sock.sendMessage(chatId, {
            text: `❌ Imeshindwa kutuma Code Community widget.\n\n${error?.message || error}`,
        }, { quoted: message });
    }
}

module.exports = blockCommand;
