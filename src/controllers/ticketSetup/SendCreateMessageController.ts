import { StringSelectMenuInteraction } from "discord.js";
import TicketSetupOptionInterface from "../../interface/ticketSetup/TicketSetupOptionInterface.ts";

export default class SendCreateMessageController implements TicketSetupOptionInterface {
    public async handle(interaction: StringSelectMenuInteraction): Promise<void> {
        await interaction.reply("Você escolheu enviar uma mensagem de criação de ticket.");
    }
}