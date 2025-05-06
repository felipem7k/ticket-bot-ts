import { StringSelectMenuInteraction } from "discord.js";

export default interface TicketSetupOptionInterface {
    handle: (interaction: StringSelectMenuInteraction) => Promise<void>;
}