import { create } from 'zustand'
import { Contract, ContractStatus, ContractActivity } from '@/app/[tenantId]/(main)/contract/contract-types'

interface ContractStore {
  contracts: Contract[]
  activities: Record<number, ContractActivity[]>
  setContracts: (contracts: Contract[]) => void
  addContract: (contract: Contract) => void
  updateContract: (id: number, contract: Partial<Contract>) => void
  addActivity: (contractId: number, activity: Omit<ContractActivity, "id">) => void
  updateStatus: (contractId: number, newStatus: ContractStatus, userId: number, userName: string) => void
}

export const useContractStore = create<ContractStore>((set, get) => ({
  contracts: [],
  activities: {},
  setContracts: (contracts) => set({ contracts }),
  addContract: (contract) => 
    set((state) => ({ 
      contracts: [...state.contracts, contract] 
    })),
  updateContract: (id, contract) =>
    set((state) => ({
      contracts: state.contracts.map((item) =>
        item.id === id ? { ...item, ...contract } : item
      ),
    })),
  addActivity: (contractId, activity) =>
    set((state) => ({
      activities: {
        ...state.activities,
        [contractId]: [
          ...(state.activities[contractId] || []),
          { ...activity, id: Date.now() }
        ]
      }
    })),
  updateStatus: (contractId, newStatus, userId, userName) => {
    const contract = get().contracts.find(c => c.id === contractId);
    if (!contract) return;

    const oldStatus = contract.Status;

    // Update contract status
    get().updateContract(contractId, { Status: newStatus });

    // Add status change activity
    get().addActivity(contractId, {
      contractId,
      type: "status_change",
      description: `Sözleşme durumu değiştirildi: ${oldStatus} → ${newStatus}`,
      oldStatus,
      newStatus,
      createdBy: userId,
      createdByName: userName,
      createdAt: new Date().toISOString()
    });
  }
}))
