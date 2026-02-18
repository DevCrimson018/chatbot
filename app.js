const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys'); 
const pino = require('pino');
const {Boom} = require('@hapi/boom');
const qrcode = require('qrcode-terminal');

const { getCurrentUser, getScheduledEvents } = require('./config/calendly')
const fs = require('fs/promises');

require('dotenv').config();

let sock; // Variable global para mantener la conexión




async function connectToWhatsApp(){
    const { state, saveCreds } = await useMultiFileAuthState('auth_session');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent'}) //Evita el Spam de Logs
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const {connection, lastDisconnect, qr} = update;

       //console.log(update);
        
       //ss

        if(qr){
            console.log('⚡ Escanea este código QR con tu WhatsApp:');
            qrcode.generate(qr, {small: true});
        }

        if (connection === 'close'){
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexion Cerrada. Reintentar?:', shouldReconnect);
            // if(shouldReconnect) {
            //     fs.rm('./auth_session', {
            //         recursive: true,
            //         force: true
            //     });
            //     connectToWhatsApp();
            // }
        } else if (connection === 'open') {
            console.log('Bot Conectado con Exito!!');
        }
    });

    const userState = {};

    // Escuchador de mensajes (El Menú)
    sock.ev.on('messages.upsert', async ({messages }) => {
        
        
        const msg = messages[0];
        
        //console.log(messages[0]);
        
        if(!msg.message || msg.key.fromMe) return;

        const jid = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        
        console.log(msg);
        
        

        if (text?.toLowerCase() === 'hola' && userState[jid] !== "NONE") {
            await sock.sendMessage(jid, {text: `¡Hola ${msg.pushName} desde Express! Escribe "test" para probar la API.`});
            getScheduledEvents();
            try {
                console.log('Archivando:...');
                //console.log(sock);
                
                await sock.chatModify({
                    pin: true
                }, jid);
                console.log('Archivado1');
                
            } catch (error) {
                console.log('Error al archivar');
            }
            userState[jid] = "NONE"; 
        }
        

    });

    // --- ENDPOINT DE EXPRESS ---
    // Esto permite enviar mensajes vía HTTP POST
    app.post('/api/send-message', async (req, res) => {
        const {number, message} = req.body;
        
        if(!sock) return res.status(500).json({ error: "Bot no iniciado"});

        const jid = `${number}@s.whatsapp.net`;
        try {
            console.log({number, message});
            
            await sock.sendMessage(jid, { text: message });
            res.json({ status: "Enviado Correctamente"});
        } catch (error) {
            res.status(500).json({ error: "Erro al enviar mensaje"});
        }

    });


}


const app = express();

app.use(express.json());

PORT = process.env.PORT || 3000

app.listen(PORT , () => {
    console.log(`Estas en el puerto: ${PORT}`);
    connectToWhatsApp();
})