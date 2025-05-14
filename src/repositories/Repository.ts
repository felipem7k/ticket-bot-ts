import admin from "firebase-admin";
import { createDatabaseConnection } from "../persistence/createDatabaseConnection.ts";

export default abstract class Repository<T> {
    protected abstract collection: string;
    protected db: admin.firestore.Firestore = createDatabaseConnection();

    protected async getDoc(id: string) {
        return await this.db.collection(this.collection).doc(id).get();
    }

    public async find(id: string): Promise<T | null> {
        const docRef = await this.getDoc(id);
        if (!docRef.exists) {
            return null;
        }
        const docData = {
            id: docRef.id,
            ...docRef.data()
        };
        return docData ? this.hydrate(docData) : null;
    }

    protected async set(
        id: string,
        data: { [x: string]: any; }
    ) {
        const docRef = this.db.collection(this.collection).doc(id);
        docRef.set(data);
    }

    protected async update(
        id: string, 
        data: { [x: string]: any; },
        createIfNotExists: boolean = true
    ): Promise<void> {
        const docRef = this.db.collection(this.collection).doc(id);
        const docSnapshot = await docRef.get();

        if (!docSnapshot.exists) {
            await docRef.set(data)
        } else {
            await docRef.update(data);
        }

    }

    protected abstract hydrate(data: admin.firestore.DocumentData): T;
}