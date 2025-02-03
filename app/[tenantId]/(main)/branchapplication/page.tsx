
'use client'

import { useEffect, useState } from "react"
import { useFilterStore } from "@/stores/filters-store"
import { useTabStore } from '@/stores/tab-store'
import { useBranchApplicationStore } from "@/stores/branch-application-store"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, Eye, FileText, Filter, Plus, Search, Star, Store, Tag, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn, formatDateTime } from "@/lib/utils"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CreateApplication from "./components/BranchCreateApplication"
import { mockApplications, mockActivities } from "./mock-data"
import { statusMap, priorityOptions, statusOptions } from "./branch-application-types"

export default function ApplicationsPage() {
    const { selectedFilter } = useFilterStore()
    const { activeTab } = useTabStore()
    const { applications, setApplications, setActivities } = useBranchApplicationStore();
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Mock verileri yükle
    useEffect(() => {
        setApplications(mockApplications)
        setActivities(mockActivities)
    }, [setApplications, setActivities])

    const filteredApplications = applications.filter(application => {
        const matchesSearch =
            (application?.Title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (application?.BranchName?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || application?.Status === statusFilter;
        const matchesPriority = priorityFilter === "all" || application?.Priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const totalApplications = filteredApplications.length;
    const totalPages = Math.ceil(totalApplications / itemsPerPage);
    const paginatedApplications = filteredApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1))
    }

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1))
    }

    if (showCreateForm) {
        return <CreateApplication filteredBranches={selectedFilter.branches} onBack={() => setShowCreateForm(false)} />
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
            case 'in_review':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500'
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
            case 'contract_shared':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500'
            case 'contract_signed':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500'
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
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
        <div className="flex-1 space-y-4 p-4 md:p-2 pt-2 h-[calc(85vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Bayi Başvuru Yönetimi
                    </h2>
                    <p className="text-[0.925rem] text-muted-foreground">
                        Bayi başvurularını yönetin ve takip edin
                    </p>
                </div>
                <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => setShowCreateForm(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Bayi Başvurusu
                </Button>
            </div>

            {/*search and filter*/}
            <div className="flex flex-col md:flex-row gap-4">
                <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-100/50 dark:border-blue-900/20 shadow-lg shadow-blue-500/5">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Başvuru ara..."
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

            {/* Applications Table */}
            <Card className="flex-1 overflow-hidden bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10 border-2 border-blue-100/50 dark:border-blue-900/20 shadow-xl shadow-blue-500/5">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Başvuru</TableHead>
                            <TableHead>Şube</TableHead>
                            <TableHead>Başvuran</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Öncelik</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedApplications.map((application) => (
                            <TableRow key={application.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{application.Title}</span>
                                        <span className="text-sm text-muted-foreground">{application.Description}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{application.BranchName}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{application.ApplicantName}</span>
                                        <span className="text-sm text-muted-foreground">{application.ApplicantContact}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn("font-medium", getStatusColor(application.Status))}>
                                        {statusMap[application.Status as keyof typeof statusMap]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn("font-medium", getPriorityColor(application.Priority))}>
                                        {application.Priority === "high" ? "Yüksek" : application.Priority === "medium" ? "Orta" : "Düşük"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{formatDateTime(application.Created_at)}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {application.CreatedUserName} tarafından
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))}
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
