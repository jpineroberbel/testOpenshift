let express = require('express')
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
  //  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('new-message', (message) => {
        console.log(message);
        // Reenviamos el mensaje a todos los clientes
        io.emit('new-message',message);
        });
});

// Gestion de subida de ficheros
app.post('/upload', (req, rest) => {
console.log("1");
    var form = new formidable.IncomingForm(); 
    console.log("2");
     form.parse(req);
     console.log("3");
    form.on('fileBegin', function (name, file){
        file.path =path.join( __dirname,'/public/uploads/', file.name);
        console.log("----------->"+file.path);
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
      //  return rest.redirect('/');

    }); 

    //return rest.redirect('/');

   // rest.sendFile(__dirname + '/public/subeArchivo.html');
})


server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

fs.open('mynewfile2.txt', 'w', function (err, file) {
    if (err) console.log("QUE NOOOOOOOOOOOOOOOOOOOOO "+ err);
  
  });