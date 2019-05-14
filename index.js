const PREFIX = "!";
const CODE = "```\n";
const CODEJSON = "```JSON\n";
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
				case new RegExp("d", "i").test(trigger):
					let dices = command;
					dices.shift();
					ret += cmdDice(dices);
					break;
				case new RegExp("new", "i").test(trigger):
					let character = command[1];
					ret += cmdNew(msg.member.id, character);
					break;
				default:
				case command[0].match(new RegExp("help", "i")):
					ret += cmdHelp();
					break;
			};
			msg.reply(ret);
		} else {
			msg.reply(ret + "I can't speak in a channel that does not include **bot**.\n");
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
	//New
	ret += helpNew();
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
		for (let i = 0; i < dices.length; ++i) {
			if (!(/^\d+$/.test(dices[i]))) {
				return "\n" + dices[i] + errNan() + "\n" + helpDice();
			} else {
				let max = parseInt(dices[i], 10);
				let res = randomInt(1, max);
				sum += res;
				ret += "1d" + dices[i] + "(" + res + ")";
				ret += (i == dices.length - 1 ? " = " + sum + "\n" : " + ");
			};
		};
	} else {
		let res = randomInt(1, 100);
		ret += "1d100(" + res + ") = " + res + "\n";
	};
	return ret + CODE;
};
/**
 * Create a new character
 * @param {String} userID 
 * @param {Json} character 
 */
function cmdNew(userID, character) {
	console.log(character);
	let ret = "";
	let file = new charFile(userID, ".JSON");
	if (file.exist("./characters/")) {
		return errAlreadyExist();
	} else {
		try {
			let content = charCreate(character);
			file.setContent(content);
			file.save("./characters/");
			ret += "Character successfully created";
		} catch (error) {
			console.log(error);
			return errWrongJSONFormat();
		};
	};
	return ret;
};
/**
 * Retourne le JSON si le character est correct
 * @param {Json} character 
 */
function charCreate(character) {
	let ret = JSON.parse(character);
	let def = new charFile("default", ".JSON");
	def.openJSon("./characters/");
	let content = def.content;
	let check = ret.length != content.lenght;
	Object.keys(content).forEach(function (key) {
		if (!ret.hasOwnProperty(key)) {
			check = true;
		};
	});
	console.log(ret["stats"].sum());
	if (check || ret["stats"].sum() != 200) {
		throw "Wrong object format.";
	} else {
		return JSON.stringify(ret);
	};
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
	ret += "To throw the dices :\n";
	ret += CODE;
	ret += command;
	ret += "Throw respectively a X,Y and Z dice and sum the result.\n";
	ret += "If no dice is specified, throw a d100.\n";
	ret += CODE;
	return ret;
};
/**
 * Display the Help's features help
 */
function helpHelp() {
	let ret = "";
	let command = "!help\n";
	ret += "To get help :\n";
	ret += CODE;
	ret += command;
	ret += "Display the help for the desired features.\n"
	ret += CODE;
	return ret;
};

function helpNew() {
	let ret = "";
	let command = "!new {...}\n";
	ret += "To create a character :\n";
	ret += CODE;
	ret += command;
	ret += CODE;
	ret += "And then replace {...} by something like :\n";
	ret += CODEJSON;
	let def = new charFile("default", ".JSON");
	def.openJSon("./characters/");
	let content = JSON.stringify(def.content);
	ret += content;
	ret += CODE;
	ret += "The sum of all stats must be equal to 200. The order of the differents property is not important.\n";
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
 * Error : is not a number
 */
function errNan() {
	return " is not a number.";
};
/**
 * Error : This file already exists
 */
function errAlreadyExist() {
	return "This player already has a characte on this Server.";
};
/**
 * Error : This character is not valid
 */
function errWrongJSONFormat() {
	return "This character is not valid.\n" + helpNew();
};

/*
 
   ______               _   _                                             _   __                      _        _               
  |  ____|             | | (_)                                           | | /_/                     | |      (_)              
  | |__ ___  _ __   ___| |_ _  ___  _ __  ___    ___ ___  _ __ ___  _ __ | | ___ _ __ ___   ___ _ __ | |_ __ _ _ _ __ ___  ___ 
  |  __/ _ \| '_ \ / __| __| |/ _ \| '_ \/ __|  / __/ _ \| '_ ` _ \| '_ \| |/ _ \ '_ ` _ \ / _ \ '_ \| __/ _` | | '__/ _ \/ __|
  | | | (_) | | | | (__| |_| | (_) | | | \__ \ | (_| (_) | | | | | | |_) | |  __/ | | | | |  __/ | | | || (_| | | | |  __/\__ \
  |_|  \___/|_| |_|\___|\__|_|\___/|_| |_|___/  \___\___/|_| |_| |_| .__/|_|\___|_| |_| |_|\___|_| |_|\__\__,_|_|_|  \___||___/
                                                                   | |                                                         
                                                                   |_|                                                         
 
*/
/**
 * Return a random number between min and max
 * @param {Number} min Included
 * @param {Number} max Included
 */
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
/**
 * Sum all the value from an object
 */
Object.prototype.sum = function () {
	let sum = 0;
	Object.keys(this).forEach(function (key) {
		sum += (this[key] > 0 ? this[key] : -this[key]);
	}, this)
	return sum;
};
/*
 
   ______ _ _       _____           _                 
  |  ____(_) |     / ____|         | |                
  | |__   _| | ___| (___  _   _ ___| |_ ___ _ __ ___  
  |  __| | | |/ _ \\___ \| | | / __| __/ _ \ '_ ` _ \ 
  | |    | | |  __/____) | |_| \__ \ ||  __/ | | | | |
  |_|    |_|_|\___|_____/ \__, |___/\__\___|_| |_| |_|
                           __/ |                      
                          |___/                       
 
*/
const charFile = require("./Scripts/filesystem.js").charFile;