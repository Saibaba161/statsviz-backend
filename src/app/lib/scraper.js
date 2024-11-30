const axios = require('axios')
const cheerio = require('cheerio')
const { query } = require('./db')

async function scrapePlayerStats(espnId) {
  const url = `https://www.espncricinfo.com/cricketers/virat-kohli-${espnId}`

  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    
    const name = $('h1.player-card-name').text().trim()
    const country = $('h3.player-card-country').text().trim()
    
    const battingStats = {}
    $('table.table-with-pagination-player-stats').first().find('tr').each((i, el) => {
      const format = $(el).find('td').first().text().trim()
      const matches = $(el).find('td').eq(1).text().trim()
      const runs = $(el).find('td').eq(2).text().trim()
      const average = $(el).find('td').eq(5).text().trim()
      
      battingStats[format] = { matches, runs, average }
    })
    
    await savePlayerStats(espnId, name, country, battingStats)
    
    console.log(`Successfully scraped and saved stats for ${name}`)
  } catch (error) {
    console.error(`Error scraping player ${espnId}:`, error)
  }
}

async function savePlayerStats(espnId, name, country, stats) {
  const playerQuery = `
    INSERT INTO players (espn_id, name, country)
    VALUES ($1, $2, $3)
    ON CONFLICT (espn_id) DO UPDATE
    SET name = EXCLUDED.name, country = EXCLUDED.country
    RETURNING id;
  `
  const playerResult = await query(playerQuery, [espnId, name, country])
  const playerId = playerResult.rows[0].id

  for (const [format, formatStats] of Object.entries(stats)) {
    const statsQuery = `
      INSERT INTO player_stats (player_id, format, matches, runs, average)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (player_id, format) DO UPDATE
      SET matches = EXCLUDED.matches, runs = EXCLUDED.runs, average = EXCLUDED.average;
    `
    await query(statsQuery, [
      playerId,
      format,
      parseInt(formatStats.matches),
      parseInt(formatStats.runs),
      parseFloat(formatStats.average)
    ])
  }
}

async function runScraper() {
  console.log('Running stats update')
  const playerIds = [253802, 35320] // Add the ESPN IDs you want to scrape
  for (const id of playerIds) {
    await scrapePlayerStats(id)
  }
  console.log('Stats update completed')
}

module.exports = { scrapePlayerStats, runScraper }

