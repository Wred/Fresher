// clear db
db.dropDatabase();

// create home page
db.pages.insert({name:"Home",children:[],image:"page.gif"});
var page = db.pages.findOne();

// create publication
db.publications.insert({name:"pub",rootPage:page._id});


// create structure
db.structures.insert({name:"Home",image:"page.gif"});
db.structures.insert({name:"Section",image:"folder.gif"});
