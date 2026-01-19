'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheck, FaUsers, FaClock, FaTools, FaAward, FaMedal, FaCertificate, FaShieldAlt } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

interface AboutContent {
  id: string;
  block_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  icon: string | null;
  order: number;
  is_active: boolean;
  metadata: Record<string, unknown>;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaCertificate,
  FaAward,
  FaTools,
  FaUsers,
  FaClock,
  FaShieldAlt,
  FaShield: FaShieldAlt, // alias for backwards compatibility
  FaCheck,
  FaMedal,
};

// Block key mapping - maps various possible keys to section types
const INTRO_KEYS = ['history', 'company_intro', 'about', 'intro', 'company', 'Кто мы', 'кто мы'];
const MISSION_KEYS = ['mission', 'Миссия', 'миссия', 'mission_statement'];
const STATS_KEYS = ['stats', 'statistics', 'статистика', 'numbers'];
const ADVANTAGE_KEYS = ['advantage', 'quality', 'safety', 'support', 'преимущество', 'Качество', 'качество', 'Безопасность', 'безопасность', 'individual', 'Индивидуальный подход'];

function isIntroBlock(key: string): boolean {
  return INTRO_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()));
}

function isMissionBlock(key: string): boolean {
  return MISSION_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()));
}

function isStatsBlock(key: string): boolean {
  return STATS_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()));
}

function isAdvantageBlock(key: string): boolean {
  return ADVANTAGE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()));
}

