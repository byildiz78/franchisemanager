"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Rental } from "../rental-types"
import { Eye, FileText, Calendar, Store, AlertCircle, DollarSign, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn, formatDateTime } from "@/lib/utils"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EnhancedDataTableProps {
  data: Rental[]
  isLoading?: boolean
}

export function EnhancedDataTable({ data, isLoading }: EnhancedDataTableProps) {
  return (
    <div className="flex-1 overflow-auto
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-thumb]:bg-gray-300/50
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-track]:bg-transparent
      dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-300/80
      dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700/80"
    >
      <Table className="relative w-full">
        <TableHeader className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
          <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
            <TableHead className="w-[10%]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </span>
                Kiralama No
              </div>
            </TableHead>
            <TableHead className="w-[15%]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <Store className="h-4 w-4 text-green-600 dark:text-green-400" />
                </span>
                Şube
              </div>
            </TableHead>
            <TableHead className="w-[15%]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </span>
                Mülk Tipi
              </div>
            </TableHead>
            <TableHead className="w-[10%] text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </span>
                Durum
              </div>
            </TableHead>
            <TableHead className="w-[15%] text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </span>
                Başlangıç
              </div>
            </TableHead>
            <TableHead className="w-[15%] text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </span>
                Bitiş
              </div>
            </TableHead>
            <TableHead className="w-[10%] text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </span>
                Kira
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
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Henüz kiralama bulunmamaktadır.
              </TableCell>
            </TableRow>
          ) : (
            data.map((rental) => (
              <TableRow
                key={rental.id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
              >
                <TableCell>
                  <div className="font-medium text-start">#{rental.rentalNumber}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{rental.BranchName}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{rental.propertyType}</div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "inline-flex items-center justify-center w-24",
                      rental.Status === "draft" && "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
                      rental.Status === "pending_approval" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
                      rental.Status === "approved" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                      rental.Status === "active" && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                      rental.Status === "terminated" && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                      rental.Status === "expired" && "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                    )}
                  >
                    {rental.Status === "draft" && "Taslak"}
                    {rental.Status === "pending_approval" && "Onay Bekliyor"}
                    {rental.Status === "approved" && "Onaylandı"}
                    {rental.Status === "active" && "Aktif"}
                    {rental.Status === "terminated" && "Feshedildi"}
                    {rental.Status === "expired" && "Süresi Doldu"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">
                      {formatDateTime(rental.startDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">
                      {formatDateTime(rental.endDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-medium">{rental.monthlyRent.toLocaleString('tr-TR')} ₺</div>
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
  )
}
