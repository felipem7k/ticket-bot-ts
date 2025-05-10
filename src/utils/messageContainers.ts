import { MessageComponentInteraction, MessageFlags } from "discord.js";
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

    const textParams = [
        title,
        description
    ];

    if (thumbnail) {
        customContainer.addThumbnail(
            thumbnail.url,
            textParams
        )
    } else {
        customContainer.addText(textParams);
    }

    if (params.useSeparator) {
        customContainer.addSeparator();
    }

    customContainer.addStringSelectMenu(
        "open-new-ticket",
        params.selectMenuDescription ?? "➡️ Clique aqui para selecionar o assunto do ticket",
        params.stringSelectMenuOptions
    );


    return customContainer.container;
}

export async function replyWithError(
    interaction: MessageComponentInteraction, 
    text: string
): Promise<void> {
    await interaction.reply({
        flags: [
            MessageFlags.Ephemeral
        ],
        content: text
    });
}