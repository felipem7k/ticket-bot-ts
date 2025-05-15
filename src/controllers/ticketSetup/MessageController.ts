import { ActionRowBuilder, ApplicationCommandOptionType, Attachment, ButtonBuilder, ButtonStyle, CommandInteraction, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, StringSelectMenuBuilder, ButtonInteraction, StringSelectMenuInteraction, TextDisplayBuilder, TextBasedChannel} from "discord.js";
import { ButtonComponent, Discord, Guard, Guild, SelectMenuComponent, Slash, SlashGroup, SlashOption } from "discordx";
import { allowedImageTypes, renderTicketCreationMessage, replyWithError } from "../../utils/messageContainers.ts";
import { getConfig } from "../../utils/configHandler.ts";
import GuildRepository from "../../repositories/GuildRepository.ts";

const savedOptions = new Map();
const contextList = await getConfig("ticketContexts");
const guildRepository: GuildRepository = new GuildRepository();

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
        @SlashOption({
            description: "Canal para enviar a mensagem",
            name: "channel",
            required: true,
            type: ApplicationCommandOptionType.Channel
        })
        channel: any,
        interaction: CommandInteraction
    ): Promise<void> {
        const customCreateMessage = await guildRepository.getCustomCreateMessage(
            interaction.guild!.id
        );
        interaction.channel
        if (!customCreateMessage) {
            await replyWithError(interaction, "Erro, mensagem não definida. utilize ``/setup message set``");
            return;
        }

        await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [
                renderTicketCreationMessage(customCreateMessage)
            ],
        });

        await interaction.reply({
            flags: [
                MessageFlags.Ephemeral
            ],
            content: "Mensagem enviada!"
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
            description: "Footer",
            name: "footer",
            required: false,
            maxLength: 500,
            type: ApplicationCommandOptionType.String
        })
        footer: string,
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
            await replyWithError(interaction, "Erro, thumbnail inválida.");
            return;
        }

        const stringMenu = new StringSelectMenuBuilder()
        .setCustomId("ticket-message/on-selected-contexts")
        .setMinValues(1)
        .setMaxValues(contextList.length)
        .addOptions(contextList);

        if (footer) {
            footer = `-# ${footer}`
        }

        savedOptions.set(interaction.user.id, {
            title,
            useSeparator,
            description,
            footer,
            thumbnail: thumbnail ? thumbnail.url : null,
            selectMenuDescription
        });

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
        const userId = interaction.user.id;
        if (!savedOptions.has(userId)) {
            await replyWithError(interaction, "Ocorreu algum erro, tente utilizar o comando novamente.");
            return;
        }

        if (!interaction.values[0]) {
            await replyWithError(interaction, "Ops! Selecione ao menos 1 opção.");
            savedOptions.delete(userId);
            return;
        }

        savedOptions.set(userId, {
            ...savedOptions.get(userId),
            stringSelectMenuOptions: contextList.filter((option: any) => interaction.values.includes(option.value))
        })

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
                    savedOptions.get(userId)
                ),
                new SeparatorBuilder({
                    spacing: SeparatorSpacingSize.Large
                }),
                new ActionRowBuilder<ButtonBuilder>({
                    components: [
                        new ButtonBuilder({
                            custom_id: "ticket-message/save-message",
                            style: ButtonStyle.Primary,
                            label: "Salvar",
                            emoji: "💾"
                        })
                    ]
                })
            ]
        });
    }

    @ButtonComponent({
        id: "ticket-message/save-message"
    })
    public async saveMessage(
        interaction: ButtonInteraction
    ) {
        const userId = interaction.user.id;
        if (!savedOptions.has(userId)) {
            await replyWithError(interaction, "Ocorreu algum erro, tente utilizar o comando novamente.");
            return;
        }

        if (!interaction.guild) {
            return;
        }

        await guildRepository.setCustomCreateMessage(
            interaction.guild.id!,
            savedOptions.get(userId)
        );
        
        await interaction.reply({
            flags: [
                MessageFlags.Ephemeral
            ],
            content: "Mensagem salva com sucesso!"
        });
    }
}