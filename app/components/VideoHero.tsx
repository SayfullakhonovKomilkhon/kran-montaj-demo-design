'use client';

import React, { useState } from 'react';

// Локальное видео (fallback) и Supabase Storage
const LOCAL_VIDEO_URL = '/video/hero-video.mp4';
const SUPABASE_VIDEO_URL = 'https://qkvgjrywutnudwcoekmf.supabase.co/storage/v1/object/public/video/video-header.mp4';

export default function VideoHero() {
  const [videoError, setVideoError] = useState(false);
  
  // Используем локальное видео как основной источник, Supabase как fallback
  const videoUrl = videoError ? SUPABASE_VIDEO_URL : LOCAL_VIDEO_URL;
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden -mt-[120px] md:-mt-[130px]">
      {/* Video background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: -1 }}
        onError={() => setVideoError(true)}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Dark industrial overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/40 to-gray-900/80 z-0"></div>
      
      
      {/* Stats - positioned near bottom */}
      <div className="absolute bottom-32 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8">
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          <div className="text-center p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-3xl sm:text-4xl font-black text-orange-400">15+</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Лет опыта</div>
          </div>
          <div className="text-center p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-3xl sm:text-4xl font-black text-yellow-400">500+</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Проектов</div>
          </div>
          <div className="text-center p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-3xl sm:text-4xl font-black text-orange-400">250+</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Клиентов</div>
          </div>
          <div className="text-center p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-3xl sm:text-4xl font-black text-yellow-400">24/7</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Поддержка</div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 z-10"></div>
    </div>
  );
}
