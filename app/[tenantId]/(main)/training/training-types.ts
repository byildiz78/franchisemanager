export type TrainingStatus = 
  | "draft" // Taslak
  | "published" // Yayında
  | "archived"; // Arşivlenmiş

export type TrainingType =
  | "video"
  | "document"
  | "presentation"
  | "quiz"
  | "other";

export type Department =
  | "kitchen" // Mutfak
  | "service" // Servis
  | "management" // Yönetim
  | "hr" // İnsan Kaynakları
  | "marketing" // Pazarlama
  | "finance" // Finans
  | "operations" // Operasyon
  | "all"; // Tüm Departmanlar

export interface TrainingActivity {
  id: number;
  trainingId: number;
  type: "view" | "complete" | "comment";
  userId: number;
  userName: string;
  createdAt: string;
  metadata?: {
    completionTime?: number;
    score?: number;
    comment?: string;
    [key: string]: any;
  };
}

export interface Training {
  id: number;
  title: string;
  description: string;
  type: TrainingType;
  status: TrainingStatus;
  department: Department;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  createdByName: string;
  duration: number; // dakika cinsinden
  thumbnailUrl?: string;
  contentUrl: string;
  viewCount: number;
  completionCount: number;
  tags: string[];
  requiredFor: Department[];
}

export const trainingTypeMap: Record<TrainingType, string> = {
  video: "Video",
  document: "Doküman",
  presentation: "Sunum",
  quiz: "Quiz",
  other: "Diğer"
};

export const departmentMap: Record<Department, string> = {
  kitchen: "Mutfak",
  service: "Servis",
  management: "Yönetim",
  hr: "İnsan Kaynakları",
  marketing: "Pazarlama",
  finance: "Finans",
  operations: "Operasyon",
  all: "Tüm Departmanlar"
};

export const statusMap: Record<TrainingStatus, string> = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşivlenmiş"
};

export const statusOptions = [
  { value: "all", label: "Tüm Durumlar" },
  { value: "draft", label: "Taslak" },
  { value: "published", label: "Yayında" },
  { value: "archived", label: "Arşivlenmiş" }
];

export const departmentOptions = [
  { value: "all", label: "Tüm Departmanlar" },
  { value: "kitchen", label: "Mutfak" },
  { value: "service", label: "Servis" },
  { value: "management", label: "Yönetim" },
  { value: "hr", label: "İnsan Kaynakları" },
  { value: "marketing", label: "Pazarlama" },
  { value: "finance", label: "Finans" },
  { value: "operations", label: "Operasyon" }
];

export const typeOptions = [
  { value: "all", label: "Tüm Tipler" },
  { value: "video", label: "Video" },
  { value: "document", label: "Doküman" },
  { value: "presentation", label: "Sunum" },
  { value: "quiz", label: "Quiz" },
  { value: "other", label: "Diğer" }
];

export function getStatusBadgeVariant(status: TrainingStatus) {
  switch (status) {
    case "draft":
      return "secondary"
    case "published":
      return "success"
    case "archived":
      return "warning"
    default:
      return "default"
  }
}

export function getTypeIcon(type: TrainingType) {
  switch (type) {
    case "video":
      return "Play"
    case "document":
      return "FileText"
    case "presentation":
      return "Presentation"
    case "quiz":
      return "CheckSquare"
    default:
      return "File"
  }
}
