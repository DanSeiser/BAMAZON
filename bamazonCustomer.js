var inquirer = require("inquirer");
var mysql = require("mysql");

//CONNECTION SETUP
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "admin",
  database: "bamazon"
});
//CONNECTION
connection.connect(function(err) {
  if (err) {
    console.error(err);
  }
  loadInventory();//LOAD INVENTORY
});
//LOAD INVENTORY
function loadInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err){console.log(err)};
    console.log(res) //PRETTIFY?!?!?!
    goShopping(res);//PASS RESULTS TO INQUIRER
  });
}
//DISPLAY INVENTORY
function goShopping(inventory) {
  inquirer.prompt([
      {
        type: "input",
        name: "item",
        message: "PICK AN ITEM TO BUY: ",
      }
    ])
    .then(function(val) {
      var item_id = parseInt(val.item);
      var item = checkInventory(item_id, inventory);
      askHowMany(item);
    });
}

//SEARCH INVENTORY ARRAY FOR THE ITEM THEY SELECTED, RETURN IT AS OBJECT
function checkInventory(item_id, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id == item_id) {
      return inventory[i];
    }
  }
  return null;
}


//ASK HOW MANY OF THE ITEM THEY WANT
function askHowMany(item) {
  inquirer.prompt([
      {
        type: "input",
        name: "customerWants",
        message: "HOW MANY DO YOU WANT?"
      }
    ]).then(function(val) {
      var customerWants = parseInt(val.customerWants);
      if (customerWants > item.stock_quantity) {
        console.log("INSUFFICIENT QUANTITY!");
      }
      else {
        doBuy(item, customerWants);
      }
    });
}

//PURCHASE ITEM
function doBuy(item, customerWants) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",[customerWants, item.item_id],
    function(err, res) {
      console.log("\nYOU ARE NOW THE PROUD OWNER OF " +customerWants+ " " +item.product_name + "(s)");
    }
  );
}