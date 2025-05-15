import admin from "firebase-admin";
import Repository from "./Repository.ts";
import Guild from "../models/Guild.ts";
import { SimpleMessageParams } from "../types/ticketSetup/SimpleMessageParams.ts";

export default class GuildRepository extends Repository<Guild> {
    protected collection: string = "guilds";

    protected hydrate(data: admin.firestore.DocumentData): Guild {
        return new Guild(
            data.id,
            data.ticket_category_id
        );
    }

    public async getCustomCreateMessage(
        guidId: string
    ): Promise<SimpleMessageParams | null> {
        const docRef = await this.getDoc(guidId);
        if (!docRef.exists) {
            return null;
        }
        const docData = docRef.data() ?? {};
        return docData.customCreateMessage;
    }

    public async setTicketCategory(
        guidId: string,
        categoryId: string
    ) {
        await this.update(
            guidId,
            {
                ticket_category_id: categoryId
            }
        );
    }

    public async setCustomCreateMessage(
        guidId: string,
        messageParams: SimpleMessageParams 
    ) {
        const messageData: any = {};
        for (const [key, value] of Object.entries(messageParams)) {
            if (value !== undefined) {
                messageData[key] = value;
            }
        }
        await this.update(
            guidId,
            {
                customCreateMessage: messageData
            }
        );
    }
}