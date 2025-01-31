import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData> {
  data: TData[]
  columns: {
    header: string
    accessorKey: string
    cell?: ({ row }: { row: { original: TData } }) => React.ReactNode
  }[]
  enableRowSelection?: boolean
  enableColumnFilters?: boolean
  enableSorting?: boolean
  enablePagination?: boolean
  showNoDataMessage?: boolean
  noDataMessage?: string
}

export function DataTable<TData>({
  data,
  columns,
  showNoDataMessage = true,
  noDataMessage = "Veri bulunamadı"
}: DataTableProps<TData>) {
  if (data.length === 0 && showNoDataMessage) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        {noDataMessage}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessorKey}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => (
              <TableCell key={column.accessorKey}>
                {column.cell
                  ? column.cell({ row: { original: row } })
                  : (row as any)[column.accessorKey]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
