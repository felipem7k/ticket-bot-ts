import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, ChannelType, Interaction, MessageFlags, PermissionFlagsBits, StringSelectMenuInteraction } from "discord.js";

export default class TicketCreationController {
    constructor(
        private ticketCategoryId: string,
    ) {
    }

    public async sendTicketLink(
        channel: Channel,
        interaction: StringSelectMenuInteraction
    ): Promise<void> {
        const ticketOpen = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Acessar ticket')
                .setURL(`https://discord.com/channels/${interaction.guild?.id}/${channel.id}`)
                .setStyle(ButtonStyle.Link)
        )

        await interaction.update({});
        await interaction.followUp({
            flags: [
                MessageFlags.Ephemeral,
            ],
            content: `<@${interaction.user.id}> ticket criado com sucesso! Você pode acessa-lo clicando no botão abaixo.`,
            components: [
                ticketOpen
            ]
        });
    }

    public async create(
        interaction: StringSelectMenuInteraction,
    ): Promise<Channel> {
        if (await this.checkIfUserHasTicket(interaction)) {
            throw new Error("Você já possui um ticket aberto.");
        }   
        const user = interaction.user;
        const channel = await interaction.guild?.channels.create({
            name: `🎫-${interaction.values[0]}-${user.username}`,
            type: ChannelType.GuildText,
            parent: this.ticketCategoryId,
            topic: `Ticket criado por ${user.username} (${user.id})`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: user.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
            ],
        });
        if (!channel) {
            throw new Error("Erro ao criar o canal do ticket.");
        }
        return channel;
    }

    private async checkIfUserHasTicket(
        interaction: Interaction,
    ): Promise<boolean> {
        const user = interaction.user;
        const guild = interaction.guild!;
        const channels = await guild.channels.fetch();
        
        // Filter channels by category and topic
        const ticketChannels = channels.filter(channel => 
            channel?.type === ChannelType.GuildText && 
            channel.parentId === this.ticketCategoryId &&
            channel.topic?.includes(`Ticket criado por ${user.username} (${user.id})`)
        );

        // Check if user has permissions in any of these channels
        for (const channel of ticketChannels.values()) {
            const permissions = channel!.permissionsFor(user);
            if (permissions && permissions.has(PermissionFlagsBits.ViewChannel)) {
            return true;
            }
        }
        return false;
    }
}