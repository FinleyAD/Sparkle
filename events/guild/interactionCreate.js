const config = require('../../botconfig/config.json');
const ee = require('../../botconfig/embed.json');
const settings = require('../../botconfig/settings.json');
const { onCoolDown, replacemsg } = require('../../handlers/functions');
const Discord = require('discord.js');

module.exports = (client, interaction) => {
  const CategoryName = interaction.commandName;

  let command = false;
  try {
    if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
      command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand());
    }
  } catch {
    if (client.slashCommands.has('normal' + CategoryName)) {
      command = client.slashCommands.get('normal' + CategoryName);
    }
  }
  if (command) {
    if (onCoolDown(interaction, command)) {
      return interaction.reply({
        ephmeral: true,
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(replacemsg(settings.messages.cooldown, {
            prefix: prefix,
            command: command,
            timeLeft: onCoolDown(interaction, command)
          }))]
      });
    }

    if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction.member.permissions.has(command.memberpermissions)) {
      return interaction.reply({
        ephemeral: true,
        embeds: [new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(replacemsh(settings.messages.notallowed_to_exec_cmd.title))
        .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions, {
          command: command,
          prefix: prefix
        }))]
      });
    }

    if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
      return interaction.reply({
        ephemeral: true,
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
          .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.requiredroles, {
            command: command,
            prefix: prefix
          }))]
      });
    }
    command.run(client, interaction, interaction.member, interaction.guild)
  }
}