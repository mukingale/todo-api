var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var sequelize;
if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-sqlitedb.sqlite'
	});

}

var db = {};
db.todo = sequelize.import(__dirname + '/Models/todo.js');
db.user = sequelize.import(__dirname + '/Models/user.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;