
var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect' : 'sqlite',
	'storage' : __dirname + '/sqlitedb.sqlite'
});	

var Todo = sequelize.define('todo', {
	description: {
		type : Sequelize.STRING,
		allowNull: false,
		validate : {
			len: [1,250]
		}
	},
	completed: {
		type : Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	ip: {
		type : Sequelize.STRING,
		defaultValue: ''
	}
});

var User = sequelize.define('user', {
	email : {
		type: Sequelize.STRING
	}
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
//	force:true
}).then(function () {
	console.log('Eveything is synced');
	
	User.findById(1).then(function (user){
		user.getTodos({
			where: {
				completed : false
			}
		}).then (function (todos){
			todos.forEach(function (todo){
				console.log(todo.toJSON());
			});
		});
	});
	// User.create({
	// 	email: "mukund@example.com"
	// }).then(function (user){
	// 	return Todo.create({
	// 		description: 'clean',
	// 		ip: '10.0.0.0',
	// 		completed:false
	// 	});
	// }, function(error){
	// 	console.log(error);
	// }).then(function(todo){
	// 	User.findById(1).then(function (user){
	// 		user.addTodo(todo);
	// 	});
	// });
	// Todo.findAll( {
	// 	where : {
	// 		id : 4
	// 	}
	// }).then(function(todos) {
	// 	todos.forEach(function (todo){
	// 		console.log(todo.toJSON());
	// 	});
	// });


	// Todo.create({
	// 	description : "Take out trash"
	// }).then(function(todo){

	// 	return Todo.create ( {
	// 		description : 'Clean office'
	// 	});
	// }). then(function(){
	// 	//return Todo.findById(3);
	// 	return Todo.findAll({
	// 		where : {
	// 			description: {
	// 				$like: '%trash%'
	// 			}
	// 		}
	// 	});
	// }).then (function (todos) {
	// 	if (todos){
	// 		todos.forEach(function(todo) {
	// 			console.log (todo.toJSON());
	// 		});
			
	// 	}else {
	// 		console.log('no tods found');
	// 	}

	// }).catch(function (e){
	// 	console.log(e);
	// });
});