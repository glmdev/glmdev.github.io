Date.prototype.ymd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('-');
};

require('dotenv').config()
global.config = require('./config')
global.approot = __dirname
global.models = {}

const express = require('express')
const multer = require('multer')
global.upload = multer({dest: approot+"/data_upload/"})
const app = express()
const port = config.http.port

const session = require('express-session')
const cookies = require('cookie-parser')
const body_parser = require('body-parser')
app.use( body_parser.json() )
app.use( body_parser.urlencoded({ extended: true }) )
app.use( cookies() )

app.use( session({ key: 'session_id', secret: config.http.session_key, resave: false, saveUninitialized: true, cookie:{ expires: 86400, }, }) )

const less_jit = require('express-less')
const favicon = require('express-favicon')
const home = require('./routers/HomeRouter')
const auth = require('./routers/AuthRouter')
const dash = require('./routers/DashRouter')
const file = require('./routers/FileRouter')

app.set('view engine', 'pug')
app.use(favicon(__dirname + '/dist/root/favicon.ico'))
app.use('/style', less_jit(__dirname + '/dist/less'))

app.use('/font', express.static(__dirname + '/dist/font'))
app.use('/image', express.static(__dirname + '/dist/image'))
app.use('/script', express.static(__dirname + '/dist/script'))

app.use('/', home)
app.use('/auth', auth)
app.use('/dash', dash)
app.use('/file', file)


// check if browser cookie exists, but no user
app.use((req, res, next) => {
    if ( req.cookies.user_sid && !req.session.user ){
        res.clearCookie('user_sid')
    }
    next()
})

/* =============== ERROR HANDLING =============== */

// Handle 404
app.use(function(req, res) {
    res.status(404)
    res.render('error', {
        title: 'Page Not Found',
        content: {
            title: 'Welp, you broke the Internet!',
            subtitle: 'I can\'t find that page, sorry. If you clicked here from somewhere else, please file a broken link bug report. Thanks!',
            links: [
                {
                    href: "https://forms.zoho.com/garrett/form/BugCrashReport",
                    text: "file a bug report"
                },
                {
                    href: "/",
                    text: "take me home"
                },
            ],
        },
    })
})

// Handle 500
global.throw500 = function(error, req, res, next) {
    res.status(500).send('500: Internal Server Error (glmdev.tech)')
}

app.use(throw500)

/* =============== DB =============== */

const db_url = "mongodb://"+config.db.host+"/"+config.db.name
const mongoose = require('mongoose')
mongoose.connect(db_url)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB Connection Error: '))
db.once('open', () => {
    // DB Connection Successful
    
    // ---- Load the User Model ----
    global.models.User = require(approot+'/models/User')
    global.models.Project = require(approot+'/models/Project')
    
    // LAUNCH THE SERVER - this must be called from the innermost callback function
    app.listen(port, () => console.log('Listening on port '+port))
})
