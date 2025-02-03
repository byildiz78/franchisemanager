import { create } from 'zustand'
import { BranchOnboarding, OnboardingTask } from '@/app/[tenantId]/(main)/onboarding/onboarding-types'

interface OnboardingStore {
    onboardings: BranchOnboarding[]
    tasks: Record<number, OnboardingTask[]>
    setOnboardings: (onboardings: BranchOnboarding[]) => void
    setTasks: (tasks: Record<number, OnboardingTask[]>) => void
    addOnboarding: (onboarding: BranchOnboarding) => void
    updateOnboarding: (id: number, onboarding: Partial<BranchOnboarding>) => void
    addTask: (task: OnboardingTask) => void
    updateTask: (onboardingId: number, taskId: number, task: Partial<OnboardingTask>) => void
    updateTaskStatus: (onboardingId: number, taskId: number, status: string, userId: number, userName: string) => void
}

const initialState = {
    onboardings: [],
    tasks: {}
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
    ...initialState,
    setOnboardings: (onboardings) => {
        console.log('Setting onboardings:', onboardings)
        set({ onboardings })
    },
    setTasks: (tasks) => {
        console.log('Setting tasks:', tasks)
        set({ tasks })
    },
    addOnboarding: (onboarding) => 
        set((state) => ({ 
            onboardings: [...state.onboardings, onboarding] 
        })),
    updateOnboarding: (id, onboarding) =>
        set((state) => ({
            onboardings: state.onboardings.map((item) =>
                item.id === id ? { ...item, ...onboarding } : item
            ),
        })),
    addTask: (task) =>
        set((state) => ({
            tasks: {
                ...state.tasks,
                [task.onboardingId]: [
                    ...(state.tasks[task.onboardingId] || []),
                    task
                ]
            }
        })),
    updateTask: (onboardingId, taskId, task) =>
        set((state) => ({
            tasks: {
                ...state.tasks,
                [onboardingId]: state.tasks[onboardingId].map((item) =>
                    item.id === taskId ? { ...item, ...task } : item
                )
            }
        })),
    updateTaskStatus: (onboardingId, taskId, status, userId, userName) => {
        const task = get().tasks[onboardingId]?.find(t => t.id === taskId);
        if (!task) return;

        get().updateTask(onboardingId, taskId, {
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            completedBy: status === 'completed' ? userId : undefined,
            completedByName: status === 'completed' ? userName : undefined
        });

        // Onboarding progress'i güncelle
        const tasks = get().tasks[onboardingId] || [];
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const progress = Math.round((completedTasks / tasks.length) * 100);

        get().updateOnboarding(onboardingId, {
            progress,
            lastUpdated: new Date().toISOString(),
            status: progress === 100 ? 'completed' : get().onboardings.find(o => o.id === onboardingId)?.status
        });
    }
}))
