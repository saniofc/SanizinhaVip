const axios = require('axios');
const { performance } = require('perf_hooks');

module.exports = async function menuAdmCommand(msg, sock, from, sender, isGroupAdmin) {
  const getBuffer = async (url) => {
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      return res.data;
    } catch (e) {
      console.error('Erro ao baixar thumbnail do menuadm:', e);
      return null;
    }
  };

  if (!isGroupAdmin) {
    await sock.sendMessage(from, { text: '❌ Apenas administradores podem usar este comando.' }, { quoted: msg });
    return;
  }

  try {
    await sock.sendMessage(from, { react: { text: '🙇🏻‍♀️', key: msg.key } });
  } catch {}

  const ping = `${Math.floor(performance.now())}ms`;
  const thumbnail = await getBuffer('https://i.postimg.cc/Gtr3K8bY/IMG-20250712-WA0027.jpg');

  const senderId = sender.split('@')[0];
  const welcomeText = `✨𝑩𝒆𝒎 𝒗𝒊𝒏𝒅𝒐 𝒂𝒐 𝒎𝒆𝒏𝒖𝒂𝒅𝒎💕 @${senderId}\n`;

  const menuAdmText = 
`╭─❍❍❍❍❍❍❍❍─╮
┃ 🩸𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒🩸 
╰─❍❍❍❍❍❍❍❍─╯
┃乡ۣۜۜ͜͡🛡️ _► gpa_
┃乡ۣۜۜ͜͡🛡️ _► gpf_
┃乡ۣۜۜ͜͡🛡️ _► ban/b_
┃乡ۣۜۜ͜͡🛡️ _► vasco_
┃乡ۣۜۜ͜͡🛡️ _► linkgp_
┃乡ۣۜۜ͜͡🛡️ _► mute_
┃乡ۣۜۜ͜͡🛡️ _► listanegra_
┃乡ۣۜۜ͜͡🛡️ _► tirardalista_
┃乡ۣۜۜ͜͡🛡️ _► verlista_
┃乡ۣۜۜ͜͡🛡️ _► desmute_
┃乡ۣۜۜ͜͡🛡️ _► antilink_
┃乡ۣۜۜ͜͡🛡️ _► antitrava_
┃乡ۣۜۜ͜͡🛡️ _► antiporno_
┃乡ۣۜۜ͜͡🛡️ _► antifake_
┃乡ۣۜۜ͜͡🛡️ _► bemvindo_
┃乡ۣۜۜ͜͡🛡️ _► legendabv_
┃乡ۣۜۜ͜͡🛡️ _► limpar_
┃乡ۣۜۜ͜͡🛡️ _► resetcontador_
┃乡ۣۜۜ͜͡🛡️ _► blockgp_
┃乡ۣۜۜ͜͡🛡️ _► marca_
┃乡ۣۜۜ͜͡🛡️ _► totag_
┃乡ۣۜۜ͜͡🛡️ _► ativa <recursos>_

╭─❍❍❍❍❍❍❍❍─╮
┃𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐎𝐍𝐎
╰─❍❍❍❍❍❍❍❍─╯
┃乡ۣۜۜ͜͡💎 _► reiniciar_
┃乡ۣۜۜ͜͡💎 _► nuke_
┃乡ۣۜۜ͜͡💎 _► entrargp_
┃乡ۣۜۜ͜͡💎 _► sairgp_
┃乡ۣۜۜ͜͡💎 _► tmss_
┃乡ۣۜۜ͜͡💎 _► novodono_
┃乡ۣۜۜ͜͡💎 _► banghost_  
┃乡ۣۜۜ͜͡💎 _► antipromote_
┃乡ۣۜۜ͜͡💎 _► bloock_
┃乡ۣۜۜ͜͡💎 _► unbloock_
┃乡ۣۜۜ͜͡💎 _► listblock_

╰─────•𝒔𝒂𝒏𝒊𝒛𝒊𝒏𝒉𝒂 𝒃𝒐𝒕•─────╯`;

  await sock.sendMessage(from, {
    text: welcomeText + menuAdmText,
    contextInfo: {
      mentionedJid: [sender],
      externalAdReply: {
        title: '👑𝗠𝗘𝗡𝗨 𝗔𝗗𝗠👑',
        body: `⚡Ping: ${ping}`,
        mediaType: 1,
        previewType: 0,
        renderLargerThumbnail: true,
        thumbnail,
        mediaUrl: 'https://linkfly.to/nexosfc',
        sourceUrl: 'https://𝘯𝘦𝘹𝘰𝘀𝘰𝘧𝘤'
      }
    }
  }, { quoted: msg });
};