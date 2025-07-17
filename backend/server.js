const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const recordRoutes = require('./routes/recordRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const API  = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use('/' ,recordRoutes);

app.get('/', (req, res) => {
    res.send("Welcome the backend services");
})

mongoose.connect(API, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch((err) => console.error(err));