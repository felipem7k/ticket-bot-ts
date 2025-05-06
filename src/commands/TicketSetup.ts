import { ActionRowBuilder, CommandInteraction, MessageActionRowComponentBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { Discord, Slash, SelectMenuComponent } from "discordx";
import SendCreateMessageController from "../controllers/ticketSetup/SendCreateMessageController.ts";
import TicketSetupOptionInterface from "../interface/ticketSetup/TicketSetupOptionInterface.ts";
import SetCreateTicketMessageController from "../controllers/ticketSetup/SetCreateTicketMessageController.ts";

function getSetupOption(option: string): TicketSetupOptionInterface {
    const optionsControllers: Record<string, new () => TicketSetupOptionInterface> = {
        "send-create-ticket-message": SendCreateMessageController,
        "set-create-ticket-message": SetCreateTicketMessageController,
    };

    const Controller = optionsControllers[option];
    if (!Controller) {
        throw new Error("Opção de configuração inválida.");
    }
    return new Controller();
}

@Discord()
export class TicketSetup {

    @SelectMenuComponent({ id: "choose-setup-option" })
    async chooseSetupOption(
        interaction: StringSelectMenuInteraction
    ) {
        try {
            const option = getSetupOption(interaction.values[0]);
            option.handle(interaction);
        } catch(err: any) {
            await interaction.update({});
            await interaction.followUp({
                content: err.message
            });
        }
    }

    @Slash({description: "Confirurar o sistema de tickets."})
    async setup(
        interaction: CommandInteraction
    ): Promise<void> {
        const setupOptions = [
            {
                label: "Enviar mensagem de criação de ticket",
                value: "send-create-ticket-message"
            },
            {
                label: "Definir mensagem de criação de ticket",
                value: "set-create-ticket-message"
            }
        ];
        const menu = new StringSelectMenuBuilder({
            options: setupOptions,
            custom_id: "choose-setup-option",
            placeholder: "Clique aqui para escolher uma opção.",
            maxValues: 1,
        });
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>({
            components: [menu],
        });
        interaction.reply({
            content: "Escolha uma opção de configuração",
            components: [row],
        });
    }
}