const express = require('express')
const router = express.Router()
const { check, validation_result } = require('express-validator/check')
const Dash = require(approot+'/controllers/DashController')

router.get('/', Dash.main)

router.get('/project/new', (req, res) => {
    res.render('dash/new_project')
})

router.post('/project/new', upload.single('img'), Dash.project.new)
router.post('/project/delete/:id', Dash.project.delete)
router.post('/project/archive/:id', Dash.project.archive)
router.post('/project/unarchive/:id', Dash.project.unarchive)
router.post('/project/edit/:id/show', Dash.project.show_edit)
router.post('/project/edit/:id/save', Dash.project.save_edit)

module.exports = router