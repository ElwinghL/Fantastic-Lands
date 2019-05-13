const PREFIX = "!";
const CODE = "```\n";
let lang = "fr";
/*
 
   ______            _                                                 _   
  |  ____|          (_)                                               | |  
  | |__   _ ____   ___ _ __ ___  _ __  _ __   ___ _ __ ___   ___ _ __ | |_ 
  |  __| | '_ \ \ / / | '__/ _ \| '_ \| '_ \ / _ \ '_ ` _ \ / _ \ '_ \| __|
  | |____| | | \ V /| | | | (_) | | | | | | |  __/ | | | | |  __/ | | | |_ 
  |______|_| |_|\_/ |_|_|  \___/|_| |_|_| |_|\___|_| |_| |_|\___|_| |_|\__|
                                                                           
                                                                           
 
*/
const dotenv = require('dotenv');
dotenv.config();
/*
 
    _____                                
   / ____|                               
  | (___   ___ _ ____   _____ _   _ _ __ 
   \___ \ / _ \ '__\ \ / / _ \ | | | '__|
   ____) |  __/ |   \ V /  __/ |_| | |   
  |_____/ \___|_|    \_/ \___|\__,_|_|   
                                         
                                         
 
*/
const http = require('http');

http.createServer((req, res) => {
res.writeHead(200, {
    'Content-type': 'text/plain'
});
    res.write('Hey');
    res.end();
}).listen(4000);
/*
 
   _____  _                       _ 
  |  __ \(_)                     | |
  | |  | |_ ___  ___ ___  _ __ __| |
  | |  | | / __|/ __/ _ \| '__/ _` |
  | |__| | \__ \ (_| (_) | | | (_| |
  |_____/|_|___/\___\___/|_|  \__,_|
                                    
                                    
 
*/
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
	console.log('The bot is ready');
});
/**
 * Handle the messages reception and the prefix recognition
 */
client.on('message', (msg) => {
	let prefix = msg.content[0];
	let command = msg.content.slice(1).split(" ");
	let ret = "\n";
	if (prefix == PREFIX && !(msg.author.bot)) {
		if (msg.channel.name.includes("bot")) {
			let trigger = command[0];
			switch (true) {
				case new RegExp("d","i").test(trigger):
					let dices = command;
					dices.shift();
					ret = cmdDice(dices);
					break;
				default:
				case command[0].match(new RegExp("help","i")):
					ret = cmdHelp();
					break;
			};
			msg.reply(ret);
		} else {
			msg.reply(ret + "Je ne peux pas parler dans ce channel. Celui ci doit inclure la mention **bot**.\n");
		}
	};
});
/*
 
    _____                                          _     
   / ____|                                        | |    
  | |     ___  _ __ ___  _ __ ___   __ _ _ __   __| |___ 
  | |    / _ \| '_ ` _ \| '_ ` _ \ / _` | '_ \ / _` / __|
  | |___| (_) | | | | | | | | | | | (_| | | | | (_| \__ \
   \_____\___/|_| |_| |_|_| |_| |_|\__,_|_| |_|\__,_|___/
                                                         
                                                         
 
*/
/**
 * Display the help for desired features
 */
function cmdHelp() {
	let ret = "";
	//Dices
	ret += helpDice();
	//Help
	ret += helpHelp();
	return ret;
};
/**
 * Throw all the dices that are given and sum them up
 * If there is no paramaters, throw a d100
 * @param {String[]} dices 
 */
function cmdDice(dices = []) {
	let sum = 0;
	let ret = CODE;
	if (dices.lenght != 0) {
		for (let i =0; i<dices.length;++i) {
			if (!(/^\d+$/.test(dices[i]))) {
				return "\n" + dices[i] + errNan() + "\n" + helpDice();
			} else {
				let max = parseInt(dices[i],10);
				let res = randomInt(1,max);
				sum += res;
				ret += "1d"+dices[i]+"("+res+")";
				ret += (i == dices.length - 1 ? " = " + sum + "\n":" + ");
			};
		};
	} else {
		let res = randomInt(1,100);
		ret += "1d100("+res+") = "+res+"\n";
	};
	return ret + CODE;
};
/*
 
   _    _      _       
  | |  | |    | |      
  | |__| | ___| |_ __  
  |  __  |/ _ \ | '_ \ 
  | |  | |  __/ | |_) |
  |_|  |_|\___|_| .__/ 
                | |    
                |_|    
 
*/
/**
 * Display the Dices' features help.
 */
function helpDice() {
	let ret = "";
	let command = "!d X Y Z...\n";
	switch (lang) {
		case "fr":
			ret += "Pour lancer les dés :\n";
			ret += CODE;
			ret += command;
			ret += "Lance un dé X, un dé Y et un dé Z et retourne la somme.\n";
			ret += "Si aucun dé n'est spécifié, lance un dé 100.\n\n";
			ret += CODE;
			break;
		default: 
			ret += "To throw the dices :\n";
			ret += CODE;
			ret += command;
			ret += "Throw respectively a X,Y and Z dice and sum the result.\n";
			ret += "If no dice is specified, throw a d100.\n";
			ret += CODE;
			break;
	};
	return ret;
};
/**
 * Display the Help's features help
 */
function helpHelp() {
	let ret = "";
	let command = "!help\n";
	switch (lang) {
		case "fr":
			ret += "Pour obtenir de l'aide sur l'utilisation de ce bot :\n";
			ret += CODE;
			ret += command;
			ret += "Affiche l'aide des fonctions voulues.\n"
			ret += CODE;
			break;
		default: 
			ret += "To get help :\n";
			ret += CODE;
			ret += command;
			ret += "Display the help for the desired features.\n"
			ret += CODE;
			break;
	};
	return ret;
};
/*
 
   ______                         
  |  ____|                        
  | |__   _ __ _ __ ___  _ __ ___ 
  |  __| | '__| '__/ _ \| '__/ __|
  | |____| |  | | | (_) | |  \__ \
  |______|_|  |_|  \___/|_|  |___/
                                  
                                  
 
*/
/**
 * Erreur : is not a number
 */
function errNan() {
	switch (lang) {
		case "fr":
			return " n'est pas un nombre.";
		default:
			return " is not a number.";
	};
};
/**
 * Return a random number between min and max
 * @param {Number} min Included
 * @param {Number} max Included
 */
function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};
/**
 * Return the last array element
 */
Array.prototype.last = function() {
	return this[this.length - 1];
};

