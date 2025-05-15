import { ApplicationCommandOptionType, CategoryChannel, ChannelType, CommandInteraction, Guild, MessageFlags } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import GuildRepository from "../../repositories/GuildRepository.ts";
import { replyWithError } from "../../utils/messageContainers.ts";

const guildRepository: GuildRepository = new GuildRepository();

@Discord()
@SlashGroup({
    description: "Configurar mensagem de criação de tickets",
    name: "ticket",
    root: "setup",
})
@SlashGroup("ticket", "setup")
export default class SetupTicketsController {
    @Slash({
        description: "Definir categoria para a criação de tickets",
        name: "set-category",
    })
    async setCategory(
        @SlashOption({
            description: "Selecione uma categoria",
            name: "category-id",
            required: true,
            type: ApplicationCommandOptionType.Channel
        })
        categoryChannel: CategoryChannel,
        interaction: CommandInteraction
    ) {
        const guild = interaction.guild as Guild;
        if (!guild) {
            await replyWithError(interaction, "Erro, guild não encontrada.");
            return;
        }
        if (!categoryChannel) {
            await replyWithError(interaction, "Erro, canal não encontrado.");
            return;
        }

        if (!categoryChannel || categoryChannel.type !== ChannelType.GuildCategory) {
            await replyWithError(interaction, "Erro, você selecionou um **canal**. Por favor, selecione uma **categoria**.");
            return;
        }

        await guildRepository.setTicketCategory(guild.id, categoryChannel.id);
        await interaction.reply({
            flags: [
                MessageFlags.Ephemeral
            ],
            content: `Categoria \`\`${categoryChannel.name}\`\` definida com sucesso! ID: \`\`${categoryChannel.id}\`\``
        });
    }
}