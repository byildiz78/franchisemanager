import { create } from 'zustand'
import { Training } from '@/app/[tenantId]/(main)/training/training-types'

interface TrainingStore {
    trainings: Training[]
    setTrainings: (trainings: Training[]) => void
    addTraining: (training: Training) => void
    updateTraining: (training: Training) => void
    removeTraining: (id: number) => void
    userDepartment: string
    setUserDepartment: (department: string) => void
}

export const useTrainingStore = create<TrainingStore>((set) => ({
    trainings: [],
    userDepartment: 'all',
    setTrainings: (trainings) => set({ trainings }),
    addTraining: (training) =>
        set((state) => ({
            trainings: [...state.trainings, training],
        })),
    updateTraining: (training) =>
        set((state) => ({
            trainings: state.trainings.map((t) =>
                t.id === training.id ? training : t
            ),
        })),
    removeTraining: (id) =>
        set((state) => ({
            trainings: state.trainings.filter((t) => t.id !== id),
        })),
    setUserDepartment: (department) => set({ userDepartment: department })
}))
