const mongoose = require('mongoose')

const File = mongoose.model('File', {
    original_name: String,
    mime: String,
    uuid: String,
})

module.exports = File