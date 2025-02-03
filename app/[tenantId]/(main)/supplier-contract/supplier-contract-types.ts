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

export interface SupplierContract {
  id: number;
  contractNumber: string;
  SupplierID: number;
  SupplierName: string;
  Status: ContractStatus;
  startDate: string;
  endDate: string;
  supplierType: string;
  paymentTerms: string;
  deliveryTerms: string;
  minimumOrderQuantity: number;
  priceAdjustmentTerms: string;
  qualityStandards: string;
  exclusivityTerms: string;
  monthlyOrderTarget: number;
  penaltyTerms: string;
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

export const supplierTypeOptions = [
  { value: "food_supplier", label: "Gıda Tedarikçisi" },
  { value: "beverage_supplier", label: "İçecek Tedarikçisi" },
  { value: "equipment_supplier", label: "Ekipman Tedarikçisi" },
  { value: "packaging_supplier", label: "Ambalaj Tedarikçisi" },
  { value: "cleaning_supplier", label: "Temizlik Malzemeleri Tedarikçisi" }
];

export function getStatusLabel(status?: string) {
  if (!status) return "Taslak"
  return contractStatusMap[status as ContractStatus] || status
}
