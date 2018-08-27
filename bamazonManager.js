var inq = require("inquirer");

var mysql = require("mysql");
var menuOptions = ['View Products for Sale', 'View Low Inventory','Add to Inventory', 'Add New Product'];


var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"root",
    database:"bamazon"
});

console.log("Connecting...");

connection.connect(function(err) {

    
    if (err) {
        console.log(err);
    } else {

            function managerView() { 


                    inq.prompt({
                        name:"options",
                        type:"rawlist",
                        message:"Choose your Options",
                        choices : menuOptions
                    }).then(function(ans){

                        var actions = [
                            function(){
                                console.log(menuOptions[0]);
                                
                                connection.query("select * from products",function(err,res){
                                    if (err) {
                                        console.log("error");
                                        throw err;
                                    } else {
                                        console.log(res);
                                        managerView();
                                    };
                                });
                            },

                            function(){
                                console.log(menuOptions[1]);
                                connection.query("select * from products where stock_quantity < 5",function(err,res){
                                    if (err) {
                                        console.log("error");
                                        throw err;
                                    } else {
                                        console.log(res);
                                        managerView();
                                    };
                                });
                            },
                            function(){
                                console.log(menuOptions[2]);
                                connection.query(
                                    "Select product_name,stock_quantity from products",
                                    function(err,res){
                                        if (err){
                                            console.log('error');
                                            throw err;
                                        } else {
                                            console.log(res);
                                            var ress=[];
                                            for (var q = 0 ; q < res.length; q++){
                                                ress.push(res[q].product_name);

                                            };
                                            inq.prompt({
                                                name:"addinv",
                                                type:"list",
                                                message:"Choose product to add inventory to",
                                                choices : ress
                                            }).then(function(ans){
                                                    inq.prompt({
                                                    name:"units",
                                                    type:'input',
                                                    message:"Enter number of units"
                                                }).then(function(anss){

                                                    connection.query(

                                                        "Update products set stock_quantity = ? where product_name = ?",[parseFloat(res[0].stock_quantity) - parseFloat(anss.units),res[0].product_name],
                                                        function(err,ress){
                                                            if (err){
                                                                console.log("err");
                                                                throw err;
                                                            } else {
                                                                console.log(ress);
                                                                actions[0]();
                                                                
                                                            };
                                                        }
                                                    );
                                                    });
                                                
                                            });
            
                                        }
                                    }

                                );

                                },
                            function(){console.log(menuOptions[3]);managerView();}
                        ];
                        console.log(ans.options);

                        // actions[0]();
                        actions[menuOptions.indexOf(ans.options)]();
                        
                    });

                };
                managerView();
            }
        });

