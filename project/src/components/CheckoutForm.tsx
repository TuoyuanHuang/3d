import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface CheckoutFormProps {
  amount: number;
  productName: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  amount, 
  productName, 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe non è stato caricato correttamente');
      }

      // Create payment intent using Supabase Edge Function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Configurazione Supabase mancante. Assicurati di aver configurato le variabili d\'ambiente.');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'eur',
          productName,
          customerInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Errore nella creazione del pagamento');
      }

      const { clientSecret } = await response.json();

      // For demo purposes, we'll simulate a successful payment
      // In a real implementation, you would use Stripe Elements for card input
      setTimeout(() => {
        setPaymentStatus('success');
        onSuccess?.();
      }, 2000);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore durante il pagamento';
      setErrorMessage(message);
      setPaymentStatus('error');
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Pagamento Completato!
        </h3>
        <p className="text-green-700 mb-4">
          Il tuo ordine per "{productName}" è stato processato con successo.
        </p>
        <p className="text-sm text-green-600">
          Riceverai una conferma via email a breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Lock className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">Pagamento Sicuro</span>
        </div>
        <p className="text-sm text-blue-700">
          I tuoi dati sono protetti con crittografia SSL a 256 bit
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Riepilogo Ordine</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">{productName}</span>
          <span className="font-semibold text-gray-900">€{amount.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center font-semibold">
          <span>Totale</span>
          <span className="text-lg">€{amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Informazioni Cliente</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={customerInfo.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mario Rossi"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={customerInfo.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="mario@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+39 123 456 7890"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Indirizzo
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={customerInfo.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Via Roma 123"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Città
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={customerInfo.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Milano"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              CAP
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={customerInfo.postalCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="20121"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Metodo di Pagamento</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Carta di Credito/Debito</span>
          </div>
          <p className="text-sm text-gray-600">
            Accettiamo Visa, Mastercard, American Express
          </p>
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Questo è un pagamento simulato per scopi dimostrativi
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Errore nel Pagamento</h4>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || paymentStatus === 'processing'}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Elaborazione...</span>
          </>
        ) : (
          <>
            <Lock className="h-5 w-5" />
            <span>Paga €{amount.toFixed(2)}</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Cliccando "Paga" accetti i nostri termini di servizio e la privacy policy
      </p>
    </form>
  );
};

export default CheckoutForm;