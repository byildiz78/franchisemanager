"use client"

import { useState } from "react"
import { useSupplierContractStore } from "@/stores/supplier-contract-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supplierTypeOptions, ContractActivity } from "../supplier-contract-types"
import { ArrowLeft, Save, FileText, DollarSign, ScrollText, Truck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContractFileUploadCard } from "./SupplierContractFileUploadCard"
import { ContractTimelineCard } from "./SupplierContractTimelineCard"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SupplierContractCreateFormProps {
  onBack: () => void
}

export default function SupplierContractCreateForm({ onBack }: SupplierContractCreateFormProps) {
  const { addContract } = useSupplierContractStore()
  const [currentContractId] = useState(1) // Temporary ID for demo
  const [files, setFiles] = useState<File[]>([])
  const [activities, setActivities] = useState<ContractActivity[]>([])
  const [formData, setFormData] = useState({
    contractNumber: "",
    SupplierID: "",
    supplierType: "",
    startDate: "",
    endDate: "",
    paymentTerms: "",
    deliveryTerms: "",
    minimumOrderQuantity: "",
    priceAdjustmentTerms: "",
    qualityStandards: "",
    exclusivityTerms: "",
    monthlyOrderTarget: "",
    penaltyTerms: "",
    territory: "",
    renewalTerms: "",
    terminationTerms: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/supplier-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          Status: "draft"
        }),
      })

      if (!response.ok) throw new Error('Failed to create supplier contract')
      
      const data = await response.json()
      addContract(data)
      onBack()
    } catch (error) {
      console.error('Error creating supplier contract:', error)
    }
  }

  const [newActivity, setNewActivity] = useState<{
    type: ContractActivity["type"],
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
    const activity: ContractActivity = {
      id: activities.length + 1,
      type: newActivity.type,
      description: newActivity.description,
      createdBy: 1,
      createdByName: "Test User",
      createdAt: new Date().toISOString(),
      contractId: currentContractId
    }
    setActivities([...activities, activity])
    setNewActivity({
      type: "comment",
      description: ""
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none px-4">
          <TabsTrigger value="form">Sözleşme Formu</TabsTrigger>
          <TabsTrigger value="activities">Aktiviteler</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <ScrollArea className="h-[calc(100vh-260px)] px-4 overflow-y-auto">
            <div className="space-y-6 pb-24">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">Yeni Tedarikçi Sözleşmesi Oluştur</h2>
                  <p className="text-muted-foreground">
                    Yeni bir tedarikçi sözleşmesi oluşturun
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
                      <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-200">
                        Temel Bilgiler
                      </h3>
                      <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                        Sözleşme temel bilgileri
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contractNumber">Sözleşme Numarası</Label>
                      <Input
                        id="contractNumber"
                        value={formData.contractNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, contractNumber: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supplierType">Tedarikçi Tipi</Label>
                      <Select
                        value={formData.supplierType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, supplierType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tedarikçi tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {supplierTypeOptions.map((option) => (
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
                        Ödeme ve teslimat detayları
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms">Ödeme Koşulları</Label>
                      <Textarea
                        id="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minimumOrderQuantity">Minimum Sipariş Miktarı</Label>
                      <Input
                        id="minimumOrderQuantity"
                        type="number"
                        value={formData.minimumOrderQuantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, minimumOrderQuantity: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyOrderTarget">Aylık Hedef Sipariş</Label>
                      <Input
                        id="monthlyOrderTarget"
                        type="number"
                        value={formData.monthlyOrderTarget}
                        onChange={(e) => setFormData(prev => ({ ...prev, monthlyOrderTarget: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priceAdjustmentTerms">Fiyat Güncelleme Koşulları</Label>
                      <Textarea
                        id="priceAdjustmentTerms"
                        value={formData.priceAdjustmentTerms}
                        onChange={(e) => setFormData(prev => ({ ...prev, priceAdjustmentTerms: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="penaltyTerms">Ceza Koşulları</Label>
                      <Textarea
                        id="penaltyTerms"
                        value={formData.penaltyTerms}
                        onChange={(e) => setFormData(prev => ({ ...prev, penaltyTerms: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </Card>

                {/* Sözleşme Koşulları */}
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 p-8 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900/50 backdrop-blur-sm border-2 border-purple-100/50 dark:border-purple-900/20 shadow-lg shadow-purple-100/30 dark:shadow-purple-900/20 rounded-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shadow-inner transform group-hover:scale-110 transition-transform duration-300">
                      <ScrollText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900 dark:from-purple-400 dark:to-purple-200">
                        Sözleşme Koşulları
                      </h3>
                      <p className="text-sm text-purple-600/80 dark:text-purple-400/80">
                        Sözleşme şartları ve koşulları
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="territory">Bölge</Label>
                      <Input
                        id="territory"
                        value={formData.territory}
                        onChange={(e) => setFormData(prev => ({ ...prev, territory: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryTerms">Teslimat Koşulları</Label>
                      <Textarea
                        id="deliveryTerms"
                        value={formData.deliveryTerms}
                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qualityStandards">Kalite Standartları</Label>
                      <Textarea
                        id="qualityStandards"
                        value={formData.qualityStandards}
                        onChange={(e) => setFormData(prev => ({ ...prev, qualityStandards: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exclusivityTerms">Münhasırlık Koşulları</Label>
                      <Textarea
                        id="exclusivityTerms"
                        value={formData.exclusivityTerms}
                        onChange={(e) => setFormData(prev => ({ ...prev, exclusivityTerms: e.target.value }))}
                        required
                      />
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

                <ContractFileUploadCard
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
                    Sözleşme Oluştur
                  </Button>
                </div>
              </form>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="activities" className="px-4 mt-4">
          <div className="space-y-4">
            <ContractTimelineCard
              activities={activities.filter(a => a.contractId === currentContractId)}
              newActivity={newActivity}
              setNewActivity={setNewActivity}
              onAddActivity={handleAddActivity}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
