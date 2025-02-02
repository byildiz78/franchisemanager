import { create } from 'zustand'
import { BranchOnboarding } from '@/app/[tenantId]/(main)/branchonboarding/branch-onboarding-types'

interface BranchOnboardingStore {
    onboardings: BranchOnboarding[]
    setOnboardings: (onboardings: BranchOnboarding[]) => void
    addOnboarding: (onboarding: BranchOnboarding) => void
    updateOnboarding: (onboarding: BranchOnboarding) => void
    removeOnboarding: (id: number) => void
}

export const useBranchOnboardingStore = create<BranchOnboardingStore>((set) => ({
    onboardings: [],
    setOnboardings: (onboardings) => set({ onboardings }),
    addOnboarding: (onboarding) =>
        set((state) => ({
            onboardings: [...state.onboardings, onboarding],
        })),
    updateOnboarding: (onboarding) =>
        set((state) => ({
            onboardings: state.onboardings.map((a) =>
                a.id === onboarding.id ? onboarding : a
            ),
        })),
    removeOnboarding: (id) =>
        set((state) => ({
            onboardings: state.onboardings.filter((a) => a.id !== id),
        })),
}))
