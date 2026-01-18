'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

export default function ExperienceSection() {
  // Images for the crane grid
  const craneImages = [
    {
      id: 1,
      title: 'Мостовой кран',
      image: '/img/services/0000259150_xzgmnpcd.jpg',
      description: 'Мостовой кран предназначен для выполнения погрузочно-разгрузочных работ в промышленных помещениях.'
    },
    {
      id: 2,
      title: 'Мостовой кран',
      image: '/img/services/photo_2022-11-07_15-16-02.jpg',
      description: 'Надежная конструкция для перемещения тяжелых грузов на производстве.'
    },
    {
      id: 3,
      title: 'Мостовой кран',
      image: '/img/services/IMG_9236.jpg',
      description: 'Грузоподъемное оборудование для увеличения эффективности производственных процессов.'
    },
    {
      id: 4,
      title: 'Мостовой кран',
      image: '/img/services/IMG_9370.jpg',
      description: 'Высокая производительность и безопасность при погрузочно-разгрузочных работах.'
    },
    {
      id: 5,
      title: 'Мостовой кран',
      image: '/img/services/photo_2022-11-07_15-16-02.jpg',
      description: 'Современное решение для оптимизации рабочих процессов на предприятии.'
    },
    {
      id: 6,
      title: 'Мостовой кран',
      image: '/img/services/IMG_9236.jpg',
      description: 'Техническое оснащение промышленных объектов для выполнения сложных задач.'
    }
  ];

  // Logos for the client grid
  const clientLogos = [
    {
      id: 1,
      name: 'Knauf',
      image: '/img/services/knauf.png'
    },
    {
      id: 2,
      name: 'Procab',
      image: '/img/services/procab.png'
    },
    {
      id: 3,
      name: 'Basalt',
      image: '/img/services/Basalt_арматура.png'
    },
    {
      id: 4,
      name: 'Binokor',
      image: '/img/services/binokor.png'
    },
    {
      id: 5,
      name: 'Knauf',
      image: '/img/services/knauf.png'
    },
    {
      id: 6,
      name: 'Binokor',
      image: '/img/services/binokor.png'
    },
    {
      id: 7,
      name: 'Knauf',
      image: '/img/services/knauf.png'
    },
    {
      id: 8,
      name: 'Procab',
      image: '/img/services/procab.png'
    },
    {
      id: 9,
      name: 'Basalt',
      image: '/img/services/Basalt_арматура.png'
    },
    {
      id: 10,
      name: 'Binokor',
      image: '/img/services/binokor.png'
    },
    {
      id: 11,
      name: 'Knauf',
      image: '/img/services/knauf.png'
    },
    {
      id: 12,
      name: 'Binokor',
      image: '/img/services/binokor.png'
    }
  ];

  // Handle image loading errors
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  // Animation on scroll
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Custom navigation button refs
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperRef>(null);

  // Navigation click handlers
  const handlePrevClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <section 
      id="experienceSection" 
      className="py-20 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      ref={sectionRef}
    >
      {/* Industrial grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      
      {/* Diagonal stripes accent */}
      <div className="absolute top-0 left-0 w-96 h-96 opacity-10">
        <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 2px, transparent 2px, transparent 20px)'}}></div>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className={`relative z-10 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out 0.3s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* 15 years badge and heading */}
          <div className={`flex flex-col items-center mb-16 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
            {/* Badge */}
            <div className="w-32 h-32 relative mb-8 floating">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl shadow-2xl shadow-orange-500/30 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl font-black text-white">15</span>
                  <span className="block text-xs font-bold text-white/80 uppercase tracking-wider">лет</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-center max-w-3xl mx-auto text-white section-heading uppercase tracking-tight">
              Опыта в разработке{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                грузоподъемного оборудования
              </span>
            </h2>
            
            {/* Industrial underline */}
            <div className="flex items-center justify-center mt-6 space-x-2">
              <div className="w-8 h-0.5 bg-gray-600 rounded"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded"></div>
              <div className="w-8 h-0.5 bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Crane images slider */}
          <div className={`relative mb-16 ${isVisible ? 'fade-in fade-in-delay-1' : 'opacity-0'} overflow-hidden`}>
            <div className="mb-10 relative carousel-container">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 30 }
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                  enabled: true,
                  disabledClass: 'swiper-button-disabled',
                }}
                pagination={{ 
                  clickable: true,
                  el: '.swiper-pagination',
                  bulletClass: 'inline-block w-3 h-3 rounded-full bg-white/50 mx-1 cursor-pointer transition-all',
                  bulletActiveClass: '!bg-gradient-to-r from-orange-500 to-yellow-500 scale-125',
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                effect="coverflow"
                coverflowEffect={{
                  rotate: 5,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                speed={800}
                grabCursor={true}
                touchEventsTarget="container"
                simulateTouch={true}
                onSwiper={(swiper) => {
                  // Update navigation when Swiper instance is available
                  setTimeout(() => {
                    if (swiper.navigation && prevRef.current && nextRef.current) {
                      swiper.navigation.prevEl = prevRef.current;
                      swiper.navigation.nextEl = nextRef.current;
                      swiper.navigation.update();
                    }
                  });
                }}
                className="relative slider-container touch-swipe"
              >
                {craneImages.map((crane) => (
                  <SwiperSlide key={crane.id}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200 group cursor-pointer hover:shadow-2xl transition-all duration-500">
                      {/* Top accent bar */}
                      <div className="h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>
                      
                      <div className="relative h-64 overflow-hidden">
                        {imgErrors[`crane-${crane.id}`] ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M21 10H3M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10M21 10L15.5 3.5C15.1673 3.1673 14.6836 3 14.1716 3H9.82843C9.31641 3 8.83266 3.1673 8.5 3.5L3 10" />
                            </svg>
                          </div>
                        ) : (
                          <Image
                            src={crane.image}
                            alt={crane.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={() => handleImageError(`crane-${crane.id}`)}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                        
                        {/* Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-3 py-1 rounded-lg text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                            Проект #{crane.id}
                          </div>
                        </div>
                        
                        {/* Title */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-bold text-lg">{crane.title}</h3>
                          <p className="text-gray-300 text-sm mt-1 line-clamp-2">{crane.description}</p>
                        </div>
                      </div>
                      
                      {/* Bottom bar */}
                      <div className="h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Custom navigation buttons */}
              <button 
                ref={prevRef}
                onClick={handlePrevClick}
                className="absolute top-1/2 left-4 z-20 transform -translate-y-1/2 hidden md:flex items-center justify-center focus:outline-none transition-all w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-500/30"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                ref={nextRef}
                onClick={handleNextClick}
                className="absolute top-1/2 right-4 z-20 transform -translate-y-1/2 hidden md:flex items-center justify-center focus:outline-none transition-all w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-500/30"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            
            {/* Custom pagination */}
            <div className="swiper-pagination flex justify-center items-center py-2"></div>
          </div>

          {/* Partner logos */}
          <div className={`mt-16 mb-6 ${isVisible ? 'fade-in fade-in-delay-2' : 'opacity-0'} overflow-hidden`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gray-800 text-orange-400 border border-gray-700 mx-auto mb-6 flex justify-center w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Партнёры
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-center mb-10 text-white section-heading">
              Нам <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">доверяют</span>
            </h3>
            
            <div className="logo-scroll">
              <div className="logo-scroll-track">
                {/* First set of logos */}
                {clientLogos.map((client) => (
                  <div key={client.id} className="logo-item">
                    <div className="logo-item-inner bg-white rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-300">
                      {imgErrors[`client-${client.id}`] ? (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-700 font-medium">{client.name}</span>
                        </div>
                      ) : (
                        <Image
                          src={client.image}
                          alt={client.name}
                          fill
                          className="object-contain mx-auto transition-all duration-300 hover:scale-105 p-2"
                          onError={() => handleImageError(`client-${client.id}`)}
                          sizes="(max-width: 640px) 120px, (max-width: 768px) 130px, 140px"
                        />
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Second set of logos (duplicate for continuous scroll) */}
                {clientLogos.map((client) => (
                  <div key={`duplicate-${client.id}`} className="logo-item">
                    <div className="logo-item-inner bg-white rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-300">
                      {imgErrors[`client-${client.id}`] ? (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-700 font-medium">{client.name}</span>
                        </div>
                      ) : (
                        <Image
                          src={client.image}
                          alt={client.name}
                          fill
                          className="object-contain mx-auto transition-all duration-300 hover:scale-105 p-2"
                          onError={() => handleImageError(`client-${client.id}`)}
                          sizes="(max-width: 640px) 120px, (max-width: 768px) 130px, 140px"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom edge */}
      <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
    </section>
  );
}
