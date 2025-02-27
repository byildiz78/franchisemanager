'use client'

import { useEffect, useState, useRef, useCallback, memo } from 'react'
import { Card } from '@/components/ui/card'
import { MapPin, Phone, Clock, Star, Image, ExternalLink, Calendar, MessageCircle } from 'lucide-react'
import NextImage from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLoadScript } from '@react-google-maps/api'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const libraries: ("places" | "geometry")[] = ["places", "geometry"]

interface Location {
  lat: number
  lng: number
}

interface PlacePhoto {
  photo_reference: string
  width: number
  height: number
}

interface Place {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  user_ratings_total?: number
  formatted_phone_number?: string
  opening_hours?: {
    open_now?: boolean
    weekday_text?: string[]
  }
  photos?: PlacePhoto[]
  price_level?: number
  types: string[]
  distance?: number
  reviews?: {
    author_name: string
    rating: number
    relative_time_description: string
    text: string
  }[]
}

interface Props {
  location: Location
}

const MAX_CACHE_SIZE = 50
const MAX_RESULTS = 10
const PHOTO_MAX_WIDTH = 400
const PHOTO_MAX_HEIGHT = 300

// Temel alanlar ve detay alanlarını ayır
const BASIC_FIELDS = [
  'formatted_phone_number',
  'opening_hours',
  'price_level'
]

const REVIEW_FIELDS = ['reviews']

// Mekan tiplerini Türkçe'ye çeviren fonksiyon
const getPlaceTypeInTurkish = (types: string[]) => {
  const typeMap: { [key: string]: string } = {
    'restaurant': 'Restoran',
    'cafe': 'Kafe',
    'bar': 'Bar',
    'food': 'Yemek',
    'bakery': 'Fırın',
    'meal_takeaway': 'Paket Servis',
    'meal_delivery': 'Yemek Teslimatı',
    'store': 'Mağaza',
    'establishment': 'İşletme',
    'point_of_interest': 'İlgi Noktası',
    'supermarket': 'Market',
    'grocery_or_supermarket': 'Market',
    'shopping_mall': 'AVM',
    'clothing_store': 'Giyim Mağazası',
    'furniture_store': 'Mobilya Mağazası',
    'home_goods_store': 'Ev Eşyaları',
    'electronics_store': 'Elektronik Mağazası'
  }

  for (const type of types) {
    if (typeMap[type]) return typeMap[type]
  }
  return 'İşletme'
}

