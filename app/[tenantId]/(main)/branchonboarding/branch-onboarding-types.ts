export type OnboardingStatus = 
  | "not_started" // Başlanmadı
  | "in_progress" // Devam Ediyor
  | "completed" // Tamamlandı
  | "on_hold"; // Beklemede

export interface OnboardingActivity {
  id: number;
  onboardingId: number;
  type: "status_change" | "comment" | "file_upload" | "meeting" | "task_completed" | "other";
  description: string;
  oldStatus?: OnboardingStatus;
  newStatus?: OnboardingStatus;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  metadata?: {
    fileUrl?: string;
    meetingDate?: string;
    meetingNotes?: string;
    taskId?: number;
    [key: string]: any;
  };
}

export type OnboardingPriority = "low" | "medium" | "high";

export interface BranchOnboarding {
  id: number;
  Title: string;
  Description: string;
  BranchID: number;
  Status: string;
  Priority: string;
  Assigned_to_id: number;
  Assigned_to_Name: string;
  Observers: string;
  Observers_id: string;
  BranchName: string;
  Created_at: string;
  UpdatedAt: string;
  Last_action_at: string;
  Created_by_id: number;
  CreatedUserName: string;
  CompletedTasks: number;
  TotalTasks: number;
  EstimatedCompletionDate: string;
}

export const statusOptions = [
  { value: "all", label: "Tüm Durumlar" },
  { value: "not_started", label: "Başlanmadı" },
  { value: "in_progress", label: "Devam Ediyor" },
  { value: "completed", label: "Tamamlandı" },
  { value: "on_hold", label: "Beklemede" }
]

export const statusMap: Record<OnboardingStatus, string> = {
  not_started: "Başlanmadı",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  on_hold: "Beklemede"
}

export function getStatusBadgeVariant(status: OnboardingStatus) {
  switch (status) {
    case "not_started":
      return "secondary"
    case "in_progress":
      return "blue"
    case "completed":
      return "success"
    case "on_hold":
      return "warning"
    default:
      return "default"
  }
}

export const priorityOptions = [
  { value: "all", label: "Tüm Öncelikler" },
  { value: "high", label: "Yüksek" },
  { value: "medium", label: "Orta" },
  { value: "low", label: "Düşük" }
]

export function getStatusLabel(status?: string) {
  if (!status) return "Başlanmadı"

  switch (status.toLowerCase()) {
    case "not_started":
      return "Başlanmadı"
    case "in_progress":
      return "Devam Ediyor"
    case "completed":
      return "Tamamlandı"
    case "on_hold":
      return "Beklemede"
    default:
      return "Başlanmadı"
  }
}
