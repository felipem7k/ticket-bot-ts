import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

@Discord()
@SlashGroup({description: "Configurações de tickets", name: "setup"})
@SlashGroup("setup")
export class TicketSetup {
    @Slash({description: "Listar possíveis subcomandos"})
    async list(interaction: CommandInteraction) {
        interaction.reply("Subcomandos disponíveis: `setup`, `list`");
    }
}
