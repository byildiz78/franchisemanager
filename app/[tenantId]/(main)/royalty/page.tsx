"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRoyaltyStore } from "@/stores/royalty-store"
import { Royalty, RoyaltyStatus, getStatusBadgeVariant } from "./royalty-types"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { EnhancedDataTable } from "./components/enhanced-data-table"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RoyaltyCreateForm from "./components/RoyaltyCreateForm"
import { RoyaltyTimelineCard } from "./components/RoyaltyTimelineCard"

const mockRoyalties: Royalty[] = [
  {
    id: "1",
    franchiseId: "F1",
    franchiseName: "Merkez Şube",
    period: "2025-01",
    franchiseType: "standard",
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
    period: "2025-01",
    franchiseType: "premium",
    salesAmount: 200000,
    royaltyRate: 0.05,
    royaltyAmount: 10000,
    status: "pending",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    createdByName: "Sistem",
  }
]

export default function RoyaltyPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRoyalty, setSelectedRoyalty] = useState<Royalty | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { royalties, setRoyalties, activities } = useRoyaltyStore()

  useEffect(() => {
    const fetchRoyalties = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/royalty')
        if (!response.ok) throw new Error('Failed to fetch royalties')
        const data = await response.json()
        setRoyalties(data.length > 0 ? data : mockRoyalties)
      } catch (error) {
        console.error('Error fetching royalties:', error)
        setRoyalties(mockRoyalties)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoyalties()
  }, [setRoyalties])

  const filteredRoyalties = useMemo(() => {
    return royalties.filter(royalty => {
      const matchesSearch = 
        royalty.franchiseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        royalty.franchiseName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || royalty.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [royalties, searchTerm, statusFilter]);

  if (showCreateForm) {
    return <RoyaltyCreateForm onBack={() => setShowCreateForm(false)} />
  }

  const columns = [
    {
      accessorKey: "franchiseId",
      header: "Bayi No",
    },
    {
      accessorKey: "franchiseName",
      header: "Bayi Adı",
    },
    {
      accessorKey: "period",
      header: "Dönem",
      cell: ({ row }) => {
        const [year, month] = row.original.period.split("-")
        return `${year} ${new Date(0, parseInt(month) - 1).toLocaleString('tr-TR', { month: 'long' })}`
      }
    },
    {
      accessorKey: "franchiseType",
      header: "Bayi Tipi",
      cell: ({ row }) => {
        const types = {
          standard: "Standart Bayi",
          premium: "Premium Bayi",
          express: "Express Bayi"
        }
        return types[row.original.franchiseType as keyof typeof types] || row.original.franchiseType
      }
    },
    {
      accessorKey: "salesAmount",
      header: "Satış Tutarı",
      cell: ({ row }) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
          .format(row.original.salesAmount)
      }
    },
    {
      accessorKey: "royaltyAmount",
      header: "Royalty Tutarı",
      cell: ({ row }) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })
          .format(row.original.royaltyAmount)
      }
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => {
        return (
          <Badge variant={getStatusBadgeVariant(row.original.status as RoyaltyStatus)}>
            {row.original.status === "pending" ? "Bekliyor" :
             row.original.status === "paid" ? "Ödendi" :
             row.original.status === "overdue" ? "Gecikmiş" : row.original.status}
          </Badge>
        )
      }
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma Tarihi",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleString('tr-TR')
      }
    }
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Royalty Yönetimi</h2>
          <p className="text-muted-foreground">
            Bayilerin royalty ödemelerini takip edin ve yönetin
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Yeni Royalty
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Bayi ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-full md:w-[180px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Durum Filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="pending">Bekleyen</SelectItem>
                  <SelectItem value="paid">Ödenen</SelectItem>
                  <SelectItem value="overdue">Gecikmiş</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <Card className="md:col-span-5">
            <EnhancedDataTable
              columns={columns}
              data={filteredRoyalties}
              onRowClick={setSelectedRoyalty}
              isLoading={isLoading}
            />
          </Card>
          <Card className="md:col-span-2">
            <RoyaltyTimelineCard
              activities={selectedRoyalty ? activities.filter(a => a.royaltyId === selectedRoyalty.id) : []}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