export default function AboutPage() {
  // Animation on scroll
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Content from database
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch content from Supabase
  useEffect(() => {
    async function fetchAboutContent() {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .eq('is_active', true)
          .order('order', { ascending: true });

        if (error) throw error;
        console.log('Fetched about content:', data);
        setAboutContent(data || []);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAboutContent();
  }, []);

  // Image error handling
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  // Find blocks by type
  const introBlock = aboutContent.find(item => isIntroBlock(item.block_key));
  const missionBlock = aboutContent.find(item => isMissionBlock(item.block_key));
  const statsBlock = aboutContent.find(item => isStatsBlock(item.block_key));
  
  // Get all advantage blocks (blocks that are not intro, mission, or stats)
  const advantageBlocks = aboutContent.filter(item => 
    isAdvantageBlock(item.block_key) || 
    (!isIntroBlock(item.block_key) && !isMissionBlock(item.block_key) && !isStatsBlock(item.block_key))
  );

  // Get stats from database or use defaults
  const companyData = {
    experience: (statsBlock?.metadata?.experience as number) || new Date().getFullYear() - 2008,
    projects: (statsBlock?.metadata?.projects as number) || 500,
    clients: (statsBlock?.metadata?.clients as number) || 250,
    employees: (statsBlock?.metadata?.employees as number) || 80
  };

  // Default advantages (used if no advantage blocks in database)
  const defaultAdvantages = [
    { id: '1', title: 'Профессионализм', content: 'Опытные специалисты с многолетним стажем работы', icon: 'FaCertificate' },
    { id: '2', title: 'Комплексный подход', content: 'Полный спектр услуг от проектирования до обслуживания', icon: 'FaAward' },
    { id: '3', title: 'Техническая поддержка', content: 'Оперативное сервисное обслуживание 24/7', icon: 'FaTools' }
  ];

  // Use database advantages if available, otherwise use defaults
  const displayAdvantages = advantageBlocks.length > 0 
    ? advantageBlocks.map(block => ({
        id: block.id,
        title: block.title || 'Преимущество',
        content: block.content || '',
        icon: block.icon || 'FaCertificate'
      }))
    : defaultAdvantages;

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-slate-100 to-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-b from-slate-100 to-gray-50 min-h-screen overflow-hidden">
      {/* Industrial-themed header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Industrial grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        
        {/* Diagonal stripes accent */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 2px, transparent 2px, transparent 20px)'}}></div>
        </div>
        
        {/* Orange accent glow */}
        <div className="absolute -left-20 top-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 bottom-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative">
          <div className="text-center relative">
            {/* Industrial icon */}
            <div className="inline-flex items-center justify-center mb-6" data-aos="fade-up" data-aos-duration="800">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                <FaUsers className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1
              className="text-3xl font-black text-white sm:text-5xl tracking-tight uppercase"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              О <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">компании</span>
            </h1>
            
            {/* Industrial underline */}
            <div className="flex items-center justify-center mt-4 space-x-2" data-aos="fade-up" data-aos-delay="150">
              <div className="w-12 h-1 bg-gray-600 rounded"></div>
              <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded"></div>
              <div className="w-12 h-1 bg-gray-600 rounded"></div>
            </div>
            
            <p
              className="mt-6 max-w-2xl mx-auto text-base text-gray-300 leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              КРАН-МОНТАЖ — ведущая компания в сфере <span className="text-orange-400 font-semibold">изготовления и обслуживания</span> грузоподъемного оборудования с {companyData.experience}-летним опытом работы
            </p>
          </div>
        </div>

        {/* Bottom edge */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-12 relative" ref={sectionRef}>
        
        <div className="space-y-16 relative z-10">
          {/* Stats/counter section */}
          <div 
            className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden relative"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
            
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 md:p-12">
              <div className="text-center p-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                  <FaClock className="w-7 h-7 text-white" />
                </div>
                <p className="text-4xl font-black text-orange-400">{companyData.experience}</p>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mt-1">Лет опыта</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                  <FaTools className="w-7 h-7 text-white" />
                </div>
                <p className="text-4xl font-black text-yellow-400">{companyData.projects}+</p>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mt-1">Проектов</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                  <FaUsers className="w-7 h-7 text-white" />
                </div>
                <p className="text-4xl font-black text-orange-400">{companyData.clients}+</p>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mt-1">Клиентов</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                  <FaAward className="w-7 h-7 text-white" />
                </div>
                <p className="text-4xl font-black text-yellow-400">{companyData.employees}</p>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mt-1">Специалистов</p>
              </div>
            </div>
          </div>

          {/* About us section - from database or default */}
          <div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-0">
              {/* Image section */}
              <div className="lg:col-span-5 relative h-72 lg:h-auto min-h-[350px] bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gray-800 text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center shadow-lg">
                    <FaUsers className="h-4 w-4 mr-1.5" />
                    О нас
                  </div>
                </div>
                
                {imgErrors['about1'] ? (
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <FaUsers className="w-24 h-24 text-gray-300" />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image 
                      src={introBlock?.image_url || "/img/services/0000259150_xzgmnpcd.jpg"}
                      alt="О компании КРАН-МОНТАЖ"
                      fill
                      className="object-cover"
                      onError={() => handleImageError('about1')}
                    />
                  </div>
                )}
              </div>
              
              {/* Content section */}
              <div className="lg:col-span-7 p-6 lg:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-sm mb-4 w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Кто мы
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-black text-gray-800">
                  {introBlock?.title || 'История компании'}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400 mt-3 rounded-full"></div>
                
                <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                  {introBlock?.content ? (
                    introBlock.content.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))
                  ) : (
                    <>
                      <p>
                        Компания <span className="font-bold text-orange-600">КРАН-МОНТАЖ</span> основана в 2008 году и специализируется на производстве, монтаже и сервисном обслуживании кранового оборудования.
                      </p>
                      <p>
                        За {companyData.experience} лет работы мы накопили богатый опыт и экспертизу в сфере грузоподъемного оборудования. Наша команда состоит из высококвалифицированных специалистов.
                      </p>
                      <p>
                        Сегодня КРАН-МОНТАЖ — это надежный партнер для предприятий различных отраслей промышленности, строительства и логистики.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bottom bar */}
            <div className="h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
          </div>

          {/* Mission section - from database or default */}
          <div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-0">
              {/* Content section */}
              <div className="lg:col-span-7 p-6 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-sm mb-4 w-fit">
                  <FaMedal className="h-3.5 w-3.5 mr-1.5" />
                  Миссия
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-black text-gray-800">
                  {missionBlock?.title || 'Наши ценности и приоритеты'}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400 mt-3 rounded-full"></div>
                
                <div className="mt-6 text-gray-600 leading-relaxed">
                  {missionBlock?.content ? (
                    missionBlock.content.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))
                  ) : (
                    <p>Наша миссия — обеспечивать клиентов надежным и эффективным грузоподъемным оборудованием, которое повышает безопасность и производительность их работы.</p>
                  )}
                </div>
              </div>
              
              {/* Image section */}
              <div className="lg:col-span-5 relative h-72 lg:h-auto min-h-[350px] bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                
                {imgErrors['about2'] ? (
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <FaMedal className="w-24 h-24 text-gray-300" />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image 
                      src={missionBlock?.image_url || "/img/services/IMG_9370.jpg"}
                      alt="Ценности и приоритеты КРАН-МОНТАЖ"
                      fill
                      className="object-cover"
                      onError={() => handleImageError('about2')}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
          </div>

          {/* Advantages section - dynamically from database */}
          <div data-aos="fade-up" data-aos-duration="800">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-sm mb-4">
                <FaAward className="h-3.5 w-3.5 mr-1.5" />
                Преимущества
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-gray-800 uppercase">
                Почему выбирают нас
              </h2>
              <div className="flex items-center justify-center mt-4 space-x-2">
                <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded"></div>
                <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
              </div>
            </div>
            
            <div className={`grid gap-6 ${displayAdvantages.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : displayAdvantages.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' : displayAdvantages.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
              {displayAdvantages.map((item, index) => {
                const IconComponent = iconMap[item.icon || 'FaCertificate'] || FaCertificate;
                return (
                  <div 
                    key={item.id || index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group h-full flex flex-col"
                  >
                    <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 flex-shrink-0"></div>
                    <div className="p-6 flex flex-col flex-1">
                      {/* Icon - fixed height */}
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      {/* Title - fixed height area */}
                      <div className="h-14 flex items-center justify-center flex-shrink-0">
                        <h3 className="text-xl font-bold text-center text-gray-800 leading-tight">{item.title}</h3>
                      </div>
                      {/* Content - flexible area, aligned to top */}
                      <div className="flex-1 flex items-start justify-center pt-2">
                        <p className="text-gray-600 text-center text-sm">{item.content}</p>
                      </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 flex-shrink-0 mt-auto"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA section */}
          <div 
            className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden relative"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
            
            <div className="absolute -left-10 top-1/2 w-32 h-32 bg-orange-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -right-10 top-1/2 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Нужна консультация?
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-6">
                Свяжитесь с нами, чтобы получить подробную информацию о наших услугах и продукции
              </p>
              <Link 
                href="/contacts" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
