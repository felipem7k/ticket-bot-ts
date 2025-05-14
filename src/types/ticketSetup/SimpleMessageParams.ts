import { Attachment, SelectMenuComponentOptionData } from "discord.js"

export type SimpleMessageParams = {
    title?: string,
    description: string,
    thumbnail?: string,
    useSeparator: boolean,
    footer?: string,
    selectMenuDescription?: string,
    stringSelectMenuOptions: SelectMenuComponentOptionData[]
}