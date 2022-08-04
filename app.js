const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get('/', (request, response) => {
    app.use(express.static(path.resolve(__dirname, '../client', 'build')));
    return response.status(200).sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
});

const authRouter = require('./routes/auth.route');
const usersRouter = require('./routes/users.route');
const hotelsRouter = require('./routes/hotels.route');
const roomsRouter = require('./routes/rooms.route');

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/rooms', roomsRouter);

const url = process.env.DB_URL;

const connectDB = (url) => {
    return mongoose.connect(url);
}

const start = async () => {
    try {
        await connectDB(url);
        if (require.main === module) {
            app.listen(process.env.PORT, () => {
                console.log(`server started at port ${process.env.PORT}`);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

start();