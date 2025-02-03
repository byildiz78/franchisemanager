import { Training, TrainingActivity } from "./training-types"

export const mockTrainings: Training[] = [
    {
        id: 1,
        title: "Temel Mutfak Eğitimi",
        description: "Mutfak personeli için temel hijyen, güvenlik ve yemek hazırlama teknikleri eğitimi",
        type: "video",
        status: "published",
        department: "kitchen",
        createdAt: "2025-01-15T09:00:00Z",
        updatedAt: "2025-01-15T09:00:00Z",
        createdById: 1,
        createdByName: "Ahmet Yılmaz",
        duration: 120,
        thumbnailUrl: "/images/trainings/kitchen-basics.jpg",
        contentUrl: "/videos/trainings/kitchen-basics.mp4",
        viewCount: 156,
        completionCount: 89,
        tags: ["mutfak", "hijyen", "güvenlik", "temel eğitim"],
        requiredFor: ["kitchen"]
    },
    {
        id: 2,
        title: "Müşteri İlişkileri Yönetimi",
        description: "Servis personeli için müşteri ilişkileri ve iletişim becerileri eğitimi",
        type: "presentation",
        status: "published",
        department: "service",
        createdAt: "2025-01-20T10:30:00Z",
        updatedAt: "2025-01-20T10:30:00Z",
        createdById: 2,
        createdByName: "Zeynep Kaya",
        duration: 90,
        thumbnailUrl: "/images/trainings/customer-relations.jpg",
        contentUrl: "/presentations/trainings/customer-relations.pdf",
        viewCount: 234,
        completionCount: 198,
        tags: ["müşteri ilişkileri", "iletişim", "servis"],
        requiredFor: ["service", "management"]
    },
    {
        id: 3,
        title: "Finansal Yönetim Temelleri",
        description: "Şube yöneticileri için temel finansal yönetim ve raporlama eğitimi",
        type: "document",
        status: "published",
        department: "finance",
        createdAt: "2025-01-25T14:00:00Z",
        updatedAt: "2025-01-25T14:00:00Z",
        createdById: 3,
        createdByName: "Mehmet Demir",
        duration: 180,
        thumbnailUrl: "/images/trainings/financial-management.jpg",
        contentUrl: "/documents/trainings/financial-management.pdf",
        viewCount: 87,
        completionCount: 45,
        tags: ["finans", "yönetim", "raporlama"],
        requiredFor: ["management", "finance"]
    },
    {
        id: 4,
        title: "Gıda Güvenliği Sertifikası",
        description: "Gıda güvenliği ve HACCP standartları eğitimi",
        type: "quiz",
        status: "published",
        department: "kitchen",
        createdAt: "2025-02-01T11:00:00Z",
        updatedAt: "2025-02-01T11:00:00Z",
        createdById: 4,
        createdByName: "Ayşe Yıldız",
        duration: 60,
        thumbnailUrl: "/images/trainings/food-safety.jpg",
        contentUrl: "/quizzes/trainings/food-safety.json",
        viewCount: 145,
        completionCount: 112,
        tags: ["gıda güvenliği", "HACCP", "sertifika"],
        requiredFor: ["kitchen", "service", "management"]
    },
    {
        id: 5,
        title: "İnsan Kaynakları Süreçleri",
        description: "İK süreçleri ve personel yönetimi eğitimi",
        type: "video",
        status: "draft",
        department: "hr",
        createdAt: "2025-02-02T15:30:00Z",
        updatedAt: "2025-02-02T15:30:00Z",
        createdById: 5,
        createdByName: "Can Öztürk",
        duration: 150,
        thumbnailUrl: "/images/trainings/hr-processes.jpg",
        contentUrl: "/videos/trainings/hr-processes.mp4",
        viewCount: 0,
        completionCount: 0,
        tags: ["insan kaynakları", "personel yönetimi"],
        requiredFor: ["hr", "management"]
    }
]

export const mockActivities: TrainingActivity[] = [
    {
        id: 1,
        trainingId: 1,
        type: "view",
        userId: 101,
        userName: "Ali Yılmaz",
        createdAt: "2025-02-01T10:15:00Z"
    },
    {
        id: 2,
        trainingId: 1,
        type: "complete",
        userId: 101,
        userName: "Ali Yılmaz",
        createdAt: "2025-02-01T11:45:00Z",
        metadata: {
            completionTime: 115,
            score: 95
        }
    },
    {
        id: 3,
        trainingId: 2,
        type: "view",
        userId: 102,
        userName: "Ayşe Demir",
        createdAt: "2025-02-02T09:30:00Z"
    },
    {
        id: 4,
        trainingId: 2,
        type: "comment",
        userId: 102,
        userName: "Ayşe Demir",
        createdAt: "2025-02-02T10:00:00Z",
        metadata: {
            comment: "Çok faydalı bir eğitim, özellikle müşteri şikayetleri yönetimi konusu çok iyi anlatılmış."
        }
    },
    {
        id: 5,
        trainingId: 3,
        type: "complete",
        userId: 103,
        userName: "Mehmet Kaya",
        createdAt: "2025-02-02T14:20:00Z",
        metadata: {
            completionTime: 165,
            score: 88
        }
    },
    {
        id: 6,
        trainingId: 4,
        type: "view",
        userId: 104,
        userName: "Zeynep Şahin",
        createdAt: "2025-02-03T11:10:00Z"
    },
    {
        id: 7,
        trainingId: 4,
        type: "complete",
        userId: 104,
        userName: "Zeynep Şahin",
        createdAt: "2025-02-03T12:30:00Z",
        metadata: {
            completionTime: 55,
            score: 100
        }
    }
]
