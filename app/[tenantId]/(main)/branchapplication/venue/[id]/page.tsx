'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'

interface VenueDetails {
  name: string
  location: {
    address?: string
    formatted_address?: string
    locality?: string
    postcode?: string
  }
  tel?: string
  website?: string
  rating?: number
  hours?: {
    display?: string
  }
  description?: string
  fsq_id: string
}

export default function VenuePage() {
  const [venue, setVenue] = useState<VenueDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/foursquare/${params.id}`)
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Mekan detayları alınamadı')
        }

        const data = await response.json()
        setVenue(data)
      } catch (err) {
        console.error('Mekan detayları yüklenirken hata:', err)
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchVenueDetails()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mt-4" role="alert">
        <span className="block sm:inline">Mekan bulunamadı</span>
      </div>
    )
  }

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
          
          <Button
            asChild
            className="flex items-center gap-2"
          >
            <a
              href={`https://foursquare.com/v/${venue.fsq_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Foursquare&apos;de Görüntüle
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-4">
          {venue.name}
        </h1>

        {venue.location && (
          <p className="text-gray-600 mb-4">
            {venue.location.formatted_address || venue.location.address}
            {venue.location.locality && `, ${venue.location.locality}`}
            {venue.location.postcode && ` ${venue.location.postcode}`}
          </p>
        )}

        {venue.tel && (
          <p className="mb-3">
            📞 {venue.tel}
          </p>
        )}

        {venue.website && (
          <p className="mb-3">
            🌐 <Link href={venue.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {venue.website}
            </Link>
          </p>
        )}

        {venue.rating && (
          <p className="mb-3">
            ⭐ {venue.rating.toFixed(1)}
          </p>
        )}

        {venue.hours?.display && (
          <p className="mb-3">
            🕒 {venue.hours.display}
          </p>
        )}

        {venue.description && (
          <p className="text-gray-700">
            {venue.description}
          </p>
        )}
      </div>
    </Card>
  )
}
