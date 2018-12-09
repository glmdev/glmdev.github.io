const Project = require(approot+"/models/Project")
const File = require(approot+"/models/File")
const FS = require(approot+"/controllers/FileController")
const moment = require('moment')

const DashController = {
    main(req, res){
        let flags = []
        if ( 'flags' in req.session ){
            flags = req.session.flags
        }
        
        
        Project.find({}, (err, projects) => {
            res.render('dash/index', { flags, projects })
        })
    },
    project: {
        new( req, res ){
            // TODO validation
            // const proj = new Project(req.body)
            if ( req.file ){
                const img = FS.new(req.file)
            }
            else {
                const img = {id: "None"}
            }
            const proj = new Project({
                title: req.body.title,
                text: req.body.text,
                date: moment(req.body.date, "YYYY-MM-DD").format('D MMM YYYY'),
                img: img.id,
                writeup: req.body.writeup,
                link: req.body.link,
                flags: "",
            })
            
            proj.save()
            
            // TODO cache busting on redirect back
            req.session.flags = ['project_added']
            res.status(307).redirect('/dash')
        },
        save_edit(req, res){
            // TODO allow editing/not editing of the image
        },
        show_edit(req, res){
            const id = req.params.id
            Project.findById(id, (err, project) => {
                res.render('dash/edit_project', { project })
            })
        },
        getflags(project){
            return project.flags.split(",")
        },
        delete(req, res){
            const id = req.params.id
            Project.findById(id, (err, proj) => {
                // TODO err handling/model not found
                proj.remove((err) => {
                    req.session.flags = ['project_deleted']
                    res.status(307).redirect('/dash')
                })
            })
        },
        archive(req, res){
            const id = req.params.id
            Project.findById(id, (err, proj) => {
                // TODO check if already archived
                if ( !proj.flags.includes("archived;") ){
                    proj.flags += "archived;"
                }
                proj.save((err) => {
                    req.session.flags = ['project_archived']
                    res.status(307).redirect('/dash')
                })
            })
        },
        unarchive(req, res){
            const id = req.params.id
            Project.findById(id, (err, proj) => {
                if ( proj.flags.includes("archived;") ){
                    proj.flags = proj.flags.replace("archived;", "")
                }
                
                proj.save((err) => {
                    req.session.flags = ['project_unarchived']
                    res.status(307).redirect('/dash')
                })
            })
        }
    }
}

module.exports = DashController