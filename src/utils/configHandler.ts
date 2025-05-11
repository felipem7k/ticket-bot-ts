import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_PATH = path.resolve(__dirname, "../../config/");

export async function getConfig<T>(folder: string, inJson: boolean = false): Promise<T | any> {
    try {
        const filePath = path.join(BASE_PATH, `${folder}.json`);
        const data = await fs.readFile(filePath, "utf-8");
        const json = JSON.parse(data);

        return inJson ? json : Object.values(json);
    } catch (error) {
        console.error("Erro ao obter configuração:", error);
        return [];
    }
}