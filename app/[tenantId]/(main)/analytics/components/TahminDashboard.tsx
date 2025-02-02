"use client"

import { Card } from "@/components/ui/card"
import { Bar, Line, Doughnut } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement,
} from "chart.js"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom" as const,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: "rgba(0, 0, 0, 0.1)",
            },
        },
        x: {
            grid: {
                color: "rgba(0, 0, 0, 0.1)",
            },
        },
    },
}

const TrendIcon = ({ trend }: { trend: string }) => {
    switch (trend) {
        case "up":
            return <TrendingUp className="w-4 h-4 text-green-500" />
        case "down":
            return <TrendingDown className="w-4 h-4 text-red-500" />
        default:
            return <Minus className="w-4 h-4 text-gray-500" />
    }
}

export default function TahminDashboard() {
    // Özet metrikler
    const metrics = [
        { label: "Tahmini Yıllık Ciro", value: "185M", trend: "up", description: "₺, 2024 sonu" },
        { label: "Büyüme Tahmini", value: "%30", trend: "up", description: "Yıllık büyüme" },
        { label: "Yeni Franchise", value: "25", trend: "up", description: "2024 hedefi" },
        { label: "Ortalama Satış", value: "2.1M", trend: "up", description: "₺/bayi/yıl" },
    ]

    // Yıllık büyüme tahmini
    const buyumeData = {
        labels: ["2022", "2023", "2024", "2025", "2026"],
        datasets: [
            {
                label: "Gerçekleşen",
                data: [85, 142, null, null, null],
                borderColor: "rgba(59, 130, 246, 0.8)",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Tahmin",
                data: [null, null, 185, 240, 312],
                borderColor: "rgba(245, 158, 11, 0.8)",
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                borderDash: [5, 5],
                fill: true,
                tension: 0.4,
            }
        ],
    }

    // Bölgesel genişleme hedefleri
    const bolgeHedefData = {
        labels: ["Marmara", "İç Anadolu", "Ege", "Akdeniz", "Karadeniz", "Doğu Anadolu", "G.Doğu Anadolu"],
        datasets: [
            {
                label: "Mevcut",
                data: [32, 18, 14, 10, 6, 3, 2],
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderRadius: 6,
            },
            {
                label: "Hedef",
                data: [45, 25, 20, 15, 10, 8, 5],
                backgroundColor: "rgba(245, 158, 11, 0.8)",
                borderRadius: 6,
            }
        ],
    }

    // Yeni lokasyon türü hedefleri
    const lokasyonHedefData = {
        labels: ["AVM", "Cadde Mağazası", "Plaza", "Üniversite Kampüsü", "Diğer"],
        datasets: [{
            data: [40, 30, 15, 10, 5],
            backgroundColor: [
                "rgba(59, 130, 246, 0.8)",  // mavi
                "rgba(16, 185, 129, 0.8)",  // yeşil
                "rgba(245, 158, 11, 0.8)",  // turuncu
                "rgba(99, 102, 241, 0.8)",  // indigo
                "rgba(236, 72, 153, 0.8)",  // pembe
            ],
        }],
    }

    // Yatırım geri dönüş süresi
    const yatirimData = {
        labels: ["6-12 Ay", "12-18 Ay", "18-24 Ay", "24+ Ay"],
        datasets: [{
            label: "Franchise Sayısı",
            data: [15, 45, 30, 10],
            backgroundColor: [
                "rgba(16, 185, 129, 0.8)",  // yeşil
                "rgba(59, 130, 246, 0.8)",  // mavi
                "rgba(245, 158, 11, 0.8)",  // turuncu
                "rgba(236, 72, 153, 0.8)",  // pembe
            ],
        }],
    }

    // Aylık ciro tahmini
    const ciroTahminData = {
        labels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
        datasets: [
            {
                label: "2024 Tahmini (Milyon ₺)",
                data: [13.5, 14.2, 14.8, 15.3, 15.9, 16.4, 16.9, 17.5, 18.1, 18.7, 19.3, 20.0],
                borderColor: "rgba(245, 158, 11, 0.8)",
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                fill: true,
                tension: 0.4,
            }
        ],
    }

    // Potansiyel pazar büyüklüğü
    const pazarData = {
        labels: ["Mevcut Pazar", "Ulaşılabilir Pazar", "Hedef Pazar"],
        datasets: [{
            label: "Milyar ₺",
            data: [1.2, 3.5, 0.8],
            backgroundColor: [
                "rgba(59, 130, 246, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(245, 158, 11, 0.8)",
            ],
            borderRadius: 6,
        }],
    }

    return (
        <div className="space-y-6">
            {/* Özet Metrikler */}
            <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
                {metrics.map((metric, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-2xl font-bold text-primary">{metric.value}</div>
                            <TrendIcon trend={metric.trend} />
                        </div>
                        <div className="text-sm font-medium">{metric.label}</div>
                        <div className="text-sm text-muted-foreground mt-1">{metric.description}</div>
                    </Card>
                ))}
            </div>

            {/* Ana Grafikler */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {/* Yıllık Büyüme Tahmini */}
                <Card className="p-6 hover:shadow-lg transition-shadow col-span-2">
                    <h3 className="text-lg font-semibold mb-6">Yıllık Büyüme Tahmini</h3>
                    <Line
                        data={buyumeData}
                        options={{
                            ...chartOptions,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: "rgba(0, 0, 0, 0.1)",
                                    },
                                    title: {
                                        display: true,
                                        text: "Milyon ₺",
                                    },
                                },
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                },
                            },
                        }}
                    />
                </Card>

                {/* Bölgesel Genişleme */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-6">Bölgesel Genişleme Hedefleri</h3>
                    <Bar
                        data={bolgeHedefData}
                        options={{
                            ...chartOptions,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: "rgba(0, 0, 0, 0.1)",
                                    },
                                    title: {
                                        display: true,
                                        text: "Franchise Sayısı",
                                    },
                                },
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                },
                            },
                        }}
                    />
                </Card>

                {/* Lokasyon Hedefleri */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-6">Yeni Lokasyon Hedefleri</h3>
                    <div className="aspect-square">
                        <Doughnut
                            data={lokasyonHedefData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "bottom" as const,
                                    },
                                },
                            }}
                        />
                    </div>
                </Card>

                {/* Yatırım Geri Dönüş */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold mb-6">Yatırım Geri Dönüş Süresi</h3>
                    <div className="aspect-square">
                        <Doughnut
                            data={yatirimData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "bottom" as const,
                                    },
                                },
                            }}
                        />
                    </div>
                </Card>

                {/* Aylık Ciro Tahmini */}
                <Card className="p-6 hover:shadow-lg transition-shadow col-span-2">
                    <h3 className="text-lg font-semibold mb-6">2024 Aylık Ciro Tahmini</h3>
                    <Line
                        data={ciroTahminData}
                        options={{
                            ...chartOptions,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: "rgba(0, 0, 0, 0.1)",
                                    },
                                    title: {
                                        display: true,
                                        text: "Milyon ₺",
                                    },
                                },
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                },
                            },
                        }}
                    />
                </Card>

                {/* Pazar Büyüklüğü */}
                <Card className="p-6 hover:shadow-lg transition-shadow col-span-2">
                    <h3 className="text-lg font-semibold mb-6">Potansiyel Pazar Büyüklüğü</h3>
                    <Bar
                        data={pazarData}
                        options={{
                            ...chartOptions,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: "rgba(0, 0, 0, 0.1)",
                                    },
                                    title: {
                                        display: true,
                                        text: "Milyar ₺",
                                    },
                                },
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                },
                            },
                        }}
                    />
                </Card>
            </div>
        </div>
    )
}
