import React from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCard from "../component/ProductCard";

const ProductCategories = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="mt-16 mb-24 px-6 md:px-16 lg:px-24 xl:px-32">
      {searchCategory && (
        <div className="flex flex-col items-start w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
          {filteredProducts
            .filter((product) => product.inStock)
            .map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-8">
          No products found in this category.
        </p>
      )}
    </div>
  );
};

export default ProductCategories;
