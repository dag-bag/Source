/** @format */

import { atom, selector } from "recoil";
import _ from "lodash";

export const productsDataAtom = selector({
  key: "productsAtom",
  get: async ({ get }) => {
    const State = get(deleteState);
    const URl = get(URLATOM);

    const response = await fetch(`${URl}/api/product`);

    const data = await response.json();
    let products = data.products;
    return products;
  },
});
export const deleteState = atom({
  key: "deleteState",
  default: false,
});

export const URLATOM = atom({
  key: "apiUrl",
  default: "http://localhost:3001",
});
