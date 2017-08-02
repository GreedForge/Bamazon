DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT not NULL auto_increment,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

select*from products;

insert into products (product_name, department_name, price, stock_quantity)
values("keyboard", "electronics", 30, 200),
("spoon", "home goods", 2, 1000),
("shoes", "clothing", 55, 40),
("playing cards", "games", 4, 100),
("dice", "games", 30, 20),
("screwdriver", "tools", 15, 30),
("toilet paper", "home goods", 12, 3000),
("bed sheets", "home goods", 80, 200),
("zyrtec", "drugs", 19, 100),
("honey", "food", 8, 50);