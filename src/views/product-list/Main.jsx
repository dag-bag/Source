/** @format */

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
import { ToastContainer, toast } from "react-toastify";
import { faker as $f } from "@/utils";
import * as $_ from "lodash";
import classnames from "classnames";
import { Suspense } from "react";
import {
  atom,
  useRecoilSnapshot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  deleteState,
  productsDataAtom,
  URLATOM,
} from "../../stores/products-data";
import SubProductList from "./Sub-Product-List";

export const deleteConfirmationAtom = atom({
  key: "deleteConfirmationAtom",
  default: false,
});
export const deleteProductIdAtom = atom({
  key: "deleteProductIdAtom",
  default: null,
});
function Main() {
  const setDeleteState = useSetRecoilState(deleteState);
  const HOST = useRecoilValue(URLATOM);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useRecoilState(
    deleteConfirmationAtom
  );
  const deletedId = useRecoilValue(deleteProductIdAtom);
  const DeleteProduct = async () => {
    const deleteProduct = await fetch(
      `${HOST}/api/product?id=${deletedId}`,

      {
        method: "DELETE",
      }
    );
    const deleteProductJson = await deleteProduct.json();
    if (deleteProductJson.success) {
      async function Revalidate() {
        let ImpData = {
          slugToValidate: "/alpaca-toys",
          secret: "vir",
          slugs: ["/alpaca-toys", "/"],
        };
        const revlidate = toast.loading("Deleting please wait!", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const respData = await fetch(`${HOST}/api/revalidate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ImpData),
        });
        toast.update(revlidate, {
          render: "Deleted Successfully",
          type: "success",
          isLoading: false,
        });
      }
      Revalidate();
    }
    setDeleteConfirmationModal(false);
  };
  // const products = useRecoilValue(productsDataAtom);
  // console.log(products);

  return (
    <>
      <ToastContainer />
      <h2 className="intro-y text-lg font-medium mt-10">Product List</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <button className="btn btn-primary shadow-md mr-2">
            Add New Product
          </button>
          <Dropdown>
            <DropdownToggle className="btn px-2 box">
              <span className="w-5 h-5 flex items-center justify-center">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
            </DropdownToggle>
            <DropdownMenu className="w-40">
              <DropdownContent>
                <DropdownItem>
                  <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
                </DropdownItem>
                <DropdownItem>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  Excel
                </DropdownItem>
                <DropdownItem>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  PDF
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
          <div className="hidden md:block mx-auto text-slate-500">
            Showing 1 to 10 of 150 entries
          </div>
          <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
            <div className="w-56 relative text-slate-500">
              <input
                type="text"
                className="form-control w-56 box pr-10"
                placeholder="Search..."
              />
              <Lucide
                icon="Search"
                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Data List -*/}
        <Suspense fallback={<div>loading....</div>}>
          <SubProductList />
        </Suspense>
        {/* END: Data List -*/}
        {/* BEGIN: Pagination -*/}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
          <nav className="w-full sm:w-auto sm:mr-auto">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#">
                  <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  <Lucide icon="ChevronLeft" className="w-4 h-4" />
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  ...
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  ...
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  <Lucide icon="ChevronsRight" className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </nav>
          <select className="w-20 form-select box mt-3 sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </select>
        </div>

        {/* END: Pagination -*/}
      </div>
      {/* BEGIN: Delete Confirmation Modal -*/}
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteState(true);
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger w-24"
              onClick={() => {
                DeleteProduct();
              }}
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal -*/}
    </>
  );
}

export default Main;
