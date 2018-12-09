const mongoose = require('mongoose')

const Project = mongoose.model('Project', {
    title: String,
    text: String,
    date: String,
    img: String,
    writeup: String,
    link: String,
    flags: String,
})

module.exports = Project