import dotenv from "dotenv";
dotenv.config();
import 'dotenv/config';
import app from "./app.js";
import bcrypt from "bcryptjs";

const PORT = process.env.PORT || 5000;
const hashed = await bcrypt.hash("shalenKatta", 10); // use your desired password
console.log(hashed);
app.listen(PORT, () => {
  console.log(hashed);
  console.log(`Server running on port ${PORT}`);
});
