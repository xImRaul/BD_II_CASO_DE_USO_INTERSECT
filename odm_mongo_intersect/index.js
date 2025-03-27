import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017"; // Cambia si MongoDB está en otro host o puerto
const dbName = "Temario_2";
const collections = [
    "coursesperyears",
    "objectsagregations",
    "objectsbasics",
    "objectscomplex",
    "objectsindexs"
];

async function createDatabase() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log("🟢 Conectado a MongoDB");

        const db = client.db(dbName);

        for (let collection of collections) {
            const collectionList = await db.listCollections({ name: collection }).toArray();
            if (collectionList.length === 0) {
                await db.createCollection(collection);
                console.log(`✅ Colección creada: ${collection}`);
            } else {
                console.log(`⚠️ La colección '${collection}' ya existe.`);
            }
        }
    } catch (error) {
        console.error("🔴 Error:", error);
    } finally {
        await client.close();
        console.log("🔵 Conexión cerrada.");
    }
}

// Ejecutar la función
createDatabase();
