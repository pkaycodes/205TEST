const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;


mongoose.connect('mongodb://localhost:27017/ugmc_emr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
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
    const { patientId, surname, otherNames, gender, phoneNumber, residentialAddress, emergencyName, emergencyContact, relationshipWithPatient } = req.body;


    if (!patientId || !surname || !gender) {
      return res.status(400).json({ error: 'Please provide patientId, surname, and gender.' });
    }


    const existingPatient = await Patient.findOne({ patientId });
    if (existingPatient) {
      return res.status(400).json({ error: 'Patient already exists.' });
    }


    const patient = new Patient({
      patientId,
      surname,
      otherNames,
      gender,
      phoneNumber,
      residentialAddress,
      emergencyName,
      emergencyContact,
      relationshipWithPatient,
    });
    await patient.save();

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.post('/encounters', async (req, res) => {
  try {
    const { patientId, date, time, encounterType } = req.body;


    if (!patientId || !date || !time || !encounterType) {
      return res.status(400).json({ error: 'Please provide patientId, date, time, and encounterType.' });
    }


    const existingPatient = await Patient.findOne({ patientId });
    if (!existingPatient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }



    res.status(200).json({ message: 'Encounter started successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.post('/vitals', async (req, res) => {
  try {
    const { patientId, bloodPressure, temperature, pulse, spO2 } = req.body;


    if (!patientId || !bloodPressure || !temperature || !pulse || !spO2) {
      return res.status(400).json({ error: 'Please provide patientId, bloodPressure, temperature, pulse, and spO2.' });
    }

    const existingPatient = await Patient.findOne({ patientId });
    if (!existingPatient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }


    res.status(200).json({ message: 'Vitals submitted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find({}, 'patientId');
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.get('/patients/:patientId', async (req,res) => {
  try {
    const patientId = req.params.patientId;

        const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});