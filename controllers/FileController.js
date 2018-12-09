const File = require(approot+"/models/File")
const Path = require('path')

const FileController = {
    new(file){
        const file_object = new File({
            original_name: file.originalname,
            uuid: file.filename,
            mime: file.mimetype,
        })
        
        file_object.save()
        
        return file_object
    },
    
    route:{
        get(req, res){
            const id = req.params.file_id
            File.findById(id, (err, file) => {
                if (err) console.log("err")
                res.header("Content-Type", file.mime)
                res.sendFile(file.uuid, {root: Path.join(approot, "data_upload")}, (err) => {
                    if (err){ console.log(err) }
                })
            })
        }
    }
}

module.exports = FileController