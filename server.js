var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');


app.get('/', function(req, res) {
	res.send('Todo api root!!!');
});


app.use(bodyParser.json());


// GET /todos?completed=true?q=house
app.get('/todos', function(req, res) {

	var query = req.query;
	var where = {};
	// var filteredTodos = todos;


	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;

	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && _.isString(query.q) && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);

	}, function(error) {
		res.status(404).send();
	});

});

// GET todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo) {
		if (!todo) {
			res.status(404).send();
		} else {
			res.json(todo.toJSON());
		}
	}, function(error) {
		res.status(500).send();
	});

});

// DELETE /todos/:id

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) { // rowDeleted will return number of rows deleted
		if (rowsDeleted !== 0) {
			res.status(204).send()
		} else {
			res.status(404).json({
				error: 'No to do with id'
			});
		}
	}, function(err) {
		res.status(500).send();
	});

});


app.put('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);
	var attributes = {};
	var body = _.pick(req.body, 'description', 'completed');

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}
	// Instance method is executed on the existing model
	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(err) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function(error) {
		res.status(500).send();
	});



});

// POST /todos

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create({
		description: body.description,
		completed: body.completed
	}).then(function(todo) {
		res.json(todo.toJSON());
	}, function(error) {
		res.status(400).json(error);
	}).catch(function(e) {
		console.log(e);
	});

});

// POST /users

app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		res.json(_.pick(user.toJSON(),'email'));
	}, function(error) {
		res.status(400).json(error);
	}).catch(function(e) {
		console.log(e);
	});

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});