const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

async function testConnection() {
  try {
    await client.connect()
    console.log('Successfully connected to PostgreSQL')
    const result = await client.query('SELECT current_database()')
    console.log('Current database:', result.rows[0].current_database)
    await client.end()
  } catch (err) {
    console.error('Connection error:', err)
  }
}

testConnection()