const PlaceCard = memo(({ 
  place, 
  onSelect, 
  onOpenMaps,
  isExpanded,
  onLoadDetails 
}: { 
  place: Place
  onSelect: (placeId: string) => void
  onOpenMaps: (place: Place) => void
  isExpanded: boolean
  onLoadDetails: (placeId: string) => void
}) => (
  <Card 
    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" 
    onClick={() => {
      onSelect(place.place_id)
      if (!isExpanded) {
        onLoadDetails(place.place_id)
      }
    }}
  >
    {/* Mekan Fotoğrafı */}
    <div className="relative h-48 bg-gray-100">
      {place.photos?.[0]?.photo_reference ? (
        <div className="relative w-full h-full">
          <img
            src={place.photos[0].photo_reference}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image className="w-12 h-12 text-gray-400" />
        </div>
      )}
      
      {/* Google Maps Butonu */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
        onClick={(e) => {
          e.stopPropagation()
          onOpenMaps(place)
        }}
      >
        <ExternalLink className="h-4 w-4 mr-1" />
        Google Maps'te Aç
      </Button>
    </div>

    {/* Mekan Bilgileri */}
    <div className="p-4">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-semibold line-clamp-2">
          {place.name}
        </h3>
        <Badge variant="secondary" className="shrink-0">
          {place.distance ? `${(place.distance / 1000).toFixed(1)} km` : 'Mesafe bilgisi yok'}
        </Badge>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        <div className="flex items-center gap-1 mb-1">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-2">
            {place.vicinity}
          </span>
        </div>

        {place.formatted_phone_number && (
          <div className="flex items-center gap-1 mb-1">
            <Phone className="h-4 w-4" />
            <a href={`tel:${place.formatted_phone_number}`} className="hover:text-blue-600">
              {place.formatted_phone_number}
            </a>
          </div>
        )}

        {place.opening_hours?.weekday_text ? (
          <div className="flex items-start gap-1 mb-2">
            <Clock className="h-4 w-4 mt-1 shrink-0" />
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                {place.opening_hours.weekday_text.map((day, index) => {
                  const [dayName, hours] = day.split(': ')
                  const isToday = new Date().getDay() === (index + 1) % 7
                  return (
                    <div 
                      key={index} 
                      className={`flex justify-between gap-2 py-0.5 px-1.5 rounded ${isToday ? 'bg-blue-50' : ''}`}
                    >
                      <span className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                        {dayName.slice(0, 3)}:
                      </span>
                      <span className={isToday ? 'text-blue-600' : 'text-gray-900'}>
                        {hours}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : place.opening_hours?.open_now !== undefined && (
          <div className="flex items-center gap-1 mb-1">
            <Clock className="h-4 w-4" />
            <span className={place.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}>
              {place.opening_hours.open_now ? 'Açık' : 'Kapalı'}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        {place.rating && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {place.rating.toFixed(1)}
            {place.user_ratings_total && (
              <span className="text-xs ml-1">({place.user_ratings_total})</span>
            )}
          </Badge>
        )}
        
        {place.price_level && (
          <Badge variant="outline">
            {'₺'.repeat(place.price_level)}
          </Badge>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="outline" className="text-xs">
          {getPlaceTypeInTurkish(place.types)}
        </Badge>
      </div>

      <Accordion 
        type="single" 
        collapsible 
        className="mt-4"
        value={isExpanded ? "reviews" : undefined}
      >
        {/* Yorumlar */}
        {isExpanded && place.reviews && place.reviews.length > 0 && (
          <AccordionItem value="reviews">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Yorumlar ({place.reviews.length})
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {place.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-2 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{review.author_name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{review.text}</p>
                    <span className="text-xs text-gray-500">{review.relative_time_description}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  </Card>
))

PlaceCard.displayName = 'PlaceCard'

export default function FoursquareCard({ location }: Props) {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [expandedPlace, setExpandedPlace] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const serviceRef = useRef<google.maps.places.PlacesService | null>(null)
  const detailsCache = useRef<Map<string, Place>>(new Map())

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries
  })

  const addToCache = useCallback((placeId: string, place: Place) => {
    if (detailsCache.current.size >= MAX_CACHE_SIZE) {
      const firstKey = detailsCache.current.keys().next().value
      detailsCache.current.delete(firstKey)
    }
    detailsCache.current.set(placeId, place)
  }, [])

  const getOptimizedPhotoUrl = useCallback((photo: PlacePhoto) => {
    return photo.photo_reference
      .replace(/=w\d+/, `=w${PHOTO_MAX_WIDTH}`)
      .replace(/=h\d+/, `=h${PHOTO_MAX_HEIGHT}`)
  }, [])

  const fetchNearbyPlaces = useCallback(async () => {
    if (!isLoaded || !location.lat || !location.lng || !serviceRef.current) return

    setLoading(true)
    setError(null)

    try {
      const service = serviceRef.current
      
      const request = {
        location: new google.maps.LatLng(location.lat, location.lng),
        type: 'restaurant',
        rankBy: google.maps.places.RankBy.DISTANCE
      }

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const topResults = results.slice(0, MAX_RESULTS)
          
          const basicPlaces = topResults.map(place => ({
            place_id: place.place_id || '',
            name: place.name || '',
            vicinity: place.vicinity || '',
            types: place.types || [],
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            photos: place.photos ? [{
              photo_reference: getOptimizedPhotoUrl({
                photo_reference: place.photos[0].getUrl(),
                width: place.photos[0].width || PHOTO_MAX_WIDTH,
                height: place.photos[0].height || PHOTO_MAX_HEIGHT
              }),
              width: PHOTO_MAX_WIDTH,
              height: PHOTO_MAX_HEIGHT
            }] : undefined,
            distance: google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(location.lat, location.lng),
              new google.maps.LatLng(
                place.geometry?.location?.lat() || 0,
                place.geometry?.location?.lng() || 0
              )
            )
          }))

          setPlaces(basicPlaces)
          setLoading(false)

          // Sadece temel bilgileri yükle
          topResults.forEach((place, index) => {
            if (!place.place_id || detailsCache.current.has(place.place_id)) return

            setTimeout(() => {
              service.getDetails(
                {
                  placeId: place.place_id,
                  fields: BASIC_FIELDS
                },
                (placeDetails, detailStatus) => {
                  if (detailStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                    const detailedPlace = {
                      ...basicPlaces[index],
                      formatted_phone_number: placeDetails.formatted_phone_number,
                      opening_hours: placeDetails.opening_hours,
                      price_level: placeDetails.price_level
                    }

                    addToCache(place.place_id, detailedPlace)
                    setPlaces(prev => prev.map(p => 
                      p.place_id === place.place_id ? detailedPlace : p
                    ))
                  }
                }
              )
            }, index * 200)
          })
        } else {
          setError('Mekanlar yüklenirken bir hata oluştu')
          setLoading(false)
        }
      })
    } catch (err) {
      console.error('Places API error:', err)
      setError('Mekanlar yüklenirken bir hata oluştu')
      setLoading(false)
    }
  }, [location, isLoaded, getOptimizedPhotoUrl, addToCache])

  useEffect(() => {
    if (isLoaded && mapRef.current && !serviceRef.current) {
      const mapDiv = mapRef.current
      const map = new google.maps.Map(mapDiv, {
        center: { lat: location.lat, lng: location.lng },
        zoom: 15
      })
      serviceRef.current = new google.maps.places.PlacesService(map)
    }
  }, [isLoaded, location])

  useEffect(() => {
    fetchNearbyPlaces()
  }, [fetchNearbyPlaces])

  // Yorumları sadece istendiğinde yükle
  const loadPlaceDetails = useCallback((placeId: string) => {
    if (!serviceRef.current || !placeId) return

    // Cache'de review varsa tekrar yükleme
    const cachedPlace = detailsCache.current.get(placeId)
    if (cachedPlace?.reviews) return

    const service = serviceRef.current
    service.getDetails(
      {
        placeId,
        fields: REVIEW_FIELDS
      },
      (placeDetails, detailStatus) => {
        if (detailStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
          const existingPlace = detailsCache.current.get(placeId) || {}
          const updatedPlace = {
            ...existingPlace,
            reviews: placeDetails.reviews || []
          }

          addToCache(placeId, updatedPlace)
          setPlaces(prev => prev.map(p => 
            p.place_id === placeId ? { ...p, ...updatedPlace } : p
          ))
        }
      }
    )
  }, [addToCache])

  const openInGoogleMaps = (place: Place) => {
    const searchQuery = `${place.name}, ${place.vicinity}`.replace(/ /g, '+')
    const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
    window.open(url, '_blank')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] overflow-hidden">
      <div ref={mapRef} className="hidden" style={{ width: '100%', height: '100px' }} />

      {!isLoaded ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <>
          <div className="flex-none p-4 border-b">
            <h2 className="text-lg font-semibold">Yakındaki Mekanlar</h2>
            {places.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {places.length} mekan bulundu
              </p>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="p-4">
                {loading && (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                )}

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                {!loading && !error && places.length === 0 && (
                  <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">Yakında mekan bulunamadı</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {places.map((place) => (
                    <PlaceCard
                      key={place.place_id}
                      place={place}
                      onSelect={setSelectedPlaceId}
                      onOpenMaps={openInGoogleMaps}
                      isExpanded={expandedPlace === place.place_id}
                      onLoadDetails={(placeId) => {
                        setExpandedPlace(placeId)
                        loadPlaceDetails(placeId)
                      }}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  )
}
