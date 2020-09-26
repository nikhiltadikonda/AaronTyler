// Aaron Tyler => A Telegram - Discord Bot
/*
~
Created by Nikhil Tadikonda - September 26,2020
~
*/

// To remove Dependency Errors in Telegram API
process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const info = require("./help_info.json");

//JSON and jQuery
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

//Telegram API
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});
bot.on("polling_error", (err) => console.log(err));

//Discord API
const Discord = require('discord.js');
const client = new Discord.Client();

// Ping-Pong Discord Command
client.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(info.DISCORD_PREFIX)) return;

  const commandBody = message.content.slice(info.DISCORD_PREFIX.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  
  if (command === "ping") {
    message.reply("Pong!");
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID,"Discord Ping - Pong Success!");
  }
});

client.on("message",message => {
  if (message.author.bot) return;

  if(message.content.toLowerCase() === "who are you?"){
    message.reply("I'm Aaron Tyler, your personalised Discord Bot.");
  }
});

console.log("Bot is Active");

// start
bot.onText(/\/start/,msg => {
  total_message=info.HELP_INFO.TITLE+"\n\n"+info.HELP_INFO.DESCRIPTION+"\n\n"+info.HELP_INFO.COMMANDS;
  bot.sendMessage(msg.chat.id,total_message);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;  
  var fName = msg.chat.first_name;   
  if(msg.text.toLowerCase() === "who are you?" || msg.text.toLowerCase() === "hi" ){
    const message= "I'm Aaron Tyler, your personalised Telegram Bot.";
    bot.sendMessage(chatId, '<b>'+message+'</b>', {parse_mode: "HTML"});
  }
});

bot.onText(/\/picture/, (msg) => {
  bot.sendPhoto(msg.chat.id,"https://picsum.photos/200/300/?blur", {caption : "Image"});
});

bot.onText(/\/location/, (msg) => {
  bot.sendLocation(msg.chat.id,40.689266, -74.044593);
  bot.sendMessage(msg.chat.id, "Statue of Liberty");
});

bot.onText(/\/keyboard/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome", {
  "reply_markup": {
      "keyboard": [["One"], ["Two"], ["Three"]]
      }
  });
});

bot.on('message', (msg) => {
  var searchURL="https://www.youtube.com/results?search_query=";
  var text="Here are your Search Results:\n\n";
  if(msg.text.substring(0,9)==='/youtube '){
    searchURL+=msg.text.substring(9).replace(/\s/,'+');
    bot.sendMessage(msg.chat.id,text+searchURL);
  }
  else if(msg.text.substring(0,9)==='/youtube'){
    text="<b>Youtube Search Command:\n\n This Command can be used to generate a search query for you, \n"
    bot.sendMessage(msg.chat.id,text+"Enter a Proper Search Query for getting a better query.</b>", {parse_mode:"HTML"})
  }
});


bot.on('message', (msg) => {
  var x = msg.text.split(' ');
  var repo_url = "https://api.github.com/users/"+x[1]+"/repos";
  var commits_url = "https://api.github.com/repos/"+x[1]+"/"+x[2]+"/commits"
  if(msg.text.substring(0,8)==='/github '){
    if(x[2] === 'repos'||'repositories')
    {
      $.get(repo_url,(repos,status) => {

        var text = "Hello, "+msg.from.first_name+", here's the repo list:\n\n";
        
        for(i = 0; i < repos.length; i++){
          text += "Repository: " + repos[i].name + "\n";
          
          if(repos[i].description != null){
            text += "\nDescription:\n" + repos[i].description + "\n\n";
          }
          else{
            text += "No Description Available\n\n";
          }
        }
        bot.sendMessage(msg.chat.id,text,{parse_mode:"HTML"});
        client.channels.cache.get(process.env.DISCORD_CHANNEL_ID).send(text);
      });
    }
    else if(x.length > 3 && x[3].toLowerCase() ==='commits')
    {
      $.get(commits_url,(commits,status) => {
        var text = "Hello, \nThese are the Last "+commits.length+" commits of your repository: "+x[2]+"\n\n";
        
        for(i = 0; i < commits.length; i++){
          var t = commits[i].commit
          text += "Contributed User:"+t.author.name+"\n\nCommit Message: \n"+t.message+"\n\n";
        }

        text += "\n"
        bot.sendMessage(msg.chat.id,text);
        client.channels.cache.get(process.env.DISCORD_CHANNEL_ID).send(text);
      });
    }
  }
  else if(msg.text.substring(0,8)==='/github'){
    var text="<b>Github Command: \n\n This Command returns info and commits from a public repository.\n\n Enter the github query properly</b>"
    bot.sendMessage(msg.chat.id,text,{parse_mode:"HTML"});
  }
});

// Login for Discord Bot
client.login(process.env.DISCORD_BOT_TOKEN);