"use client"

import { useEffect } from "react"
import { useOnboardingStore } from "@/stores/onboarding-store"
import { mockOnboardings, mockTasks } from "./mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, Plus, Search } from "lucide-react"
import { cn, formatDateTime } from "@/lib/utils"
import { statusOptions, priorityOptions, statusMap } from "./onboarding-types"
import { useState } from "react"

export default function OnboardingPage() {
    const { onboardings, setOnboardings, setTasks } = useOnboardingStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Mock verileri yükle
    useEffect(() => {
        console.log('Mock veriler yükleniyor:', { mockOnboardings, mockTasks })
        if (mockOnboardings && mockTasks) {
            setOnboardings(mockOnboardings)
            setTasks(mockTasks)
        }
    }, [setOnboardings, setTasks, mockOnboardings, mockTasks])

    // Debug için mevcut state'i kontrol et
    useEffect(() => {
        console.log('Mevcut onboardings:', onboardings)
    }, [onboardings])

    const filteredOnboardings = onboardings?.filter(onboarding => {
        if (!onboarding) return false;
        
        const matchesSearch =
            (onboarding?.branchName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (onboarding?.projectManager?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (onboarding?.branchManager?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || onboarding?.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || onboarding?.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    }) || [];

    console.log('Filtered onboardings:', filteredOnboardings)

    const totalOnboardings = filteredOnboardings.length;
    const totalPages = Math.ceil(totalOnboardings / itemsPerPage);
    const paginatedOnboardings = filteredOnboardings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1))
    }

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1))
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'not_started':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500'
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500'
            case 'training':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500'
            case 'setup':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
            case 'final_review':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500'
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500'
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Bayi Onboarding Yönetimi
                    </h2>
                    <p className="text-[0.925rem] text-muted-foreground">
                        Bayi onboarding süreçlerini yönetin ve takip edin
                    </p>
                </div>
                <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all duration-200 hover:scale-[1.02]"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Onboarding
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-100/50 dark:border-blue-900/20 shadow-lg shadow-blue-500/5">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Şube veya yetkili ara..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-[180px]">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Durum seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full md:w-[180px]">
                                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Öncelik seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorityOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Onboarding Table */}
            <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 border-2 border-blue-100/50 dark:border-blue-900/20 shadow-xl shadow-blue-500/5">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Şube</TableHead>
                            <TableHead>Proje Yöneticisi</TableHead>
                            <TableHead>Şube Yöneticisi</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>İlerleme</TableHead>
                            <TableHead>Öncelik</TableHead>
                            <TableHead>Hedef Tarih</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedOnboardings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4">
                                    Henüz onboarding süreci bulunmamaktadır.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedOnboardings.map((onboarding) => (
                                <TableRow key={onboarding.id}>
                                    <TableCell className="font-medium">
                                        {onboarding.branchName}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{onboarding.projectManager.name}</span>
                                            <span className="text-sm text-muted-foreground">{onboarding.projectManager.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{onboarding.branchManager.name}</span>
                                            <span className="text-sm text-muted-foreground">{onboarding.branchManager.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn("font-medium", getStatusColor(onboarding.status))}>
                                            {statusMap[onboarding.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <Progress value={onboarding.progress} className="h-2" />
                                            <span className="text-sm text-muted-foreground">%{onboarding.progress}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn("font-medium", getPriorityColor(onboarding.priority))}>
                                            {onboarding.priority === "high" ? "Yüksek" : onboarding.priority === "medium" ? "Orta" : "Düşük"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{formatDateTime(onboarding.targetCompletionDate)}</span>
                                            <span className="text-sm text-muted-foreground">
                                                Son güncelleme: {formatDateTime(onboarding.lastUpdated)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Önceki
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Sonraki
                    </Button>
                </div>
            )}
        </div>
    )
}
