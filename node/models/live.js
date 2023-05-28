const mongoose = require('mongoose');

const UserShema = new mongoose.Schema({
    sport_name: {
        type: String,
        enum: [
            'Badminton',       'Bandy',            'Baseball',
            'Basketball',      'Beach Volleyball', 'Boxing',
            'Chess',           'Cricket',          'Curling',
            'Darts',           'E Sports',         'Field Hockey',
            'Floorball',       'Football',         'Futsal',
            'Golf',            'Handball',         'Hockey',
            'Horse Racing',    'Lacrosse',         'Mixed Martial Arts',
            'Other Sports',    'Politics',         'Rugby League',
            'Rugby Union',     'Snooker',          'Soccer',
            'Softball',        'Squash',           'Table Tennis',
            'Tennis',          'Volleyball',       'Water Polo',
            'Padel Tennis',    'Aussie Rules',     'Alpine Skiing',
            'Biathlon',        'Ski Jumping',      'Cross Country',
            'Formula 1',       'Cycling',          'Bobsleigh',
            'Figure Skating',  'Freestyle Skiing', 'Luge',
            'Nordic Combined', 'Short Track',      'Skeleton',
            'Snow Boarding',   'Speed Skating',    'Olympics',
            'Athletics',       'Crossfit',         'Entertainment',
            'Archery',         'Drone Racing',     'Poker',
            'Motorsport',      'Simulated Games',  'Sumo'
        ]
    },
    league: String,
    teams: String,
    time: { type: Date, default: Date.now },
});

mongoose.model('Live', UserShema);