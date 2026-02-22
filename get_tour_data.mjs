import Database from "better-sqlite3";

const db = new Database(process.env.DATABASE_URL.replace('file:', ''));

const tours = db.prepare('SELECT * FROM tours').all();
console.log(JSON.stringify(tours, null, 2));

db.close();
