import { ActionRowBuilder, ModalBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import TicketSetupOptionInterface from "../../interface/ticketSetup/TicketSetupOptionInterface";
import { Discord } from "discordx";

@Discord()
export default class SetCreateTicketMessageController implements TicketSetupOptionInterface {
    public async handle(interaction: StringSelectMenuInteraction): Promise<void> {
        const titleOption = new ActionRowBuilder<TextInputBuilder>({
            components: [
                new TextInputBuilder({
                    custom_id: "set-create-ticket_title",
                    placeholder: "Digite o título da mensagem de criação de ticket",
                    label: "Título",
                    style: TextInputStyle.Short,
                    min_length: 1,
                    max_length: 100,
                    required: false,
                }),
            ]
        });
        const descriptionOption = new ActionRowBuilder<TextInputBuilder>({
            components: [
                new TextInputBuilder({
                    custom_id: "set-create-ticket_description",
                    placeholder: "Digite a descrição da mensagem de criação de ticket",
                    label: "Descrição",
                    style: TextInputStyle.Paragraph,
                    min_length: 1,
                    max_length: 4000,
                    required: false,
                }),
            ]
        });
        const modal = new ModalBuilder({
            custom_id: "set-create-ticket_params",
            title: "Mensagem de criação de ticket",
            components: [
                titleOption,
                descriptionOption
            ],
        });
        await interaction.showModal(modal);
    }
}