const { Message } = require("discord.js")

module.exports = {
  name: "coinflip",
  /**
   * 
   * @param {Message} message 
   */
  async execute(message, args) {
    message.channel.send({content: `Hola bebé`})
  }
}