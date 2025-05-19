import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Channel, MessageFlags, SelectMenuInteraction, StringSelectMenuInteraction } from "discord.js";
import { ButtonComponent, Discord, SelectMenuComponent } from "discordx";
import GuildRepository from "../repositories/GuildRepository.ts";
import { replyWithError } from "../utils/messageContainers.ts";
import TicketCreationController from "../controllers/ticketCreation/TicketCreationController.ts";

@Discord()
export default class TicketCreator {
    @SelectMenuComponent({
        id: "open-new-ticket",
    })
    async createNewTicket(
        interaction: StringSelectMenuInteraction
    ): Promise<void> {
        const guildRepository = new GuildRepository();
        const guild = await guildRepository.find(interaction.guildId!);
        if (!guild || !guild.ticketCategoryId) {
            await replyWithError(
                interaction,
                "O sistema de tickets não está configurado neste servidor. Por favor, entre em contato com um administrador para obter assistência."
            );
            return;
        }
        const creationController = new TicketCreationController(
            guild.ticketCategoryId
        );
        creationController.create(
            interaction
        ).then(async (channel: Channel) => {
            console.log("Novo ticket criado:", interaction.values[0], interaction.user.id);
            await creationController.sendTicketLink(
                channel,
                interaction
            );
        }).catch(async (error) => {
            console.error("Error creating ticket:", error);
            await interaction.update({});
            await interaction.followUp({
                flags: [
                    MessageFlags.Ephemeral,
                ],
                content: error.message || "Erro ao criar o ticket. Tente novamente mais tarde.",
            });
        });
    }
}