var inq = require("inquirer");

var mysql = require("mysql");

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

            function customerView() { 

            connection.query("Select * from products", function(err,res){

                    if (err) {
                        console.log(err);
                    } else {
                        console.log("ID     Product      Dept      Price       Stock\n");
                        console.log("------------------\n");
                        var choicesArray =[];
                        for (var a = 0;a < res.length; a++){
                        console.log(res[a].item_id+"        "  +res[a].product_name+"     "+res[a].department_name+"     "+res[a].price+"     "+res[a].stock_quantity);
                        choicesArray.push(res[a].product_name);
                        

                        };
                        inq.prompt(
                            {
                                name:'enterId',
                                type:'list',
                                message:'Enter id of product you would like to buy',
                                choices:choicesArray
                            }
                        ).then(function(ans){
                            console.log("You chose :");
                            console.log(ans.enterId);
                            inq.prompt(
                                {
                                    name:'units',
                                    type:'input',
                                    message:'Enter number of units you would like to buy'
                                }
                            ).then(
                                function(ansunit){

                                    connection.query("select stock_quantity, price from products where product_name = ?",[ans.enterId],function(err,res){
                                        if (err) {
                                            throw err;
                                        } else {
                                            
                                            if (res[0].stock_quantity < ansunit.units) {
                                                console.log("Insufficient Quantity - please reduce");

                                            } else {

                                                connection.query("Update  products set stock_quantity = ? where product_name = ?",[(parseFloat(res[0].stock_quantity) -parseFloat(ansunit.units)),ans.enterId],function(err,resp){
                                                    if (err) {
                                                        console.log("Error");
                                                        throw err;
                                                    } else {
                                                        console.log("You have made a purchase of "+ansunit.units+" unit(s) of "+ans.enterId);
                                                        console.log("\nYou paid $"+parseFloat(res[0].price)*ansunit.units+ " for this.");
                                                        customerView();
                                                    }
                                                });
                                            };
                                        };

                                    });
                                    
                                }
                            );
                        });

                        
                        };

  
                }
                );
                    

            };
           
        };

        customerView();

        });

