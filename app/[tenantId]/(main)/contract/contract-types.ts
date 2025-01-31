export type ContractStatus = 
  | "draft" // Taslak
  | "pending_approval" // Onay Bekliyor
  | "approved" // Onaylandı
  | "active" // Aktif
  | "terminated" // Feshedildi
  | "expired"; // Süresi Doldu

export interface ContractActivity {
  id: number;
  contractId: number;
  type: "status_change" | "comment" | "file_upload" | "payment" | "other";
  description: string;
  oldStatus?: ContractStatus;
  newStatus?: ContractStatus;
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

export interface Contract {
  id: number;
  contractNumber: string;
  BranchID: number;
  BranchName: string;
  Status: ContractStatus;
  startDate: string;
  endDate: string;
  franchiseType: string;
  royaltyPercentage: number;
  initialFee: number;
  monthlyFee: number;
  securityDeposit: number;
  equipmentFee: number;
  trainingFee: number;
  marketingFee: number;
  territory: string;
  renewalTerms: string;
  terminationTerms: string;
  Created_at: string;
  UpdatedAt: string;
  Created_by_id: number;
  CreatedUserName: string;
  Assigned_to_id: number;
  Assigned_to_Name: string;
}

export const contractStatusMap: Record<ContractStatus, string> = {
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

export function getStatusBadgeVariant(status: ContractStatus): "secondary" | "destructive" | "default" | "outline" {
  switch (status) {
    case "draft":
      return "secondary"
    case "pending_approval":
      return "outline" // was warning
    case "approved":
      return "outline" // was success
    case "active":
      return "outline" // was green
    case "terminated":
      return "destructive"
    case "expired":
      return "default"
    default:
      return "default"
  }
}

export const franchiseTypeOptions = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe" },
  { value: "fast_food", label: "Fast Food" },
  { value: "food_court", label: "Food Court" },
  { value: "express", label: "Express" }
];

export function getStatusLabel(status?: string) {
  if (!status) return "Taslak"
  
  const statusKey = status.toLowerCase() as ContractStatus;
  return contractStatusMap[statusKey] || "Taslak"
}
