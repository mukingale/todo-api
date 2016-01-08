var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var bodyParser = require('body-parser');
app.get('/',function(req, res){
	res.send('Todo api root');
});


app.use(bodyParser.json());
// GET todos
app.get('/todos',function(req, res){

	res.json(todos);
})

// GET todos/:id
app.get('/todos/:id',function(req, res){
	var todoID = parseInt(req.params.id, 10);
	var found = false;
	var todo;

	for(var i = 0; i < todos.length; i++ )
	{
		if (todos[i].id === todoID)
		{

			todo = todos[i];
			found = true;
		}
	}
	if (found === false)
	{
		res.status(404).send();
	}
	else
	{
		res.json(todo);
	}
	//res.send('Asking for todo with id of ' + req.params.id);
})

// POST /todos?

app.post('/todos', function(req,res){
	var body = req.body;
	//console.log('description ' + req.body.description);
	if (undefined !== req.body)
	{
		var todoItem = req.body;

		todoItem.id = todoNextId;
		todos.push(todoItem);
		todoNextId++;
	}
	res.json(body);

});
app.listen(PORT, function(){
	console.log('Express litening on port ' + PORT + '!');
});