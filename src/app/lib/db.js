const { Pool } = require('pg')

console.log('DB_HOST:', process.env.DB_HOST)
console.log('DB_USER:', process.env.DB_USER)
console.log('DB_NAME:', process.env.DB_NAME)

const pool = new Pool({
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  host: String(process.env.DB_HOST),
  port: parseInt(process.env.DB_PORT),
  database: String(process.env.DB_NAME),
})

async function query(text, params) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

async function initDatabase() {
  const createPlayersTable = `
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      espn_id INTEGER UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL
    );
  `
  const createPlayerStatsTable = `
    CREATE TABLE IF NOT EXISTS player_stats (
      id SERIAL PRIMARY KEY,
      player_id INTEGER REFERENCES players(id),
      format VARCHAR(50) NOT NULL,
      matches INTEGER NOT NULL,
      runs INTEGER NOT NULL,
      average FLOAT NOT NULL,
      UNIQUE(player_id, format)
    );
  `
  const getAllPlayers = `
  `
  await query(createPlayersTable)
  await query(createPlayerStatsTable)
  console.log('Database initialized')
}

module.exports = { query, initDatabase }
