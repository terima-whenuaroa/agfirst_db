const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { end } = require("./db");

//middleware
app.use(cors());
app.use(express.json());
//ROUTES

//Create test

app.post("/tests", async (req, res) => {
  try {
    const test = req.body.name;
    console.log(req.body.name);
    const new_test = await pool.query("INSERT INTO test(name) VALUES (?)", [
      test,
    ]);
    res.json(new_test.affectedRows);
  } catch (err) {
    console.error(err.message);
  }
});
//Create procurement

app.post("/procurement", async (req, res) => {
  try {
    const livestock_id = req.body.id;
    const date = req.body.date;
    const pi_percentage = req.body.pi_percentage;
    const new_procurement = await pool.query(
      "INSERT INTO procurement(livestock_id,date,pi_percentage) VALUES(?,?,?) ",
      [livestock_id, date, pi_percentage]
    );
    console.log(req.body);
    res.json(new_procurement);
  } catch (err) {
    console.error(err.message);
  }
});
//Create selling year

app.post("/sellingYear", async (req, res) => {
  try {
    const period = req.body.period;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const new_selling_year = await pool.query(
      "INSERT INTO selling_year(period,start_date,end_date) VALUES(?,?,?)",
      [period, start_date, end_date]
    );

    res.json(new_selling_year);
  } catch (err) {
    console.error(err.message);
  }
});

//Create livestock row

app.post("/livestock", async (req, res) => {
  try {
    const { name, livestock_type, is_meat } = req.body;
    const new_livestock = await pool.query(
      "INSERT INTO livestock(name,livestock_type,is_meat) VALUES(?,?,?) ",
      [name, livestock_type, is_meat]
    );
    //console.log(new_livestock_type);
    res.json(new_livestock.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Create livestock type

app.post("/livestockType", async (req, res) => {
  try {
    const name = req.body.name;
    console.log(req.body.name);
    const new_test = await pool.query(
      "INSERT INTO livestock_type(name) VALUES (?)",
      [name]
    );
    res.json(new_test.affectedRows);
  } catch (err) {
    console.error(err.message);
  }
});

//Create price per kg

app.post("/centsKg", async (req, res) => {
  try {
    const { price, livestock_id, new_date } = req.body;

    const new_cents_kg = await pool.query(
      "INSERT INTO cents_kg(price,livestock_id,date) VALUES(?,?,?) ",
      [price, livestock_id, new_date]
    );
    console.log(req.body);
    res.json(new_cents_kg);
  } catch (err) {
    console.error(err.message);
  }
});

//register user
app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, hash_password } = req.body;
    const new_user = await pool.query(
      "INSERT INTO user(first_name, last_name, email, password) VALUES(?,?,?,?)",
      [first_name, last_name, email, hash_password]
    );
    console.log(req.body);
    res.json(new_user);
  } catch (err) {
    console.log(err.message);
  }
});
// session store

app.post("/login", async (req, res) => {
  try {
    const { email, hash_password } = req.body;
    const new_user = await pool.query(
      "SELECT * FROM user WHERE email = ? AND password = ?",
      [email, hash_password]
    );

    if (new_user.length > 0) {
      console.log(new_user);
      res.json(new_user);
    }
    res.json("failed");
  } catch (err) {
    console.log(err.message);
  }
});

//Get all tests

// app.get("/tests", async (req, res) => {
//   const sql_select = "SELECT * FROM test;";
//   pool.query(sql_select, (err, result) => {
//     res.json(result);
//   });
// });

//get user
// app.get("/login", async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;
//     const [all_users] = await pool.query("SELECT  * FROM user;");
//     var i;

//     console.log(all_users);
//     res.json(all_users);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//Get all test
app.get("/tests", async (req, res) => {
  try {
    const all_tests = await pool.query("SELECT  * FROM test;");
    console.log(all_tests);
    res.json(all_tests);
  } catch (err) {
    console.error(err.message);
  }
});

// //Get all procurement
// app.get("/procurement", async (req, res) => {
//   try {
//     const all_procurements = await pool.query("SELECT  * FROM procurement");

//     res.json(all_procurements);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.get("/procurement", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = 5;

    const all_procurements = await pool.query("SELECT  * FROM procurement");
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < all_procurements.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.procurements = all_procurements.slice(startIndex, endIndex);
    res.json(results);
  } catch (err) {
    console.error(err.message);
  }
});

//Get all selling years
app.get("/sellingYear", async (req, res) => {
  try {
    const all_selling_year = await pool.query("SELECT  * FROM selling_year");

    res.json(all_selling_year);
  } catch (err) {
    console.error(err.message);
  }
});
// get specific selling year

app.get("/sellingYear/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await pool.query(
      "SELECT * FROM selling_year WHERE selling_year_id  = ?",
      [id]
    );

    res.json(record);
  } catch (err) {
    console.error(err.message);
  }
});

