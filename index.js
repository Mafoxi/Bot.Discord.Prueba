// ----------------------------------------------------CONFIG BOT NORMAL------------------------------------------------------
const Discord = require("discord.js");
const {Client, GatewayIntentBits, Partials, Collection, Events, AuditLogEvent, EmbedBuilder } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const{User, Message, GuildMember, ThreadMember} = Partials;
const client = new Client({
  intents: 3276799, 
  partials: [User, Message, GuildMember, ThreadMember],
});

const{ loadEvents } = require('./Handlers/eventHandler');

client.config = require("./config.json")
client.events = new Collection();
client.commands = new Collection();
client.prefixs = new Collection();

loadEvents(client);

client.login(client.config.token);

// -------------------------------------------SISTEMA DE LOGS------------------------------------------------------------

client.on(Events.ChannelCreate, async (channel) => {
  channel.guild
    .fetchAuditLogs({
      type: AuditLogEvent.ChannelCreate,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = `Texto`;
      if (type == 2) type = `Voz`;
      if (type == 13) type = `Stage`;
      if (type == 15) type = `Foro`;
      if (type == 5) type = `Announcememnt`;
      if (type == 4) type = `Categoria`;

      const channelID = `1113318135680995338`;
      const Channel = await channel.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setTitle(`Canal Creado`)
        .addFields({ name: `Nombre del canal`, value: `${name} (<#${id}>)` })
        .addFields({ name: `Tipo de canal`, value: `${type}` })
        .addFields({ name: `ID del canal`, value: `${id}` })
        .addFields({ name: `Creado por`, value: `${executor.tag}` })
        .setTimestamp();
        

      Channel.send({ embeds: [embed] });
    });
});

