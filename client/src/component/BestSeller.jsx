import ProductCard from "./ProductCard";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useContext(AppContext);
  return (
    <div className="mt-16">
      <p className="text-2xl mb-5 md:text-3xl font-medium">Best Seller</p>
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:grid-cols-5  mt-6">
          {products
            ?.filter((p) => p.inStock)
            .slice(0, 5)
            .map((product, idx) => (
              <ProductCard product={product} key={idx} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
