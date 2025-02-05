'use client'

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { MapPin, Store, Users, Target } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import FoursquareCard from "../../branchapplication/components/FoursquareCard"
import dynamic from 'next/dynamic'
import type { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// MapComponent'i dinamik olarak import et
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="text-muted-foreground">Harita yükleniyor...</div>
      </div>
    </div>
  )
})

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  type: 'store' | 'candidate'
  region: string
  status: string
}

// Türkiye'nin büyük şehirlerinin merkez koordinatları
const CITIES = [
  // Marmara Bölgesi
  { name: 'İstanbul', lat: 41.0082, lng: 28.9784, region: 'Marmara', center: 'Taksim' },
  { name: 'Bursa', lat: 40.1824, lng: 29.0670, region: 'Marmara', center: 'Osmangazi' },
  { name: 'Edirne', lat: 41.6771, lng: 26.5557, region: 'Marmara', center: 'Kaleiçi' },
  { name: 'Tekirdağ', lat: 40.9781, lng: 27.5177, region: 'Marmara', center: 'Süleymanpaşa' },
  { name: 'Çanakkale', lat: 40.1553, lng: 26.4142, region: 'Marmara', center: 'Merkez' },
  
  // Ege Bölgesi
  { name: 'İzmir', lat: 38.4192, lng: 27.1287, region: 'Ege', center: 'Konak' },
  { name: 'Muğla', lat: 37.2154, lng: 28.3636, region: 'Ege', center: 'Menteşe' },
  { name: 'Aydın', lat: 37.8440, lng: 27.8450, region: 'Ege', center: 'Efeler' },
  { name: 'Denizli', lat: 37.7830, lng: 29.0963, region: 'Ege', center: 'Merkezefendi' },
  { name: 'Manisa', lat: 38.6191, lng: 27.4289, region: 'Ege', center: 'Şehzadeler' },
  
  // Akdeniz Bölgesi
  { name: 'Antalya', lat: 36.8841, lng: 30.7056, region: 'Akdeniz', center: 'Muratpaşa' },
  { name: 'Mersin', lat: 36.8121, lng: 34.6415, region: 'Akdeniz', center: 'Yenişehir' },
  { name: 'Adana', lat: 37.0000, lng: 35.3213, region: 'Akdeniz', center: 'Seyhan' },
  { name: 'Hatay', lat: 36.2023, lng: 36.1613, region: 'Akdeniz', center: 'Antakya' },
  { name: 'Isparta', lat: 37.7648, lng: 30.5566, region: 'Akdeniz', center: 'Merkez' },

  // İç Anadolu Bölgesi
  { name: 'Ankara', lat: 39.9334, lng: 32.8597, region: 'İç Anadolu', center: 'Kızılay' },
  { name: 'Konya', lat: 37.8714, lng: 32.4846, region: 'İç Anadolu', center: 'Selçuklu' },
  { name: 'Kayseri', lat: 38.7205, lng: 35.4826, region: 'İç Anadolu', center: 'Melikgazi' },
  { name: 'Eskişehir', lat: 39.7767, lng: 30.5206, region: 'İç Anadolu', center: 'Tepebaşı' },
  { name: 'Sivas', lat: 39.7477, lng: 37.0179, region: 'İç Anadolu', center: 'Merkez' },

  // Karadeniz Bölgesi
  { name: 'Samsun', lat: 41.2867, lng: 36.3300, region: 'Karadeniz', center: 'İlkadım' },
  { name: 'Trabzon', lat: 41.0027, lng: 39.7168, region: 'Karadeniz', center: 'Ortahisar' },
  { name: 'Rize', lat: 41.0201, lng: 40.5234, region: 'Karadeniz', center: 'Merkez' },
  { name: 'Ordu', lat: 40.9862, lng: 37.8797, region: 'Karadeniz', center: 'Altınordu' },
  { name: 'Giresun', lat: 40.9128, lng: 38.3895, region: 'Karadeniz', center: 'Merkez' },

  // Doğu Anadolu Bölgesi
  { name: 'Erzurum', lat: 39.9055, lng: 41.2658, region: 'Doğu Anadolu', center: 'Yakutiye' },
  { name: 'Van', lat: 38.4891, lng: 43.4089, region: 'Doğu Anadolu', center: 'İpekyolu' },
  { name: 'Malatya', lat: 38.3554, lng: 38.3335, region: 'Doğu Anadolu', center: 'Yeşilyurt' },
  { name: 'Elazığ', lat: 38.6810, lng: 39.2264, region: 'Doğu Anadolu', center: 'Merkez' },
  { name: 'Kars', lat: 40.6013, lng: 43.0975, region: 'Doğu Anadolu', center: 'Merkez' },

  // Güneydoğu Anadolu Bölgesi
  { name: 'Gaziantep', lat: 37.0662, lng: 37.3833, region: 'Güneydoğu Anadolu', center: 'Şahinbey' },
  { name: 'Diyarbakır', lat: 37.9144, lng: 40.2306, region: 'Güneydoğu Anadolu', center: 'Bağlar' },
  { name: 'Şanlıurfa', lat: 37.1674, lng: 38.7955, region: 'Güneydoğu Anadolu', center: 'Haliliye' },
  { name: 'Mardin', lat: 37.3212, lng: 40.7245, region: 'Güneydoğu Anadolu', center: 'Artuklu' },
  { name: 'Batman', lat: 37.8812, lng: 41.1351, region: 'Güneydoğu Anadolu', center: 'Merkez' }
]

