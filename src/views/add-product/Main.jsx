/** @format */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form } from "formik";
import Dropzone from "react-dropzone";
import {
  Lucide,
  Tippy,
  TomSelect,
  Alert,
  ClassicEditor,
} from "@/base-components";

import { useState } from "react";

import {
  atom,
  selector,
  useRecoilSnapshot,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { find, size } from "lodash";
import { string } from "yup";
import { deleteState, URLATOM } from "../../stores/products-data";
import { number } from "prop-types";
import CustomSelect from "../../custom/Select";
import ReactSelect from "react-select";
import { ProductSchema } from "../../schema/ProductSchema";

function Main() {
  const URL = useRecoilValue(URLATOM);
  const [ChangeState, setChangeState] = useRecoilState(deleteState);
  const [pic, setPic] = useState("");
  const [allPic, setAllPic] = useState([]);

  const [product, setProduct] = useState({
    title: "",
    desc: "",
    category: "slipers",
    variant: [
      {
        img: [],
        color: "",
        size: [10],
        price: 0,
        sellPrice: 0,
        slug: "",
        availableQty: 0,
        metadesc: "",
        title: "",
      },
    ],

    tag: "General",
  });

  const [customSize, setCustomSize] = useState("");

  const [sizes, setSizes] = useState(10);
  const [type, setType] = useState("");
  const handleSubmitFn = async (values, actions) => {
    const id = toast.loading("Creating please wait!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    const respData = await fetch(`${URL}/api/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const resp = await respData.json();
    const { success, msg, error } = resp;
    console.log(success, msg, error);
    if (success) {
      setChangeState(!ChangeState);
      toast.update(id, {
        render: msg,
        type: "success",
        isLoading: false,
      });
      if (type === "publish") {
        await newFunction();
      }
    }
    actions.resetForm();
    if (error) {
      toast.update(id, {
        render: error,
        type: "error",
        isLoading: false,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Add Product</h2>
      </div>
      {/* BEGIN: Notification */}
      <Alert className="intro-y col-span-11 alert-primary alert-dismissible mb-6">
        {({ dismiss }) => (
          <>
            <div className="flex items-center">
              <span>
                <Lucide icon="Info" className="w-4 h-4 mr-2" />
              </span>
              <span>
                Starting May 10, 2021, there will be changes to the Terms &
                Conditions regarding the number of products that may be added by
                the Seller.
                <a
                  href="https://themeforest.net/item/midone-jquery-tailwindcss-html-admin-template/26366820"
                  className="underline ml-1"
                  target="blank"
                >
                  Learn More
                </a>
              </span>
              <button
                type="button"
                className="btn-close text-white"
                onClick={dismiss}
                aria-label="Close"
              >
                <Lucide icon="X" className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </Alert>

      <Formik
        onSubmit={handleSubmitFn}
        initialValues={{
          title: "",
          desc: "",
          category: "",
          variant: [
            {
              img: [],
              color: "",
              size: [10],
              price: 0,
              sellPrice: 0,
              slug: "",
              availableQty: 0,
              metadesc: "",
              title: "",
            },
          ],
          tag: "General",
        }}
        validationSchema={ProductSchema}
      >
        {({ values, setFieldValue, setValues, handleSubmit, errors }) => {
          console.log("errors:", errors);
          const styles = {
            error:
              "border-red-500 text-error focus:outline-red-500 focus:border-red-500",
          };

          const addNewVariant = () => {
            let variant = {
              img: [],
              color: "",
              size: [10],
              price: 0,
              sellPrice: 0,
              slug: "",
              availableQty: 0,
              metadesc: "",
              title: "",
            };
            let temp = { ...values };
            temp.variant = [...temp.variant, variant];
            setValues(temp);
          };
          const removeVariant = (i) => {
            let temp = { ...values };

            temp.variant.splice(i, 1);
            setValues(temp);
          };
          const addImages = (i, img) => {
            if (img === "") {
              toast.error("Please select a image");
              return null;
            }
            let temp = { ...values };
            temp.variant[i].img = [...temp.variant[i].img, img];
            setValues(temp);
          };
          const postDetails = (pic, index) => {
            if (!pic) {
              toast.error("Please select a profile picture");
            }
            const picNames = pic.name.split(".")[0];
            // setAllPic([...allPic, { alt: picNames, img: pic.path }]);

            if (pic.type === "image/jpeg" || "image/png") {
              const data = new FormData();
              data.append("file", pic);
              data.append("upload_preset", "chat-app");
              data.append("cloud_name", "hellooworkd");
              fetch(
                "https://api.cloudinary.com/v1_1/hellooworkd/image/upload",
                {
                  method: "post",
                  body: data,
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  setAllPic([...allPic, data.url]);
                  let imgObject = { alt: picNames, img: data.url };
                  addImages(index, imgObject);
                  // setPic(data.url.toString());
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            console.log("Data", data);
          };

          const AlpacaCategories = [
            "alpaca-stuffed-animals",
            "alpaca-slippers",
            "alpaca-clothing",
            "alpaca-key-chain",
          ];
          const addCSizes = (e, i) => {
            let temp = { ...values };
            if (e === "") {
              toast.error("Please enter a size");
              return null;
            }

            let size = parseInt(e);
            let IsSizeAlreadyExist = values.variant[i].size.find(
              (v) => v === size
            );
            console.log(IsSizeAlreadyExist);
            if (IsSizeAlreadyExist) return toast.error("Size already exists");
            if (isNaN(size)) {
              toast.error("Please enter a valid size");
              return null;
            }

            temp.variant[i].size = [...temp.variant[i].size, size];
            setValues(temp);
          };

          const removeCSizes = (i, j) => {
            let temp = { ...values };
            temp.variant[i].size.splice(j, 1);
            setValues(temp);
          };
          const slugCreater = (i) => {
            let temp = { ...values };
            let url = values.title.replace(/\s+/g, "-").toLowerCase();
            let variant = i + 1;
            let sizes = temp.variant[i].size;
            let Urlsize = sizes.join("-");
            temp.variant[i].slug =
              url + "-" + temp.variant[i].color + "-" + Urlsize + "-" + variant;
            setValues(temp);
          };
          for (let i = 0; i < Object.keys(errors).length; i++) {
            let name = Object.keys(errors)[i];
            const element = document.getElementsByName(name);
          }
          return (
            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-11 gap-x-6 mt-5 pb-20">
                <div className="intro-y col-span-11 2xl:col-span-9">
                  <div className="intro-y box p-5 mt-5">
                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                      <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                        <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" />{" "}
                        Product Information
                      </div>
                      <div className="mt-5">
                        <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                          <div className="form-label xl:w-64 xl:!mr-10">
                            <div className="text-left">
                              <div className="flex items-center">
                                <div className="font-medium">Product Name</div>
                                <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                  Required
                                </div>
                              </div>
                              <div className="leading-relaxed text-slate-500 text-xs mt-3">
                                Include min. 40 characters to make it more
                                attractive and easy for buyers to find,
                                consisting of product type, brand, and
                                information such as color, material, or type.
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-3 xl:mt-0 flex-1">
                            <Field
                              id="title"
                              type="text"
                              className={`${
                                errors.title && styles.error
                              } form-control`}
                              name="title"
                              placeholder="Product name"
                            />
                            <div className="form-help text-right">
                              Maximum character 0/70
                            </div>
                          </div>
                        </div>
                        <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                          <div className="form-label xl:w-64 xl:!mr-10">
                            <div className="text-left">
                              <div className="flex items-center">
                                <div className="font-medium">Category</div>
                                <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                  Required
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-3 xl:mt-0 flex-1">
                            <Field
                              id="category"
                              name="category"
                              as="select"
                              className="form-select"
                            >
                              <option value="">Select Category</option>

                              {AlpacaCategories.map((item, index) => (
                                <option
                                  value={item}
                                  className="uppercase"
                                  key={index}
                                >
                                  {item.split("-").join(" ")}
                                </option>
                              ))}
                            </Field>
                          </div>
                        </div>
                        <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                          <div className="form-label xl:w-64 xl:!mr-10">
                            <div className="text-left">
                              <div className="flex items-center">
                                <div className="font-medium">Tag</div>
                                <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                  Required
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-3 xl:mt-0 flex-1">
                            <Field
                              as="select"
                              id="tag"
                              name="tag"
                              className={`${
                                errors.tag && styles.error
                              } form-control`}
                            >
                              <option value="General">General</option>
                              <option value="Recommended">Recommended</option>
                              <option value="Top">Top</option>
                              <option value="Best Seller">Best Seller</option>
                            </Field>
                          </div>
                        </div>
                        {/* <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                          <div className="form-label xl:w-64 xl:!mr-10">
                            <div className="text-left">
                              <div className="flex items-center">
                                <div className="font-medium">Subcategory</div>
                              </div>
                              <div className="leading-relaxed text-slate-500 text-xs mt-3">
                                You can add a new subcategory or choose from the
                                existing subcategory list.
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-3 xl:mt-0 flex-1">
                            <select
                              id="tag"
                              name="tag"
                              value={product.tag}
                              onChange={handleChange}
                              className="form-select"
                            >
                              <option value="General">General</option>
                              <option value="Recommended">Recommended</option>
                              <option value="Top">Top</option>
                              <option value="Best Seller">Best Seller</option>
                            </select>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="intro-y box p-5 mt-5">
                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                      <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                        <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" />{" "}
                        Product Detail
                      </div>
                      <div className="mt-5">
                        <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                          <div className="form-label xl:w-64 xl:!mr-10">
                            <div className="text-left"></div>
                          </div>
                          <div className="w-full mt-3 xl:mt-0 flex-1">
                            <div className="flex flex-col sm:flex-row"></div>
                          </div>
                        </div>
                        <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                          <div className="form-label xl:w-64 xl:!mr-10">
                            <div className="text-left">
                              <div className="flex items-center">
                                <div className="font-medium">
                                  Product Description
                                </div>
                                <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                  Required
                                </div>
                              </div>
                              <div className="leading-relaxed text-slate-500 text-xs mt-3">
                                <div>
                                  Make sure the product description provides a
                                  detailed explanation of your product so that
                                  it is easy to understand and find your
                                  product.
                                </div>
                                <div className="mt-2">
                                  It is recommended not to enter info on mobile
                                  numbers, e-mails, etc. into the product
                                  description to protect your personal data.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-3 xl:mt-0 flex-1">
                            <div class="box border rounded flex flex-col shadow bg-white">
                              <div class="box__title bg-grey-lighter px-3 py-2 border-b">
                                <h3 class="text-sm text-grey-darker font-medium">
                                  Product Description
                                </h3>
                              </div>
                              <Field
                                as="textarea"
                                name="desc"
                                placeholder="Product Description"
                                cols={30}
                                rows={10}
                                className={`${
                                  errors.title && styles.error
                                } form-control`}
                              ></Field>
                            </div>

                            <div className="form-help text-right">
                              Maximum character 0/2000
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="intro-y box p-5 mt-5">
                    <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                      <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                        <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" />{" "}
                        Product Variant (Details)
                      </div>
                      <div className="mt-5">
                        {values.variant.map((item, index) => {
                          return (
                            <div className="form-inline items-start flex-col xl:flex-row mt-2 pt-2 first:mt-0 first:pt-0">
                              <div className="form-label xl:w-64 xl:!mr-10">
                                <div className="text-left">
                                  <div className="flex items-center">
                                    <div className="font-medium">
                                      Variant {index + 1}
                                    </div>
                                  </div>
                                  <div className="leading-relaxed text-slate-500 text-xs mt-3">
                                    Add the types of variants and options, you
                                    can add up to 5 options.
                                  </div>
                                </div>
                              </div>
                              <div className="w-full mt-3 xl:mt-0 flex-1">
                                <div className="relative pl-5 pr-5 xl:pr-10 py-10 bg-slate-50 dark:bg-transparent dark:border rounded-md">
                                  <button
                                    className="text-slate-500 absolute top-0 right-0 mr-4 mt-4"
                                    onClick={() => {
                                      removeVariant(index);
                                    }}
                                  >
                                    <Lucide icon="X" className="w-5 h-5" />
                                  </button>

                                  <div>
                                    <div className="form-inline mt-5 items-start first:mt-0">
                                      <label className="form-label mt-2 sm:w-20">
                                        Image
                                      </label>
                                      <div className="w-full mt-3 xl:mt-0 flex-1 border-2 border-dashed dark:border-darkmode-400 rounded-md pt-4">
                                        <div className="grid grid-cols-10 gap-5 pl-4 pr-5">
                                          {values.variant[index].img.length >
                                            0 &&
                                            values.variant[index].img.map(
                                              (pic, index) => {
                                                return (
                                                  <img
                                                    key={index}
                                                    className="rounded-md w-20 h-20 object-cover col-span-2"
                                                    alt="Midone - HTML Admin Template"
                                                    src={pic.img}
                                                  />
                                                );
                                              }
                                            )}
                                        </div>
                                        <div className="px-4 pb-4 mt-5 flex items-center justify-center cursor-pointer relative">
                                          <Lucide
                                            icon="Image"
                                            className="w-4 h-4 mr-2"
                                          />

                                          <Dropzone
                                            onDrop={(item) => {
                                              item.map((i) => {
                                                postDetails(i, index);
                                              });
                                            }}
                                          >
                                            {({
                                              getRootProps,
                                              getInputProps,
                                            }) => (
                                              <section>
                                                <div
                                                  {...getRootProps({
                                                    className: "dropzone",
                                                  })}
                                                >
                                                  <input {...getInputProps()} />
                                                  `Drag and drop files here, or
                                                  click to select files`
                                                </div>
                                                {/* <aside className="selected-file-wrapper">
                                                  <button
                                                    className="btn btn-success"
                                                    // disabled={!selectedFiles}
                                                    // onClick={this.uploadFiles}
                                                  >
                                                    Upload
                                                  </button>
                                                </aside> */}
                                              </section>
                                            )}
                                          </Dropzone>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="form-inline mt-5 items-start first:mt-0">
                                      <label className="form-label mt-2 sm:w-20">
                                        Add Url Img
                                      </label>
                                      <div className="flex-1">
                                        <div className="xl:flex items-center mt-5 first:mt-0">
                                          <div className="input-group flex-1">
                                            <Field
                                              type="text"
                                              className="form-control"
                                              placeholder="url like this: /product/your-slug"
                                              onChange={(e) => {
                                                setPic(e.target.value);
                                              }}
                                              name="slug"
                                              value={pic}
                                            />
                                            <button
                                              type="button"
                                              className="input-group-text"
                                              onClick={() => {
                                                addImages(index, pic);
                                                setPic("");
                                              }}
                                            >
                                              ADD URL
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="form-inline mt-5 first:mt-0">
                                      {/* <ReactSelect
                                        className={""}
                                        name={"variant.size"}
                                        value={values.variant[index].size}
                                        onChange={handleChange}
                                        // placeholder={placeholder}
                                        options={item.size}
                                        isMulti={true}
                                      /> */}
                                      <label className="form-label mt-2 sm:w-20">
                                        Size
                                      </label>
                                      <div className="space-x-2">
                                        {item.size.map((size, spanIndex) => {
                                          return (
                                            <span
                                              className="py-3 px-4 cursor-pointer bg-gray-400 rounded-sm relative group"
                                              id={index}
                                            >
                                              <span
                                                className="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl group-hover:block group-hover:bg-gray-200  px-4 "
                                                onClick={(e) => {
                                                  // setSizes(sizes.filter((item, i) => i !== index))
                                                  removeCSizes(
                                                    index,
                                                    spanIndex
                                                  );
                                                  // setSizes(
                                                  //   item.size.filter(
                                                  //     (s, i) => i !== index
                                                  //   )
                                                  // );
                                                }}
                                              >
                                                x
                                              </span>
                                              {size}
                                            </span>
                                          );
                                        })}
                                      </div>
                                      <div className="w-full mt-3 xl:mt-0 flex-1 ml-2">
                                        <select
                                          id="category"
                                          name="size"
                                          value={sizes}
                                          onChange={(e) => {
                                            setSizes(e.target.value);
                                            if (
                                              item.size.includes(e.target.value)
                                            ) {
                                              toast.warn(
                                                `${
                                                  e.target.value
                                                } already in variant ${
                                                  index + 1
                                                }`,
                                                {
                                                  position: "bottom-center",
                                                  autoClose: 5000,
                                                  hideProgressBar: false,
                                                  closeOnClick: true,
                                                  pauseOnHover: true,
                                                  draggable: true,
                                                  progress: undefined,
                                                }
                                              );
                                              return;
                                            }

                                            //  sizes.find((item) => item === e.target.value)
                                            // setSizes([...sizes, e.target.value]);
                                            addCSizes(e.target.value, index);
                                          }}
                                          className="form-select"
                                        >
                                          <option value={10}>10</option>
                                          <option value={20}>20</option>
                                          <option value={30}>30</option>
                                          <option value={40}>40</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="form-inline mt-5 items-start first:mt-0">
                                      <label className="form-label mt-2 sm:w-20">
                                        Add Size
                                      </label>
                                      <div className="flex-1">
                                        <div className="xl:flex items-center mt-5 first:mt-0">
                                          <div className="input-group flex-1">
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Please Add Your Custom Size"
                                              onChange={(e) => {
                                                setCustomSize(e.target.value);
                                              }}
                                              name="customSize"
                                              value={customSize}
                                            />
                                            <button
                                              className="input-group-text"
                                              onClick={() => {
                                                addCSizes(customSize, index);
                                                setCustomSize("");
                                              }}
                                              type="button"
                                            >
                                              ADD SIZE
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="form-inline mt-5 items-start first:mt-0">
                                      <label className="form-label mt-2 sm:w-20">
                                        Slug
                                      </label>
                                      <div className="flex-1">
                                        <div className="xl:flex items-center mt-5 first:mt-0">
                                          <div className="input-group flex-1">
                                            <Field
                                              type="text"
                                              className="form-control"
                                              placeholder="url like this: /product/your-slug"
                                              name={`variant[${[index]}].slug`}
                                            />
                                            <button
                                              type="button"
                                              className="input-group-text"
                                              onClick={() => {
                                                slugCreater(index);
                                              }}
                                            >
                                              Create Slug
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="form-inline mt-5 items-start first:mt-0">
                                      <label className="form-label mt-2 sm:w-20">
                                        Color
                                      </label>
                                      <div className="w-full mt-3 xl:mt-0 flex-1">
                                        <Field
                                          type="text"
                                          className="form-control capitalize"
                                          placeholder="color"
                                          // onChange={(e) => {
                                          //   handleBranchChange(e, index);
                                          // }}
                                          name={`variant[${[index]}].color`}
                                          // value={item.color}
                                        />
                                      </div>
                                    </div>
                                    <div className="form-inline mt-5 items-start first:mt-0">
                                      <label className="form-label mt-2 sm:w-20 text-center">
                                        Normal Price
                                      </label>
                                      <div className="w-full mt-3 xl:mt-0 flex-1">
                                        <Field
                                          type="number"
                                          className="form-control capitalize"
                                          placeholder="Price"
                                          name={`variant[${[index]}].price`}
                                        />
                                      </div>
                                      <label className="form-label mt-2 sm:w-20">
                                        Sell Price
                                      </label>
                                      <div className="w-full mt-3 xl:mt-0 flex-1">
                                        <Field
                                          type="number"
                                          className="form-control capitalize"
                                          placeholder="Price"
                                          name={`variant[${[index]}].sellPrice`}
                                        />
                                      </div>
                                    </div>
                                    <div className="form-inline mt-5 items-start first:mt-0">
                                      <label className="form-label mt-2 sm:w-20">
                                        Stock
                                      </label>
                                      <div className="w-full mt-3 xl:mt-0 flex-1">
                                        <Field
                                          type="number"
                                          className="form-control capitalize"
                                          placeholder="Stock"
                                          name={`variant[${[
                                            index,
                                          ]}].availableQty`}
                                        />
                                      </div>
                                    </div>
                                    <div className="form-inline mt-5 items-start first:mt-0">
                                      <label className="form-label mt-2 sm:w-20">
                                        Title
                                      </label>
                                      <div className="w-full mt-3 xl:mt-0 flex-1">
                                        <Field
                                          type="text"
                                          className="form-control capitalize"
                                          placeholder="color"
                                          name={`variant[${[index]}].title`}
                                        />
                                      </div>
                                    </div>
                                    <div className="form-inline mt-5 items-start first:mt-0">
                                      <label className="form-label mt-2 sm:w-20">
                                        Meta Description
                                      </label>
                                      <div className="w-full mt-3 xl:mt-0 flex-1">
                                        <Field
                                          type="text"
                                          className="form-control capitalize"
                                          placeholder="color"
                                          name={`variant[${[index]}].metadesc`}
                                        />
                                      </div>
                                    </div>
                                    <div className="xl:ml-20 xl:pl-5 xl:pr-20 mt-5 first:mt-0">
                                      <button className="btn btn-outline-primary border-dashed w-full">
                                        <Lucide
                                          icon="Plus"
                                          className="w-4 h-4 mr-2"
                                        />{" "}
                                        Add New Option
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <div className="xl:ml-64 xl:pl-10 mt-2 pt-2 first:mt-0 first:pt-0">
                          <button
                            type="button"
                            className="btn py-3 btn-outline-secondary border-dashed w-full"
                            onClick={addNewVariant}
                          >
                            <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add
                            New Variant
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end flex-col md:flex-row gap-2 mt-5">
                    <button
                      type="button"
                      className="btn py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 w-full md:w-52"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 w-full md:w-52"
                      onClick={(e) => setType("publish")}
                    >
                      Save & Add New Product
                    </button>
                    <button
                      type="submit"
                      className="btn py-3 btn-primary w-full md:w-52"
                      onClick={(e) => setType("create")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );

  async function newFunction() {
    let ImpData = {
      slugToValidate: "/alpaca-toys",
      secret: "vir",
      slugs: ["/alpaca-toys", "/"],
    };
    const revlidate = toast.loading("Publishing please wait!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    const respData = await fetch(`${URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ImpData),
    });
    toast.update(revlidate, {
      render: "Published Successfully",
      type: "success",
      isLoading: false,
    });
  }
}

export default Main;
