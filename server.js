const express = require('express');
const mongoose = require('mongoose');


const app = express();


mongoose.connect('mongodb://localhost/ugmc_emr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  surname: { type: String, required: true },
  otherNames: { type: String },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  phoneNumber: { type: String },
  residentialAddress: { type: String },
  emergencyName: { type: String },
  emergencyContact: { type: String },
  relationshipWithPatient: { type: String },
});


const Patient = mongoose.model('Patient', patientSchema);


app.use(express.json());


app.post('/patients', async (req, res) => {
  try {
    const patientData = req.body;
    const patient = new Patient(patientData);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/encounters', async (req, res) => {
  try {
    const { patientId, date, time, encounterType } = req.body;
    
    res.status(200).json({ message: 'Encounter started successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/vitals', async (req, res) => {
  try {
    const { patientId, bloodPressure, temperature, pulse, spO2 } = req.body;
    
    res.status(200).json({ message: 'Vitals submitted successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find({}, 'patientId');
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get('/patients/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findOne({ patientId });
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});