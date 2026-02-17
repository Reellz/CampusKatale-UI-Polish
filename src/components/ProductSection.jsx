import "@fontsource-variable/lexend";
import ProductCard from "./ProductCard";

function ProductSection({ title, products, showDiscount = false }) {
  return (
    <section className="font-[Lexend] bg-white py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#0C0D19]">
            {title}
          </h2>
          <a
            href="#"
            className="text-[#177529] font-medium hover:text-[#97C040] transition-colors"
          >
            View All &gt;
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              {...product}
              showDiscount={showDiscount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;





