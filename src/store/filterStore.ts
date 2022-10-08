import create from "zustand";

export type OrderBy = "ASC" | "DESC";
export type Year = "TOTAL" | "F2018" | "F2019" | "F2020";

interface FilterState {
  orderBy: OrderBy;
  year: Year;
  count: number;
  setCount: (count: number) => void;
  setOrderBy: (orderBy: OrderBy) => void;
  setYear: (year: Year) => void;
  resetDefault: () => void;
}

export const useFilter = create<FilterState>((set) => ({
  orderBy: "DESC",
  year: "TOTAL",
  count: 1,
  setCount: (count: number) => set(() => ({ count })),
  setOrderBy: (orderBy: OrderBy) => set(() => ({ orderBy })),
  setYear: (year: Year) => set(() => ({ year })),
  resetDefault: () => set(() => ({ orderBy: "DESC", year: "TOTAL", count: 1 })),
}));
