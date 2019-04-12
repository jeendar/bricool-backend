var app = require('./app');

var PORT = process.env.PORT || 3000;

var server = app.listen(PORT,function(){
    console.log('Express server listening on port ' + PORT);
    const all_routes = require('express-list-endpoints');
    console.log(all_routes(app));
});

