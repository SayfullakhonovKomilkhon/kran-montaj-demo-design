'use client';

import Image from 'next/image';
import Link from 'next/link';

// Статические данные услуг
const services = [
  {
    id: 1,
    title: 'Изготовление мостовых кранов',
    subtitle: 'однобалочных, двухбалочных, опорных, подвесных',
    image: '/img/services/services-card1.png',
  },
  {
    id: 2,
    title: 'Изготовление козловых кранов',
    subtitle: 'для открытых площадок и складов',
    image: '/img/services/services-card2.png',
  },
  {
    id: 3,
    title: 'Поставка оборудования',
    subtitle: 'электротельферы, троллейные линии, тали',
    image: '/img/services/services-card3.png',
  },
  {
    id: 4,
    title: 'Запасные части',
    subtitle: 'к электротельферам и крановому оборудованию',
    image: '/img/services/services-card4.png',
  },
  {
    id: 5,
    title: 'Ремонт и монтаж',
    subtitle: 'мостовых и козловых кранов',
    image: '/img/services/services-card5.png',
  },
  {
    id: 6,
    title: 'Техническое обслуживание',
    subtitle: 'сервис мостовых и козловых кранов',
    image: '/img/services/services-card6.png',
  },
];

export default function ServiceSection() {
  return (
    <div className="py-16 sm:py-24 bg-gradient-to-b from-slate-100 to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Наши услуги
          </div>
          <h2 
            className="text-2xl sm:text-3xl font-black text-gray-800 md:text-4xl uppercase tracking-tight"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Полный спектр <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">услуг</span>
          </h2>
          
          {/* Industrial underline */}
          <div className="flex items-center justify-center mt-4 space-x-2" data-aos="fade-up" data-aos-delay="150">
            <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded"></div>
            <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
          </div>
          
          <p 
            className="mt-6 max-w-2xl text-base text-gray-600 mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Мы предлагаем <span className="text-orange-600 font-semibold">полный спектр услуг</span> по изготовлению и обслуживанию грузоподъемного оборудования
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              data-aos="fade-up"
              data-aos-delay={100 + (index * 100)}
            >
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>
              
              {/* Large Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 overflow-hidden">
                {/* Grid pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                ></div>
                
                {/* Diagonal accent lines */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(251,146,60,0.3) 8px, rgba(251,146,60,0.3) 10px)'
                    }}
                  ></div>
                </div>
                
                {/* Glowing circle behind number */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/10 to-yellow-500/5 blur-xl"></div>
                
                {/* Background number */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-orange-500/15 select-none">
                  {service.id}
                </span>
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500/30"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500/30"></div>
                
                {/* Crane image - Large */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={140}
                    height={140}
                    className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                
                {/* Badge number */}
                <div className="absolute top-3 right-3 w-9 h-9 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <span className="text-white font-bold text-base">{service.id}</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                {/* Service title */}
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2 group-hover:text-orange-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  {service.subtitle}
                </p>
              </div>
              
              {/* Bottom bar */}
              <div className="h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center" data-aos="fade-up" data-aos-delay="400">
          <Link 
            href="/services" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Все услуги
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
