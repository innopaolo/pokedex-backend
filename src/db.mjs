import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('db.sqlite', { encoding: 'utf8' });

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS pokemon (
        id INTEGER PRIMARY KEY,
        name TEXT,
        type TEXT,
        hp INTEGER,
        attack INTEGER,
        defense INTEGER,
        sp_attack INTEGER,
        sp_defense INTEGER,
        speed INTEGER,
        sprite TEXT,
        thumbnail TEXT,
        image TEXT
      )
    `);
});

export default db;