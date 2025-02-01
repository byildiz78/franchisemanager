export type RentalStatus = 
  | "draft" // Taslak
  | "pending_approval" // Onay Bekliyor
  | "approved" // Onaylandı
  | "active" // Aktif
  | "terminated" // Feshedildi
  | "expired"; // Süresi Doldu

export interface RentalActivity {
  id: number;
  rentalId: number;
  type: "status_change" | "comment" | "file_upload" | "payment" | "other";
  description: string;
  oldStatus?: RentalStatus;
  newStatus?: RentalStatus;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  metadata?: {
    fileUrl?: string;
    paymentAmount?: number;
    paymentDate?: string;
    [key: string]: any;
  };
}

export interface Rental {
  id: number;
  rentalNumber: string;
  BranchID: number;
  BranchName: string;
  Status: RentalStatus;
  startDate: string;
  endDate: string;
  propertyType: string;
  monthlyRent: number;
  depositAmount: number;
  utilityCharges: number;
  maintenanceFee: number;
  propertyAddress: string;
  propertySize: number;
  parkingSpaces: number;
  renewalTerms: string;
  terminationTerms: string;
  Created_at: string;
  UpdatedAt: string;
  Created_by_id: number;
  CreatedUserName: string;
  Assigned_to_id: number;
  Assigned_to_Name: string;
}

export const rentalStatusMap: Record<RentalStatus, string> = {
  draft: "Taslak",
  pending_approval: "Onay Bekliyor",
  approved: "Onaylandı",
  active: "Aktif",
  terminated: "Feshedildi",
  expired: "Süresi Doldu"
};

export const statusOptions = [
  { value: "all", label: "Tüm Durumlar" },
  { value: "draft", label: "Taslak" },
  { value: "pending_approval", label: "Onay Bekliyor" },
  { value: "approved", label: "Onaylandı" },
  { value: "active", label: "Aktif" },
  { value: "terminated", label: "Feshedildi" },
  { value: "expired", label: "Süresi Doldu" }
];

export function getStatusBadgeVariant(status: RentalStatus): "secondary" | "destructive" | "default" | "outline" {
  switch (status) {
    case "draft":
      return "secondary"
    case "pending_approval":
      return "outline"
    case "approved":
      return "outline"
    case "active":
      return "outline"
    case "terminated":
      return "destructive"
    case "expired":
      return "default"
    default:
      return "default"
  }
}

export const propertyTypeOptions = [
  { value: "store", label: "Mağaza" },
  { value: "warehouse", label: "Depo" },
  { value: "office", label: "Ofis" },
  { value: "mixed", label: "Karma" }
];

export function getStatusLabel(status?: string) {
  if (!status) return "Taslak"
  
  const statusKey = status.toLowerCase() as RentalStatus;
  return rentalStatusMap[statusKey] || "Taslak"
}