//Get all livestock
app.get("/livestock", async (req, res) => {
  try {
    const all_livestock = await pool.query("SELECT  * FROM livestock");
    res.json(all_livestock);
  } catch (err) {
    console.error(err.message);
  }
});
//Get all livestock_type
app.get("/livestockType", async (req, res) => {
  try {
    const all_livestock_types = await pool.query(
      "SELECT  * FROM livestock_type"
    );

    res.json(all_livestock_types);
  } catch (err) {
    console.error(err.message);
  }
});
//Get all monthly price limit
app.get("/centsKg", async (req, res) => {
  try {
    const all_cents_kg = await pool.query(
      "SELECT  * FROM cents_kg order by cents_kg_id desc "
    );
    res.json(all_cents_kg);
  } catch (err) {
    console.error(err.message);
  }
});

// get specific monthly price

app.get("/centsKg/:id", async (req, res) => {
  try {
    const { cents_kg_id } = req.params;
    const record = await pool.query(
      "SELECT * FROM cents_kg WHERE cents_kg_id  = $1",
      [cents_kg_id]
    );

    res.json(record.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get all monthly price for a certain livestock

app.get("/centsKg/livestock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await pool.query(
      "SELECT * FROM cents_kg WHERE livestock_id = $1",
      [id]
    );

    res.json(record.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// get a livestock record

app.get("/livestock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await pool.query("SELECT * FROM livestock WHERE id = $1", [
      id,
    ]);

    res.json(record.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// get a stock_type

app.get("/livestockType/:id", async (req, res) => {
  try {
    const { livestock_type_id } = req.params;
    const record = await pool.query(
      "SELECT * FROM livestock_type WHERE livestock_type_id = $1",
      [livestock_type_id]
    );

    res.json(record.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// update test

app.put("/tests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const update_lt = await pool.query(
      "UPDATE test SET description = $1 WHERE id = $2",
      [description, id]
    );

    res.json("test was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// update procurement

app.put("/procurement/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { livestock_id, newDate, pi_percentage } = req.body;
    const update_lt = await pool.query(
      "UPDATE procurement SET livestock_id = ?, date = ?, pi_percentage = ? WHERE pi_id = ?",
      [livestock_id, newDate, pi_percentage, id]
    );
    console.log(req.body);
    res.json("Procurement was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// update selling year

app.put("/sellingYear/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const period = req.body.period;
    const new_start_date = req.body.start_date;
    const new_end_date = req.body.end_date;
    const update_sy = await pool.query(
      "UPDATE selling_year SET period= ?, start_date = ?, end_date = ? WHERE selling_year_id = ?",
      [period, new_start_date, new_end_date, id]
    );
    console.log(update_sy);
    res.json("Selling year was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// update livestock record

app.put("/livestock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const name = req.body.name;
    const livestock_type = req.body.livestock_type;
    const is_meat = req.body.is_meat;
    const records = await pool.query(
      "UPDATE livestock SET name = ?, livestock_type = ?, is_meat = ? WHERE id = ?",
      [name, livestock_type, is_meat, id]
    );
    console.log(livestock_type);
    console.log();
    res.json("Livestock was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// update livestock_type

app.put("/livestockType/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const update_lt = await pool.query(
      "UPDATE livestock_type SET name = ? WHERE livestock_type_id = ?",
      [name, id]
    );

    res.json("Livestock type was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// update monthly price

app.put("/centsKg/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { price, livestock_id, new_date } = req.body;
    const record = await pool.query(
      "UPDATE cents_kg SET price = ?, livestock_id = ?, date = ? WHERE cents_kg_id = ?",
      [price, livestock_id, new_date, id]
    );
    console.log(req.params);
    res.json("Price per kg was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a test

app.delete("/tests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTests = await pool.query("DELETE FROM test WHERE id = ?", [id]);

    res.json("test was deleted");
  } catch (err) {
    console.log(err.message);
  }
});

// delete a procurement record

app.delete("/procurement/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProcurement = await pool.query(
      "DELETE FROM procurement WHERE pi_id = ?",
      [id]
    );

    res.json("Procurement was deleted");
  } catch (err) {
    console.log(err.message);
  }
});

// delete a selling year

app.delete("/sellingYear/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const delete_selling_year = await pool.query(
      "DELETE FROM selling_year WHERE selling_year_id = ?",
      [id]
    );

    res.json("selling year was deleted");
  } catch (err) {
    console.log(err.message);
  }
});

// delete a livestock

app.delete("/livestock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteLivestock = await pool.query(
      "DELETE FROM livestock WHERE id = ?",
      [id]
    );

    res.json("livestock was deleted");
  } catch (err) {
    console.log(err.message);
  }
});

// delete a livestock_type

app.delete("/livestockType/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteStockType = await pool.query(
      "DELETE FROM livestock_type WHERE livestock_type_id = ?",
      [id]
    );
    console.log(id);
    console.log("deleted");
    res.json("livestock type was deleted");
  } catch (err) {
    console.log(err.message);
  }
});

// delete a centsKg

app.delete("/centsKg/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCentsKg = await pool.query(
      "DELETE FROM cents_kg WHERE cents_kg_id = ?",
      [id]
    );

    res.json("Monthly price was deleted");
  } catch (err) {
    console.log(err.message);
  }
});

// start api

app.listen(3000, () => {
  console.log("Server has started on port 3000");
});
