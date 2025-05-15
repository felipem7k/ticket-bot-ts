import admin from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";
import { getConfig } from "../utils/configHandler.ts";

export class DatabaseConnection {
    private static instance: admin.firestore.Firestore | null = null;

    public static async initialize(): Promise<admin.firestore.Firestore> {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }

        try {
            const serviceAccount = await getConfig<string>("firebase-cert", true);
            
            initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

            DatabaseConnection.instance = getFirestore();
            return DatabaseConnection.instance;
        } catch (error) {
            throw new Error(`Failed to initialize database connection: ${error}`);
        }
    }

    public static getInstance(): admin.firestore.Firestore {
        if (!DatabaseConnection.instance) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return DatabaseConnection.instance;
    }
}

// Uso:
// await DatabaseConnection.initialize();
// const db = DatabaseConnection.getInstance();