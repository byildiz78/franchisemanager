"use client"

import { Card } from "@/components/ui/card"
import { GoogleMap, LoadScript, MarkerF, CircleF, InfoWindow, Libraries, useLoadScript } from "@react-google-maps/api"
import { useEffect, useState, useCallback, useMemo } from "react"
import { MapPin, Store, Users, Target } from "lucide-react"

const containerStyle = {
    width: "100%",
    height: "700px",
}

const center = {
    lat: 39.1667,
    lng: 35.6667,
}

const libraries: Libraries = ["places"]

// Bayrak ikonları base64 formatında
const FLAG_ICONS = {
    store: "data:image/svg+xml;base64," + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path d="M8 2C7.44772 2 7 2.44772 7 3V29C7 29.5523 7.44772 30 8 30C8.55228 30 9 29.5523 9 29V3C9 2.44772 8.55228 2 8 2Z" fill="#3b82f6"/>
            <path d="M9 4H25L22 10L25 16H9V4Z" fill="#3b82f6"/>
        </svg>
    `),
    candidate: "data:image/svg+xml;base64," + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path d="M8 2C7.44772 2 7 2.44772 7 3V29C7 29.5523 7.44772 30 8 30C8.55228 30 9 29.5523 9 29V3C9 2.44772 8.55228 2 8 2Z" fill="#9333ea"/>
            <path d="M9 4H25L22 10L25 16H9V4Z" fill="#9333ea"/>
        </svg>
    `),
}

interface Location {
    id: string
    lat: number
    lng: number
    type: "store" | "candidate"
    name: string
    region?: string
    status?: string
}

const TR_BOUNDS = {
    north: 42.1,
    south: 36.0,
    west: 26.0,
    east: 45.0,
}

const regions = ["Marmara", "Ege", "Akdeniz", "İç Anadolu", "Karadeniz", "Doğu Anadolu", "Güneydoğu Anadolu"]
const statuses = ["Aktif", "Yeni Açıldı", "Hazırlık Aşamasında"]

const generateMockLocations = () => {
    const locations: Location[] = []

    for (let i = 0; i < 100; i++) {
        const { lat, lng } = getRandomLocation(TR_BOUNDS)
        locations.push({
            id: `store-${i}`,
            lat,
            lng,
            type: "store",
            name: `${regions[Math.floor(Math.random() * regions.length)]} Bölge Bayisi ${i + 1}`,
            region: regions[Math.floor(Math.random() * regions.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)]
        })
    }

    for (let i = 0; i < 10; i++) {
        const { lat, lng } = getRandomLocation(TR_BOUNDS)
        locations.push({
            id: `candidate-${i}`,
            lat,
            lng,
            type: "candidate",
            name: `${regions[Math.floor(Math.random() * regions.length)]} Bölge Aday ${i + 1}`,
            region: regions[Math.floor(Math.random() * regions.length)],
            status: "Başvuru Değerlendirmede"
        })
    }

    return locations
}

const getRandomLocation = (bounds: typeof TR_BOUNDS) => {
    const lat = bounds.south + Math.random() * (bounds.north - bounds.south)
    const lng = bounds.west + Math.random() * (bounds.east - bounds.west)
    return { lat, lng }
}

export default function BirdseyeView() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries,
    })

    const [locations, setLocations] = useState<Location[]>([])
    const [stats, setStats] = useState({
        stores: 0,
        candidates: 0,
        regions: 0
    })
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

    useEffect(() => {
        const mockData = generateMockLocations()
        setLocations(mockData)
        setStats({
            stores: mockData.filter(l => l.type === "store").length,
            candidates: mockData.filter(l => l.type === "candidate").length,
            regions: new Set(mockData.map(l => l.region)).size
        })
    }, [])

    const mapOptions = useMemo(() => ({
        styles: [
            {
                "elementType": "geometry",
                "stylers": [{"color": "#f5f5f5"}]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#616161"}]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#f5f5f5"}]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#bdbdbd"}]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#eeeeee"}]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#757575"}]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{"color": "#e5e5e5"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#757575"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{"color": "#dadada"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#616161"}]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9e9e9e"}]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{"color": "#e5e5e5"}]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{"color": "#eeeeee"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#c9c9c9"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9e9e9e"}]
            }
        ],
        restriction: {
            latLngBounds: TR_BOUNDS,
            strictBounds: false,
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: 2, // DROPDOWN_MENU
            position: 3, // RIGHT_TOP
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"]
        },
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: 3 // RIGHT_TOP
        },
        minZoom: 5,
        maxZoom: 12,
        disableDefaultUI: true,
        clickableIcons: false,
    }), [])

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[700px] bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <div className="text-muted-foreground">Harita yükleniyor...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="grid grid-cols-3 gap-6">
                <div className="group flex items-center gap-4 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Store className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.stores}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Aktif Bayi</div>
                    </div>
                </div>
                <div className="group flex items-center gap-4 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.candidates}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Bayi Adayı</div>
                    </div>
                </div>
                <div className="group flex items-center gap-4 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.regions}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Aktif Bölge</div>
                    </div>
                </div>
            </div>

            <Card className="overflow-hidden rounded-xl border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
                <div className="p-4 bg-gradient-to-r from-gray-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-900/90 border-b border-gray-200 dark:border-gray-700 flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="w-3 h-3 rounded-full bg-blue-500/20 ring-4 ring-blue-500/10" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Kapsam Alanı (20km)</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <img src={FLAG_ICONS.store} alt="Bayi" className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Mevcut Bayiler</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <img src={FLAG_ICONS.candidate} alt="Aday" className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Aday Başvuruları</span>
                    </div>
                </div>

                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={6}
                    options={mapOptions}
                >
                    {locations.map((location) => (
                        <div key={location.id}>
                            {location.type === "store" && (
                                <CircleF
                                    center={{ lat: location.lat, lng: location.lng }}
                                    radius={20000}
                                    options={{
                                        fillColor: "#3b82f6",
                                        fillOpacity: 0.12,
                                        strokeColor: "#3b82f6",
                                        strokeOpacity: 0.24,
                                        strokeWeight: 2,
                                    }}
                                />
                            )}
                            <MarkerF
                                position={{ lat: location.lat, lng: location.lng }}
                                icon={{
                                    url: FLAG_ICONS[location.type],
                                    scaledSize: { width: 32, height: 32 },
                                    anchor: { x: 8, y: 32 }
                                }}
                                onClick={() => setSelectedLocation(location)}
                            />
                        </div>
                    ))}

                    {selectedLocation && (
                        <InfoWindow
                            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                            onCloseClick={() => setSelectedLocation(null)}
                            options={{
                                pixelOffset: { width: 0, height: -32 }
                            }}
                        >
                            <div className="p-4 min-w-[240px]">
                                <div className={`text-base font-bold mb-3 ${
                                    selectedLocation.type === "store" ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"
                                }`}>
                                    {selectedLocation.name}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <MapPin className="w-4 h-4" />
                                        <span className="font-medium">{selectedLocation.region}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className={`w-2.5 h-2.5 rounded-full ${
                                            selectedLocation.status === "Aktif" ? "bg-green-500" :
                                            selectedLocation.status === "Yeni Açıldı" ? "bg-blue-500" :
                                            selectedLocation.status === "Hazırlık Aşamasında" ? "bg-yellow-500" :
                                            "bg-purple-500"
                                        }`} />
                                        <span className="font-medium text-gray-600 dark:text-gray-300">{selectedLocation.status}</span>
                                    </div>
                                </div>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </Card>
        </div>
    )
}
