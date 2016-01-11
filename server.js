var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var bodyParser = require('body-parser');
var _ = require('underscore');

app.get('/', function(req, res) {
	res.send('Todo api root!!!');
});


app.use(bodyParser.json());


// GET /todos?completed=true?q=house
app.get('/todos', function(req, res) {

	var queryParams = req.query;
	var filteredTodos = todos;


	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(todos, {
			completed: true
		});

	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(todos, {
			completed: false
		});

	}

	if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.length > 0) {
		// Search using regular expression
		filteredTodos = _.filter(filteredTodos, function(obj) {
			//return obj['description'].match(queryParams.q);
			return obj.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});

	}

	res.json(filteredTodos);
});

// GET todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var machedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (machedTodo) {
		res.json(machedTodo);
	} else {
		res.status(404).send();
	}
});

// DELETE /todos/:id

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	  var machedTodo = _.findWhere(todos, {
		id: todoId
	});
	todos = _.without(todos, _.findWhere(todos, {
		id: todoId
	}));
	if (machedTodo) {
		res.json(machedTodo);
	} else {
		res.status(404).send();
	}
});

// PUT

// app.put('/todos/:id',function(req, res){

// 	var todoId = parseInt(req.params.id, 10);
// 	var body = _.pick(req.body,'description','completed');

// 	var description = body.description.trim();
// 	var completed = body.completed.trim();

// 	var machedTodo = _.findWhere(todos, {id: todoId});
// 	if (machedTodo )
// 	{	
// 		machedTodo.description = description;
// 		machedTodo.completed = completed;

// 		res.json(machedTodo);
// 	}
// 	else
// 	{
// 		res.status(404).send();
// 	}
// });


app.put('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);
	var validAttributes = {};
	var body = _.pick(req.body, 'description', 'completed');
	var machedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (!machedTodo) {
		res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		res.status(400).send();

	}

	if (body.hasOwnProperty('description') && _.isString(body.completed) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('desciption')) {
		res.status(400).send();
	}

	_.extend(machedTodo, validAttributes);

	res.json(machedTodo);


});

// POST /todos

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);

	res.json(body);

});
app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});