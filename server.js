const express = require('express');
const mongoose = require('mongoose');
const Place = require('./models/places');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://user:password@cluster0.zyi1g2n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Create a new place
app.post('/places', async (req, res) => {
    try {
        const newPlace = new Place(req.body);
        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// To Create a test place entry
app.get('/test-add-place', async (req, res) => {
    try {
        const newPlace = new Place({
            name: 'National Memorial',
            type: 'artificial',
            facilities: ['park', 'restaurant'],
            image: './images/national_memorial.jpg',
            detailsLink: 'https://en.wikipedia.org/wiki/National_Martyrs%27_Memorial'
        });
        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieving all places
app.get('/places', async (req, res) => {
    try {
        const places = await Place.find();
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Handling form submission for adding a place
app.post('/add-place', async (req, res) => {
    try {
        const newPlace = new Place({
            name: req.body.name,
            type: req.body.type,
            facilities: req.body.facilities.split(',').map(facility => facility.trim()),
            image: req.body.image,
            detailsLink: req.body.detailsLink,
        });
        const savedPlace = await newPlace.save();
        res.json(savedPlace);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Starting the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
