const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(express.static(path.join(__dirname, 'views')));

const uri = "mongodb+srv://johnchristojcr:maxsteel10@talentpitch.bzufe.mongodb.net/?retryWrites=true&w=majority&appName=TalentPitch"; 
const client = new MongoClient(uri);

async function connectToDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('TalentPitch');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error;
    }
}

// Start the server after connecting to MongoDB
connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to start the server:', err.message);
        process.exit(1);
    });

// Serve login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve signup.html
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Serve preferences.html
app.get('/preferences', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'preference.html'));
});

// Login route
app.post('/auth/login', async (req, res) => {
    const db = await connectToDB();
    const collection = db.collection('users'); // Change to your users collection name
    const { username, password } = req.body;

    try {
        const user = await collection.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).send('Login successful');
            // Here you could redirect to a different page or return a token
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Error logging in');
    }
});

// Example for user registration
app.post('/auth/signup', async (req, res) => {
    const db = await connectToDB();
    const collection = db.collection('users');
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password with bcrypt
        await collection.insertOne({ username, password: hashedPassword });
        res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).send('Error creating user');
    }
});