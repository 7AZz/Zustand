/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  completedDates: string[];
  createAt: string;
}

interface HabitState {
  habits: Habit[];
  addHabit: (name: string, frequency: "daily" | "weekly") => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  fetchHabits: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const useHabitStore = create<HabitState>()(
  persist(
    (set,get) => ({
      habits: [],
      isLoading: false,
      error: null,
      addHabit: (name: string, frequency: "daily" | "weekly") =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: Date.now().toString(),
              name,
              frequency,
              completedDates: [],
              createAt: new Date().toISOString(),
            },
          ],
        })),
      removeHabit: (id: string) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),
      toggleHabit: (id: string, date: string) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  completedDates: habit.completedDates.includes(date)
                    ? habit.completedDates.filter((d) => d !== date)
                    : [...habit.completedDates, date],
                }
              : habit,
          ),
        })),
      fetchHabits: async () => {
        set({ isLoading: true, error: null });
        try {
            const currentHabits = get().habits;
            if(currentHabits.length > 0){
                set({ isLoading: false });
                return;
            }
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const mockHabits: Habit[] = [
            {
              id: "1",
              name: "Drink Water",
              frequency: "daily",
              completedDates: [],
              createAt: new Date().toISOString(),
            },
            {
              id: "2",
              name: "Exercise",
              frequency: "weekly",
              completedDates: [],
              createAt: new Date().toISOString(),
            },
          ];
          set({ habits: mockHabits, isLoading: false });
          // Here you would normally fetch from an API and update the state
          // For this example, we'll just keep the existing habits
        } catch (error) {
          set({ error: "Failed to fetch habits", isLoading: false });
        }
      },
    }),
    {
      name: "habit-local",
    },
  ),
);

export default useHabitStore;
