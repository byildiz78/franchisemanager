"use client"

import { Card } from "@/components/ui/card"
import { Bar, Doughnut, Line } from "react-chartjs-2"
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
            labels: {
                padding: 20,
                font: {
                    size: 12,
                    family: "'Inter', sans-serif"
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
                size: 14,
                family: "'Inter', sans-serif"
            },
            bodyFont: {
                size: 13,
                family: "'Inter', sans-serif"
            },
            cornerRadius: 8
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: "rgba(0, 0, 0, 0.06)",
                drawBorder: false
            },
            ticks: {
                font: {
                    size: 12,
                    family: "'Inter', sans-serif"
                },
                padding: 8
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                font: {
                    size: 12,
                    family: "'Inter', sans-serif"
                },
                padding: 8
            }
        },
    },
    animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
    }
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

export default function AdaylarDashboard() {
    return (
        <div className="space-y-6">
            {/* Metric Cards Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden p-6 bg-white hover:shadow-lg transition-all duration-200">
                    <div className="relative z-10 flex flex-col space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Toplam Başvuru</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">1,234</span>
                            <TrendIcon trend="up" />
                        </div>
                        <span className="text-xs text-green-600">+12.5% geçen aya göre</span>
                    </div>
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl"></div>
                </Card>
                
                <Card className="relative overflow-hidden p-6 bg-white hover:shadow-lg transition-all duration-200">
                    <div className="relative z-10 flex flex-col space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Bu Ay Başvuru</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">156</span>
                            <TrendIcon trend="up" />
                        </div>
                        <span className="text-xs text-green-600">+8.2% geçen haftaya göre</span>
                    </div>
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl"></div>
                </Card>

                <Card className="relative overflow-hidden p-6 bg-white hover:shadow-lg transition-all duration-200">
                    <div className="relative z-10 flex flex-col space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Aktif Görüşme</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">45</span>
                            <TrendIcon trend="down" />
                        </div>
                        <span className="text-xs text-red-600">-3.1% geçen haftaya göre</span>
                    </div>
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-red-500/10 blur-2xl"></div>
                </Card>

                <Card className="relative overflow-hidden p-6 bg-white hover:shadow-lg transition-all duration-200">
                    <div className="relative z-10 flex flex-col space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Ortalama Yatırım</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">₺2.5M</span>
                            <TrendIcon trend="neutral" />
                        </div>
                        <span className="text-xs text-gray-600">Değişim yok</span>
                    </div>
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gray-500/10 blur-2xl"></div>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2 overflow-hidden bg-white hover:shadow-lg transition-all duration-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Aylık Başvuru Trendi</h3>
                        <div className="aspect-[2/1]">
                            <Line
                                data={{
                                    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
                                    datasets: [
                                        {
                                            label: 'Başvurular',
                                            data: [65, 78, 90, 85, 95, 110],
                                            borderColor: 'rgb(99, 102, 241)',
                                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                            tension: 0.3,
                                            fill: true
                                        }
                                    ]
                                }}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Başvuru Durumu</h3>
                        <div className="aspect-square">
                            <Doughnut
                                data={{
                                    labels: ['Değerlendirmede', 'Görüşme', 'Onaylandı', 'Reddedildi'],
                                    datasets: [{
                                        data: [35, 25, 20, 20],
                                        backgroundColor: [
                                            'rgba(99, 102, 241, 0.8)',
                                            'rgba(59, 130, 246, 0.8)',
                                            'rgba(16, 185, 129, 0.8)',
                                            'rgba(239, 68, 68, 0.8)'
                                        ],
                                        borderWidth: 0
                                    }]
                                }}
                                options={{
                                    ...chartOptions,
                                    cutout: '65%'
                                }}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="col-span-2 overflow-hidden bg-white hover:shadow-lg transition-all duration-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Şehir Dağılımı</h3>
                        <div className="aspect-[2/1]">
                            <Bar
                                data={{
                                    labels: ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana'],
                                    datasets: [{
                                        label: 'Başvurular',
                                        data: [45, 32, 28, 21, 19, 15],
                                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                                        borderRadius: 8
                                    }]
                                }}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Başvuru Kaynağı</h3>
                        <div className="aspect-square">
                            <Doughnut
                                data={{
                                    labels: ['Web Sitesi', 'Sosyal Medya', 'Referans', 'Diğer'],
                                    datasets: [{
                                        data: [40, 30, 20, 10],
                                        backgroundColor: [
                                            'rgba(99, 102, 241, 0.8)',
                                            'rgba(59, 130, 246, 0.8)',
                                            'rgba(16, 185, 129, 0.8)',
                                            'rgba(239, 68, 68, 0.8)'
                                        ],
                                        borderWidth: 0
                                    }]
                                }}
                                options={{
                                    ...chartOptions,
                                    cutout: '65%'
                                }}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
