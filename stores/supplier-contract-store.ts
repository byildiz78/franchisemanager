import { create } from "zustand"
import { SupplierContract } from "@/app/[tenantId]/(main)/supplier-contract/supplier-contract-types"

interface SupplierContractStore {
  contracts: SupplierContract[]
  setContracts: (contracts: SupplierContract[]) => void
  addContract: (contract: SupplierContract) => void
  updateContract: (id: number, contract: Partial<SupplierContract>) => void
  deleteContract: (id: number) => void
}

export const useSupplierContractStore = create<SupplierContractStore>((set) => ({
  contracts: [],
  setContracts: (contracts) => set({ contracts }),
  addContract: (contract) =>
    set((state) => ({
      contracts: [...state.contracts, contract],
    })),
  updateContract: (id, updatedContract) =>
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === id ? { ...contract, ...updatedContract } : contract
      ),
    })),
  deleteContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((contract) => contract.id !== id),
    })),
}))
