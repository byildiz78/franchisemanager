import { BranchOnboarding, OnboardingTask } from "./onboarding-types"

export const mockOnboardings: BranchOnboarding[] = [
    {
        id: 1,
        branchId: 1,
        branchName: "Kadıköy Şubesi",
        status: "in_progress",
        priority: "high",
        startDate: "2025-02-01T10:00:00Z",
        targetCompletionDate: "2025-03-01T10:00:00Z",
        projectManager: {
            id: 1,
            name: "Ahmet Yılmaz",
            email: "ahmet.yilmaz@email.com"
        },
        branchManager: {
            id: 2,
            name: "Mehmet Demir",
            email: "mehmet.demir@email.com"
        },
        progress: 35,
        lastUpdated: "2025-02-03T14:30:00Z"
    },
    {
        id: 2,
        branchId: 2,
        branchName: "Çankaya Şubesi",
        status: "training",
        priority: "medium",
        startDate: "2025-01-15T09:00:00Z",
        targetCompletionDate: "2025-02-15T09:00:00Z",
        projectManager: {
            id: 3,
            name: "Ayşe Kaya",
            email: "ayse.kaya@email.com"
        },
        branchManager: {
            id: 4,
            name: "Ali Öztürk",
            email: "ali.ozturk@email.com"
        },
        progress: 65,
        lastUpdated: "2025-02-03T11:15:00Z"
    },
    {
        id: 3,
        branchId: 3,
        branchName: "Karşıyaka Şubesi",
        status: "setup",
        priority: "high",
        startDate: "2025-01-20T11:00:00Z",
        targetCompletionDate: "2025-02-20T11:00:00Z",
        projectManager: {
            id: 5,
            name: "Zeynep Çelik",
            email: "zeynep.celik@email.com"
        },
        branchManager: {
            id: 6,
            name: "Burak Aydın",
            email: "burak.aydin@email.com"
        },
        progress: 80,
        lastUpdated: "2025-02-03T16:45:00Z"
    },
    {
        id: 4,
        branchId: 4,
        branchName: "Nilüfer Şubesi",
        status: "final_review",
        priority: "medium",
        startDate: "2025-01-10T13:00:00Z",
        targetCompletionDate: "2025-02-10T13:00:00Z",
        projectManager: {
            id: 7,
            name: "Can Yılmaz",
            email: "can.yilmaz@email.com"
        },
        branchManager: {
            id: 8,
            name: "Selin Arslan",
            email: "selin.arslan@email.com"
        },
        progress: 95,
        lastUpdated: "2025-02-03T09:30:00Z"
    },
    {
        id: 5,
        branchId: 5,
        branchName: "Muratpaşa Şubesi",
        status: "completed",
        priority: "low",
        startDate: "2025-01-05T10:00:00Z",
        targetCompletionDate: "2025-02-05T10:00:00Z",
        actualCompletionDate: "2025-02-03T15:00:00Z",
        projectManager: {
            id: 9,
            name: "Deniz Kara",
            email: "deniz.kara@email.com"
        },
        branchManager: {
            id: 10,
            name: "Ece Demir",
            email: "ece.demir@email.com"
        },
        progress: 100,
        lastUpdated: "2025-02-03T15:00:00Z"
    }
]

