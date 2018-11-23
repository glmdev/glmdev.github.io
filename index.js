const express = require('express')
const app = express()
const port = 8080

const less_jit = require('express-less')
const favicon = require('express-favicon')
const home = require('./routers/HomeRouter')

global.approot = __dirname

app.set('view engine', 'pug')
app.use(favicon(__dirname + '/dist/root/favicon.ico'))
app.use('/style', less_jit(__dirname + '/dist/less'))

app.use('/font', express.static(__dirname + '/dist/font'))
app.use('/image', express.static(__dirname + '/dist/image'))
app.use('/script', express.static(__dirname + '/dist/script'))

app.use('/', home)

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
    });
});

// Handle 500
app.use(function(error, req, res, next) {
    res.send('500: Internal Server Error', 500);
});

app.listen(port, () => console.log('Listening on port '+port))