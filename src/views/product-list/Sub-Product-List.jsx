/** @format */

import * as $_ from "lodash";
import React, { useState } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  deleteState,
  EditableProduct,
  productsDataAtom,
} from "../../stores/products-data";
import {
  Lucide,
  Tippy,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  Modal,
  ModalBody,
} from "@/base-components";
import classnames from "classnames";
import { deleteConfirmationAtom, deleteProductIdAtom } from "./Main";
import { useNavigate } from "react-router-dom";
function SubProductList() {
  const navigate = useNavigate();
  const setEditProduct = useSetRecoilState(EditableProduct);
  const setDeleteConfirmationModal = useSetRecoilState(deleteConfirmationAtom);
  const setDeleteProductId = useSetRecoilState(deleteProductIdAtom);

  const products = useRecoilValue(productsDataAtom);
  const [deleteSta, setDeleteState] = useRecoilState(deleteState);
  console.log("products:", products);
  console.log("deleteState:", deleteSta);

  return (
    <div className="intro-y col-span-12 overflow-auto lg:overflow-visible ">
      <table className="table table-report -mt-2">
        <thead>
          <tr>
            <th className="whitespace-nowrap">IMAGES</th>
            <th className="whitespace-nowrap">PRODUCT NAME</th>
            <th className="whitespace-nowrap">Variant NAME</th>

            <th className="text-center whitespace-nowrap">STOCK</th>
            <th className="text-center whitespace-nowrap">PRICE</th>
            <th className="text-center whitespace-nowrap">STATUS</th>
            <th className="text-center whitespace-nowrap">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {$_.take(products, 10).map((faker, fakerKey) => (
            <tr key={fakerKey} className="intro-x h-auto">
              <td className="w-40">
                <div className="flex">
                  <div className="w-10 h-10 image-fit zoom-in">
                    {faker?.variant.map((i) => {
                      return i.img.map((i) => {
                        return (
                          <>
                            <Tippy
                              tag="img"
                              alt="Midone Tailwind HTML Admin Template"
                              className="rounded-full"
                              src={i}
                              content={`Uploaded at faker.dates}`}
                            />
                          </>
                        );
                      });
                    })}
                  </div>
                </div>
              </td>
              <td>
                <a href="" className="font-medium whitespace-nowrap">
                  {faker.title}
                </a>
                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  {faker.category}
                </div>
              </td>
              <td>
                {faker.variant.map((item, i) => {
                  console.log("item:", item);
                  return (
                    <div>
                      <h1>Variant {i + 1}</h1>
                    </div>
                  );
                })}
              </td>
              <td>
                {faker.variant.map((item, i) => {
                  return (
                    <div>
                      <h1>{item.availableQty}</h1>
                    </div>
                  );
                })}
              </td>
              <td className="mt-4">
                {faker.variant.map((item, i) => {
                  return (
                    <div className="">
                      <h1>{item.price}</h1>
                    </div>
                  );
                })}
              </td>

              <td className="w-40">
                <div
                  className={classnames({
                    "flex items-center justify-center": true,
                    // "text-success": faker.trueFalse[0],
                    // "text-danger": !faker.trueFalse[0],
                  })}
                >
                  <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />

                  {faker.active ? "Active" : "Inactive"}
                </div>
              </td>
              <td className="table-report__action w-56">
                <div className="flex justify-center items-center">
                  <button
                    className="flex items-center mr-3"
                    onClick={() => {
                      setEditProduct(faker);
                      navigate(`/edit-product/${faker._id}`);
                    }}
                  >
                    <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    className="flex items-center text-danger"
                    onClick={() => {
                      setDeleteConfirmationModal(true);

                      setDeleteProductId(faker._id);
                    }}
                  >
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubProductList;
