import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Star, Package, Clock, Palette, Ruler, ShoppingCart } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import productsData from '../data/products.json';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = productsData.products.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Prodotto non trovato</h1>
          <Link
            to="/catalogo"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Torna al catalogo</span>
          </Link>
        </div>
      </div>
    );
  }

  const category = productsData.categories.find(c => c.id === product.category);
  const material = productsData.materials.find(m => m.id === product.material);

  const handleBuyNow = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link to="/catalogo" className="hover:text-blue-600">Catalogo</Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.featured && (
                  <div className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span>In Evidenza</span>
                  </div>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {category?.name}
                </p>
                <div className="text-3xl font-bold text-blue-600">
                  €{product.price.toFixed(2)}
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <p>{product.description}</p>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifiche Tecniche</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Materiale</p>
                      <p className="font-medium">{material?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Ruler className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Dimensioni</p>
                      <p className="font-medium">{product.dimensions}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tempo di stampa</p>
                      <p className="font-medium">{product.printTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Palette className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Colori disponibili</p>
                      <p className="font-medium">{product.colors.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Colori Disponibili
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                        selectedColor === index
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Caratteristiche
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Acquista Ora - €{product.price.toFixed(2)}</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`mailto:info@3dsumisura.it?subject=Richiesta informazioni - ${product.name}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Info</span>
                  </a>
                  
                  <a
                    href="tel:+391234567890"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Chiama</span>
                  </a>
                </div>
              </div>

              {/* Material Info */}
              {material && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Informazioni sul Materiale
                  </h4>
                  <p className="text-sm text-gray-600">
                    {material.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Back to Catalog */}
          <div className="mt-12 text-center">
            <Link
              to="/catalogo"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Torna al Catalogo</span>
            </Link>
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

export default ProductDetail;