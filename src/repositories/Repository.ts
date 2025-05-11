import admin from "firebase-admin";
import { createDatabaseConnection } from "../persistence/createDatabaseConnection.ts";

export default abstract class Repository<T> {
    protected collection = "";
    protected db: admin.firestore.Firestore = createDatabaseConnection();

    public async find(id: string): Promise<T | null> {
        const docRef = await this.db.collection(this.collection).doc(id).get();
        if (!docRef) {
            return null;
        }
        const docData = {
            id: docRef.id,
            ...docRef.data()
        };
        if (!docData) {
            return null;
        }
        return this.hydrate(docData);
    }

    protected abstract hydrate(data: admin.firestore.DocumentData): T;
}