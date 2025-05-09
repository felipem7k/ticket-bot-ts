import { ActionRowBuilder, Attachment, ButtonBuilder, ButtonStyle, ContainerBuilder, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, StringSelectMenuOptionBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { SimpleMessageParams } from "../types/ticketSetup/SimpleMessageParams.ts";
import CustomContainer from "../components/CustomContainer.ts";

export const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"]

export function renderTicketCreationMessage(
    params: SimpleMessageParams
) {
    const customContainer = new CustomContainer();

    const title = params.title ?? "";
    const description = params.description;
    const thumbnail = params.thumbnail;

    if (thumbnail) {
        customContainer.addThumbnail(
            thumbnail.url,
            [
                title,
                description
            ]
        )
    } else {
        customContainer.addText([
            title,
            description
        ]);
    }

    if (params.useSeparator) {
        customContainer.addSeparator();
    }

    customContainer.addStringSelectMenu(
        "open-new-ticket",
        params.selectMenuDescription ?? "➡️ Clique aqui para selecionar o assunto do ticket",
        params.stringSelectMenuOptions
    );

    // const buttonSection = new SectionBuilder()
    // .addTextDisplayComponents(new TextDisplayBuilder({
    //     content: "``Utilize o botão ao lado para abrir um novo ticket ➡️``"
    // }))
    // .setButtonAccessory(new ButtonBuilder({
    //     custom_id: "create-ticket",
    //     label: "📩",
    //     style: ButtonStyle.Primary,
    // }));


    // attachToContainer(container, params.description, params.useSeparator, params.title, params.thumbnail);

    // container.addSectionComponents(buttonSection);

    return customContainer.container;
}