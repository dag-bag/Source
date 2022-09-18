/** @format */

import { selector } from "recoil";
import _ from "lodash";
export const productsDataAtom = selector({
  key: "productsAtom",
  get: async () => {
    const response = await fetch("https://incascestor.vercel.app/api/product");

    const data = await response.json();
    let products = data.products;
    return products;
  },
});
