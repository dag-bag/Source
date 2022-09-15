/** @format */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form } from "formik";
import {
  Lucide,
  Tippy,
  TomSelect,
  Alert,
  ClassicEditor,
} from "@/base-components";

import { useState } from "react";
import { atom, selector, useRecoilValue } from "recoil";
import { size } from "lodash";

function Main() {
  const [pic, setPic] = useState("");
  const [allPic, setAllPic] = useState([]);
  console.log(allPic);

  const postDetails = (pic, index) => {
    if (!pic) {
      toast.error("Please select a profile picture");
    }

    if (pic.type === "image/jpeg" || "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "hellooworkd");
      fetch("https://api.cloudinary.com/v1_1/hellooworkd/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setAllPic([...allPic, data.url]);
          addImages(index, data.url);
          // setPic(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    }
    console.log("Data", data);
  };

  // const respData = await fetch("http://localhost:3000/api/products", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     ...product,
  //   }),
  // });

  const [active, setActive] = useState(false);
  const addNewVariant = () => {
    let a = {
      img: [],
      color: "",
      size: [],
      price: 0,
      slug: "",
      availableQty: 0,
    };
    let temp = { ...product };
    temp.variant = [...temp.variant, a];
    setProduct(temp);
  };
  const removeVariant = (i) => {
    let temp = { ...product };
    // temp.variant.filter((vi, i) => i !== index);
    temp.variant.splice(i, 1);
    setProduct(temp);
  };

  const [product, setProduct] = useState({
    title: "",
    desc: "",
    category: "slipers",
    variant: [
      { img: [], color: "", size: [10], price: 0, slug: "", availableQty: 0 },
    ],
    tag: "General",
  });
  let url = product.title.replace(/\s+/g, "-").toLowerCase();
  const slugCreater = (i) => {
    let temp = { ...product };
    let variant = i + 1;
    let sizes = temp.variant[i].size;
    let Urlsize = sizes.join("-");
    temp.variant[i].slug =
      url + "-" + temp.variant[i].color + "-" + Urlsize + "-" + variant;
    setProduct(temp);
  };

  const [customSize, setCustomSize] = useState();

  const addCSizes = (e, i) => {
    let temp = { ...product };
    let size = parseInt(e.target.value);

    temp.variant[i].size = [...temp.variant[i].size, size];
    setProduct(temp);
  };
  const addImages = (i, img) => {
    let temp = { ...product };
    temp.variant[i].img = [...temp.variant[i].img, img];
    setProduct(temp);
  };
  const removeCSizes = (i, j) => {
    let temp = { ...product };
    temp.variant[i].size.splice(j, 1);
    setProduct(temp);
  };
  const handleChange = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBranchChange = (e, i) => {
    let temp = { ...product };
    temp.variant[i][e.target.name] = e.target.value;
    setProduct(temp);
  };
  console.log(product);

  const [sizes, setSizes] = useState(10);

  const handleSubimt = async (e) => {
    // console.log({ pic });
    console.log(product);

    const id = toast.loading("Creating please wait!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    const respData = await fetch("https://incascestor.vercel.app/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const resp = await respData.json();
    const { success, msg, error } = resp;
    console.log(success, msg, error);
    if (success) {
      toast.update(id, { render: msg, type: "success", isLoading: false });
    }

    if (error) {
      toast.update(id, { render: error, type: "error", isLoading: false });
    }
    // const productData = await fetch("http://localhost:3001/api/product");
    // const all = await productData.json();
    // console.log(all);
  };

  return (
    <>
      <ToastContainer />
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Add Product</h2>
      </div>
      <div className="grid grid-cols-11 gap-x-6 mt-5 pb-20">
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
                  Conditions regarding the number of products that may be added
                  by the Seller.
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
        {/* BEGIN: Notification */}
        <div className="intro-y col-span-11 2xl:col-span-9">
          <div className="intro-y box p-5 mt-5">
            <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
              <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Product
                Information
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
                        Include min. 40 characters to make it more attractive
                        and easy for buyers to find, consisting of product type,
                        brand, and information such as color, material, or type.
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <input
                      id="product-name"
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="Product name"
                      value={product.title}
                      onChange={(e) => {
                        handleChange(e);
                      }}
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
                    <select
                      id="category"
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="slipers">Slipers</option>
                      <option value="slipers">Slipers</option>
                      <option value="slipers">Slipers</option>
                      <option value="slipers">Slipers</option>
                      <option value="slipers">Slipers</option>
                    </select>
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
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
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
                </div>
              </div>
            </div>
          </div>

          <div className="intro-y box p-5 mt-5">
            <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
              <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Product
                Detail
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
                        <div className="font-medium">Product Description</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        <div>
                          Make sure the product description provides a detailed
                          explanation of your product so that it is easy to
                          understand and find your product.
                        </div>
                        <div className="mt-2">
                          It is recommended not to enter info on mobile numbers,
                          e-mails, etc. into the product description to protect
                          your personal data.
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
                      <textarea
                        name="desc"
                        value={product.desc}
                        onChange={handleChange}
                        placeholder="Product Description"
                        cols={30}
                        rows={10}
                      ></textarea>
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
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Product
                Variant (Details)
              </div>
              <div className="mt-5">
                {product.variant.map((item, index) => {
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
                            Add the types of variants and options, you can add
                            up to 5 options.
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
                                  {item.img.length > 0 &&
                                    item.img.map((pic, index) => {
                                      return (
                                        <img
                                          key={index}
                                          className="rounded-md w-20 h-20 object-cover col-span-2"
                                          alt="Midone - HTML Admin Template"
                                          src={pic}
                                        />
                                      );
                                    })}
                                </div>
                                <div className="px-4 pb-4 mt-5 flex items-center justify-center cursor-pointer relative">
                                  <Lucide
                                    icon="Image"
                                    className="w-4 h-4 mr-2"
                                  />
                                  <span className="text-primary mr-1">
                                    Upload a file
                                  </span>{" "}
                                  or drag and drop
                                  <input
                                    id="horizontal-form-1"
                                    type="file"
                                    className="w-full h-full top-0 left-0 absolute opacity-0"
                                    onChange={(e) => {
                                      postDetails(e.target.files[0], index);
                                      // addImages(image, index);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-inline mt-5 first:mt-0">
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
                                          removeCSizes(index, spanIndex);
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
                                    if (item.size.includes(e.target.value)) {
                                      toast.warn(
                                        `${e.target.value} already in variant ${
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
                                    addCSizes(e, index);
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
                                Custom Size
                              </label>
                              <div className="flex-1">
                                <div className="xl:flex items-center mt-5 first:mt-0">
                                  <div className="input-group flex-1">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="size"
                                      placeholder="Add your custom size"
                                      onChange={(e) => {
                                        setCustomSize(e.target.value);
                                      }}
                                      value={customSize}
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      addCSizes(customSize, index);
                                    }}
                                  >
                                    Add
                                  </button>
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
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="url like this: /product/your-slug"
                                      onChange={(e) => {
                                        handleBranchChange(e, index);
                                      }}
                                      name="slug"
                                      value={item.slug}
                                    />
                                    <button
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
                                <input
                                  type="text"
                                  className="form-control capitalize"
                                  placeholder="color"
                                  onChange={(e) => {
                                    handleBranchChange(e, index);
                                  }}
                                  name="color"
                                  value={item.color}
                                />
                              </div>
                            </div>
                            <div className="form-inline mt-5 items-start first:mt-0">
                              <label className="form-label mt-2 sm:w-20">
                                Price
                              </label>
                              <div className="w-full mt-3 xl:mt-0 flex-1">
                                <input
                                  type="number"
                                  className="form-control capitalize"
                                  placeholder="Price"
                                  onChange={(e) => {
                                    handleBranchChange(e, index);
                                  }}
                                  name="price"
                                  value={item.price}
                                />
                              </div>
                            </div>
                            <div className="form-inline mt-5 items-start first:mt-0">
                              <label className="form-label mt-2 sm:w-20">
                                Stock
                              </label>
                              <div className="w-full mt-3 xl:mt-0 flex-1">
                                <input
                                  type="number"
                                  className="form-control capitalize"
                                  placeholder="Stock"
                                  onChange={(e) => {
                                    handleBranchChange(e, index);
                                  }}
                                  name="availableQty"
                                  value={item.availableQty}
                                />
                              </div>
                            </div>
                            <div className="xl:ml-20 xl:pl-5 xl:pr-20 mt-5 first:mt-0">
                              <button className="btn btn-outline-primary border-dashed w-full">
                                <Lucide icon="Plus" className="w-4 h-4 mr-2" />{" "}
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
                    className="btn py-3 btn-outline-secondary border-dashed w-full"
                    onClick={addNewVariant}
                  >
                    <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New
                    Variant
                  </button>
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Variant Information</div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        Apply price and stock on all variants or based on
                        certain variant codes.
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <div className="sm:grid grid-cols-4 gap-2">
                      <div className="input-group">
                        <div className="input-group-text">$</div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Price"
                          name="price"
                          value={product.price}
                          onChange={handleChange}
                        />
                      </div>
                      <input
                        type="number"
                        className="form-control mt-2 sm:mt-0"
                        placeholder="Stock"
                        name="availableQty"
                        value={product.availableQty}
                        onChange={handleChange}
                      />
                      <input
                        type="number"
                        className="form-control mt-2 sm:mt-0"
                        placeholder="Variant Code"
                      />
                      <button className="btn btn-primary mt-2 sm:mt-0">
                        Apply To All
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Variant List</div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        Set the price and stock for each variant.
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <div className="overflow-x-auto">
                      <table className="table border">
                        <thead>
                          <tr>
                            <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                              Size
                            </th>
                            <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                              <div className="flex items-center">
                                Color{" "}
                                <Lucide
                                  icon="HelpCircle"
                                  className="w-4 h-4 ml-2"
                                />
                              </div>
                            </th>
                            <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap !px-2">
                              Price
                            </th>
                            <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap !px-2">
                              <div className="flex items-center">
                                <div className="relative w-4 h-4 mr-2 -mt-0.5 before:content-[''] before:absolute before:w-4 before:h-4 before:bg-primary/20 before:rounded-full lg:before:animate-ping after:content-[''] after:absolute after:w-4 after:h-4 after:bg-primary after:rounded-full after:border-4 after:border-white/60 after:dark:border-darkmode-300"></div>
                                Stock{" "}
                                <Lucide
                                  icon="HelpCircle"
                                  className="w-4 h-4 ml-2"
                                />
                              </div>
                            </th>
                            <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap !pl-2">
                              Variant Code
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td rowSpan="3" className="border-r">
                              Small
                            </td>
                            <td>Black</td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Stock"
                              />
                            </td>
                            <td className="!pl-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Variant Code"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>White</td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Stock"
                              />
                            </td>
                            <td className="!pl-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Variant Code"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Gray</td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Stock"
                              />
                            </td>
                            <td className="!pl-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Variant Code"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td rowSpan="3" className="border-r">
                              Medium
                            </td>
                            <td>Black</td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Stock"
                              />
                            </td>
                            <td className="!pl-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Variant Code"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>White</td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Stock"
                              />
                            </td>
                            <td className="!pl-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Variant Code"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Gray</td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Stock"
                              />
                            </td>
                            <td className="!pl-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Variant Code"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td rowSpan="3" className="border-r">
                              Large
                            </td>
                            <td>Black</td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Stock"
                              />
                            </td>
                            <td className="!pl-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Variant Code"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>White</td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Stock"
                              />
                            </td>
                            <td className="!pl-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Variant Code"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>Gray</td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Stock"
                              />
                            </td>
                            <td className="!pl-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Variant Code"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Wholesale</div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        Add wholesale price for certain quantity purchases.
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <div className="overflow-x-auto">
                      <table className="table border">
                        <thead>
                          <tr>
                            <th className="!pr-2 bg-slate-50 dark:bg-darkmode-800"></th>
                            <th className="bg-slate-50 dark:bg-darkmode-800"></th>
                            <th className="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                              Min.
                            </th>
                            <th className="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                              Max.
                            </th>
                            <th className="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                              Unit Price
                            </th>
                            <th className="!px-2 bg-slate-50 dark:bg-darkmode-800"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="!pr-2">1.</td>
                            <td className="whitespace-nowrap">
                              Wholesale Price 1
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Min Qty"
                              />
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Max Qty"
                              />
                            </td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!pl-4 text-slate-500">
                              <a href="">
                                <Lucide icon="Trash2" className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="!pr-2">2.</td>
                            <td className="whitespace-nowrap">
                              Wholesale Price 2
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Min Qty"
                              />
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Max Qty"
                              />
                            </td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!pl-4 text-slate-500">
                              <a href="">
                                <Lucide icon="Trash2" className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="!pr-2">3.</td>
                            <td className="whitespace-nowrap">
                              Wholesale Price 3
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Min Qty"
                              />
                            </td>
                            <td className="!px-2">
                              <input
                                type="text"
                                className="form-control min-w-[6rem]"
                                placeholder="Max Qty"
                              />
                            </td>
                            <td className="!px-2">
                              <div className="input-group">
                                <div className="input-group-text">$</div>
                                <input
                                  type="text"
                                  className="form-control min-w-[6rem]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="!pl-4 text-slate-500">
                              <a href="">
                                <Lucide icon="Trash2" className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button className="btn btn-outline-primary border-dashed w-full mt-4">
                      <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New
                      Wholesale Price
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: Product Variant (Details) */}
          {/* BEGIN: Product Management */}
          <div className="intro-y box p-5 mt-5">
            <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
              <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Product
                Management
              </div>
              <div className="mt-5">
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Product Status</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        If the status is active, your product can be searched
                        for by potential buyers.
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <div className="form-check form-switch">
                      <input
                        id="product-status-active"
                        className="form-check-input"
                        type="checkbox"
                        name="active"
                        onChange={() => {
                          setActive(!active);
                          console.log(active);
                        }}
                        value={active}
                        checked={active}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="product-status-active"
                      >
                        Active
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Product Stock</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <input
                      id="product-stock"
                      type="text"
                      className="form-control"
                      placeholder="Input Product Stock"
                    />
                  </div>
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">
                          SKU (Stock Keeping Unit)
                        </div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        Use a unique SKU code if you want to mark your product.
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <input
                      id="sku"
                      type="text"
                      className="form-control"
                      placeholder="Input SKU"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: Product Management */}
          {/* BEGIN: Weight & Shipping */}
          <div className="intro-y box p-5 mt-5">
            <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
              <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Weight &
                Shipping
              </div>
              <div className="mt-5">
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Product Weight</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        Enter the weight by weighing the product after it is
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          packaged
                        </span>
                        .
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <div className="sm:grid grid-cols-4 gap-2">
                      <select className="form-select" value={product.category}>
                        <option value="Gram (g)">Gram (g)</option>
                        <option value="Kilogram (kg)">Kilogram (kg)</option>
                      </select>
                      <input
                        type="text"
                        id="product-weight"
                        className="form-control mt-2 sm:mt-0"
                        placeholder="Stock"
                      />
                    </div>
                    <Alert className="alert-outline-warning alert-dismissible bg-warning/20 dark:bg-darkmode-400 dark:border-darkmode-400 mt-5">
                      {({ dismiss }) => (
                        <>
                          <div className="flex items-center">
                            <span>
                              <Lucide
                                icon="AlertTriangle"
                                className="w-6 h-6 mr-3"
                              />
                            </span>
                            <span className="text-slate-800 dark:text-slate-500">
                              Pay close attention to the weight of the product
                              so that there is no difference in data with the
                              shipping courier.
                              <a className="text-primary font-medium" href="">
                                Learn More
                              </a>
                            </span>
                            <button
                              type="button"
                              className="btn-close dark:text-white"
                              onClick={dismiss}
                              aria-label="Close"
                            >
                              <Lucide icon="X" className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </Alert>
                  </div>
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Product Size</div>
                        <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                          Required
                        </div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        Enter the product size after packing to calculate the
                        volume weight.
                        <a className="text-primary font-medium" href="">
                          Learn Volume Weight
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-g0 flex-1">
                    <div className="sm:grid grid-cols-3 gap-2">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Width"
                        />
                        <div className="input-group-text">cm</div>
                      </div>
                      <div className="input-group mt-2 sm:mt-0">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Height"
                        />
                        <div className="input-group-text">cm</div>
                      </div>
                      <div className="input-group mt-2 sm:mt-0">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Length"
                        />
                        <div className="input-group-text">cm</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Shipping Insurance</div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        Refund product & postage for the seller and buyer in
                        case of damage / loss during shipping.
                        <a className="text-primary font-medium" href="">
                          Learn More
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <div className="flex flex-col sm:flex-row">
                      <div className="form-check mr-4">
                        <input
                          id="shipping-insurance-required"
                          className="form-check-input"
                          type="radio"
                          name="horizontal_radio_button"
                          value="horizontal-radio-chris-evans"
                        />
                        <div className="form-check-label">
                          <div>Required</div>
                          <div className="leading-relaxed text-slate-500 text-xs mt-1 w-56">
                            You
                            <span className="font-medium text-slate-600 dark:text-slate-300">
                              require
                            </span>
                            the buyer to activate shipping insurance
                          </div>
                        </div>
                      </div>
                      <div className="form-check mr-4 mt-2 sm:mt-0">
                        <input
                          id="shipping-insurance-optional"
                          className="form-check-input"
                          type="radio"
                          name="horizontal_radio_button"
                          value="horizontal-radio-liam-neeson"
                        />
                        <div className="form-check-label">
                          <div>Optional</div>
                          <div className="leading-relaxed text-slate-500 text-xs mt-1 w-56">
                            You
                            <span className="font-medium text-slate-600 dark:text-slate-300">
                              give the buyer the option
                            </span>
                            to activate shipping insurance
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Shipping Service</div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        Configure shipping services according to your product
                        type.
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <div className="flex flex-col sm:flex-row">
                      <div className="form-check mr-4">
                        <input
                          id="shipping-service-standard"
                          className="form-check-input"
                          type="radio"
                          name="horizontal_radio_button"
                          value="horizontal-radio-chris-evans"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="shipping-service-standard"
                        >
                          Standard
                        </label>
                      </div>
                      <div className="form-check mr-4 mt-2 sm:mt-0">
                        <input
                          id="shipping-service-custom"
                          className="form-check-input"
                          type="radio"
                          name="horizontal_radio_button"
                          value="horizontal-radio-liam-neeson"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="shipping-service-custom"
                        >
                          Custom
                        </label>
                      </div>
                    </div>
                    <div className="leading-relaxed text-slate-500 text-xs mt-3">
                      The delivery service for this product will be the same as
                      in the
                      <a className="text-primary font-medium" href="">
                        Shipping Settings.
                      </a>
                    </div>
                  </div>
                </div>
                <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                  <div className="form-label xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">PreOrder</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-3 xl:mt-0 flex-1">
                    <div className="form-check form-switch">
                      <input
                        id="preorder-active"
                        className="form-check-input"
                        type="checkbox"
                      />
                      <label
                        className="form-check-label leading-relaxed text-slate-500 text-xs"
                        htmlFor="preorder-active"
                      >
                        Activate PreOrder if you need a longer shipping process.
                        <a className="text-primary font-medium" href="">
                          Learn more.
                        </a>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: Weight & Shipping */}
          <div className="flex justify-end flex-col md:flex-row gap-2 mt-5">
            <button
              type="button"
              className="btn py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 w-full md:w-52"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 w-full md:w-52"
            >
              Save & Add New Product
            </button>
            <button
              type="button"
              className="btn py-3 btn-primary w-full md:w-52"
              onClick={(e) => {
                handleSubimt(e);
              }}
            >
              Save
            </button>
          </div>
        </div>
        <div className="intro-y col-span-2 hidden 2xl:block">
          <div className="pt-10 sticky top-0">
            <ul className="text-slate-500 relative before:content-[''] before:w-[2px] before:bg-slate-200 before:dark:bg-darkmode-600 before:h-full before:absolute before:left-0 before:z-[-1]">
              <li className="mb-4 border-l-2 pl-5 border-primary dark:border-primary text-primary font-medium">
                <a href="">Upload Product</a>
              </li>
              <li className="mb-4 border-l-2 pl-5 border-transparent dark:border-transparent">
                <a href="">Product Information</a>
              </li>
              <li className="mb-4 border-l-2 pl-5 border-transparent dark:border-transparent">
                <a href="">Product Detail</a>
              </li>
              <li className="mb-4 border-l-2 pl-5 border-transparent dark:border-transparent">
                <a href="">Product Variant</a>
              </li>
              <li className="mb-4 border-l-2 pl-5 border-transparent dark:border-transparent">
                <a href="">Product Variant (Details)</a>
              </li>
              <li className="mb-4 border-l-2 pl-5 border-transparent dark:border-transparent">
                <a href="">Product Management</a>
              </li>
              <li className="mb-4 border-l-2 pl-5 border-transparent dark:border-transparent">
                <a href="">Weight & Shipping</a>
              </li>
            </ul>
            <div className="mt-10 bg-warning/20 dark:bg-darkmode-600 border border-warning dark:border-0 rounded-md relative p-5">
              <Lucide
                icon="Lightbulb"
                className="w-12 h-12 text-warning/80 absolute top-0 right-0 mt-5 mr-3"
              />
              <h2 className="text-lg font-medium">Tips</h2>
              <div className="mt-5 font-medium">Price</div>
              <div className="leading-relaxed text-xs mt-2 text-slate-600 dark:text-slate-500">
                <div>
                  The image format is .jpg .jpeg .png and a minimum size of 300
                  x 300 pixels (For optimal images use a minimum size of 700 x
                  700 pixels).
                </div>
                <div className="mt-2">
                  Select product photos or drag and drop up to 5 photos at once
                  here. Include min. 3 attractive photos to make the product
                  more attractive to buyers.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
