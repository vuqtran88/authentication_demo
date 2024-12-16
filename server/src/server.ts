import express, { NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import router from './routes/auth';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} mode`);

if (environment === 'development') {
    dotenvExpand.expand(dotenv.config({path: '.env.local'}));
} else {
    dotenv.config();
}


const app = express();
app.use(cors(
    {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
    }
));

// Manually handle preflight requests (optional)
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(204); // Respond with no content
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI!).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// // Serve static files from React
// app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
app.use('/api/auth', router);

// Catch-all route for React
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});