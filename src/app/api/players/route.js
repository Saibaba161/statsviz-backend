import { NextResponse } from 'next/server'
import { searchPlayers, getPlayerStats, comparePlayerStats } from '@/lib/playerController'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const id = searchParams.get('id')
  const player1 = searchParams.get('player1')
  const player2 = searchParams.get('player2')
  const format = searchParams.get('format')

  try {
    if (name) {
      const players = await searchPlayers(name)
      return NextResponse.json(players)
    }

    if (id) {
      const stats = await getPlayerStats(id)
      return NextResponse.json(stats)
    }

    if (player1 && player2 && format) {
      const comparison = await comparePlayerStats(player1, player2, format)
      return NextResponse.json(comparison)
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

