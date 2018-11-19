var faker = require("faker");

var appRouter = function (app) {

    var itemPerPage = 10;
    var page;
    var firstName;
    var lastName;
    var userName;
    var email;
    var users = [];

    for (i = 0; i <= 25; i++) {
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
        var username = req.params.username;
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
            if(ele.firstName.toLowerCase().includes(firstName.toLowerCase()) 
                && ele.lastName.toLowerCase().includes(lastName.toLowerCase())
                && ele.username.toLowerCase().includes(userName.toLowerCase())
                && ele.email.toLowerCase().includes(email.toLowerCase())){
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

    app.post("/adduser", function (req, res) {
        //console.log(req.body);
        var check = false;
        users.forEach(function(ele, index) {
            if(ele.username == req.body.userName){
                check = true;
                res.status(500).send(users);
                return;
            }
        });
        if(!check){
            users.push({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.userName,
                email: req.body.email
            });
            res.status(200).send(users);
        }
    });

    app.post("/edituser", function (req, res) {
        //console.log(req.body);
        var check = false;
        users.forEach(function(ele, index) {
            if(ele.username == req.body.userName){
                check = true;
                users[index].firstName = req.body.firstName;
                users[index].lastName = req.body.lastName;
                users[index].email = req.body.email;
                res.status(200).send(users);
                return;
            }
        });
        if(!check){
            res.status(500).send('user not found');
        }
    });

    app.post("/deleteuser", function (req, res) {
        //console.log(req.body);
        var check = false;
        users.forEach(function(ele, index) {
            if(ele.username == req.body.userName){
                check = true;
                users.splice(index, 1);
                res.status(200).send(users);
                return;
            }
        });
        if(!check){
            res.status(500).send('user not found');
        }
    });
}

module.exports = appRouter;