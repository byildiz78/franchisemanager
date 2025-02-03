"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useSupplierContractStore } from "@/stores/supplier-contract-store"
import { SupplierContract } from "./supplier-contract-types"
import { Card } from "@/components/ui/card"
import { EnhancedDataTable } from "./components/enhanced-data-table"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from "next/navigation"

import SupplierContractCreateForm from "./components/SupplierContractCreateForm"

const mockContracts: SupplierContract[] = [
  {
    id: 1,
    contractNumber: "SUP-2024-001",
    SupplierName: "ABC Gıda Ltd. Şti.",
    Status: "active",
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    supplierType: "food_supplier",
    paymentTerms: "30 gün vadeli",
    deliveryTerms: "Haftalık teslimat",
    minimumOrderQuantity: 1000,
    priceAdjustmentTerms: "3 ayda bir güncelleme",
    qualityStandards: "ISO 22000, HACCP",
    exclusivityTerms: "Münhasır tedarikçi",
    Created_at: "2024-01-01",
    UpdatedAt: "2024-01-01",
    Created_by_id: 1,
    CreatedUserName: "Admin",
    Assigned_to_id: 1,
    Assigned_to_Name: "Manager"
  },
  {
    id: 2,
    contractNumber: "SUP-2024-002",
    SupplierName: "XYZ İçecek A.Ş.",
    Status: "pending_approval",
    startDate: "2024-02-01",
    endDate: "2025-02-01",
    supplierType: "beverage_supplier",
    paymentTerms: "45 gün vadeli",
    deliveryTerms: "2 haftada bir teslimat",
    minimumOrderQuantity: 500,
    priceAdjustmentTerms: "6 ayda bir güncelleme",
    qualityStandards: "ISO 9001",
    exclusivityTerms: "Bölgesel münhasırlık",
    Created_at: "2024-01-15",
    UpdatedAt: "2024-01-15",
    Created_by_id: 1,
    CreatedUserName: "Admin",
    Assigned_to_id: 2,
    Assigned_to_Name: "Supervisor"
  }
];

export default function SupplierContractPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()
  const tenantId = params?.tenantId
  const { contracts, setContracts } = useSupplierContractStore()

  // Initialize with mock data
  useEffect(() => {
    setContracts(mockContracts)
  }, [setContracts])

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = 
        contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.SupplierName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || contract.Status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  if (showCreateForm) {
    return <SupplierContractCreateForm onBack={() => setShowCreateForm(false)} />
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-2 pt-2 h-[calc(85vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Tedarikçi Sözleşme Yönetimi
          </h2>
          <p className="text-[0.925rem] text-muted-foreground">
            Tedarikçi sözleşmelerini yönetin ve takip edin
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all duration-200 hover:scale-[1.02]"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Sözleşme
        </Button>
      </div>

      {/*search and filter*/}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-100/50 dark:border-blue-900/20 shadow-lg shadow-blue-500/5">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Sözleşme ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 dark:bg-gray-800/80 border-2 border-blue-100 dark:border-blue-900/30 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white/80 dark:bg-gray-800/80 border-2 border-blue-100 dark:border-blue-900/30 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Durum Filtrele" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="draft">Taslak</SelectItem>
                    <SelectItem value="pending_approval">Onay Bekliyor</SelectItem>
                    <SelectItem value="approved">Onaylandı</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="terminated">Feshedildi</SelectItem>
                    <SelectItem value="expired">Süresi Doldu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex-1 overflow-hidden rounded-xl">
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 h-full flex flex-col">
          <EnhancedDataTable
            data={filteredContracts}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </div>
  )
}
