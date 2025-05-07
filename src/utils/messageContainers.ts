import { ActionRowBuilder, Attachment, ButtonBuilder, ButtonStyle, ContainerBuilder, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { SimpleMessageParams } from "../types/ticketSetup/SimpleMessageParams.ts";

export const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"]

async function attachToContainer(container: ContainerBuilder, description: string, title?: string, thumbnail?: Attachment) {
    if (!thumbnail) {
        if (title) {
            container.addTextDisplayComponents(new TextDisplayBuilder({
                content: title
            }));
        }
    container.addTextDisplayComponents(new TextDisplayBuilder({
        content: description
    }));
    } else {
        const sectionComponent = new SectionBuilder();
        if (title) {
            sectionComponent.addTextDisplayComponents(new TextDisplayBuilder({
                content: title
            }));
        }
        sectionComponent.addTextDisplayComponents(new TextDisplayBuilder({
            content: description
        }));
        sectionComponent.setThumbnailAccessory(new ThumbnailBuilder({
            media: {
                url: thumbnail.url
            }
        }));
        container.addSectionComponents(sectionComponent);
    }
}

export function createSimpleMessage(
    params: SimpleMessageParams
) {
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

    // const thumbnailComponent = new ThumbnailBuilder({
    //     media: {
    //         url: "https://preview.redd.it/aig27h1meoq11.jpg?auto=webp&s=e794d3fc545f8c069f599c50a083a20d7322a742"
    //     }
    // });


    // const sectionComponent = new SectionBuilder()
    // .addTextDisplayComponents(new TextDisplayBuilder({
    //     content: params.title ? `# ${params.title}` : ""
    // }), new TextDisplayBuilder({
    //     content: params.description
    // }));

    const container = new ContainerBuilder()

    // if (params.title) {
    //     container.addTextDisplayComponents(new TextDisplayBuilder({
    //         content: `# ${params.title}`
    //     }));
    // }
    // container.addTextDisplayComponents(new TextDisplayBuilder({
    //     content: params.description
    // }));
    attachToContainer(container, params.description, params.title, params.thumbnail);

    // container.addSectionComponents(sectionComponent);
    container.addSeparatorComponents(separatorComponent);
    container.addActionRowComponents(buttonRow);

    return container;
}