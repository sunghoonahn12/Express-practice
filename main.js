var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser')
var compression = require('compression')
var topicRouter = require('./routes/topic')
var indexRouter = require('./routes/index')
var helmet = require('helmet')
var port = 3000

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

app.use('/', indexRouter);
// perform topicRouter middleware for addresses starting with /topic
app.use('/topic', topicRouter);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that')
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
