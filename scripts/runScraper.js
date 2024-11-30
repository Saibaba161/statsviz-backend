require('dotenv').config({ path: '.env.local' })
const { runScraper } = require('../src/app/lib/scraper')

async function main() {
  await runScraper()
  process.exit(0)
}

main().catch(error => {
  console.error('Error running scraper:', error)
  process.exit(1)
})

