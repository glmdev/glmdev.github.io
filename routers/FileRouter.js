const express = require('express')
const router = express.Router()
const FS = require(approot+"/controllers/FileController")

router.get('/get/:file_id', FS.route.get)

module.exports = router;