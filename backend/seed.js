import mongoose from "mongoose";
import dotenv from "dotenv";
import LabResult from "./src/models/Labresult.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedLabResults = async () => {
  try {
    const doctorId = "68e93ed18d7fb3357c8be2d3"; // Dr. Sarah Johnson
    const patientId = "68ee7e7376a0c934c5cc9cc9"; // Sanjeevi

    const labResultsData = [
      {
        patientId,
        doctorId,
        fileName: "lab_day1.pdf",
        filePath: "/lab-results/lab_day1.pdf",
        remarks: JSON.stringify({
          cholesterol: 210,
          bloodSugar: 105,
          hemoglobin: 13,
          bpSystolic: 120,
          bpDiastolic: 80,
          bmi: 24.5,
          fastingGlucose: 95,
        }),
      },
      {
        patientId,
        doctorId,
        fileName: "lab_day2.pdf",
        filePath: "/lab-results/lab_day2.pdf",
        remarks: JSON.stringify({
          cholesterol: 198,
          bloodSugar: 102,
          hemoglobin: 14,
          bpSystolic: 118,
          bpDiastolic: 78,
          bmi: 24.2,
          fastingGlucose: 92,
        }),
      },
      {
        patientId,
        doctorId,
        fileName: "lab_day3.pdf",
        filePath: "/lab-results/lab_day3.pdf",
        remarks: JSON.stringify({
          cholesterol: 205,
          bloodSugar: 110,
          hemoglobin: 13,
          bpSystolic: 122,
          bpDiastolic: 82,
          bmi: 24.8,
          fastingGlucose: 98,
        }),
      },
      {
        patientId,
        doctorId,
        fileName: "lab_day4.pdf",
        filePath: "/lab-results/lab_day4.pdf",
        remarks: JSON.stringify({
          cholesterol: 200,
          bloodSugar: 108,
          hemoglobin: 14,
          bpSystolic: 119,
          bpDiastolic: 79,
          bmi: 24.6,
          fastingGlucose: 96,
        }),
      },
      {
        patientId,
        doctorId,
        fileName: "lab_day5.pdf",
        filePath: "/lab-results/lab_day5.pdf",
        remarks: JSON.stringify({
          cholesterol: 215,
          bloodSugar: 107,
          hemoglobin: 13,
          bpSystolic: 121,
          bpDiastolic: 81,
          bmi: 24.7,
          fastingGlucose: 97,
        }),
      },
    ];

    await LabResult.deleteMany({ patientId });
    await LabResult.insertMany(labResultsData);
    console.log("Lab results seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding lab results:", error);
    process.exit(1);
  }
};

connectDB().then(seedLabResults);
