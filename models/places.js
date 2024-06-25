const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['natural', 'artificial'],
        required: true
    },
    facilities: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    detailsLink: {
        type: String,
        required: true
    }
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
