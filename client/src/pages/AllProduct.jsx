import React from "react";
import { useAppContext } from "../context/AppContext";
import { useState, useEffect } from "react";
import ProductCard from "../component/ProductCard";

const AllProduct = () => {
  const { products, searchQuery } = useAppContext();
  const [filterProduct, setFilterProduct] = useState([]);
  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilterProduct(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilterProduct(products);
    }
  }, [searchQuery, products]);
  return (
    <div className="mt-15 flex flex-col gap-6">
      <div className="flex flex-col items-center w-max">
        <p className="text-2xl font-medium">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filterProduct
          .filter((product) => product.inStock)
          .map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
      </div>
    </div>
  );
};

export default AllProduct;
