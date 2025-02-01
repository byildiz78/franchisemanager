import { create } from 'zustand'
import { Rental, RentalStatus, RentalActivity } from '@/app/[tenantId]/(main)/rental/rental-types'

interface RentalStore {
  rentals: Rental[]
  activities: Record<number, RentalActivity[]>
  setRentals: (rentals: Rental[]) => void
  addRental: (rental: Rental) => void
  updateRental: (id: number, rental: Partial<Rental>) => void
  addActivity: (rentalId: number, activity: Omit<RentalActivity, "id">) => void
  updateStatus: (rentalId: number, newStatus: RentalStatus, userId: number, userName: string) => void
}

export const useRentalStore = create<RentalStore>((set, get) => ({
  rentals: [],
  activities: {},
  setRentals: (rentals) => set({ rentals }),
  addRental: (rental) => 
    set((state) => ({ 
      rentals: [...state.rentals, rental] 
    })),
  updateRental: (id, rental) =>
    set((state) => ({
      rentals: state.rentals.map((item) =>
        item.id === id ? { ...item, ...rental } : item
      ),
    })),
  addActivity: (rentalId, activity) =>
    set((state) => ({
      activities: {
        ...state.activities,
        [rentalId]: [
          ...(state.activities[rentalId] || []),
          { ...activity, id: Date.now() }
        ]
      }
    })),
  updateStatus: (rentalId, newStatus, userId, userName) => {
    const rental = get().rentals.find(r => r.id === rentalId);
    if (!rental) return;

    const oldStatus = rental.Status;

    // Update rental status
    get().updateRental(rentalId, { Status: newStatus });

    // Add status change activity
    get().addActivity(rentalId, {
      rentalId,
      type: "status_change",
      description: `Kiralama durumu değiştirildi: ${oldStatus} → ${newStatus}`,
      oldStatus,
      newStatus,
      createdBy: userId,
      createdByName: userName,
      createdAt: new Date().toISOString()
    });
  }
}))
