var faker = require("faker");

var appRouter = function (app) {

    var itemPerPage = 10;
    var page;
    var firstName;
    var lastName;
    var userName;
    var email;
    var users = [];

    for (i = 0; i <= 105; i++) {
        users.push({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email()
        });
    }

    app.get("/", function (req, res) {
        res.render("home");
    });

    app.get("/user/:username", function (req, res) {
        var check = false;
        var username = request.params.username;
        users.forEach(function(ele, index) {
            if(ele.username == username){
                check = true;
                res.status(200).send(ele);
                return;
            }
        });
        if(!check){
            res.status(500).send('user not found');
        }
    });

    app.get("/users/:page(*)/:firstName(*)/:lastName(*)/:userName(*)/:email(*)", function (req, res) {
        var list = [];
        page = req.params.page;
        firstName = req.params.firstName;
        lastName = req.params.lastName;
        userName = req.params.userName ;
        email = req.params.email;
        
        var temp = [];
        
        users.forEach(function(ele, index) {
            if(ele.firstName.includes(firstName) 
                && ele.lastName.includes(lastName)
                && ele.username.includes(userName)
                && ele.email.includes(email)){
                    temp.push(ele);
            }
        });

        if(temp.length == 0){
            res.status(200).send({list : [], size : 0});
            return;
        }else if(page > Math.ceil(temp.length/itemPerPage)){
            res.status(500).send({message : 'no data'});
            return;
        }else{
            for (i = (page-1) * itemPerPage; i < page * itemPerPage && i< temp.length; i++) {
                list.push(temp[i]);
            }
            res.status(200).send({list : list, size : Math.ceil(temp.length/itemPerPage)});
        }
    });
}

module.exports = appRouter;