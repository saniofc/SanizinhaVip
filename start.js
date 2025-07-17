// 📦 Módulos externos
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const colors = require('colors');
const gradient = require('gradient-string');
const readline = require('readline');
const exec = require('child_process').exec;
const { Boom } = require('@hapi/boom');
const P = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

// 🔁 Importações internas
const { upsert, onGroupParticipantsUpdate, setSock } = require('./index');

// 📁 Caminhos e variáveis de ambiente
const number = process.env.WHATSAPP_NUMBER || 'default';
const qrcodePath = `./dados/sessoes/session-${number}`;
const pairingCode = process.argv.includes("--code");

// 🧠 Interface para código de pareamento
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise(resolve => rl.question(text, resolve));

// 🚀 Função principal
async function STBLK() {
  const { state, saveCreds } = await useMultiFileAuthState(qrcodePath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['Ubuntu', 'Edge', '110.0.1587.56'],
  });

  setSock(sock);

  // 📨 Recebimento de mensagens
  sock.ev.on('messages.upsert', async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg || !msg.message || msg.message.protocolMessage) return;
      await upsert(m, sock);
    } catch (e) {
      console.error('Erro no messages.upsert:', e);
    }
  });

  // 👥 Atualização de participantes do grupo
  sock.ev.on('group-participants.update', async (update) => {
    try {
      await onGroupParticipantsUpdate(update, sock);
      const { id: groupId, participants, action } = update;

      if (action === 'remove') {
        const contadorPath = './dados/contador.json';
        if (!fs.existsSync(contadorPath)) return;

        let contador = JSON.parse(fs.readFileSync(contadorPath, 'utf-8'));
        if (typeof contador !== 'object') return;

        for (const user of participants) {
          if (contador[groupId]?.[user]) {
            delete contador[groupId][user];
          }
          if (contador[groupId] && Object.keys(contador[groupId]).length === 0) {
            delete contador[groupId];
          }
        }

        fs.writeFileSync(contadorPath, JSON.stringify(contador, null, 2));
      }
    } catch (e) {
      console.error('Erro em group-participants.update:', e);
    }
  });

  // 🔄 Conexão e QR code
  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr && !pairingCode) {
      console.log('\n📷 Escaneie o QR code abaixo:\n');
      require('qrcode-terminal').generate(qr, { small: true });
    }

    const code = new Boom(lastDisconnect?.error)?.output?.statusCode;

    // 🚨 Aviso de possível banimento
    try {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const reason = lastDisconnect?.error?.output?.payload?.message;

      if (statusCode === 401 || (reason && reason.toLowerCase().includes('logged out'))) {
        const donoJson = JSON.parse(fs.readFileSync('./dono/info.json'));
        const donoJid = donoJson.numerodono.replace(/\D/g, '') + '@s.whatsapp.net';
        await sock.sendMessage(donoJid, {
          text: '👀 tô sentindo o Marckzukemberck no meu cangote kkk\n🚨 O bot pode ter sido banido ou desconectado, verifica aí chefia!'
        });
      }
    } catch (err) {
      console.error('Erro ao tentar avisar o dono sobre possível ban:', err);
    }

    // 🔁 Reconexão automática
    if (connection === 'close') {
      if (code !== DisconnectReason.loggedOut) {
        console.log(colors.yellow('Conexão fechada, tentando reconectar...'));
        STBLK();
      } else {
        console.log(colors.red("Sessão encerrada pelo logout. Excluindo diretório de sessão..."));
        exec(`rm -rf ${qrcodePath}`);
        process.exit(0);
      }
    }

    // ✅ Conexão aberta
    else if (connection === 'open') {
      const texto = `
░██████╗░█████╗░███╗░░██╗██╗███████╗██╗███╗░░██╗██╗░░██╗░█████╗░
██╔════╝██╔══██╗████╗░██║██║╚════██║██║████╗░██║██║░░██║██╔══██╗
╚█████╗░███████║██╔██╗██║██║░░███╔═╝██║██╔██╗██║███████║███████║
░╚═══██╗██╔══██║██║╚████║██║██╔══╝░░██║██║╚████║██╔══██║██╔══██║
██████╔╝██║░░██║██║░╚███║██║███████╗██║██║░╚███║██║░░██║██║░░██║
╚═════╝░╚═╝░░╚═╝╚═╝░░╚══╝╚═╝╚══════╝╚═╝╚═╝░░╚══╝╚═╝░░╚═╝╚═╝░░╚═╝
                        ██╗░░░██╗░░░███╗
                        ██║░░░██║░░█████║
                        ╚██╗░██╔╝░╚██╔██║
                        ░╚████╔╝░░░╚═╝██║
                        ░░╚██╔╝░░░███████║
                        ░░░╚═╝░░░░╚══════╝`;
      const usernameBot = process.env.BOT_NAME || "SanizinhaBot";
      console.log(gradient.pastel.multiline(texto));
      console.log(chalk.yellow(`*ੈ🌸‧₊˚Sistema conectado com sucesso°❀⋆.ೃ࿔*･!`));
      console.log(chalk.magenta(`💻 Desenvolvido por ${chalk.bold('@saniofc°❀⋆.ೃ࿔*:･')}`));
      console.log('');
    }
  });

  // 🔗 Pareamento por código (opcional)
  if (pairingCode && !sock.authState.creds.registered) {
    let phoneNumber = await question("Digite o número do bot (sem + e sem espaços): ");
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    let code = await sock.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log("🔗 Código de pareamento:", code);
    rl.close();
  }

  sock.ev.on('creds.update', saveCreds);
}

// ▶️ Inicializa o bot
STBLK().catch(e => console.error("Erro ao iniciar o bot:", e));