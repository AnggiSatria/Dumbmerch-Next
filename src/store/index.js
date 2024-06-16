import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { users } from "./user";
import { transaction } from "./transaction";
import { product } from "./product";
import { category } from "./category";

export const useStore = create(
  persist(
    (set) => ({
      ...users(set),
      ...transaction(set),
      ...product,
      ...category(set),
    }),
    {
      name: "store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
