import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const dbName = "Temario_2";

async function createDatabase() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        const db = client.db(dbName);

        // Process objectsAggregations
        const objectsCollection = db.collection("objectsAggregations");
        await objectsCollection.deleteMany({}); // Clear existing data

        // Get data from MySQL (this would come from your PHP script)
        // For demonstration, we'll assume we have the data already
        const objectsData = [
            // This would be the actual data from your PHP query
            // Example structure:
            {
                dept_name: "Comp. Sci.",
                building: "Taylor",
                budget: 100000.00,
                classrooms: [
                    {
                        building: "Taylor",
                        room_number: "3128",
                        capacity: 70
                    }
                ]
            }
            // ... other departments
        ];

        if (objectsData.length > 0) {
            const insertResult = await objectsCollection.insertMany(objectsData);
            console.log(`Inserted ${insertResult.insertedCount} documents into objectsAggregations`);
            
            // Verify the aggregation
            const aggregationResult = await objectsCollection.aggregate([
                {
                    $unwind: "$classrooms" // Split classrooms array into separate documents
                },
                {
                    $group: {
                        _id: "$building",
                        totalClassrooms: { $sum: 1 },
                        totalCapacity: { $sum: "$classrooms.capacity" },
                        departments: { $addToSet: "$dept_name" }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]).toArray();

            console.log("Aggregation Results by Building:");
            console.log(JSON.stringify(aggregationResult, null, 2));
        } else {
            console.log("No data to insert into objectsAggregations");
        }
    } catch (error) {
        console.error("Error completo:", error);
    } finally {
        await client.close();
        console.log("Conexion cerrada.");
    }
}

// Execute the function
createDatabase();