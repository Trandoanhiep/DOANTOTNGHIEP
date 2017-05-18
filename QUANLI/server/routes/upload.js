var express = require('express');
var multer = require('multer');
var router = express.Router();

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        var type  = req.query.type;
        if(type == 'course'){
            cb(null, './DATA/COURSES/');
        }else if(type == 'toeic'){
            var part = req.query.part;
            cb(null, './DATA/TOEICTEST/PART' + part + "/");
        }
        
    },
    filename: function (req, file, cb) {
        var courseID  = req.query.id;

        var datetimestamp = Date.now();
        cb(null, courseID + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

/* GET users listing. */
router.post('/', function(req, res, next) {

	upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            res.json({error_code:0,err_desc:null});
        });
});

module.exports = router;
