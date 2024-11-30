const { query } = require('./db')

async function searchPlayers(name) {
  const result = await query('SELECT * FROM players WHERE name ILIKE $1', [`%${name}%`])
  return result.rows
}

async function getPlayerStats(id) {
  const result = await query('SELECT * FROM player_stats WHERE player_id = $1', [id])
  console.log(result)
  return result.rows
}

async function comparePlayerStats(player1, player2, format) {
  const result = await query(`
    SELECT p.name, ps.*
    FROM players p
    JOIN player_stats ps ON p.id = ps.player_id
    WHERE (p.name ILIKE $1 OR p.name ILIKE $2)
    AND ps.format = $3
  `, [`%${player1}%`, `%${player2}%`, format])
  return result.rows
}

module.exports = { searchPlayers, getPlayerStats, comparePlayerStats }
