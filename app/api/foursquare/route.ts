import { NextResponse } from 'next/server'

const FOURSQUARE_API_KEY = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY

export async function POST(request: Request) {
  try {
    const { lat, lng, query } = await request.json()

    console.log('Gelen istek:', { lat, lng, query })

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Konum bilgisi gerekli' },
        { status: 400 }
      )
    }

    if (!FOURSQUARE_API_KEY) {
      console.error('Foursquare API anahtarı bulunamadı')
      return NextResponse.json(
        { error: 'API yapılandırma hatası' },
        { status: 500 }
      )
    }

    const searchParams = new URLSearchParams({
      ll: `${lat},${lng}`,
      radius: '3000', // 3km yarıçap
      limit: '20', // Sadece ilk 20 sonuç
      categories: '13000', // Sadece yeme-içme mekanları
      sort: 'DISTANCE', // En yakından en uzağa sırala
      fields: [
        'fsq_id',
        'name',
        'location',
        'distance',
        'categories',
        'rating',
        'photos',
        'tel',
        'website',
        'hours',
        'price',
        'description',
        'stats'
      ].join(',')
    })

    if (query) {
      searchParams.append('query', query)
    }

    const url = `https://api.foursquare.com/v3/places/search?${searchParams}`
    console.log('Foursquare API isteği URL:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': FOURSQUARE_API_KEY
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Foursquare API hatası')
    }

    const data = await response.json()

    // Her mekan için distance bilgisini ana seviyeye taşı
    const results = data.results.map((venue: any) => ({
      ...venue,
      distance: venue.distance // location.distance yerine ana seviyede distance
    }))

    return NextResponse.json({ ...data, results })

  } catch (error) {
    console.error('Foursquare API işlem hatası:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Mekanlar yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
