import { create } from "zustand"
import { Royalty, RoyaltyActivity } from "@/app/[tenantId]/(main)/royalty/royalty-types"

interface RoyaltyStore {
  royalties: Royalty[]
  activities: RoyaltyActivity[]
  addRoyalty: (royalty: Royalty) => void
  updateRoyalty: (royalty: Royalty) => void
  setRoyalties: (royalties: Royalty[]) => void
  addActivity: (activity: RoyaltyActivity) => void
}

export const useRoyaltyStore = create<RoyaltyStore>((set) => ({
  royalties: [],
  activities: [],
  addRoyalty: (royalty) =>
    set((state) => ({
      royalties: [...state.royalties, royalty],
    })),
  updateRoyalty: (royalty) =>
    set((state) => ({
      royalties: state.royalties.map((r) =>
        r.id === royalty.id ? royalty : r
      ),
    })),
  setRoyalties: (royalties) =>
    set(() => ({
      royalties,
    })),
  addActivity: (activity) =>
    set((state) => ({
      activities: [...state.activities, activity],
    })),
}))
