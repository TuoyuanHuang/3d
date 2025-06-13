import React from 'react';
import { CheckCircle, Download, Mail, Package } from 'lucide-react';

interface OrderConfirmationProps {
  orderDetails: {
    id: string;
    productName: string;
    amount: number;
    customerEmail: string;
    status: string;
  };
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderDetails }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="text-center mb-8">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Ordine Confermato!
        </h1>
        <p className="text-gray-600">
          Grazie per il tuo acquisto. Il tuo ordine è stato processato con successo.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dettagli Ordine
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Numero Ordine:</span>
            <span className="font-medium text-gray-900">#{orderDetails.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Prodotto:</span>
            <span className="font-medium text-gray-900">{orderDetails.productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Totale:</span>
            <span className="font-medium text-gray-900">€{orderDetails.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {orderDetails.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">Email Inviata</h3>
          <p className="text-sm text-gray-600">
            Conferma inviata a {orderDetails.customerEmail}
          </p>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <Package className="h-6 w-6 text-orange-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">In Produzione</h3>
          <p className="text-sm text-gray-600">
            Inizieremo la stampa entro 24h
          </p>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Download className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">Ricevuta</h3>
          <p className="text-sm text-gray-600">
            Disponibile nel tuo account
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">
          Prossimi Passi
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Riceverai aggiornamenti via email durante la produzione</li>
          <li>• Ti contatteremo per confermare i dettagli di consegna</li>
          <li>• Tempo stimato di completamento: 2-5 giorni lavorativi</li>
        </ul>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 mb-4">
          Hai domande sul tuo ordine?
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="mailto:info@3dsumisura.it"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Invia Email
          </a>
          <a
            href="tel:+391234567890"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Chiama
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;