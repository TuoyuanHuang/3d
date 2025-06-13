import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Info, ShoppingCart } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  material: string;
  colors: string[];
  dimensions: string;
  description: string;
  images: string[];
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current" />
              <span>In Evidenza</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700">
            €{product.price.toFixed(2)}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {product.material.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              {product.dimensions}
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xs text-gray-500">Colori:</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300 bg-gradient-to-br from-gray-200 to-gray-400"
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/prodotto/${product.id}`}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Info className="h-4 w-4" />
              <span>Dettagli</span>
            </Link>
            
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 group"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Acquista</span>
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
        }}
      />
    </>
  );
};

export default ProductCard;