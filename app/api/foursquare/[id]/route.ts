import { NextResponse } from 'next/server'

const FOURSQUARE_API_KEY = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!FOURSQUARE_API_KEY) {
      return NextResponse.json(
        { error: 'API yapılandırma hatası' },
        { status: 500 }
      )
    }

    const url = `https://api.foursquare.com/v3/places/${params.id}`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': FOURSQUARE_API_KEY
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Mekan detayları alınamadı')
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Foursquare API hatası:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Mekan detayları alınamadı' },
      { status: 500 }
    )
  }
}
