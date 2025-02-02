"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from 'next/dynamic'
import { Card } from "@/components/ui/card"
import { ChartBar, Users, TrendingUp } from "lucide-react"

// Dinamik import ile component'leri yükleyelim
const AdaylarDashboard = dynamic(() => import('./components/AdaylarDashboard'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20"></div>
                <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
        </div>
    )
})

const SatisDashboard = dynamic(() => import('./components/SatisDashboard'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20"></div>
                <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
        </div>
    )
})

const TahminDashboard = dynamic(() => import('./components/TahminDashboard'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20"></div>
                <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
        </div>
    )
})

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
            <div className="flex-none p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Data Analiz
                        </h2>
                        <p className="text-muted-foreground">
                            Bayi ve aday başvuru analizleri
                        </p>
                    </div>
                </div>

                <Card className="overflow-hidden border-none shadow-md bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                    <Tabs defaultValue="adaylar" className="h-[calc(100vh-12rem)]">
                        <div className="border-b bg-white/50">
                            <TabsList className="h-16 w-full justify-start gap-2 rounded-none border-b px-4 py-2">
                                <TabsTrigger 
                                    value="adaylar" 
                                    className="relative h-11 rounded-md px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow transition-all duration-200"
                                >
                                    <span className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>Adaylar</span>
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="satis"
                                    className="relative h-11 rounded-md px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow transition-all duration-200"
                                >
                                    <span className="flex items-center gap-2">
                                        <ChartBar className="w-4 h-4" />
                                        <span>Satış</span>
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="tahmin"
                                    className="relative h-11 rounded-md px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow transition-all duration-200"
                                >
                                    <span className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>Tahmin</span>
                                    </span>
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <TabsContent 
                                value="adaylar" 
                                className="h-[calc(100vh-16rem)] overflow-y-auto px-4 pb-8 pt-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
                            >
                                <AdaylarDashboard />
                            </TabsContent>
                            <TabsContent 
                                value="satis" 
                                className="h-[calc(100vh-16rem)] overflow-y-auto px-4 pb-8 pt-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
                            >
                                <SatisDashboard />
                            </TabsContent>
                            <TabsContent 
                                value="tahmin" 
                                className="h-[calc(100vh-16rem)] overflow-y-auto px-4 pb-8 pt-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
                            >
                                <TahminDashboard />
                            </TabsContent>
                        </div>
                    </Tabs>
                </Card>
            </div>
        </div>
    )
}
