db.dropDatabase();
db.pages.insert({name:"Home",subs:[],image:"page.gif"});
var page = db.pages.findOne();
db.publications.insert({name:"pub",rootPage:page._id});

