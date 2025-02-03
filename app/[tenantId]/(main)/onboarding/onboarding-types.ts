export type OnboardingStatus = 'not_started' | 'in_progress' | 'training' | 'setup' | 'final_review' | 'completed'
export type OnboardingPriority = 'high' | 'medium' | 'low'

export interface User {
    id: number
    name: string
    email: string
}

export interface Document {
    id: number
    name: string
    url: string
    uploadedAt: string
    uploadedBy: string
}

export interface OnboardingTask {
    id: number
    onboardingId: number
    type: 'document' | 'training' | 'setup' | 'review' | 'approval'
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed'
    dueDate: string
    assignedTo: number
    assignedToName: string
    completedAt?: string
    completedBy?: number
    completedByName?: string
    dependencies?: number[]
    documents?: Document[]
}

export interface BranchOnboarding {
    id: number
    branchId: number
    branchName: string
    status: OnboardingStatus
    priority: OnboardingPriority
    startDate: string
    targetCompletionDate: string
    actualCompletionDate?: string
    projectManager: User
    branchManager: User
    progress: number
    lastUpdated: string
}

export const statusOptions = [
    { value: 'all', label: 'Tüm Durumlar' },
    { value: 'not_started', label: 'Başlamadı' },
    { value: 'in_progress', label: 'Devam Ediyor' },
    { value: 'training', label: 'Eğitim' },
    { value: 'setup', label: 'Kurulum' },
    { value: 'final_review', label: 'Son İnceleme' },
    { value: 'completed', label: 'Tamamlandı' }
]

export const priorityOptions = [
    { value: 'all', label: 'Tüm Öncelikler' },
    { value: 'high', label: 'Yüksek' },
    { value: 'medium', label: 'Orta' },
    { value: 'low', label: 'Düşük' }
]

export const statusMap: Record<OnboardingStatus, string> = {
    not_started: 'Başlamadı',
    in_progress: 'Devam Ediyor',
    training: 'Eğitim',
    setup: 'Kurulum',
    final_review: 'Son İnceleme',
    completed: 'Tamamlandı'
}
