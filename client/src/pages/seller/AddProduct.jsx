import React from "react";
import { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const [addCategory, setAddCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file) URL.revokeObjectURL(URL.createObjectURL(file));
      });
    };
  }, [files]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/product/categories"
      );
      if (response.data.success) {
        setCategories(
          response.data.categories.map((cat) => ({
            path: cat.name,
            image: cat.image,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle adding new category
  const handleAddCategory = async () => {
    if (addCategory.trim() && categoryImage) {
      if (!categories.find((cat) => cat.path === addCategory)) {
        try {
          const formData = new FormData();
          formData.append("name", addCategory);
          formData.append("image", categoryImage);

          const response = await axios.post(
            "http://localhost:4000/api/product/add-category",
            formData
          );

          if (response.data.success) {
            const newCategory = {
              path: response.data.category.name,
              image: response.data.category.image,
            };
            setCategories([...categories, newCategory]);
            setCategory(addCategory);
            setAddCategory("");
            setCategoryImage(null);
          }
        } catch (error) {
          console.error("Error adding category:", error);
          alert(error.response?.data?.message || "Failed to add category");
        }
      } else {
        alert("Category already exists");
      }
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate images
    const uploadedImages = files.filter((file) => file !== undefined);
    if (uploadedImages.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    // Validate required fields
    if (
      !name.trim() ||
      !description.trim() ||
      !category ||
      !price ||
      !offerPrice
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Append product data as JSON string
      const productData = {
        name,
        description,
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
      };
      formData.append("productData", JSON.stringify(productData));

      // Append images
      uploadedImages.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        "http://localhost:4000/api/product/add-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Product added successfully!");
        // Reset form
        setFiles([]);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 flex flex-col h-[80vh] justify-between">
      <form
        onSubmit={onSubmitHandler}
        className="md:px-10 md:py-4 p-4 space-y-5 max-w-lg"
      >
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    className="w-24 h-24 cursor-pointer object-cover rounded border border-dashed border-gray-300"
                    alt=""
                  />
                </label>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md w-full">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            id="product-name"
            type="text"
            placeholder="Type here"
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md w-full">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
            id="product-description"
            rows={4}
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            id="category"
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, idx) => (
              <option key={idx} value={item.path}>
                {item.path}
              </option>
            ))}
          </select>

          {/* Display selected category with image */}
          {category &&
            categories.find((cat) => cat.path === category)?.image && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-gray-100 rounded">
                <img
                  src={categories.find((cat) => cat.path === category)?.image}
                  alt={category}
                  className="w-12 h-12 object-cover rounded"
                />
                <span className="text-sm font-medium">{category}</span>
              </div>
            )}
        </div>

        {/* Add new category section */}
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <p className="text-sm font-medium mb-2">Add New Category</p>
          <div className="flex flex-col gap-3">
            <input
              onChange={(e) => setAddCategory(e.target.value)}
              value={addCategory}
              type="text"
              placeholder="Category name"
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
            />

            <div className="flex items-center gap-3">
              <label htmlFor="category-image" className="cursor-pointer">
                <input
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  accept="image/*"
                  type="file"
                  id="category-image"
                  hidden
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  <span className="text-sm">Choose Image</span>
                </div>
              </label>

              {categoryImage && (
                <img
                  src={URL.createObjectURL(categoryImage)}
                  alt="Category preview"
                  className="w-12 h-12 object-cover rounded"
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleAddCategory}
              disabled={!addCategory.trim() || !categoryImage}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Category
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              id="product-price"
              type="number"
              placeholder="0"
              className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              id="offer-price"
              type="number"
              placeholder="0"
              className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-8 w-full py-2.5 bg-primary cursor-pointer text-white font-medium rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