export const mockTasks: Record<number, OnboardingTask[]> = {
    1: [
        {
            id: 1,
            onboardingId: 1,
            type: "document",
            title: "Franchise Sözleşmesi İmzalama",
            description: "Franchise sözleşmesinin imzalanması ve sistemde kayıt altına alınması",
            status: "completed",
            dueDate: "2025-02-05T17:00:00Z",
            assignedTo: 2,
            assignedToName: "Mehmet Demir",
            completedAt: "2025-02-03T14:30:00Z",
            completedBy: 2,
            completedByName: "Mehmet Demir",
            documents: [
                {
                    id: 1,
                    name: "Franchise_Sozlesmesi.pdf",
                    url: "/documents/franchise_sozlesmesi.pdf",
                    uploadedAt: "2025-02-03T14:30:00Z",
                    uploadedBy: "Mehmet Demir"
                }
            ]
        },
        {
            id: 2,
            onboardingId: 1,
            type: "training",
            title: "Temel Eğitim Programı",
            description: "Şube personeli için temel eğitim programının tamamlanması",
            status: "in_progress",
            dueDate: "2025-02-15T17:00:00Z",
            assignedTo: 2,
            assignedToName: "Mehmet Demir",
            dependencies: [1]
        },
        {
            id: 3,
            onboardingId: 1,
            type: "setup",
            title: "POS Sistemi Kurulumu",
            description: "POS sisteminin kurulumu ve test edilmesi",
            status: "pending",
            dueDate: "2025-02-20T17:00:00Z",
            assignedTo: 11,
            assignedToName: "Teknik Ekip",
            dependencies: [1]
        }
    ],
    2: [
        {
            id: 4,
            onboardingId: 2,
            type: "document",
            title: "Personel Dökümanları",
            description: "Personel sözleşmeleri ve özlük evraklarının tamamlanması",
            status: "completed",
            dueDate: "2025-01-20T17:00:00Z",
            assignedTo: 4,
            assignedToName: "Ali Öztürk",
            completedAt: "2025-01-19T16:30:00Z",
            completedBy: 4,
            completedByName: "Ali Öztürk",
            documents: [
                {
                    id: 2,
                    name: "Personel_Evraklari.zip",
                    url: "/documents/personel_evraklari.zip",
                    uploadedAt: "2025-01-19T16:30:00Z",
                    uploadedBy: "Ali Öztürk"
                }
            ]
        },
        {
            id: 5,
            onboardingId: 2,
            type: "training",
            title: "Satış Eğitimi",
            description: "Satış ekibi için kapsamlı eğitim programı",
            status: "in_progress",
            dueDate: "2025-02-10T17:00:00Z",
            assignedTo: 4,
            assignedToName: "Ali Öztürk"
        }
    ],
    3: [
        {
            id: 6,
            onboardingId: 3,
            type: "setup",
            title: "Mobilya ve Ekipman Kurulumu",
            description: "Şube mobilya ve ekipmanlarının kurulumu",
            status: "completed",
            dueDate: "2025-02-01T17:00:00Z",
            assignedTo: 6,
            assignedToName: "Burak Aydın",
            completedAt: "2025-01-31T15:00:00Z",
            completedBy: 6,
            completedByName: "Burak Aydın"
        },
        {
            id: 7,
            onboardingId: 3,
            type: "review",
            title: "Şube Denetimi",
            description: "Açılış öncesi son şube denetimi",
            status: "in_progress",
            dueDate: "2025-02-10T17:00:00Z",
            assignedTo: 5,
            assignedToName: "Zeynep Çelik",
            dependencies: [6]
        }
    ],
    4: [
        {
            id: 8,
            onboardingId: 4,
            type: "setup",
            title: "IT Altyapı Kurulumu",
            description: "Şube IT altyapısının hazırlanması",
            status: "completed",
            dueDate: "2025-01-25T17:00:00Z",
            assignedTo: 11,
            assignedToName: "Teknik Ekip",
            completedAt: "2025-01-24T16:00:00Z",
            completedBy: 11,
            completedByName: "Teknik Ekip"
        },
        {
            id: 9,
            onboardingId: 4,
            type: "approval",
            title: "Final Onay",
            description: "Şube açılışı için son onay",
            status: "in_progress",
            dueDate: "2025-02-05T17:00:00Z",
            assignedTo: 7,
            assignedToName: "Can Yılmaz",
            dependencies: [8]
        }
    ],
    5: [
        {
            id: 10,
            onboardingId: 5,
            type: "document",
            title: "Açılış Raporları",
            description: "Şube açılış raporlarının hazırlanması",
            status: "completed",
            dueDate: "2025-02-03T17:00:00Z",
            assignedTo: 10,
            assignedToName: "Ece Demir",
            completedAt: "2025-02-03T15:00:00Z",
            completedBy: 10,
            completedByName: "Ece Demir",
            documents: [
                {
                    id: 3,
                    name: "Acilis_Raporu.pdf",
                    url: "/documents/acilis_raporu.pdf",
                    uploadedAt: "2025-02-03T15:00:00Z",
                    uploadedBy: "Ece Demir"
                }
            ]
        }
    ]
}