client.on(Events.ChannelDelete, async (channel) => {
  channel.guild
    .fetchAuditLogs({
      type: AuditLogEvent.ChannelDelete,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = `Texto`;
      if (type == 2) type = `Voz`;
      if (type == 13) type = `Stage`;
      if (type == 15) type = `Foro`;
      if (type == 5) type = `Announcememnt`;
      if (type == 4) type = `Categoria`;

      const channelID = `1113318135680995338`;
      const Channel = await channel.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setTitle(`Canal Eliminado`)
        .addFields({ name: `Nombre del canal`, value: `${name}` })
        .addFields({ name: `Tipo de canal`, value: `${type}` })
        .addFields({ name: `ID del canal`, value: `${id}` })
        .addFields({ name: `Eliminado por`, value: `${executor.tag}` })
        .setTimestamp();

      Channel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildBanAdd, async (member) => {
  member.guild
    .fetchAuditLogs({
      type: AuditLogEvent.GuildBanAdd,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const name = member.user.username;
      const id = member.user.id;

      const channelID = `1113318135680995338`;
      const Channel = await member.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setTitle(`Usuario baneado`)
        .addFields({ name: `Nombre del usuario`, value: `${name}` })
        .addFields({ name: `ID del usuario`, value: `${id}` })
        .addFields({ name: `Baneado por`, value: `${executor.tag}` })
        .setTimestamp();

      Channel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildBanRemove, async (member) => {
  member.guild
    .fetchAuditLogs({
      type: AuditLogEvent.GuildBanRemove,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const name = member.user.username;
      const id = member.user.id;

      const channelID = `1113318135680995338`;
      const Channel = await member.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setTitle(`Usuario Desbaneado`)
        .addFields({ name: `Nombre del usuario`, value: `${name}` })
        .addFields({ name: `ID del usuario`, value: `${id}` })
        .addFields({ name: `Desbaneado por`, value: `${executor.tag}` })
        .setTimestamp();

      Channel.send({ embeds: [embed] });
    });
});

client.on(Events.MessageDelete, async (message) => {
  message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
    })
    .then(async (audit) => {
      const autor = message.author;

      const msg = message.content;

      if (!msg) return;

      const channelID = `1113318135680995338`;
      const Channel = await message.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setTitle(`Mensaje eliminado`)
        .addFields({ name: `Contenido del mensaje`, value: `${msg}` })
        .addFields({ name: `Canal del mensaje`, value: `${message.channel}` })
        .addFields({ name: `Autor del mensaje`, value: `${autor}` })
        .setTimestamp();

      Channel.send({ embeds: [embed] });
    });
});

client.on(Events.MessageUpdate, async (message, newMessage) => {
  message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageUpdate,
    })
    .then(async (audit) => {
      const autor = message.author;

      const msg = message.content;

      if (!msg) return;

      const channelID = `1113318135680995338`;
      const Channel = await message.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setTitle(`Mensaje editado`)
        .addFields({ name: `Mensaje inicial`, value: `${msg}` })
        .addFields({ name: `Mensaje editado`, value: `${newMessage}` })
        .addFields({ name: `Autor del mensaje`, value: `${autor}` })
        .setTimestamp();

      Channel.send({ embeds: [embed] });
    });
});

//---------------------------------BILLETERA----------------------------------

const fs = require("fs");
const path = require("path");

async function saveUser(userID, commandName, timeEnd) {
    const data = fs.readFileSync(path.resolve(__dirname, "activeTimeouts.json"));
    let activeTimeouts = JSON.parse(data);
    if (!activeTimeouts[commandName]) activeTimeouts[commandName] = {};
    activeTimeouts[commandName][userID] = { userID, timeEnd };

    fs.writeFileSync(path.resolve(__dirname, "activeTimeouts.json"), JSON.stringify(activeTimeouts, null, 3));
}

async function checkForUser(userID, commandName) {
    const data = fs.readFileSync(path.resolve(__dirname, "activeTimeouts.json"));
    let activeTimeouts = JSON.parse(data);

    if (!activeTimeouts[commandName]) return null;
    if (!activeTimeouts[commandName][userID]) return null;

    let userData = activeTimeouts[commandName][userID];
    let now = Date.now();

    if (now > new Date(userData.timeEnd)) {
        delete activeTimeouts[commandName][userID];
        fs.writeFileSync(path.resolve(__dirname, "activeTimeouts.json"), JSON.stringify(activeTimeouts, null, 3));
        return null;
    }

    userData.timeEnd = new Date(userData.timeEnd);
    userData.msLeft = Math.abs(now - userData.timeEnd.getTime());
    return userData;
}

async function removeUserCommandCooldown(userID, commandName) {
    const data = fs.readFileSync(path.resolve(__dirname,'activeTimeouts.json'));
    let activeTimeouts = JSON.parse(data);

    if(!activeTimeouts[commandName]) return false;
    if(!activeTimeouts[commandName][userID]) return false;

    delete activeTimeouts[commandName][userID];

    fs.writeFileSync(path.resolve(__dirname,'activeTimeouts.json'), JSON.stringify(activeTimeouts, null, 3));

    return true;
}

class CommandCooldown {
    constructor(commandName, timeout) {
        this.commandName = commandName;
        this.timeout = timeout;
        const data = fs.readFileSync(path.resolve(__dirname, "activeTimeouts.json"));
        const activeTimeouts = JSON.parse(data);
        this.activeTimeouts = activeTimeouts;
        if (!activeTimeouts[commandName]) activeTimeouts[commandName] = {};
        for (let v of Object.values(activeTimeouts[commandName])) {
            checkForUser(v.userID, this.commandName);
        }
    }

    async addUser(userID) {
        let endDate = Date.now();
        endDate += this.timeout;
        let timeEnd = new Date(endDate);

        await saveUser(userID, this.commandName, timeEnd);
    }

    async getUser(userID) {
        return checkForUser(userID, this.commandName);
    }

    async removeUser(userID) {
        return removeUserCommandCooldown(userID, this.commandName);
    }
}

function msToTime(duration, includeZeros) {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    if (includeZeros) {
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
    }

    return { hours, minutes, seconds };
}

module.exports = {
    CommandCooldown,
    msToMinutes: (ms, includeZeros = true) => {
        ms = Number(ms);
        const { hours, minutes, seconds } = msToTime(ms, includeZeros);

        return { hours, minutes, seconds };
    },
};