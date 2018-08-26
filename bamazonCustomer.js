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

        connection.query("Select * from products", function(err,res){

            if (err) {
                console.log(err);
            } else {
                console.log("ID     Product      Dept      Price       Stock");
                for (var a = 0;a < res.length; a++){
                console.log(res[a].item_id+"        "  +res[a].product_name+"     "+res[a].department_name+"     "+res[a].price+"     "+res[a].stock_quantity);
                };
                inq.prompt(
                    {name:'enterId',
                    type:'rawlist',
                    choices:res,
                    message:'Enter id of product you would like to buy'}
                ).then(
                    function(ans){
                        console.log("You chose "+res[ans.enterId].product_name);
                        inq.prompt({
                            name:"units",
                            type:"input",
                            message:"How Many Units?"
                        }).then();
                    }
                );
                

            };
           

        });


    };
  });
  

// inq.prompt(

//             );