import mysql from "mysql2";

//الاتصال مع قاعدة البيانات
const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "justJournal",
  })
  .promise();
export default pool;
