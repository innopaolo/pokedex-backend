import sqlite3 from 'sqlite3';
import fetch from 'node-fetch'; 

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
        speed INTEGER
      )
    `);
});

async function fetchDataAndInsert() {
  try {
    // Fetch data from GitHub repository
    const response = await fetch('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const dataText = await response.text();
    const data = JSON.parse(dataText);

    // Loop through the data and insert into database
    data.forEach(async (item) => {
      const { id, name, type, base } = item;
      console.log('Raw Data:', id, name.english, type[0], base.Defense);
      db.run(
        'INSERT INTO pokemon (id, name, type, hp, attack, defense, sp_attack, sp_defense, speed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',

        // Take only english name and join types if there are more than one
        [id, name.english, type.join(', '), base.HP, base.Attack, base.Defense, base['Sp. Attack'], base['Sp. Defense'], base.Speed],
        (err) => {
          if (err) {
            console.error('Error inserting data:', err);
          } else {
            console.log('Data inserted successfully');
          }
        }
      );
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


fetchDataAndInsert();
  