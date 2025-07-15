const axios = require('axios');
const { performance } = require('perf_hooks');
const info = require('../dono/info.json');

async function getBuffer(url) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return res.data;
  } catch (e) {
    console.error('Erro ao baixar thumbnail do menu:', e);
    return null;
  }
}

module.exports = async function menuCommand(msg, sock, from) {
  try {
    const sender = msg.key.participant || msg.participant || msg.key.remoteJid || from;
    const userTag = `@${sender.split('@')[0]}`;
    const isDono = sender.includes(info.numerodono);

    const groupMetadata = await sock.groupMetadata(from);
    const isAdmin = groupMetadata.participants?.some(p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    const admStatus = isAdmin ? '✅' : '❌';

    const start = performance.now();
    await sock.sendMessage(from, { react: { text: '🙇🏻‍♀️', key: msg.key } });

    const thumbnail = await getBuffer('https://i.postimg.cc/Gtr3K8bY/IMG-20250712-WA0027.jpg');
    const end = performance.now();
    const ping = Math.floor(end - start);

    const hora = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const uptime = process.uptime();
    const uptimeHoras = Math.floor(uptime / 3600);
    const uptimeMin = Math.floor((uptime % 3600) / 60);
    const uptimeSeg = Math.floor(uptime % 60);

    const menuText = `╭─❍❍❍❍🩸❍❍❍❍─╮
│✭ 𝗢𝗶𝗶 ${userTag}
│✭ 𝗼𝗻𝗹𝗶𝗻𝗲 𝗮: ${uptimeHoras}𝗵 ${uptimeMin}𝗺 ${uptimeSeg}𝘀
│✭ 𝗛𝗼𝗿𝗮: ${hora}
│✭ 𝗗𝗼𝗻𝗼: ${isDono ? '☑️' : '❌'}
│✭ 𝗔𝗱𝗺: ${admStatus}
│✭ 𝗕𝗼𝘁: ${info.nomebot}
╰─❍❍❍❍🩸❍❍❍❍─╯

╭─❍❍❍❍❍❍❍❍─╮
┃ 💞𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒💞 
╰─❍❍❍❍❍❍❍❍─╯
┃乡ۜۜ͜͡👑ۣ _► 𝗺𝗲𝗻𝘂𝗮𝗱𝗺_
┃乡ۣۜۜ͜͡🌎 _► sanizinha_
┃乡ۣۜۜ͜͡🌎 _► grupoofc_  
┃乡ۣۜۜ͜͡🌎 _► sorteio_
┃乡ۣۜۜ͜͡🌎 _► criador_
┃乡ۣۜۜ͜͡🌎 _► toimg_
┃乡ۣۜۜ͜͡🌎 _► perfil_
┃乡ۣۜۜ͜͡🌎 _► matar_
┃乡ۣۜۜ͜͡🌎 _► beijar_
┃乡ۣۜۜ͜͡🌎 _► dono_
┃乡ۣۜۜ͜͡🌎 _► ping_
┃乡ۣۜۜ͜͡🌎 _► bot_
┃乡ۣۜۜ͜͡🌎 _► fs_

╭─❍❍❍❍❍❍❍❍─╮
┃   🎭𝐙𝐎𝐄𝐈𝐑𝐀😂      
╰─❍❍❍❍❍❍❍❍─╯
┃✰ۣۜۜ͜͡🎠 _► pau_
┃✰ۣۜۜ͜͡🎠 _► ppk_
┃✰ۣۜۜ͜͡🎠 _► lavarlouca_
┃✰ۣۜۜ͜͡🎠 _► tapa_
┃✰ۣۜۜ͜͡🎠 _► tapao_
┃✰ۣۜۜ͜͡🎠 _► corno_
┃✰ۣۜۜ͜͡🎠 _► gay_

╭─❍❍❍❍❍❍❍❍─╮
┃  🥇𝐑𝐀𝐍𝐊𝐒🏆     
╰─❍❍❍❍❍❍❍❍─╯
┃乡ۣۜۜ͜͡🎖️ _► rank_  
┃乡ۣۜۜ͜͡🎖️ _► rankgay_
┃乡ۣۜۜ͜͡🎖️ _► rankgado_
┃乡ۣۜۜ͜͡🎖️ _► rankcorno_
┃乡ۣۜۜ͜͡🎖️ _► rankfeio_
┃乡ۣۜۜ͜͡🎖️ _► ranklindo_
┃乡ۣۜۜ͜͡🎖️ _► rankputa_
┃乡ۣۜۜ͜͡🎖️ _► rankclt_
┃乡ۣۜۜ͜͡🎖️ _► rankpau_
┃乡ۣۜۜ͜͡🎖️ _► rankppk_

╭─❍❍❍❍❍❍❍❍─╮
┃   🎮𝐉𝐎𝐆𝐎𝐒⚽
╰─❍❍❍❍❍❍❍❍─╯
┃𝄢ۣۜۜ͜͡🎲 _► dado_
┃𝄢ۣۜۜ͜͡👵🏻 _► jogodavelha_
┃𝄢ۣۜۜ͜͡💣 _► campominado_
┃𝄢ۣۜۜ͜͡🧩 _► memoria_
┃𝄢ۣۜۜ͜͡🧸 _► forca_

╭─❍❍❍❍❍❍❍❍─╮
┃🔍𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐒🔎
╰─❍❍❍❍❍❍❍❍─╯
┃乡♪ۣۜۜ͜͡🎶 _► play_
┃乡♪ۣۜۜ͜͡🎶 _► playvd_
┃乡♪ۣۜۜ͜͡🎶 _► videopraaudio_

╭─❍❍❍❍❍❍❍❍─╮
┃💭𝐈𝐍𝐅𝐎𝐒/𝐈𝐃𝐄𝐈𝐀𝐒💡
╰─❍❍❍❍❍❍❍❍─╯
┃𝄢ۣۜۜ͜͡🪐 _► infogp_
┃𝄢ۣۜۜ͜͡🪐 _► ideia_

╰─────•𝑺𝒂𝒏𝒊𝒛𝒊𝒏𝒉𝒂𝑩𝒐𝒕•─────╯`;

    await sock.sendMessage(from, {
      text: menuText,
      mentions: [sender],
      contextInfo: {
        mentionedJid: [sender],
        externalAdReply: {
          title: '🪐 𝗠𝗘𝗡𝗨 𝗜𝗡𝗜𝗖𝗜𝗔𝗟 ✨',
          body: `⚡ 𝘗𝘪𝘯𝘨: ${ping}ms`,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnail,
          mediaUrl: 'https://linkfly.to/nexosfc',
          sourceUrl: 'https://nexosofc'
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error('Erro ao enviar menu:', err);
    await sock.sendMessage(from, { text: '❌ Erro ao carregar menu.' }, { quoted: msg });
  }
};