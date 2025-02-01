export type RoyaltyStatus = "pending" | "paid" | "overdue"
export type RoyaltyActivityType = "comment" | "payment" | "status_change"
export type FranchiseType = "standard" | "premium" | "express"

export interface RoyaltyActivity {
  id: string
  royaltyId: string
  type: RoyaltyActivityType
  description: string
  createdAt: string
  createdBy: string
  createdByName: string
  oldStatus?: RoyaltyStatus
  newStatus?: RoyaltyStatus
  metadata?: {
    paymentAmount?: number
    [key: string]: any
  }
}

export interface Royalty {
  id: string
  franchiseId: string
  franchiseName: string
  period: string
  franchiseType: FranchiseType
  salesAmount: number
  royaltyRate: number
  royaltyAmount: number
  status: RoyaltyStatus
  createdAt: string
  createdBy: string
  createdByName: string
}

export const royaltyStatusMap: Record<RoyaltyStatus, string> = {
  pending: "Ödeme Bekliyor",
  paid: "Ödendi",
  overdue: "Gecikmiş"
};

export const statusOptions = [
  { value: "all", label: "Tüm Durumlar" },
  { value: "pending", label: "Ödeme Bekliyor" },
  { value: "paid", label: "Ödendi" },
  { value: "overdue", label: "Gecikmiş" }
];

export const getStatusBadgeVariant = (status: RoyaltyStatus) => {
  switch (status) {
    case "pending":
      return "outline"
    case "paid":
      return "success"
    case "overdue":
      return "destructive"
    default:
      return "secondary"
  }
}
