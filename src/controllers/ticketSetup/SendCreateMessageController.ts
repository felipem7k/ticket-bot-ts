import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, StringSelectMenuInteraction, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import TicketSetupOptionInterface from "../../interface/ticketSetup/TicketSetupOptionInterface.ts";
import { url } from "inspector";

export default class SendCreateMessageController implements TicketSetupOptionInterface {
    public async handle(interaction: StringSelectMenuInteraction): Promise<void> {
        const titleComponent = new TextDisplayBuilder({
            content: "# Título exemplo"
        });
        const descriptionComponent = new TextDisplayBuilder({
            content: "Descrição exemplo"
        });
        const separatorComponent = new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Small
        });
        const buttonComponent = new ButtonBuilder({
            custom_id: "create-ticket",
            label: "Ticket",
            style: ButtonStyle.Primary,
        });

        const buttonRow = new ActionRowBuilder<ButtonBuilder>()
        buttonRow.addComponents(buttonComponent);

        const thumbnailComponent = new ThumbnailBuilder({
            media: {
                url: "https://preview.redd.it/aig27h1meoq11.jpg?auto=webp&s=e794d3fc545f8c069f599c50a083a20d7322a742"
            }
        });

        // const buttonSectionComponent = new SectionBuilder()
        // .addTextDisplayComponents(titleComponent, descriptionComponent)
        // .setButtonAccessory(buttonComponent);

        const sectionComponent = new SectionBuilder()
        .addTextDisplayComponents(titleComponent, descriptionComponent)
        .setThumbnailAccessory(thumbnailComponent);

        const container = new ContainerBuilder()
        .addSectionComponents(sectionComponent)
        .addSeparatorComponents(separatorComponent)
        .addActionRowComponents(buttonRow);

        await interaction.reply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                container
            ],
            
        });
    }
}