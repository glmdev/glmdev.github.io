const express = require('express')
const router = express.Router()
const { check, validation_result } = require('express-validator/check')
const Auth = require(approot+'/controllers/AuthController')

router.get('/login', Auth.middleware.require_guest, (req, res) => {
    if ( !req.session.auth_then ){ req.session.auth_then = '/dash' }
    const view_data = { errors: {}, form_data: {} }
    if ( req.session.form_errors ){ view_data.errors = req.session.form_errors }
    if ( req.session.form_data ){ view_data.form_data = req.session.form_data }
    res.render('auth/login', view_data)
})

router.get('/protect', Auth.middleware.require_auth, (req, res) => {
    res.send(req.session)
})

router.post('/login', Auth.middleware.require_guest, [
    check('username').isAlpha(),
    check('password').isLength({ min: 5, max: 25 })
], Auth.login)

router.get('/register', Auth.middleware.require_guest, (req, res) => {
    const view_data = { errors: {} }
    if ( req.session.form_errors ){ view_data.errors = req.session.form_errors }
    res.render('auth/register', view_data)
})

router.post('/register', Auth.middleware.require_guest, [
    check('username').isAlpha(),
    check('password').isLength({ min: 5, max: 25 })
], Auth.register)

router.all('/logout', (req, res) => {
    req.session.user = null
    req.session.destroy()
    res.redirect('/')
})

module.exports = router