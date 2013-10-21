/*var Schema = require('jugglingdb').Schema;
var schema = require('../../dbconfig').schema;
var Book = schema.define('Book');
var Chapter = schema.define('Chapters');
//Book.hasMany(Chapter);
Book.belongsTo(Chapter,{foreignKey: 'chapter_id'});
schema.isActual(function(err, actual) {
    if (!actual) {
        schema.autoupdate();
    }
});
//schema.automigrate();
schema.models.Book;
schema.models.Chapter;

Chapter.create(function(err,cps){
	
	Book.create({chaptersId:cps.id},function(err, book) {
	console.log(book.chapters);
	
	book.chapters(function(err, chapters){
		
		console.log(chapters);	
	});
	});
	
	
});

Book.all(function(err,books){

books[3].chapters(function(err, chapters){
		
		console.log(chapters);	
	});	
});


module.exports = Book;
module.exports = Chapter;*/