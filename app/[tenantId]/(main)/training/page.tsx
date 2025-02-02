'use client'

import { useState } from "react"
import { useFilterStore } from "@/stores/filters-store"
import { useTabStore } from '@/stores/tab-store'
import { useTrainingStore } from "@/stores/training-store"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, Filter, Plus, Search, Tag, Timer, Users, FileText, Play, CheckSquare, File, Presentation } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn, formatDateTime } from "@/lib/utils"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Training, TrainingStatus, departmentOptions, statusOptions, typeOptions, statusMap, getStatusBadgeVariant, getTypeIcon, trainingTypeMap } from "./training-types"
import CreateTraining from "./components/CreateTraining"
import { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"

export default function TrainingPage() {
    const { selectedFilter } = useFilterStore()
    const { activeTab } = useTabStore()
    const { trainings: storeTrainings, userDepartment } = useTrainingStore()
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [trainings, setTrainings] = useState<Training[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [departmentFilter, setDepartmentFilter] = useState(userDepartment)
    const [typeFilter, setTypeFilter] = useState("all")
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredTrainings = trainings.filter(training => {
        const matchesSearch =
            training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            training.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === "all" || training.status === statusFilter;
        const matchesDepartment = departmentFilter === "all" || training.department === departmentFilter || training.requiredFor.includes(departmentFilter as any);
        const matchesType = typeFilter === "all" || training.type === typeFilter;

        return matchesSearch && matchesStatus && matchesDepartment && matchesType;
    });

    const totalTrainings = filteredTrainings.length;
    const totalPages = Math.ceil(totalTrainings / itemsPerPage);
    const paginatedTrainings = filteredTrainings.slice(
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
        return <CreateTraining onClose={() => setShowCreateForm(false)} />
    }

    const TypeIcon = ({ type }: { type: string }) => {
        const iconName = getTypeIcon(type as any);
        const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;
        return <Icon className="h-4 w-4" />;
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-2 pt-2 h-[calc(85vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Kurum içi Eğitim
                    </h2>
                    <p className="text-[0.925rem] text-muted-foreground">
                        Eğitim materyallerini yönetin ve takip edin
                    </p>
                </div>
                <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => setShowCreateForm(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Eğitim Ekle
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
                                        placeholder="Eğitim ara..."
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
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                    <SelectTrigger className="w-full md:w-[180px] bg-white/80 dark:bg-gray-800/80 border-2 border-blue-100 dark:border-blue-900/30 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <SelectValue placeholder="Departman Filtrele" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departmentOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-full md:w-[180px] bg-white/80 dark:bg-gray-800/80 border-2 border-blue-100 dark:border-blue-900/30 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            <SelectValue placeholder="Tip Filtrele" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {typeOptions.map((option) => (
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

            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex-1 overflow-hidden rounded-xl">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 h-full flex flex-col">
                    <div className="flex-1 overflow-auto
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-thumb]:bg-gray-300/50
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-transparent
                        dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/80
                        dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700/80">
                        <Table className="relative w-full">
                            <TableHeader className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
                                <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
                                    <TableHead className="w-[5%]">
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                                                <Tag className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                            </span>
                                            Tip
                                        </div>
                                    </TableHead>
                                    <TableHead className="w-[25%]">
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </span>
                                            Başlık
                                        </div>
                                    </TableHead>
                                    <TableHead className="w-[15%]">
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </span>
                                            Departman
                                        </div>
                                    </TableHead>
                                    <TableHead className="w-[10%] text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                                                <Timer className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            </span>
                                            Süre
                                        </div>
                                    </TableHead>
                                    <TableHead className="w-[15%] text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                                                <Eye className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                            </span>
                                            İzlenme
                                        </div>
                                    </TableHead>
                                    <TableHead className="w-[15%] text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                                            </span>
                                            Tarih
                                        </div>
                                    </TableHead>
                                    <TableHead className="w-[10%] text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                                <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                            </span>
                                            İşlemler
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedTrainings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-4">
                                            Henüz eğitim bulunmamaktadır.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedTrainings.map((training) => (
                                        <TableRow
                                            key={training.id}
                                            className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <TypeIcon type={training.type} />
                                                    <span>{trainingTypeMap[training.type]}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{training.title}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-1">
                                                    {training.description}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {training.requiredFor.map((dept) => (
                                                        <Badge
                                                            key={dept}
                                                            variant="outline"
                                                            className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                                        >
                                                            {departmentOptions.find(d => d.value === dept)?.label}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span>{training.duration} dk</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="text-sm font-medium">{training.viewCount}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {training.completionCount} tamamlama
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <span className="text-sm text-muted-foreground">
                                                        {formatDateTime(training.createdAt)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400 justify-self-center" />
                                                        </TooltipTrigger>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="py-1.5 px-6 bg-white/80 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">
                                    Toplam {totalTrainings} kayıt
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="h-8 px-4"
                                >
                                    Önceki
                                </Button>
                                <div className="flex items-center gap-2 min-w-[5rem] justify-center">
                                    <span className="font-medium">{currentPage}</span>
                                    <span className="text-muted-foreground">/</span>
                                    <span className="text-muted-foreground">{totalPages}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="h-8 px-4"
                                >
                                    Sonraki
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
