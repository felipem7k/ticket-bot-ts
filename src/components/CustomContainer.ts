import { ActionRowBuilder, ContainerBuilder, MediaGalleryBuilder, RestOrArray, SectionBuilder, SelectMenuComponentOptionData, SeparatorBuilder, SeparatorSpacingSize, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";

export default class CustomContainer {
    private _container = new ContainerBuilder();

    public addText(
        textList: string[]
    ) {
        textList.forEach((text: string) => {
            if (text !== "") {
                this._container.addTextDisplayComponents(new TextDisplayBuilder({
                    content: text
                }));
            };
        });
    }

    public addThumbnail(
        thumbnail: string,
        textList?: string[]
    ) {
        if (textList && textList.length > 0) {
            const section = new SectionBuilder();
            textList.forEach((text: string) => {
                if (text !== "") {
                    section.addTextDisplayComponents(new TextDisplayBuilder({
                        content: text
                    }));
                };
            });
            section.setThumbnailAccessory(new ThumbnailBuilder({
                media: {
                    url: thumbnail
                }
            }));
            this._container.addSectionComponents(section);
        } else {
            const mediaGallery = new MediaGalleryBuilder({
                items: [
                    {
                        media: {
                            url: thumbnail
                        }
                    }
                ]
            });
            this._container.addMediaGalleryComponents(mediaGallery);
        }
    }

    public addSeparator() {
        this._container.addSeparatorComponents(new SeparatorBuilder({
            spacing: SeparatorSpacingSize.Small
        }));
    }

    public addStringSelectMenu(
        customId: string,
        placeholder: string,
        options: SelectMenuComponentOptionData[],
        maxValues: number = 1,
        minValues: number = 1
    ) {
        const row = new ActionRowBuilder<StringSelectMenuBuilder>();
        const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder(placeholder)
        .addOptions(options)
        .setMaxValues(maxValues)
        .setMinValues(minValues);
        row.addComponents(selectMenu);

        this._container.addActionRowComponents(row);
    }
    
    public get container() : ContainerBuilder {
        return this._container;
    }
    
}