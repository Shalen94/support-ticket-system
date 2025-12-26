import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const {Pool} = pkg ;

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT ,
});
console.log("PG_PASSWORD type:", typeof process.env.PG_PASSWORD);

console.log("PG_PASSWORD:", process.env.PG_PASSWORD);
console.log("PG_USER:", process.env.PG_USER);
export default pool ;