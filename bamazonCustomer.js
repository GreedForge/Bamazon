var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var table = new Table();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});


function start() {
    inquirer
        .prompt({
            name: "buy",
            type: "confirm",
            message: "Would you like to buy something?",
        })
        .then(function(answer) {
          // console.log(answer.buy);
            // based on their answer, either call the bid or the post functions
            if (answer.buy) {
                pickBuy();
            } else {
                console.log("alrighty!")
                start();
            }
        });
}

function pickBuy() {
    // query the database for all items being auctioned
    var query = "Select item_id, product_name,price,stock_quantity From products";
    connection.query(query, function(err, results) {
        if (err) throw err;

              console.log(results);

        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "What item would you like to buy?"
        },
        {
          name: "buy",
          type: "input",
          message: "How many?"
        }
      ]
            )
            .then(function(answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                // console.log(chosenItem);
                // console.log(chosenItem.stock_quantity);

                // determine if bid was high enough
                if (chosenItem.stock_quantity > parseInt(answer.buy)) {
                  var newAmount = chosenItem.stock_quantity - answer.buy;
                    // bid was high enough, so update db, let the user know, and start over
                    connection.query(
                        "UPDATE products SET ? WHERE ?", [{
                                stock_quantity: newAmount
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function(error) {
                            if (error) throw err;
                            console.log("Items bought");
                            console.log("Total Cost: "+ answer.buy*chosenItem.price);
                            start();
                        }
                    );
                } else {
                    // bid wasn't high enough, so apologize and start over
                    console.log("Not enough left");
                    start();
                }
            });
    });
}