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

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/matakuliah', matakuliahRoutes);
app.use('/api/modul', modulRoutes);
app.use('/api/lastseen', lastSeenRoutes);
app.use('/api/count', countRoutes);

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
