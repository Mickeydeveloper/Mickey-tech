'use strict';

const RICH_IMAGE = 'https://picsum.photos/seed/banner/900/500';
const RICH_VIDEO = 'https://athars.space/uploads/1c4c9712.mp4';

function buildRichMessage(subject = 'LevviCode') {
    return {
        title: 'Laporan AI LevviCode',
        text: 'Loading...',
        editrich: {
            title: 'Laporan AI LevviCode',
            text: `Ini adalah **rich message** lengkap dengan berbagai komponen untuk ${subject}.`,
            code: {
                language: 'javascript',
                code: 'console.log("LevviCode");',
            },
            table: [
                ['Produk', 'Harga', 'Stok'],
                ['Kopi Susu', 'Rp18.000', '25'],
                ['Es Teh', 'Rp5.000', '120'],
                ['Roti Bakar', 'Rp12.000', '30'],
            ],
            image: RICH_IMAGE,
            images: [
                'https://picsum.photos/seed/img1/600/600',
                'https://picsum.photos/seed/img2/600/600',
                'https://picsum.photos/seed/img3/600/600',
            ],
            video: RICH_VIDEO,
            productSingle: {
                title: 'Kopi Susu Spesial',
                brand: 'LevviCoffee',
                price: 'Rp18.000',
                sale_price: 'Rp15.000',
                product_url: 'https://levvicode.cloud',
                image: 'https://picsum.photos/seed/coffee/400/400',
                additional_images: [
                    { url: 'https://picsum.photos/seed/coffee2/400/400' },
                ],
            },
            productMultiple: [
                {
                    title: 'Roti Bakar',
                    brand: 'LevviBakery',
                    price: 'Rp12.000',
                    product_url: 'https://levvicode.cloud',
                    image: 'https://picsum.photos/seed/bread/400/400',
                },
                {
                    title: 'Es Teh',
                    brand: 'LevviTea',
                    price: 'Rp5.000',
                    product_url: 'https://levvicode.cloud',
                    image: 'https://picsum.photos/seed/tea/400/400',
                },
            ],
            post: [
                {
                    title: 'Tutorial Baileys',
                    subtitle: 'Panduan WhatsApp Bot',
                    username: 'LevviCode',
                    profile_picture_url: 'https://picsum.photos/seed/profile/100/100',
                    is_verified: true,
                    thumbnail_url: 'https://picsum.photos/seed/post/600/350',
                    post_caption: 'Belajar membuat bot WhatsApp.',
                    likes_count: 1200,
                    comments_count: 230,
                    shares_count: 80,
                    post_url: 'https://levvicode.cloud',
                    post_deeplink: 'https://levvicode.cloud',
                    source_app: 'INSTAGRAM',
                    footer_label: 'LevviCode',
                    footer_icon: 'https://picsum.photos/seed/footer/60/60',
                    orientation: 'LANDSCAPE',
                    post_type: 'IMAGE',
                },
            ],
            reels: [
                {
                    title: 'Tutorial Baileys',
                    reels_title: 'Cara Membuat Bot',
                    profileIconUrl: 'https://picsum.photos/seed/avatar/100/100',
                    thumbnailUrl: 'https://picsum.photos/seed/reels/500/800',
                    videoUrl: RICH_VIDEO,
                    likes_count: 5000,
                    shares_count: 300,
                    view_count: 20000,
                    reel_source: 'Instagram',
                    is_verified: true,
                },
            ],
            sources: [
                ['https://picsum.photos/seed/google/64/64', 'https://levvicode.cloud', 'LevviCode'],
                ['https://picsum.photos/seed/github/64/64', 'https://github.com/LevviCodeID', 'GitHub'],
            ],
            tip: 'Gunakan rich message untuk pengalaman yang lebih interaktif.',
            suggestions: ['Lihat Produk', 'Tutorial', 'Website', 'Hubungi Admin'],
            footer: 'Powered by LevviCode AI',
        },
    };
}

async function levviCommand(sock, chatId, message, args = []) {
    const subject = args.length ? args.join(' ').trim() : 'MICKEYGLITCH BOT';
    const richMessage = buildRichMessage(subject);

    try {
        await sock.sendMessage(chatId, { richMessage }, { quoted: message });
    } catch (error) {
        console.error('Levvi rich message error:', error?.message || error);
        await sock.sendMessage(chatId, {
            text: `❌ Rich message haikutumwa.\n\n${error?.message || error}`,
        }, { quoted: message });
    }
}

module.exports = levviCommand;
