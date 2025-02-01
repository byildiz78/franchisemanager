"use client"

import { useState } from "react"
import { useRentalStore } from "@/stores/rental-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { propertyTypeOptions, RentalActivity } from "../rental-types"
import { ArrowLeft, Save, FileText, DollarSign, Building2, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RentalFileUploadCard } from "./RentalFileUploadCard"
import { RentalTimelineCard } from "./RentalTimelineCard"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RentalCreateFormProps {
  onBack: () => void
}

export default function RentalCreateForm({ onBack }: RentalCreateFormProps) {
  const { addRental, addActivity, activities } = useRentalStore()
  const [currentRentalId] = useState(1) // Temporary ID for demo
  const [files, setFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    rentalNumber: "",
    BranchID: "",
    propertyType: "",
    startDate: "",
    endDate: "",
    monthlyRent: "",
    depositAmount: "",
    utilityCharges: "",
    maintenanceFee: "",
    propertyAddress: "",
    propertySize: "",
    parkingSpaces: "",
    renewalTerms: "",
    terminationTerms: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/rental', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          Status: "draft"
        }),
      })

      if (!response.ok) throw new Error('Failed to create rental')
      
      const data = await response.json()
      addRental(data)
      onBack()
    } catch (error) {
      console.error('Error creating rental:', error)
    }
  }

  const [newActivity, setNewActivity] = useState<{
    type: RentalActivity["type"],
    description: string
  }>({
    type: "comment",
    description: "",
  })

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles])
  }

  const handleFileRemove = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName))
  }

  const handleAddActivity = () => {
    if (!newActivity.description) return
    addActivity(currentRentalId, {
      type: newActivity.type,
      description: newActivity.description,
      createdBy: 1,
      createdByName: "Test User",
      createdAt: new Date().toISOString(),
      rentalId: currentRentalId
    })
    setNewActivity({
      type: "comment",
      description: ""
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none px-4">
          <TabsTrigger value="form">Kiralama Formu</TabsTrigger>
          <TabsTrigger value="activities">Aktiviteler</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <ScrollArea className="h-[calc(100vh-260px)] px-4 overflow-y-auto">
            <div className="space-y-6 pb-24">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">Yeni Kiralama Oluştur</h2>
                  <p className="text-muted-foreground">
                    Yeni bir kiralama kaydı oluşturun
                  </p>
                </div>
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri Dön
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Temel Bilgiler */}
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 p-8 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900/50 backdrop-blur-sm border-2 border-blue-100/50 dark:border-blue-900/20 shadow-lg shadow-blue-100/30 dark:shadow-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shadow-inner transform group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-200">
                        Temel Bilgiler
                      </h3>
                      <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                        Kiralama temel bilgileri
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rentalNumber">Kiralama Numarası</Label>
                      <Input
                        id="rentalNumber"
                        value={formData.rentalNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, rentalNumber: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Mülk Tipi</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Mülk tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Bitiş Tarihi</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </Card>

                {/* Finansal Bilgiler */}
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 p-8 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-900/50 backdrop-blur-sm border-2 border-emerald-100/50 dark:border-emerald-900/20 shadow-lg shadow-emerald-100/30 dark:shadow-emerald-900/20 rounded-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shadow-inner transform group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200">
                        Finansal Bilgiler
                      </h3>
                      <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                        Kira ve ödeme detayları
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent">Aylık Kira</Label>
                      <Input
                        id="monthlyRent"
                        type="number"
                        value={formData.monthlyRent}
                        onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="depositAmount">Depozito</Label>
                      <Input
                        id="depositAmount"
                        type="number"
                        value={formData.depositAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, depositAmount: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="utilityCharges">Aidat</Label>
                      <Input
                        id="utilityCharges"
                        type="number"
                        value={formData.utilityCharges}
                        onChange={(e) => setFormData(prev => ({ ...prev, utilityCharges: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maintenanceFee">Bakım Ücreti</Label>
                      <Input
                        id="maintenanceFee"
                        type="number"
                        value={formData.maintenanceFee}
                        onChange={(e) => setFormData(prev => ({ ...prev, maintenanceFee: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </Card>

                {/* Mülk Detayları */}
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 p-8 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900/50 backdrop-blur-sm border-2 border-purple-100/50 dark:border-purple-900/20 shadow-lg shadow-purple-100/30 dark:shadow-purple-900/20 rounded-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shadow-inner transform group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900 dark:from-purple-400 dark:to-purple-200">
                        Mülk Detayları
                      </h3>
                      <p className="text-sm text-purple-600/80 dark:text-purple-400/80">
                        Mülk özellikleri ve koşulları
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyAddress">Adres</Label>
                      <Textarea
                        id="propertyAddress"
                        value={formData.propertyAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, propertyAddress: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="propertySize">Alan (m2)</Label>
                        <Input
                          id="propertySize"
                          type="number"
                          value={formData.propertySize}
                          onChange={(e) => setFormData(prev => ({ ...prev, propertySize: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parkingSpaces">Otopark Alanı</Label>
                        <Input
                          id="parkingSpaces"
                          type="number"
                          value={formData.parkingSpaces}
                          onChange={(e) => setFormData(prev => ({ ...prev, parkingSpaces: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="renewalTerms">Yenileme Koşulları</Label>
                      <Textarea
                        id="renewalTerms"
                        value={formData.renewalTerms}
                        onChange={(e) => setFormData(prev => ({ ...prev, renewalTerms: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terminationTerms">Fesih Koşulları</Label>
                      <Textarea
                        id="terminationTerms"
                        value={formData.terminationTerms}
                        onChange={(e) => setFormData(prev => ({ ...prev, terminationTerms: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </Card>

                <RentalFileUploadCard
                  files={files}
                  onFilesChange={handleFilesChange}
                  onFileRemove={handleFileRemove}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Kiralama Oluştur
                  </Button>
                </div>
              </form>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="activities" className="px-4 mt-4">
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Yeni Aktivite Ekle</h3>
              </div>
              <div className="space-y-4">
                <Select
                  value={newActivity.type}
                  onValueChange={(value: "comment" | "payment" | "file_upload" | "other") => 
                    setNewActivity(prev => ({...prev, type: value}))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Aktivite tipi seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comment">Yorum</SelectItem>
                    <SelectItem value="payment">Ödeme</SelectItem>
                    <SelectItem value="file_upload">Dosya</SelectItem>
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity(prev => ({...prev, description: e.target.value}))}
                  placeholder="Aktivite açıklaması..."
                />
                <Button onClick={handleAddActivity}>
                  Aktivite Ekle
                </Button>
              </div>
            </Card>
            <RentalTimelineCard activities={activities[currentRentalId] || []} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
