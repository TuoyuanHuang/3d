import React from 'react';
import { Users, Award, Clock, MapPin, Target, Heart } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { label: 'Progetti Completati', value: '500+', icon: Award },
    { label: 'Clienti Soddisfatti', value: '200+', icon: Users },
    { label: 'Anni di Esperienza', value: '5+', icon: Clock },
    { label: 'Materiali Disponibili', value: '10+', icon: MapPin },
  ];

  const team = [
    {
      name: 'Marco Rossi',
      role: 'Fondatore & CEO',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      description: 'Ingegnere meccanico con una passione per l\'innovazione e la tecnologia 3D.'
    },
    {
      name: 'Laura Bianchi',
      role: 'Designer Tecnico',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
      description: 'Esperta in design industriale e modellazione 3D con 8 anni di esperienza.'
    },
    {
      name: 'Alessandro Verdi',
      role: 'Specialista Materiali',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      description: 'Chimico dei materiali specializzato in polimeri e tecnologie di stampa 3D.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Chi Siamo
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Siamo un team di professionisti appassionati che trasforma idee innovative 
                in realtà tangibile attraverso la tecnologia di stampa 3D più avanzata.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-red-400" />
                  <span className="text-blue-100">Passione per l'innovazione</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg"
                alt="Il nostro team al lavoro"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">La Nostra Missione</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Rendere accessibile la tecnologia di stampa 3D a tutti, dalle aziende ai privati, 
                offrendo servizi di alta qualità, consulenza personalizzata e soluzioni innovative. 
                Crediamo che ogni idea meriti di essere realizzata con precisione e cura.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">I Nostri Valori</h2>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span><strong>Qualità:</strong> Utilizziamo solo materiali premium e tecnologie all'avanguardia</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span><strong>Innovazione:</strong> Sempre alla ricerca di nuove soluzioni e miglioramenti</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span><strong>Servizio:</strong> Supporto personalizzato per ogni cliente e progetto</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Il Nostro Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un gruppo di professionisti esperti e appassionati, uniti dalla voglia di innovare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Le Nostre Tecnologie
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Utilizziamo le tecnologie di stampa 3D più avanzate per garantire risultati eccellenti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">FDM/FFF</h3>
              <p className="text-gray-600 text-sm">
                Stampa a deposizione fusa per oggetti funzionali e prototipi
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SLA/DLP</h3>
              <p className="text-gray-600 text-sm">
                Stereolitografia per dettagli ultra-precisi e superfici lisce
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SLS</h3>
              <p className="text-gray-600 text-sm">
                Sinterizzazione laser per parti meccaniche resistenti
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Material</h3>
              <p className="text-gray-600 text-sm">
                Stampa multi-materiale per progetti complessi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Pronto a Realizzare la Tua Idea?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Contattaci per discutere del tuo progetto e scoprire come possiamo aiutarti
          </p>
          <a
            href="/contatti"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
          >
            Iniziamo Insieme
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;