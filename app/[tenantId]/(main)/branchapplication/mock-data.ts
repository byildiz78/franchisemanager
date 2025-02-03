import { BranchApplication, ApplicationActivity } from "./branch-application-types"

export const mockApplications: BranchApplication[] = [
    {
        id: 1,
        Title: "İstanbul Kadıköy Şube Başvurusu",
        Description: "Kadıköy bölgesinde yeni şube açılması talebi",
        BranchName: "Kadıköy Şubesi",
        BranchId: 1,
        Status: "pending",
        Priority: "high",
        ApplicantName: "Ahmet Yılmaz",
        ApplicantContact: "ahmet.yilmaz@email.com",
        Created_at: "2025-02-01T10:00:00Z",
        CreatedUserId: 1,
        CreatedUserName: "Ahmet Yılmaz"
    },
    {
        id: 2,
        Title: "Ankara Çankaya Şube Başvurusu",
        Description: "Çankaya bölgesinde yeni şube açılması talebi",
        BranchName: "Çankaya Şubesi",
        BranchId: 2,
        Status: "in_review",
        Priority: "medium",
        ApplicantName: "Mehmet Demir",
        ApplicantContact: "mehmet.demir@email.com",
        Created_at: "2025-02-02T11:30:00Z",
        CreatedUserId: 2,
        CreatedUserName: "Mehmet Demir"
    },
    {
        id: 3,
        Title: "İzmir Karşıyaka Şube Başvurusu",
        Description: "Karşıyaka bölgesinde yeni şube açılması talebi",
        BranchName: "Karşıyaka Şubesi",
        BranchId: 3,
        Status: "approved",
        Priority: "high",
        ApplicantName: "Ayşe Kaya",
        ApplicantContact: "ayse.kaya@email.com",
        Created_at: "2025-02-03T09:15:00Z",
        CreatedUserId: 3,
        CreatedUserName: "Ayşe Kaya"
    },
    {
        id: 4,
        Title: "Bursa Nilüfer Şube Başvurusu",
        Description: "Nilüfer bölgesinde yeni şube açılması talebi",
        BranchName: "Nilüfer Şubesi",
        BranchId: 4,
        Status: "contract_shared",
        Priority: "medium",
        ApplicantName: "Ali Öztürk",
        ApplicantContact: "ali.ozturk@email.com",
        Created_at: "2025-02-03T14:45:00Z",
        CreatedUserId: 4,
        CreatedUserName: "Ali Öztürk"
    },
    {
        id: 5,
        Title: "Antalya Muratpaşa Şube Başvurusu",
        Description: "Muratpaşa bölgesinde yeni şube açılması talebi",
        BranchName: "Muratpaşa Şubesi",
        BranchId: 5,
        Status: "rejected",
        Priority: "low",
        ApplicantName: "Zeynep Çelik",
        ApplicantContact: "zeynep.celik@email.com",
        Created_at: "2025-02-03T16:20:00Z",
        CreatedUserId: 5,
        CreatedUserName: "Zeynep Çelik"
    }
]

export const mockActivities: Record<number, ApplicationActivity[]> = {
    1: [
        {
            id: 1,
            applicationId: 1,
            type: "status_change",
            description: "Başvuru durumu değiştirildi: pending → in_review",
            oldStatus: "pending",
            newStatus: "in_review",
            createdBy: 1,
            createdByName: "Sistem Yöneticisi",
            createdAt: "2025-02-01T10:30:00Z"
        },
        {
            id: 2,
            applicationId: 1,
            type: "comment",
            description: "Lokasyon analizi yapılması gerekiyor.",
            createdBy: 2,
            createdByName: "Bölge Müdürü",
            createdAt: "2025-02-01T11:00:00Z"
        }
    ],
    2: [
        {
            id: 3,
            applicationId: 2,
            type: "file_upload",
            description: "İş planı dokümanı yüklendi",
            createdBy: 2,
            createdByName: "Mehmet Demir",
            createdAt: "2025-02-02T12:00:00Z",
            fileUrl: "/documents/business-plan.pdf",
            fileName: "is-plani.pdf"
        }
    ],
    3: [
        {
            id: 4,
            applicationId: 3,
            type: "meeting",
            description: "Başvuru değerlendirme toplantısı",
            createdBy: 3,
            createdByName: "Ayşe Kaya",
            createdAt: "2025-02-03T10:00:00Z",
            meetingDate: "2025-02-05",
            meetingTime: "14:00",
            meetingLocation: "Genel Merkez"
        }
    ],
    4: [
        {
            id: 5,
            applicationId: 4,
            type: "status_change",
            description: "Başvuru durumu değiştirildi: approved → contract_shared",
            oldStatus: "approved",
            newStatus: "contract_shared",
            createdBy: 1,
            createdByName: "Sistem Yöneticisi",
            createdAt: "2025-02-03T15:00:00Z"
        },
        {
            id: 6,
            applicationId: 4,
            type: "file_upload",
            description: "Sözleşme dokümanı yüklendi",
            createdBy: 1,
            createdByName: "Sistem Yöneticisi",
            createdAt: "2025-02-03T15:05:00Z",
            fileUrl: "/documents/contract.pdf",
            fileName: "sozlesme.pdf"
        }
    ],
    5: [
        {
            id: 7,
            applicationId: 5,
            type: "status_change",
            description: "Başvuru durumu değiştirildi: in_review → rejected",
            oldStatus: "in_review",
            newStatus: "rejected",
            createdBy: 1,
            createdByName: "Sistem Yöneticisi",
            createdAt: "2025-02-03T16:45:00Z"
        },
        {
            id: 8,
            applicationId: 5,
            type: "comment",
            description: "Lokasyon kriterlere uygun değil.",
            createdBy: 2,
            createdByName: "Bölge Müdürü",
            createdAt: "2025-02-03T16:50:00Z"
        }
    ]
}
