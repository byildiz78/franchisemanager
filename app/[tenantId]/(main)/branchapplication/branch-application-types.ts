export type ApplicationStatus = 
    | "pending"
    | "in_review"
    | "approved"
    | "contract_shared"
    | "contract_signed"
    | "rejected"

export type ApplicationPriority = "high" | "medium" | "low"

export type ActivityType = 
    | "status_change"
    | "comment"
    | "file_upload"
    | "meeting"

export interface ApplicationActivity {
    id: number
    applicationId: number
    type: ActivityType
    description: string
    oldStatus?: ApplicationStatus
    newStatus?: ApplicationStatus
    createdBy: number
    createdByName: string
    createdAt: string
    meetingDate?: string
    meetingTime?: string
    meetingLocation?: string
    fileUrl?: string
    fileName?: string
}

export interface BranchApplication {
    id: number
    Title: string
    Description: string
    BranchName: string
    BranchId: number
    Status: ApplicationStatus
    Priority: ApplicationPriority
    ApplicantName: string
    ApplicantContact: string
    Created_at: string
    CreatedUserId: number
    CreatedUserName: string
}

export const statusMap = {
    pending: "Beklemede",
    in_review: "İncelemede",
    approved: "Onaylandı",
    contract_shared: "Sözleşme Paylaşıldı",
    contract_signed: "Sözleşme İmzalandı",
    rejected: "Reddedildi"
}

export const statusOptions = [
    { value: "all", label: "Tüm Durumlar" },
    { value: "pending", label: "Beklemede" },
    { value: "in_review", label: "İncelemede" },
    { value: "approved", label: "Onaylandı" },
    { value: "contract_shared", label: "Sözleşme Paylaşıldı" },
    { value: "contract_signed", label: "Sözleşme İmzalandı" },
    { value: "rejected", label: "Reddedildi" }
]

export const priorityOptions = [
    { value: "all", label: "Tüm Öncelikler" },
    { value: "high", label: "Yüksek" },
    { value: "medium", label: "Orta" },
    { value: "low", label: "Düşük" }
]