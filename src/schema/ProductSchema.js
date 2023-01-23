/** @format */

import { string } from "prop-types";
import * as Yup from "yup";
const stringRequired = Yup.string()
  .min(2, "Too Short")
  .max(50, "Too Long")
  .required("Required");
const ArrayRequired = Yup.array().required("Required");
const NumRequired = Yup.number().required("Required");
let VariantSchema = Yup.object().shape({
  img: ArrayRequired,
  color: stringRequired,
  size: ArrayRequired,
  price: NumRequired,
  sellPrice: NumRequired,
  slug: stringRequired,
  availableQty: NumRequired,
  metadesc: stringRequired,
  title: stringRequired,
});
export const ProductSchema = Yup.object().shape({
  title: stringRequired,
  desc: stringRequired,
  category: stringRequired,
  variant: Yup.array().of(VariantSchema),
  tag: stringRequired,
});
