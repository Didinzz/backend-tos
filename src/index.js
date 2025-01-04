const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const cloudinary  = require('./config/cloudinary')
const authRoutes = require('./routes/authRoutes');
const matakuliahRoutes = require('./routes/matakuliahRoutes');
const modulRoutes = require('./routes/modulRoutes');
const searchRoutes = require('./routes/searchRoutes');
const userRoutes = require('./routes/userRoutes');
const lastSeenRoutes = require('./routes/lastSeenRoutes');
const countRoutes = require('./routes/countRoutes');
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();


const app = express();

app.use(cors({
  origin: ['https://e-learning-informatika.vercel.app', 'http://localhost:3000'], // Ganti dengan domain frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode yang diizinkan
  credentials: true, // Izinkan pengiriman cookies atau credentials lainnya
  allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diperbolehkan
}));

app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        code:200,
        status: 'ok',
        message: 'Hai selamat datang di route backend E-Learning Informatika😁, berikut adalah beberapa route yang tersedia: /api/users, /api/auth, /api/matakuliah, /api/modul, /api/lastseen, /api/count'
     });
})
// Routes
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/matakuliah', matakuliahRoutes);
app.use('/api/modul', modulRoutes);
app.use('/api/lastseen', lastSeenRoutes);
app.use('/api/count', countRoutes);
app.use((_, res) => {
  res.status(404).json({
    code: 404,
    status: 'error',
    message: 'tidak ada route apapun disini atau kosong😢',
  });
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

// Database connection and server start
sequelize.sync().then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});
