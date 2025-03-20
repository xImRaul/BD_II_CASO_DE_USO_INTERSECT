import mongoose from 'mongoose';
import { getdata } from './api.js';
const { Schema } = mongoose;
let uri = 'mongodb://127.0.0.1:27017/evaluacionContinua';

// Options configuration for MongoDB connection
const options = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

// Establish connection before any operations
let connection;
try {
  connection = await mongoose.connect(uri, options);
  console.log('Conexión exitosa');
} catch (error) {
  console.log('No se pudo conectar:', error.message);
  process.exit(1);
}

// Define schemas first
const courseSchema = new Schema({
  course_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  dept_name: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true
  }
});

const takeSchema = new Schema({
  ID: {
    type: String,
    required: true
  },
  course_id: {
    type: String,
    required: true,
    index: true
  },
  sec_id: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: false,
    default: null
  }
});

const roomSchema = new Schema({
  mongodb_object: {
    type: new Schema({
      building: { type: String, required: true },
      capacity: { type: Number, required: true },
      room_number: { type: String, required: true }
    }, { _id: false }), // Prevent creating _id for subdocument
    required: true
  }
});

const studentJsonSchema = new Schema({
  student_id: { type: String, required: true },
  data: { type: Object, required: true }
});

// Create indexes
takeSchema.index({ course_id: 1, year: 1 });

// Create models
const Course = mongoose.model('course', courseSchema);
const Takes = mongoose.model('takes', takeSchema);
const Room = mongoose.model('Room', roomSchema);
const StudentJson = mongoose.model('StudentJson', studentJsonSchema);

// Define aggregation functions
const coursesGroupedByCreditsAndDepartment = async () => {
  try {
    const result = await Course.aggregate([
      {
        $group: {
          _id: { dept_name: "$dept_name", credits: "$credits" },
          totalCourses: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.dept_name": 1, "_id.credits": 1 }
      }
    ]);
    console.log('Cursos agrupados por créditos y departamento:', result);
    return result;
  } catch (error) {
    console.error("Error en la agregación de cursos por créditos y departamento:", error);
    return null;
  }
};

const coursesTakenByYear = async () => {
  try {
    const result = await Takes.aggregate([
      {
        $group: {
          _id: "$year",
          totalCoursesTaken: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    console.log('Cursos tomados por año:', result);
    return result;
  } catch (error) {
    console.error("Error en la agregación de cursos tomados por año:", error);
    return null;
  }
};

// Main execution
async function main() {
  try {
    // Fetch data after establishing connection
    const query = await getdata().catch(error => {
      console.log('No se pudo obtener la data:', error);
      process.exit(1);
    });
    
    if (!query) {
      console.log('No hay data para procesar');
      process.exit(1);
    }
    
    console.log('Data obtenida correctamente');

    // Transform room data
    const roomData = query.json.map(item => {
      let parsedObject;
      try {
        parsedObject = typeof item.object_mongodb === 'string' 
          ? JSON.parse(item.object_mongodb) 
          : item.object_mongodb;
      } catch (e) {
        console.error('Error parsing object_mongodb:', e);
        return null;
      }
      return { mongodb_object: parsedObject };
    }).filter(item => item !== null);

    // Insert data
    await Course.deleteMany({});
    await Takes.deleteMany({});
    await Room.deleteMany({});

    const courseInsert = await Course.insertMany(query.course);
    console.log(`Insertados ${courseInsert.length} cursos`);
    
    const takesInsert = await Takes.insertMany(query.takes);
    console.log(`Insertados ${takesInsert.length} registros de takes`);
    
    const roomInsert = await Room.insertMany(roomData);
    console.log(`Insertados ${roomInsert.length} registros de room`);

    // Run aggregations
    await coursesGroupedByCreditsAndDepartment();
    await coursesTakenByYear();
    
    console.log('Proceso completado con éxito');
  } catch (error) {
    console.error('Error en la ejecución principal:', error);
  } finally {
    // Close connection when done
    await mongoose.connection.close();
    console.log('Conexión cerrada');
    process.exit(0);
  }
}