const statuses = ['Aktif', 'Yeni Açıldı', 'Hazırlık Aşamasında']

export default function BirdseyeView() {
  const [locations, setLocations] = useState<Location[]>([])
  const [stats, setStats] = useState({
    stores: 0,
    candidates: 0,
    regions: 0
  })
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showFoursquareDetails, setShowFoursquareDetails] = useState(false)
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([39.1667, 35.6667]) // Türkiye merkezi

  useEffect(() => {
    const mockData = generateMockLocations()
    setLocations(mockData.locations)
    setStats(mockData.stats)
  }, [])

  // Rastgele koordinat oluşturma fonksiyonu
  const getRandomCoordinate = (baseLat: number, baseLng: number, radius: number = 0.05) => {
    // Şehir merkezinden en fazla 5km uzaklıkta olacak şekilde
    const randomLat = baseLat + (Math.random() - 0.5) * radius
    const randomLng = baseLng + (Math.random() - 0.5) * radius
    return { lat: randomLat, lng: randomLng }
  }

  // Mock veri oluşturma fonksiyonu
  const generateMockLocations = () => {
    const mockLocations: Location[] = []
    const usedCities = new Set<string>()

    // Her bölgeden en az bir şube olmasını sağla
    const regions = Array.from(new Set(CITIES.map(city => city.region)))
    regions.forEach(region => {
      const citiesInRegion = CITIES.filter(city => city.region === region)
      const city = citiesInRegion[Math.floor(Math.random() * citiesInRegion.length)]
      const coords = getRandomCoordinate(city.lat, city.lng)
      mockLocations.push({
        id: `store-${mockLocations.length}`,
        name: `${city.name} ${city.center} Şubesi`,
        lat: coords.lat,
        lng: coords.lng,
        type: 'store',
        region: city.region,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      })
      usedCities.add(city.name)
    })

    // Kalan şubeleri rastgele dağıt
    for (let i = mockLocations.length; i < 100; i++) {
      let city
      do {
        city = CITIES[Math.floor(Math.random() * CITIES.length)]
      } while (usedCities.has(city.name) && usedCities.size < CITIES.length)
      
      const coords = getRandomCoordinate(city.lat, city.lng)
      mockLocations.push({
        id: `store-${i}`,
        name: `${city.name} ${city.center} Şubesi`,
        lat: coords.lat,
        lng: coords.lng,
        type: 'store',
        region: city.region,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      })
      usedCities.add(city.name)
    }

    // 10 adayı farklı bölgelere dağıt
    for (let i = 0; i < 10; i++) {
      const region = regions[i % regions.length]
      const citiesInRegion = CITIES.filter(city => city.region === region)
      const city = citiesInRegion[Math.floor(Math.random() * citiesInRegion.length)]
      const coords = getRandomCoordinate(city.lat, city.lng, 0.08) // Adaylar için biraz daha geniş yarıçap
      
      mockLocations.push({
        id: `candidate-${i}`,
        name: `${city.name} ${city.center} Aday`,
        lat: coords.lat,
        lng: coords.lng,
        type: 'candidate',
        region: city.region,
        status: 'Başvuru Değerlendirmede'
      })
    }

    const stats = {
      stores: mockLocations.filter(l => l.type === 'store').length,
      candidates: mockLocations.filter(l => l.type === 'candidate').length,
      regions: new Set(mockLocations.map(l => l.region)).size
    }

    return { locations: mockLocations, stats }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Şubeler</span>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.stores}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Adaylar</span>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.candidates}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Bölgeler</span>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.regions}</div>
        </Card>
      </div>

      <Card className="h-[600px] relative">
        <MapComponent
          locations={locations}
          mapCenter={mapCenter}
          onLocationSelect={(location) => {
            setSelectedLocation(location)
            setMapCenter([location.lat, location.lng])
          }}
          onShowDetails={() => setShowFoursquareDetails(true)}
        />
      </Card>

      {/* Foursquare Detay Modalı */}
      <Dialog open={showFoursquareDetails} onOpenChange={setShowFoursquareDetails}>
        <DialogContent className="max-w-[95vw] lg:max-w-[1200px] h-[90vh] p-0">
          {selectedLocation && (
            <div className="h-full">
              <FoursquareCard
                location={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng
                }}
                searchQuery={selectedLocation.name}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
