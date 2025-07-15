const fs = require('fs');
const path = './dados/namoros.json';

function carregarNamoros() {
  if (!fs.existsSync(path)) fs.writeFileSync(path, '[]');
  return JSON.parse(fs.readFileSync(path));
}

function salvarNamoros(dados) {
  fs.writeFileSync(path, JSON.stringify(dados, null, 2));
}

async function handleNamorar(sock, msg, msgLower) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;

  if (msgLower.startsWith('namorar')) {
    const citado = msg.message?.extendedTextMessage?.contextInfo?.participant ||
                  (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [])[0];

    if (!citado) {
      await sock.sendMessage(from, { text: '💌 Marque ou responda a mensagem de quem você quer namorar.' }, { quoted: msg });
      return;
    }

    if (citado === sender) {
      await sock.sendMessage(from, { text: '🫢 Você não pode namorar consigo mesmo(a).' }, { quoted: msg });
      return;
    }

    const groupMetadata = await sock.groupMetadata(from);
    const nomeGrupo = groupMetadata?.subject || 'Grupo';
    const data = new Date().toLocaleDateString('pt-BR');
    const hora = new Date().toLocaleTimeString('pt-BR');
    const user1 = sender;
    const user2 = citado;

    const namoros = carregarNamoros();
    const jaNamora = namoros.find(n =>
      n.grupo === from &&
      (n.user1 === user1 || n.user2 === user1 || n.user1 === user2 || n.user2 === user2)
    );

    if (jaNamora) {
      await sock.sendMessage(from, { text: '❌ Um dos dois já está em um relacionamento.' }, { quoted: msg });
      return;
    }

    await sock.sendMessage(from, { react: { text: '❤️‍🔥', key: msg.key } });

    const videoBuffer = fs.readFileSync('./dados/figurinhas/namoro.mp4');
    await sock.sendMessage(from, {
      video: videoBuffer,
      gifPlayback: true,
      caption: `_𝗢 𝗮𝗺𝗼𝗿 𝗲𝘀𝘁𝗮 𝗻𝗼 𝗮𝗿😂🌹_\n💞 @${user2.split('@')[0]}, *você aceita namorar com* @${user1.split('@')[0]}?\nResponda com *sim* ou *não*\n⏳ 𝗩𝗼𝗰𝗲 𝘁𝗲𝗺 1𝗺𝗶𝗻𝘂𝘁𝗼...`,
      mentions: [user1, user2]
    }, { quoted: msg });

    const coletor = async (update) => {
      const resposta = update.messages?.[0];
      if (!resposta || resposta.key.remoteJid !== from) return;
      const senderResposta = resposta.key.participant || resposta.key.remoteJid;
      if (senderResposta !== user2) return;

      const tipoMsg = Object.keys(resposta.message || {})[0];
      const conteudo = tipoMsg === 'conversation'
        ? resposta.message.conversation
        : tipoMsg === 'extendedTextMessage'
          ? resposta.message.extendedTextMessage?.text
          : '';

      const txt = conteudo?.toLowerCase().trim();
      if (txt === 'sim') {
        namoros.push({ grupo: from, nomeGrupo, user1, user2, data, hora });
        salvarNamoros(namoros);

        const finalVideo = fs.readFileSync('./dados/figurinhas/namoro2.mp4');
        await sock.sendMessage(from, {
          video: finalVideo,
          gifPlayback: true,
          caption: `💖 𝗔𝗴𝗼𝗿𝗮 @${user1.split('@')[0]} 𝗲 @${user2.split('@')[0]} 𝗲𝘀𝘁𝗮̃𝗼 𝗼𝗳𝗶𝗰𝗶𝗮𝗹𝗺𝗲𝗻𝘁𝗲 𝗻𝗮𝗺𝗼𝗿𝗮𝗻𝗱𝗼! 💘`,
          mentions: [user1, user2]
        }, { quoted: resposta });

        try {
          const audio = fs.readFileSync('./dados/figurinhas/namoro.mp3');
          await sock.sendMessage(from, {
            audio,
            mimetype: 'audio/mpeg',
            ptt: true
          }, { quoted: resposta });
        } catch (err) {
          console.error('Erro ao enviar áudio:', err);
        }

      } else if (txt === 'não' || txt === 'nao') {
        await sock.sendMessage(from, {
          text: `😢 Pedido recusado... @${user1.split('@')[0]} vai ter que tentar de novo.`,
          mentions: [user1]
        }, { quoted: resposta });
      }

      sock.ev.off('messages.upsert', coletor);
    };

    sock.ev.on('messages.upsert', coletor);
    setTimeout(() => sock.ev.off('messages.upsert', coletor), 60000);
  }

else if (msgLower.startsWith('terminar')) {
  const namoros = carregarNamoros();
  const namoro = namoros.find(n =>
    n.grupo === from && (n.user1 === sender || n.user2 === sender)
  );

  if (!namoro) {
    await sock.sendMessage(from, { text: '⚠️ Você não está namorando com ninguém.' }, { quoted: msg });
    return;
  }

  const parceiro = (namoro.user1 === sender) ? namoro.user2 : namoro.user1;

  // Remove o namoro
  const index = namoros.indexOf(namoro);
  namoros.splice(index, 1);
  salvarNamoros(namoros);

  const gifBuffer = fs.readFileSync('./dados/figurinhas/terminar.mp4');
  await sock.sendMessage(from, {
    video: gifBuffer,
    gifPlayback: true,
    caption: `💔 O namoro entre @${sender.split('@')[0]} e @${parceiro.split('@')[0]} chegou ao fim... 😢`,
    mentions: [sender, parceiro]
  }, { quoted: msg });
}

  else if (msgLower.startsWith('dupla')) {
    const namoros = carregarNamoros();
    const namoro = namoros.find(n =>
      n.grupo === from && (n.user1 === sender || n.user2 === sender)
    );

    if (!namoro) {
      await sock.sendMessage(from, { text: '❌ Você não está em um relacionamento.' }, { quoted: msg });
      return;
    }

    const parceiro = (namoro.user1 === sender) ? namoro.user2 : namoro.user1;

    const gifBuffer = fs.readFileSync('./dados/figurinhas/dupla.mp4');
    await sock.sendMessage(from, {
      video: gifBuffer,
      gifPlayback: true,
      caption: `*💑 Sua dupla é* @${parceiro.split('@')[0]}!\n📅 *Desde:* ${namoro.data} às ${namoro.hora}.`,
      mentions: [parceiro]
    }, { quoted: msg });
  }
}

module.exports = { handleNamorar };