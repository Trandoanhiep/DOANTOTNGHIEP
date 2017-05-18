var express = require('express'); 
var app = express(); 
let http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');


app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // res.writeHead(200, {"Content-Type": "application/json"});
    next();
});

//  api cho việc quản lí của admin
var login = require('./routes/login');
var addCourse = require('./routes/add-course');
var updateCourse = require('./routes/update-course');
var deleteCourse = require('./routes/delete-course');
var allCourses = require('./routes/all-courses');
var getCourse = require('./routes/get-course');
var upload = require('./routes/upload');

app.use('/api/login', login);
app.use('/api/add-course',  addCourse);
app.use('/api/update-course',  updateCourse);
app.use('/api/delete-course',  deleteCourse);
app.use('/api/all-courses', allCourses);
app.use('/api/get-course', getCourse);
app.use('/api/upload', upload);

//api cho user
var register = require('./routes/register');
var getAllPosts = require('./routes/get-all-posts');
var userPost = require('./routes/user-post');
var getAllComments = require('./routes/get-all-comments');
var userComment = require('./routes/user-comment');

app.use('/api/register', register);
app.use('/api/get-all-posts', getAllPosts);
app.use('/api/user-post', userPost);
app.use('/api/get-all-comments', getAllComments);
app.use('/api/user-comment', userComment);


app.use(express.static('../client'));
app.use('/upload',express.static('uploads'));
app.use('/data',express.static('DATA/COURSES'));
app.use('/toeic',express.static('DATA/TOEICTEST'));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));



// io.on('connection', (socket) => {
//     console.log('user connected');
  
//     socket.on('disconnect', function(){
//         console.log('user disconnected');
//     });
  
//     socket.on('add-message', (message) => {
//         io.emit('message', {type:'new-message', text: message});    
//     });
// });



app.listen('3000', function(){
    console.log('running on 3000...');
});