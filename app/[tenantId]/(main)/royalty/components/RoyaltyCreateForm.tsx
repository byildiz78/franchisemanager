"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/toast/use-toast"
import { Loader2, ArrowLeft, Calendar, Building2, Database, CheckCircle2 } from "lucide-react"
import { useRoyaltyStore } from "@/stores/royalty-store"
import { Steps } from "@/components/ui/steps"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface RoyaltyCreateFormProps {
  onBack: () => void
}

export default function RoyaltyCreateForm({ onBack }: RoyaltyCreateFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [selectedFranchiseType, setSelectedFranchiseType] = useState("")
  const { toast } = useToast()
  const addRoyalty = useRoyaltyStore((state) => state.addRoyalty)

  const periods = [
    { value: "2025-01", label: "Ocak 2025" },
    { value: "2025-02", label: "Şubat 2025" },
    { value: "2025-03", label: "Mart 2025" },
  ]

  const franchiseTypes = [
    { value: "standard", label: "Standart Bayi", description: "Temel hizmetler ve standart royalty oranları" },
    { value: "premium", label: "Premium Bayi", description: "Gelişmiş hizmetler ve özel avantajlar" },
    { value: "express", label: "Express Bayi", description: "Hızlı servis odaklı küçük lokasyonlar" },
  ]

  const steps = [
    { 
      title: "Dönem Seçimi",
      description: "Royalty dönemi seçin",
      icon: Calendar
    },
    { 
      title: "Bayi Tipi",
      description: "Bayi tipini seçin",
      icon: Building2
    },
    { 
      title: "Veri Çekme",
      description: "RobotPOS verilerini çek",
      icon: Database
    },
  ]

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleCreateRoyalties()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const handleCreateRoyalties = async () => {
    setLoading(true)
    try {
      // Simüle edilmiş RobotPOS veri çekme ve royalty hesaplama
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock royalty verileri
      const mockRoyalties = [
        {
          id: "1",
          franchiseId: "F1",
          franchiseName: "Merkez Şube",
          period: selectedPeriod,
          franchiseType: selectedFranchiseType,
          salesAmount: 150000,
          royaltyRate: 0.05,
          royaltyAmount: 7500,
          status: "pending",
          createdAt: new Date().toISOString(),
          createdBy: "system",
          createdByName: "Sistem",
        },
        {
          id: "2",
          franchiseId: "F2",
          franchiseName: "Kadıköy Şube",
          period: selectedPeriod,
          franchiseType: selectedFranchiseType,
          salesAmount: 200000,
          royaltyRate: 0.05,
          royaltyAmount: 10000,
          status: "pending",
          createdAt: new Date().toISOString(),
          createdBy: "system",
          createdByName: "Sistem",
        },
      ]

      mockRoyalties.forEach(royalty => {
        addRoyalty(royalty)
      })

      toast({
        title: "Royalty Kayıtları Oluşturuldu",
        description: `${mockRoyalties.length} adet royalty kaydı başarıyla oluşturuldu.`,
      })

      onBack()
    } catch (error) {
      toast({
        title: "Hata",
        description: "Royalty kayıtları oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    const StepIcon = steps[currentStep - 1].icon

    return (
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-8"
              >
                <StepIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                {currentStep === 1 && (
                  <div className="w-full max-w-sm mx-auto space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold">Dönem Seçimi</h3>
                      <p className="text-sm text-muted-foreground">
                        Royalty hesaplaması yapılacak dönemi seçin
                      </p>
                    </div>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Dönem seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="w-full max-w-2xl mx-auto space-y-6 px-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold">Bayi Tipi Seçimi</h3>
                      <p className="text-sm text-muted-foreground">
                        Royalty hesaplaması yapılacak bayi tipini seçin
                      </p>
                    </div>
                    <div className="grid gap-4">
                      {franchiseTypes.map((type, idx) => (
                        <motion.div
                          key={type.value}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + idx * 0.1 }}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all cursor-pointer",
                            "hover:border-blue-400 dark:hover:border-blue-500",
                            selectedFranchiseType === type.value
                              ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-800"
                          )}
                          onClick={() => setSelectedFranchiseType(type.value)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{type.label}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {type.description}
                              </p>
                            </div>
                            {selectedFranchiseType === type.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                              >
                                <CheckCircle2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="w-full max-w-md mx-auto space-y-6 px-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold">RobotPOS Veri Entegrasyonu</h3>
                      <p className="text-sm text-muted-foreground">
                        Seçilen dönem ve bayi tipi için RobotPOS'tan satış verilerini çekerek royalty hesaplamaları yapılacaktır.
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Seçilen Dönem:</span>
                          <span className="font-medium">{periods.find(p => p.value === selectedPeriod)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Bayi Tipi:</span>
                          <span className="font-medium">{franchiseTypes.find(t => t.value === selectedFranchiseType)?.label}</span>
                        </div>
                        <div className="pt-4">
                          <p className="text-sm text-center text-muted-foreground">
                            "Royalty Oluştur" butonuna tıklayarak seçili kriterlere göre royalty hesaplamalarını başlatabilirsiniz.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !selectedPeriod
      case 2:
        return !selectedFranchiseType
      default:
        return false
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-9 flex items-center justify-center"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Yeni Royalty Oluştur
            </h2>
          </div>
          <p className="text-[0.925rem] text-muted-foreground">
            Yeni bir royalty kaydı oluşturun
          </p>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <div className="p-6">
          <div className="mb-20">
            <Steps
              steps={steps}
              currentStep={currentStep}
              onStepClick={(step) => !loading && setCurrentStep(step)}
            />
          </div>

          <div className="min-h-[400px] relative">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={loading}
            >
              {currentStep === 1 ? "İptal" : "Geri"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={isNextDisabled() || loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === steps.length ? "Royalty Oluştur" : "İleri"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
