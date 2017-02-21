const Sequelize = require('sequelize'),
			express = require('express'),
			pug = require('pug'),
			morgan = require('morgan'),
			bodyParser = require('body-parser'),
			methodOverride = require('method-override');

var app = express(),
		sequelize = new Sequelize('bulletinboard', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
		dialect: 'postgres'
		});

// var noticesRouter = require('routes/notices');

var notice = sequelize.define('notice', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT
});

app.use(morgan('dev'));

// use bodyParser for input in forms
app.use(bodyParser.urlencoded({extended:false}));

//  delete function
/* app.use(methodOverride)(req, res) => {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// all three must be true
		var method = req.body._method;
		delete req.body._method;
		return method;
	}})
);
*/

app.set('view engine', 'pug');

// app.use('notices', noticesRouter);

app.get('/', (request, response) => {
	response.render('notices/add-message.pug');
});

app.post('/notice', (request, response) => {
	notice.create(request.body).then(() => {
		response.redirect('/notices');
	});
});

// run server
app.listen(3000, function() {
 console.log('Web server started on port 3000');
});
