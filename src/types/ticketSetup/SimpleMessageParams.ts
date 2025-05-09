import { Attachment, SelectMenuComponentOptionData } from "discord.js"

export type SimpleMessageParams = {
    title?: string,
    description: string,
    thumbnail?: Attachment,
    useSeparator: boolean,
    selectMenuDescription?: string,
    stringSelectMenuOptions: SelectMenuComponentOptionData[]
}