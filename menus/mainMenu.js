const { getScheduledEvents, generateSchedulingLink } = require("../config/calendly");

async function menuFlow(sock, userState, text, message, jid) {
    try {
        console.log(userState[jid]);
        console.log(text);
        
        if(
            ((text?.toLowerCase() === 'hola') && userState[jid] === undefined) ||
            (userState[jid] === "FREE" && text?.toLowerCase() === "menu")){
                mainMenu(sock, userState, text, message, jid)
        }
        else if(userState[jid] === "MAIN_MENU"){
            switch(text){
                case "1":
                    menu1(sock, userState, text, message, jid);
                    break;
                case "2":
                    menu2(sock, userState, text, message, jid);
                    break;
                case "3":
                    menu3(sock, userState, text, message, jid);
                    break;
                case "4":
                    await sock.sendMessage(jid, {text: "Ahora estaras chateando normal"});
                    userState[jid] = "FREE";
                    break;
                default:
                    await sock.sendMessage(jid, {text: "Debes seleccionar una opcion. Intenta de nuevo..."})
                    mainMenu(sock, userState, text, message, jid);
                    break;
            }
        }else if(userState[jid] === "MENU_1"){
            if(text?.toLowerCase() === "ok"){
                userState[jid] = "FREE";
                await sock.sendMessage(jid, {text: "Acabas de salir del Menu 1. Chatea normal"})
                
            }else if(text?.toLowerCase() === "atras"){
                await sock.sendMessage(jid, {text: "Volviendo al meno principal"});
                mainMenu(sock, userState, text, message, jid)
            }else{
                await sock.sendMessage(jid, {text: "Debes escribir ok para salir. Intentalo de nuevo"});
            }
        }else if(userState[jid] === "MENU_2"){
            if(text?.toLowerCase() === "peter"){
                userState[jid] = "FREE";
                await sock.sendMessage(jid, {text: "Acabas de salir del Menu 2. Chatea normal"})
                
            }else if(text?.toLowerCase() === "atras"){
                await sock.sendMessage(jid, {text: "Volviendo al meno principal"});
                mainMenu(sock, userState, text, message, jid);
            }else{
                await sock.sendMessage(jid, {text: "Debes escribir peter para salir. Intentalo de nuevo"});
            }
        }else if(userState[jid] === "MENU_3"){
            if(text?.toLowerCase() === "goku"){
                userState[jid] = "FREE";
                await sock.sendMessage(jid, {text: "Acabas de salir del Menu 3. Chatea normal"})
                
            }else if(text?.toLowerCase() === "atras"){
                await sock.sendMessage(jid, {text: "Volviendo al meno principal"});
                mainMenu(sock, userState, text, message, jid);
            }else{
                await sock.sendMessage(jid, {text: "Debes escribir goku para salir. Intentalo de nuevo"});
            }
        }
        
    } catch (error) {
        console.log(error);
    }
}


async function mainMenu(sock, userState, text, message, jid){
    try {
        await sock.sendMessage(jid, {text: `¡Hola ${message.pushName} desde Express! \n 
            1- Obtener Citas \n
            2- Agendar Nueva Cita \n
            3- Reagendar una cita \n
            4- Salir y seguir hablando normal.`});
        userState[jid] = "MAIN_MENU"
    } catch (error) {
        console.log(error);
        
    }

}

async function menu1(sock, userState, text, message, jid){
    try{
        await sock.sendMessage(jid, {text: `¡Hola ${message.pushName} desde Express! Aqui tienes las listas citas por consola \n 
            Escribe OK para chatear normal \n
            Tambien puedes escribir Atras para volver`});
            getScheduledEvents();
        userState[jid] = "MENU_1"
    }catch(error){
        console.log(error);
    }
}

async function menu2(sock, userState, text, message, jid){
    try{
        //${await generateSchedulingLink()} \n
        await sock.sendMessage(jid, {text: `¡Hola ${message.pushName} desde Express! Aqui tienes el link para agendar una cita: \n 
            
            Escribe PETER para chatear normal`});

        generateSchedulingLink();
        userState[jid] = "MENU_2"
    }catch(error){
        console.log(error);
    }
}

async function menu3(sock, userState, text, message, jid){
    try{
        await sock.sendMessage(jid, {text: `¡Hola ${message.pushName} desde Express! Estas en el Menu 3 \n 
            Escribe Goku para chatear normal`});
        userState[jid] = "MENU_3"
    }catch(error){
        console.log(error);
    }
}




module.exports = {menuFlow}