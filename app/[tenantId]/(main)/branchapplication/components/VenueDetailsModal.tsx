'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

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

interface VenueDetailsModalProps {
  venueId: string
  isOpen: boolean
  onClose: () => void
}

export default function VenueDetailsModal({ venueId, isOpen, onClose }: VenueDetailsModalProps) {
  const [venue, setVenue] = useState<VenueDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!isOpen) return
      
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/foursquare/${venueId}`)
        
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

    if (venueId) {
      fetchVenueDetails()
    }
  }, [venueId, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : venue ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{venue.name}</h2>
              <Button
                asChild
                variant="outline"
                size="sm"
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

            {venue.location && (
              <p className="text-gray-600">
                {venue.location.formatted_address || venue.location.address}
                {venue.location.locality && `, ${venue.location.locality}`}
                {venue.location.postcode && ` ${venue.location.postcode}`}
              </p>
            )}

            {venue.tel && (
              <p>
                📞 {venue.tel}
              </p>
            )}

            {venue.website && (
              <p>
                🌐 <Link href={venue.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {venue.website}
                </Link>
              </p>
            )}

            {venue.rating && (
              <p>
                ⭐ {venue.rating.toFixed(1)}
              </p>
            )}

            {venue.hours?.display && (
              <p>
                🕒 {venue.hours.display}
              </p>
            )}

            {venue.description && (
              <p className="text-gray-700">
                {venue.description}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Mekan bulunamadı</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
