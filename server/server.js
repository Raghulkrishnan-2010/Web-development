import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    course: {
      type: String,
      required: true,
      enum: ["B.E CSE", "B.Tech IT", "B.E ECE", "B.E Mechanical"],
    },
    address: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

registrationSchema.index({ email: 1 }, { unique: true });
const Registration = mongoose.model("Registration", registrationSchema);

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/registrations", async (request, response) => {
  try {
    const registration = await Registration.create(request.body);
    response.status(201).json({
      message: "Student registration successful.",
      registration: {
        id: registration._id,
        name: registration.name,
        email: registration.email,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({ message: "This email is already registered." });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return response.status(400).json({ message: "Please provide valid registration details." });
    }

    console.error("Registration error:", error);
    return response.status(500).json({ message: "Unable to save registration." });
  }
});

app.use((_request, response) => {
  response.status(404).json({ message: "Route not found." });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/student_registration");
    app.listen(port, () => {
      console.log(`Registration API listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
