const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/hook/contact_success', (req, res) => {
    res.render('landing', {
        title: 'Success!',
        content: {
            title: "Your message has been sent.",
            subtitle: "I'll get back to you as soon as possible. Thanks!",
            links: [
                {
                    href: '/',
                    text: 'take me home',

                }
            ]
        }
    })
})

router.get('/robots.txt', (req, res) => {
    res.sendFile(approot+'/dist/root/robots.txt')
})

router.get('/humans.txt', (req, res) => {
    res.sendFile(approot+'/dist/root/humans.txt')
})

module.exports = router;