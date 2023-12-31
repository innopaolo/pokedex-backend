import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('db.sqlite', { encoding: 'utf8' });

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS pokemon (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        hp INTEGER,
        attack INTEGER,
        defense INTEGER,
        sprite TEXT,
        thumbnail TEXT,
        image TEXT
      )
    `);
});

export default db;