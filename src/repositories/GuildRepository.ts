import admin from "firebase-admin";
import Repository from "./Repository.ts";
import Guild from "../models/Guild.ts";

export default class GuildRepository extends Repository<Guild> {
    protected collection: string = "guilds";

    protected hydrate(data: admin.firestore.DocumentData): Guild {
        return new Guild(
            data.id,
            data.ticket_category_id
        );
    }
}