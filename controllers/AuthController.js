const bcrypt = require('bcrypt')
const User = require(approot+'/models/User')

const AuthController = {
    login(req, res){
        // TODO - validation & form data pushback
        User.find({ username: req.body.username }, (err, find_usrs) => {
            
            if ( err ){
                throw500()
            }
            
            if ( find_usrs.length >> 0 ){
                const user = find_usrs[0]
                if ( bcrypt.compareSync(req.body.password, user.password) ){
                    // Authentication Successful. Create session and redirect.
                    req.session.user = user
                    req.session.user.password = "" 
                    
                    const then = req.session.auth_then
                    delete req.session['auth_then']
                    res.redirect(then)
                }
                else {
                    req.session.form_errors = {
                        login: 'Invalid username/password.'
                    }
                    const san_data = req.body
                    san_data.password = ""
                    req.session.form_data = san_data
                    res.redirect('/auth/login')
                }
            }
            else {
                req.session.form_errors = {
                    login: 'Invalid username/password.'
                }
                const san_data = req.body
                san_data.password = ""
                req.session.form_data = san_data
                res.redirect('/auth/login')
            }
            
        })
    },
    
    register(req, res){
        // TODO - validation & errors & form data pushback
        User.find({ username: req.body.username }, (err, find_usrs) => {
            
            if ( !err && find_usrs.length === 0 ){
                
                const user = new User({
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password, 10),
                })
                user.save((err, user) => {
                    // create session and redirect
                    req.session.user = user
                    req.session.user.password = ""
                    res.redirect('/dash')
                })
            }
            else {
                if ( err ){
                    throw500()
                }
            }
        })
    },
    
    middleware: {
        require_auth(req, res, next){
            if ( !req.session.user ){
                req.session.auth_then = req.originalUrl
                res.redirect('/auth/login')
            }
            else {
                next()
            }
        },
        
        require_guest(req, res, next){
            if ( req.session.user ){
                const back_url = '/'
                res.redirect(back_url)
            }
            else {
                next()
            }
        }
    },
}

module.exports = AuthController