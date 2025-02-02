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
                padding: 8,
                callback: function(value: any) {
                    return '₺' + value.toLocaleString();
                }
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

export default function SatisDashboard() {
    return (
        <div className="space-y-6">
            {/* Metric Cards Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden p-6 bg-white hover:shadow-lg transition-all duration-200">
                    <div className="relative z-10 flex flex-col space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Toplam Franchise</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">324</span>
                            <TrendIcon trend="up" />
                        </div>
                        <span className="text-xs text-green-600">+15 son çeyrekte</span>
                    </div>
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl"></div>
                </Card>

                <Card className="relative overflow-hidden p-6 bg-white hover:shadow-lg transition-all duration-200">
                    <div className="relative z-10 flex flex-col space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Yıllık Gelir</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">₺458M</span>
                            <TrendIcon trend="up" />
                        </div>
                        <span className="text-xs text-green-600">+12.3% geçen yıla göre</span>
                    </div>
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-500/10 blur-2xl"></div>
                </Card>

                <Card className="relative overflow-hidden p-6 bg-white hover:shadow-lg transition-all duration-200">
                    <div className="relative z-10 flex flex-col space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Ortalama Gelir</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">₺1.4M</span>
                            <TrendIcon trend="up" />
                        </div>
                        <span className="text-xs text-green-600">+5.2% geçen aya göre</span>
                    </div>
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl"></div>
                </Card>

                <Card className="relative overflow-hidden p-6 bg-white hover:shadow-lg transition-all duration-200">
                    <div className="relative z-10 flex flex-col space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Büyüme Oranı</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">18.5%</span>
                            <TrendIcon trend="up" />
                        </div>
                        <span className="text-xs text-green-600">+2.1% geçen çeyreğe göre</span>
                    </div>
                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl"></div>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2 overflow-hidden bg-white hover:shadow-lg transition-all duration-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Aylık Satış Trendi</h3>
                        <div className="aspect-[2/1]">
                            <Line
                                data={{
                                    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
                                    datasets: [
                                        {
                                            label: 'Satışlar',
                                            data: [32, 35, 40, 38, 42, 45],
                                            borderColor: 'rgb(59, 130, 246)',
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                        <h3 className="text-lg font-semibold mb-4">Bölgesel Dağılım</h3>
                        <div className="aspect-square">
                            <Bar
                                data={{
                                    labels: ['Marmara', 'İç Anadolu', 'Ege', 'Akdeniz', 'Karadeniz', 'Diğer'],
                                    datasets: [{
                                        label: 'Franchise Sayısı',
                                        data: [120, 85, 65, 45, 25, 15],
                                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                        borderRadius: 8
                                    }]
                                }}
                                options={{
                                    ...chartOptions,
                                    indexAxis: 'y' as const
                                }}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Lokasyon Tipi</h3>
                        <div className="aspect-square">
                            <Doughnut
                                data={{
                                    labels: ['AVM', 'Cadde', 'Plaza', 'Diğer'],
                                    datasets: [{
                                        data: [45, 35, 15, 5],
                                        backgroundColor: [
                                            'rgba(59, 130, 246, 0.8)',
                                            'rgba(16, 185, 129, 0.8)',
                                            'rgba(245, 158, 11, 0.8)',
                                            'rgba(99, 102, 241, 0.8)'
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
                        <h3 className="text-lg font-semibold mb-4">Ortalama Sipariş Değeri Trendi</h3>
                        <div className="aspect-[2/1]">
                            <Line
                                data={{
                                    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
                                    datasets: [{
                                        label: 'Ortalama Sipariş',
                                        data: [85, 88, 92, 90, 95, 98],
                                        borderColor: 'rgb(16, 185, 129)',
                                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                        tension: 0.3,
                                        fill: true
                                    }]
                                }}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Franchise Performans</h3>
                        <div className="aspect-square">
                            <Doughnut
                                data={{
                                    labels: ['Üstün', 'İyi', 'Orta', 'Gelişmesi Gerek'],
                                    datasets: [{
                                        data: [30, 45, 20, 5],
                                        backgroundColor: [
                                            'rgba(16, 185, 129, 0.8)',
                                            'rgba(59, 130, 246, 0.8)',
                                            'rgba(245, 158, 11, 0.8)',
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
                        <h3 className="text-lg font-semibold mb-4">Menü Kategorisi Satış Dağılımı</h3>
                        <div className="aspect-[2/1]">
                            <Bar
                                data={{
                                    labels: ['Ana Yemek', 'İçecek', 'Tatlı', 'Başlangıç', 'Ekstra'],
                                    datasets: [{
                                        label: 'Satış Yüzdesi',
                                        data: [45, 25, 15, 10, 5],
                                        backgroundColor: [
                                            'rgba(59, 130, 246, 0.8)',
                                            'rgba(16, 185, 129, 0.8)',
                                            'rgba(245, 158, 11, 0.8)',
                                            'rgba(99, 102, 241, 0.8)',
                                            'rgba(236, 72, 153, 0.8)'
                                        ],
                                        borderRadius: 8
                                    }]
                                }}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
