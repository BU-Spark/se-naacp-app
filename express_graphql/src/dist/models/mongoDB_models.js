const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({
    neighborhoods: [String],
    position_section: String,
    tracts: [String],
    author: String,
    body: String,
    content_id: String,
    hl1: String,
    hl2: String,
    pub_date: Date,
    pub_name: String,
    link: String,
    openai_labels: [String],
    dateSum: Number
});

const neighborhoodSchema = new mongoose.Schema({
    articles: [String],
    value: String,
    tracts: [String]
})

const Article = mongoose.model('Article', articleSchema);
const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);
module.exports = {Article, Neighborhood};
