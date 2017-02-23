// declaring and requiring npm packages for this app

const Sequelize = require('sequelize'),
			express = require('express'),
			pug = require('pug'),
			morgan = require('morgan'),
			bodyParser = require('body-parser'),
			methodOverride = require('method-override');

// declaring that we are using express in this app
// connecting to database bulletinboard, using postgres, accessing user and password from bash profile
var app = express(),
		sequelize = new Sequelize('bulletinboard', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
		dialect: 'postgres'
		});

// requiting route notices.js in routes folder

var noticesRouter = require('./routes/notices');

// creating a table 'notice' with two columns 'title' and 'body'
var notice = sequelize.define('notice', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT
});

// using morgan middleware to print HTTP request to help debugging (no need to write console.logs)
app.use(morgan('dev'));

// use bodyParser to parse text input in forms
app.use(bodyParser.urlencoded({extended:false}));

// use methodOverride to add delete functionality to application
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
		}})
	);

// setting 'pug' as the view engine, pug files render to html
app.set('view engine', 'pug');

// get request to redirect the homepage to the notices route (in notices.js)
//1. go to route notices.js, go to the app.get('/') in the notices.js file
app.get('/', (request, response) => {
	response.redirect('/notices');
});

// get request to path '/board' route
app.get('/board', (request, response) => {
	//findAll - native method in sequelize returns everything in notice table
	// 'notices' object is passed as a parameter, to be rendered in the pug file
  notice.findAll().then((notices) => {
		// rendering the board pug file, in the notices folder
    response.render('notices/board', { notices: notices });
  });
});

// post request to post a new entry to noticeboard - a new row in the notices table
app.post('/notices', (request, response) => {
	// request.body is the input in the forms (title + body), takes everything in request.body from name attribute
	// in pug file
	//create is native to sequalize, creates a new entry into notices table with a promise
	notice.create(request.body).then(() => {
		//redirects to url [home]/board
		response.redirect('/board');
	});
});

// '/notices' is the url to set app to use noticesRouter variable
// not clear what this does yet!!
app.use('/notices', noticesRouter);

// promise - connects to data with sequelize
sequelize.sync().then(() => {
  console.log('Connected to database');
	// creates a server
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
  });
});
