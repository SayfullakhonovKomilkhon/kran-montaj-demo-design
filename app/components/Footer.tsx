'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Logo and description */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/img/services/logo.svg" 
                alt="Kran Montaj Servis" 
                width={140} 
                height={45}
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Профессиональное изготовление, монтаж и обслуживание грузоподъемного оборудования с 2009 года.
            </p>
            {/* Social links */}
            <div className="flex space-x-3">
              <a href="https://t.me/kranmontaj" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="https://instagram.com/kranmontaj" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://facebook.com/kranmontaj" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Компания</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Главная
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                О компании
              </Link>
              <Link href="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Услуги
              </Link>
              <Link href="/catalog" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Каталог
              </Link>
              <Link href="/works" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Наши работы
              </Link>
              <Link href="/contacts" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Контакты
              </Link>
            </nav>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Услуги</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Изготовление кранов
              </Link>
              <Link href="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Монтаж оборудования
              </Link>
              <Link href="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Техобслуживание
              </Link>
              <Link href="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Ремонт кранов
              </Link>
              <Link href="/services" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Запасные части
              </Link>
            </nav>
          </div>
          
          {/* Contacts */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p className="text-gray-400 text-sm">г. Ташкент, Узбекистан</p>
              </div>
              
              <a href="tel:+998998279159" className="flex items-center space-x-3 group">
                <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span className="text-gray-400 text-sm group-hover:text-orange-400 transition-colors">+998 99 827 91 59</span>
              </a>
              
              <a href="mailto:info@kran-montaj.uz" className="flex items-center space-x-3 group">
                <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="text-gray-400 text-sm group-hover:text-orange-400 transition-colors">info@kran-montaj.uz</span>
              </a>
              
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-gray-400 text-sm">Пн–Сб: 9:00 – 18:00</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} КРАН-МОНТАЖ. Все права защищены
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-orange-400 transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
