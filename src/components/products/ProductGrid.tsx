import React from 'react';
import { SearchX } from 'lucide-react';
import type { Product } from '../../types/product.types';
import ProductCard from './ProductCard';
import SkeletonCard from '../common/SkeletonCard';
import './ProductGrid.css';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  onQuickView?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  skeletonCount = 8,
  onQuickView,
}) => {
  if (isLoading) {
    return (
      <div className="product-grid" aria-label="Loading products" aria-busy="true">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <SearchX size={40} strokeWidth={1.5} className="no-products__icon" aria-hidden />
        <h3 className="no-products__title">No products found</h3>
        <p className="no-products__text">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="product-grid" role="list" aria-label="Products">
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} onQuickView={onQuickView} />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ProductGrid);
