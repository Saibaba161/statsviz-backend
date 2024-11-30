require('dotenv').config({ path: '.env.local' })
const { initDatabase } = require('../src/app/lib/db')

async function main() {
  await initDatabase()
  process.exit(0)
}

main().catch(error => {
  console.error('Error initializing database:', error)
  process.exit(1)
})

