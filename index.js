let express = require('express')
var path = require('path');
var formidable = require('formidable');
//var fs = require('fs');

let app = express();

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
app.use(express.static(path.join(__dirname, 'public')));

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

    var form = new formidable.IncomingForm(); 

     form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/public/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    }); 

    rest.sendFile(__dirname + '/public/subeArchivo.html');
})


server.listen(port, () => {
    console.log(`started on port: ${port}`);
});