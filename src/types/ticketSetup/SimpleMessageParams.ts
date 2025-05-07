import { Attachment } from "discord.js"

export type SimpleMessageParams = {
    title?: string,
    description: string,
    thumbnail?: Attachment,
}