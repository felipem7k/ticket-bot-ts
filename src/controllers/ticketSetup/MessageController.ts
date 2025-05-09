import { ActionRowBuilder, ApplicationCommandOptionType, Attachment, AutocompleteInteraction, CommandInteraction, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, StringSelectMenuBuilder, StringSelectMenuComponent, StringSelectMenuInteraction, TextDisplayBuilder} from "discord.js";
import { Discord, SelectMenuComponent, Slash, SlashGroup, SlashOption } from "discordx";
import { allowedImageTypes, renderTicketCreationMessage } from "../../utils/messageContainers.ts";
import { getConfig } from "../../utils/configHandler.ts";

const savedOptions = new Map();
const selectMenuOptions = await getConfig("ticketContexts");

@Discord()
@SlashGroup({
    description: "Configurar mensagem de criação de tickets",
    name: "message",
    root: "setup",
})
@SlashGroup("message", "setup")
export default class MessageController {
    @Slash({description: "Enviar mensagem de criação de tickets"})
    public async send(
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.reply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                renderTicketCreationMessage({
                    title: "### TICKET",
                    useSeparator: true,
                    description: "Para receber **SUPORTE**, tirar **DÚVIDAS** ou realizar uma **COMPRA**, por favor, selecione uma das opções abaixo. Nossa equipe está pronta para ajudar assim que possível!",
                    stringSelectMenuOptions: selectMenuOptions
                })
            ],
            
        });
    }

    @Slash({description: "Definir parâmetros da mensagem de criação de tickets"})
    public async set(
        @SlashOption({
            description: "Descrição",
            name: "description",
            required: true,
            maxLength: 4000,
            type: ApplicationCommandOptionType.String
        })
        description: string,
        @SlashOption({
            description: "Utilizar separador?",
            name: "use-separator",
            required: true,
            type: ApplicationCommandOptionType.Boolean
        })
        useSeparator: boolean,
        @SlashOption({
            description: "Título (utilize '#' no início para texto grande)",
            name: "title",
            required: false,
            maxLength: 100,
            type: ApplicationCommandOptionType.String
        })
        title: string,
        @SlashOption({
            description: "Thumbnail",
            name: "thumbnail",
            required: false,
            type: ApplicationCommandOptionType.Attachment
        })
        thumbnail: Attachment,
        @SlashOption({
            description: "Descrição do menu de seleção de assunto de tickets",
            name: "select-menu-description",
            maxLength: 100,
            required: false,
            type: ApplicationCommandOptionType.String
        })
        selectMenuDescription: string,
        interaction: CommandInteraction
    ): Promise<void> {
        if (thumbnail && (!thumbnail.contentType || !allowedImageTypes.includes(thumbnail.contentType))) {
            await interaction.reply({
                content: "Erro, thumbnail inválida.",
                ephemeral: true
            });
            return;
        }

        const stringMenu = new StringSelectMenuBuilder();
        stringMenu.addOptions(selectMenuOptions);
        stringMenu.setCustomId("ticket-message/on-selected-contexts")
        stringMenu.setMinValues(1);
        stringMenu.setMaxValues(selectMenuOptions.length);

        savedOptions.set(interaction.user.id, {
            title,
            useSeparator,
            description,
            thumbnail,
            selectMenuDescription
        })

        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>();
        actionRow.addComponents(stringMenu);

        await interaction.reply({
            flags: [
                MessageFlags.IsComponentsV2,
                MessageFlags.Ephemeral
            ],
            components: [
                new TextDisplayBuilder({
                    content: "## Selecione os assuntos dos tickets: "
                }),
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                }),
                actionRow
            ]
        });
    }

    @SelectMenuComponent({
        id: "ticket-message/on-selected-contexts"
    })
    public async selected(interaction: StringSelectMenuInteraction): Promise<void> {
        if (!interaction.values[0]) {
            await interaction.reply({
                content: "Ops! Selecione ao menos 1 opção."
            });
            savedOptions.delete(interaction.user.id)
            return;
        }

        
        await interaction.reply({
            flags: [
                MessageFlags.IsComponentsV2,
                MessageFlags.Ephemeral
            ],
            components: [
                new TextDisplayBuilder({
                    content: "## Abaixo, um preview de como ficará a mensagem: "
                }),
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                }),
                renderTicketCreationMessage(
                    {
                        ...savedOptions.get(interaction.user.id),
                        stringSelectMenuOptions: selectMenuOptions.filter(option => interaction.values.includes(option.value))
                    }
                )
            ]
        });
    }
}