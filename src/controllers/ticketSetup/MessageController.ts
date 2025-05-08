import { ApplicationCommandOptionType, Attachment, AutocompleteInteraction, CommandInteraction, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder} from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { allowedImageTypes, renderTicketCreationMessage } from "../../utils/messageContainers.ts";

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
                    description: "Para receber **SUPORTE**, tirar **DÚVIDAS** ou realizar uma **COMPRA**, por favor, selecione uma das opções abaixo. Nossa equipe está pronta para ajudar assim que possível!"
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
                renderTicketCreationMessage({
                    title,
                    useSeparator,
                    description,
                    thumbnail,
                    selectMenuDescription
                })
            ]
        });
    }
}