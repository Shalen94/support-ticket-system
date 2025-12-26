import db from "./db.js";

db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB Connection Failed:", err);
  } else {
    console.log("DB Connected! Time:", res.rows[0]);
  }
  db.end();
});
