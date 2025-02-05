'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import { MapPin } from 'lucide-react'
import type { LatLngTuple } from 'leaflet'

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  type: 'store' | 'candidate'
  region: string
  status: string
}

interface MapComponentProps {
  locations: Location[]
  mapCenter: LatLngTuple
  onLocationSelect: (location: Location) => void
  onShowDetails: () => void
}

// Harita merkezini ve sınırları güncelleyen bileşen
function MapUpdater({ center, locations }: { center: LatLngTuple, locations: Location[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (locations.length > 0) {
      // Tüm konumları içeren sınırları hesapla
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]))
      map.fitBounds(bounds)
    } else {
      map.setView(center, map.getZoom())
    }
  }, [center, locations, map])
  
  return null
}

const MAP_LAYERS = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
}

export default function MapComponent({ locations, mapCenter, onLocationSelect, onShowDetails }: MapComponentProps) {
  useEffect(() => {
    // Leaflet marker ikonlarını client-side'da ayarla
    const DefaultIcon = L.icon({
      iconUrl: '/images/marker-icon.png',
      iconRetinaUrl: '/images/marker-icon-2x.png',
      shadowUrl: '/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
    L.Marker.prototype.options.icon = DefaultIcon
  }, [])

  return (
    <MapContainer
      center={mapCenter}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      minZoom={5}
      maxZoom={18}
    >
      <MapUpdater center={mapCenter} locations={locations} />
      
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution={MAP_LAYERS.osm.attribution}
            url={MAP_LAYERS.osm.url}
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="Uydu Görünümü">
          <TileLayer
            attribution={MAP_LAYERS.satellite.attribution}
            url={MAP_LAYERS.satellite.url}
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="Topoğrafik">
          <TileLayer
            attribution={MAP_LAYERS.terrain.attribution}
            url={MAP_LAYERS.terrain.url}
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="Koyu Tema">
          <TileLayer
            attribution={MAP_LAYERS.dark.attribution}
            url={MAP_LAYERS.dark.url}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      
      {locations.map((location) => (
        <div key={location.id}>
          <Marker
            position={[location.lat, location.lng]}
            eventHandlers={{
              click: () => onLocationSelect(location)
            }}
            icon={L.divIcon({
              className: 'relative',
              html: `
                <div class="absolute -top-8 -left-2">
                  <div class="relative">
                    <div class="absolute top-0 left-0 w-1 h-8 bg-gray-800"></div>
                    <div class="${
                      location.type === 'store' ? 'bg-blue-500' : 'bg-purple-500'
                    } w-6 h-4 ml-1 shadow-md relative">
                      <div class="absolute inset-0 flex items-center justify-center">
                        <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                          ${location.type === 'store' 
                            ? '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z"/>' // Şube ikonu
                            : '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>' // Aday ikonu
                          }
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              `,
              iconSize: [24, 32],
              iconAnchor: [12, 32]
            })}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className={`text-base font-bold mb-2 ${
                  location.type === 'store' ? 'text-blue-600' : 'text-purple-600'
                }`}>
                  {location.name}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{location.region}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      location.status === 'Aktif' ? 'bg-green-500' :
                      location.status === 'Yeni Açıldı' ? 'bg-blue-500' :
                      location.status === 'Hazırlık Aşamasında' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`} />
                    <span>{location.status}</span>
                  </div>
                  <button
                    onClick={onShowDetails}
                    className="w-full mt-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Yakındaki Mekanları Göster
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
          {location.type === 'store' && (
            <Circle
              center={[location.lat, location.lng]}
              radius={2000}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1
              }}
            />
          )}
        </div>
      ))}
    </MapContainer>
  )
}
