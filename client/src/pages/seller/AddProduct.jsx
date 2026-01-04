import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useAppContext();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const [addCategory, setAddCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);

  const defaultCategories = [
    "Vegetables",
    "Fruits",
    "Drinks",
    "Instant",
    "Dairy",
    "Bakery",
    "Grains",
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/products/categories");
        if (data.success && data.categories?.length > 0) {
          const categoryNames = data.categories.map((cat) => cat.name);
          const merged = [...new Set([...defaultCategories, ...categoryNames])];
          setCategories(merged);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!addCategory.trim()) {
      toast.error("Please enter category name");
      return;
    }
    if (!categoryImage) {
      toast.error("Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", addCategory);
      formData.append("image", categoryImage);

      const { data } = await axios.post("/api/products/add-category", formData);

      if (data.success) {
        setCategories([...categories, addCategory]);
        setCategory(addCategory);
        setAddCategory("");
        setCategoryImage(null);
        toast.success("Category added successfully!");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate images
    const uploadedImages = files.filter((file) => file);
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    // Validate required fields
    if (!name.trim() || !description.trim() || !category || !price || !offerPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(offerPrice) > parseFloat(price)) {
      toast.error("Offer price cannot be greater than original price");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Convert description into array of strings
      const descriptionArray = description
        .split("\n")
        .filter((line) => line.trim());

      const productData = {
        name: name.trim(),
        description: descriptionArray.length > 0 ? descriptionArray : [description.trim()],
        category: category.trim(),
        price: parseFloat(price),
        offerPrice: parseFloat(offerPrice),
      };

      formData.append("productData", JSON.stringify(productData));

      // Append only non-null images
      uploadedImages.forEach((file) => {
        if (file) formData.append("images", file);
      });

      console.log("🍪 Cookies being sent:", document.cookie);
      
      const { data } = await axios.post("/api/products/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (data.success) {
        toast.success("Product added successfully!");
        setFiles([]);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(`Failed to add product: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 flex flex-col h-[80vh] justify-between">
      <form onSubmit={onSubmitHandler} className="md:px-10 md:py-4 p-4 space-y-5 max-w-lg">
        {/* Product Images */}
        <div>
          <p className="text-base font-medium">Product Image (Upload at least 1)</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                  <input
                    onChange={(e) => {
                      const newFiles = [...files];
                      newFiles[index] = e.target.files[0];
                      setFiles(newFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden hover:border-primary transition">
                    {files[index] ? (
                      <img
                        src={URL.createObjectURL(files[index])}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={assets.upload_area}
                        alt="upload"
                        className="w-12 h-12 opacity-50"
                      />
                    )}
                  </div>
                </label>
              ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {files.filter((f) => f).length} image(s) selected
          </p>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-base font-medium">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g., Fresh Tomato 1kg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-primary transition"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-base font-medium">
            Description (One per line) *
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Line 1&#10;Line 2&#10;Line 3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-primary transition resize-none"
            required
          />
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-base font-medium">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-primary transition bg-white"
            required
          >
            <option value="">-- Select Category --</option>
            {categories && categories.length > 0 ? (
              categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        {/* Add New Category */}
        <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
          <p className="text-sm font-medium mb-3">Or Add New Category</p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Category name"
              value={addCategory}
              onChange={(e) => setAddCategory(e.target.value)}
              className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-primary transition"
            />

            <div className="flex items-center gap-3">
              <label htmlFor="catImage" className="cursor-pointer">
                <input
                  id="catImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  hidden
                />
                <div className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition text-sm font-medium">
                  Choose Image
                </div>
              </label>
              {categoryImage && (
                <img
                  src={URL.createObjectURL(categoryImage)}
                  alt="cat"
                  className="w-12 h-12 object-cover rounded border"
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleAddCategory}
              disabled={!addCategory.trim() || !categoryImage}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="price" className="text-base font-medium">
              Original Price *
            </label>
            <input
              id="price"
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-primary transition"
              required
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="offerPrice" className="text-base font-medium">
              Offer Price *
            </label>
            <input
              id="offerPrice"
              type="number"
              placeholder="0"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 focus:border-primary transition"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-8 w-full py-2.5 bg-primary cursor-pointer text-white font-medium rounded hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;