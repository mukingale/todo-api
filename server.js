var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id : 1,
	description: 'Gym workout',
	completed: false
}, {
	id : 2,
	description: 'Private Appointment',
	completed: false
}, {
	id : 3,
	description: 'take medicine',
	completed: true
}];


app.get('/',function(req, res){
	res.send('Todo api root');
});

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

app.listen(PORT, function(){
	console.log('Express litening on port ' + PORT + '!');
});