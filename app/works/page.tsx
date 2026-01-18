'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

interface VideoFile {
  id: string;
  name: string;
  title: string;
  description: string;
  url: string;
  video_type: 'file' | 'url' | 'youtube';
  youtube_id?: string;
  created_at: string;
}

interface PhotoFile {
  id: string;
  name: string;
  title: string;
  url: string;
  created_at: string;
}

const SUPABASE_URL = 'https://rgpdolopvlfdiutwlvow.supabase.co';

interface VideoData {
  video_type: 'file' | 'url' | 'youtube';
  youtube_id?: string;
  video_url?: string;
  filename?: string;
}

// Get video URL based on type
function getVideoUrl(video: VideoData): string {
  switch (video.video_type) {
    case 'youtube':
      return `https://www.youtube.com/embed/${video.youtube_id || ''}`;
    case 'url':
      return video.video_url || '';
    case 'file':
    default:
      return `${SUPABASE_URL}/storage/v1/object/public/video/${encodeURIComponent(video.filename || '')}`;
  }
}

// Get YouTube thumbnail
function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
}

// Thumbnail component for the sidebar (videos)
function VideoThumbnail({ 
  video, 
  isSelected, 
  onClick 
}: { 
  video: VideoFile; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isYouTube = video.video_type === 'youtube';

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-lg transition-all duration-300 overflow-hidden flex ${
        isSelected 
          ? 'bg-orange-50 ring-2 ring-orange-500' 
          : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-orange-300'
      }`}
    >
      {/* Thumbnail - Fixed 16:9 aspect ratio */}
      <div className="relative w-32 sm:w-36 flex-shrink-0 aspect-video bg-gray-900 overflow-hidden">
        {isYouTube && video.youtube_id ? (
          <img
            src={getYouTubeThumbnail(video.youtube_id)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={video.url}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
            onMouseEnter={() => !isYouTube && videoRef.current?.play()}
            onMouseLeave={() => {
              if (!isYouTube && videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
          />
        )}
        
        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isYouTube 
              ? 'bg-red-500'
              : (isSelected ? 'bg-orange-500' : 'bg-white/70 group-hover:bg-white/90')
          }`}>
            <svg className={`w-4 h-4 ml-0.5 ${isYouTube || isSelected ? 'text-white' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        {/* Type badge */}
        {isYouTube && (
          <div className="absolute bottom-1 left-1 bg-red-500 text-white text-[10px] px-1 py-0.5 rounded font-bold">
            YT
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
        <h4 className={`font-semibold text-sm leading-tight truncate ${isSelected ? 'text-orange-700' : 'text-gray-800'}`}>
          {video.title}
        </h4>
        {video.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{video.description}</p>
        )}
        {isSelected && (
          <span className="text-[10px] text-orange-600 font-bold mt-1 uppercase tracking-wide">▶ Воспроизводится</span>
        )}
      </div>
    </div>
  );
}

// Photo thumbnail component
function PhotoThumbnail({ 
  photo, 
  isSelected, 
  onClick 
}: { 
  photo: PhotoFile; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-lg transition-all duration-300 overflow-hidden flex ${
        isSelected 
          ? 'bg-orange-50 ring-2 ring-orange-500' 
          : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-orange-300'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative w-32 sm:w-36 flex-shrink-0 aspect-video bg-gray-200 overflow-hidden">
        <Image
          src={photo.url}
          alt={photo.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="150px"
        />
        
        {/* Zoom icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all">
          <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Info */}
      <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
        <h4 className={`font-semibold text-sm leading-tight truncate ${isSelected ? 'text-orange-700' : 'text-gray-800'}`}>
          {photo.title}
        </h4>
        {isSelected && (
          <span className="text-[10px] text-orange-600 font-bold mt-1 uppercase tracking-wide">✓ Выбрано</span>
        )}
      </div>
    </div>
  );
}

export default function WorksPage() {
  const [viewMode, setViewMode] = useState<'video' | 'photo'>('video');
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        
        // Fetch videos from database
        const { data: dbVideos } = await supabase
          .from('videos')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        
        if (dbVideos && dbVideos.length > 0) {
          const videoFiles: VideoFile[] = dbVideos.map(video => ({
            id: video.id,
            name: video.filename,
            title: video.title,
            description: video.description || '',
            url: getVideoUrl(video),
            video_type: video.video_type || 'file',
            youtube_id: video.youtube_id,
            created_at: video.created_at
          }));
          setVideos(videoFiles);
          setSelectedVideo(videoFiles[0]);
        } else {
          // Fallback videos
          const knownVideoFiles = [
            { title: 'Проект 1', filename: '0u9dq5fzmlad_1748104138382.mp4' },
            { title: 'Проект 2', filename: 'fa108d7pstu_1748104211093.mp4' },
            { title: 'Проект 3', filename: 'fgvgtlomy0i_1748021981959.mp4' },
            { title: 'Проект 4', filename: 'n9pmlarbaei_1748163383916.mp4' },
          ];
          
          const videoFiles: VideoFile[] = knownVideoFiles.map((v, index) => ({
            id: `fallback-${index}`,
            name: v.filename,
            title: v.title,
            description: '',
            url: `${SUPABASE_URL}/storage/v1/object/public/video/${encodeURIComponent(v.filename)}`,
            video_type: 'file' as const,
            created_at: new Date().toISOString()
          }));
          setVideos(videoFiles);
          setSelectedVideo(videoFiles[0]);
        }

        // Fetch photos from database table
        const { data: dbPhotos } = await supabase
          .from('photos')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (dbPhotos && dbPhotos.length > 0) {
          const photoItems: PhotoFile[] = dbPhotos.map(photo => ({
            id: photo.id,
            name: photo.filename,
            title: photo.title,
            url: `${SUPABASE_URL}/storage/v1/object/public/products_img/${encodeURIComponent(photo.filename)}`,
            created_at: photo.created_at
          }));
          setPhotos(photoItems);
          if (photoItems.length > 0) {
            setSelectedPhoto(photoItems[0]);
          }
        } else {
          // Fallback: try to get photos from images bucket or use placeholders
          const fallbackPhotos: PhotoFile[] = [
            { id: '1', name: 'photo1', title: 'Проект 1', url: '/img/services/IMG_9236.jpg', created_at: new Date().toISOString() },
            { id: '2', name: 'photo2', title: 'Проект 2', url: '/img/services/IMG_9370.jpg', created_at: new Date().toISOString() },
            { id: '3', name: 'photo3', title: 'Проект 3', url: '/img/services/photo_2022-11-07_15-16-02.jpg', created_at: new Date().toISOString() },
          ];
          setPhotos(fallbackPhotos);
          setSelectedPhoto(fallbackPhotos[0]);
        }
        
      } catch (err) {
        console.error('Error:', err);
        setError('Не удалось загрузить медиа');
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, []);

  // Handle video selection
  const handleVideoSelect = (video: VideoFile) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    if (mainVideoRef.current) {
      mainVideoRef.current.load();
    }
  };

  // Handle photo selection
  const handlePhotoSelect = (photo: PhotoFile) => {
    setSelectedPhoto(photo);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentItems = viewMode === 'video' ? videos : photos;
  const itemCount = currentItems.length;

  return (
    <div className="bg-gradient-to-b from-slate-100 to-gray-100 min-h-screen">
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

        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 relative">
          <div className="text-center relative">
            {/* Industrial icon */}
            <div className="inline-flex items-center justify-center mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-black text-white sm:text-4xl tracking-tight uppercase">
              Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">работы</span>
            </h1>
            
            {/* Industrial underline */}
            <div className="flex items-center justify-center mt-3 space-x-2">
              <div className="w-10 h-0.5 bg-gray-600 rounded"></div>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded"></div>
              <div className="w-10 h-0.5 bg-gray-600 rounded"></div>
            </div>
            
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-gray-400 leading-relaxed">
              Галерея <span className="text-orange-400 font-semibold">выполненных проектов</span>
            </p>
            
            {/* Stats */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-sm font-semibold">{photos.length} фото</span>
              </div>
              <div className="flex items-center bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="text-white text-sm font-semibold">{videos.length} видео</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">Загрузка...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Toggle Buttons - Above main content on mobile */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-3 border border-gray-200">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('photo')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    viewMode === 'photo'
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Фото
                </button>
                <button
                  onClick={() => setViewMode('video')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    viewMode === 'video'
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Видео
                </button>
              </div>
              <span className="text-sm text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full">
                {itemCount} {viewMode === 'video' ? 'видео' : 'фото'}
              </span>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Media Player - Takes 2 columns on desktop */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                  {/* Top accent bar */}
                  <div className="h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>
                  
                  {/* Media Container - 16:9 aspect ratio */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <div className="absolute inset-0 bg-gray-900">
                      {viewMode === 'video' ? (
                        // Video player
                        selectedVideo && (
                          <>
                            {selectedVideo.video_type === 'youtube' ? (
                              <iframe
                                src={`${selectedVideo.url}?autoplay=0&rel=0`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <>
                                <video
                                  ref={mainVideoRef}
                                  src={selectedVideo.url}
                                  className="w-full h-full object-contain"
                                  controls
                                  onPlay={() => setIsPlaying(true)}
                                  onPause={() => setIsPlaying(false)}
                                  onEnded={() => setIsPlaying(false)}
                                />
                                
                                {/* Custom overlay when not playing */}
                                {!isPlaying && (
                                  <div 
                                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex items-center justify-center cursor-pointer group"
                                    onClick={togglePlay}
                                  >
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-500/90 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-500 shadow-xl shadow-orange-500/40">
                                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )
                      ) : (
                        // Photo viewer
                        selectedPhoto && (
                          <div className="relative w-full h-full">
                            <Image
                              src={selectedPhoto.url}
                              alt={selectedPhoto.title}
                              fill
                              className="object-contain"
                              sizes="(max-width: 1024px) 100vw, 66vw"
                              priority
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  
                  {/* Media Info */}
                  <div className="p-4 sm:p-5 border-t border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                            {viewMode === 'video' 
                              ? (selectedVideo?.title || 'Выберите видео')
                              : (selectedPhoto?.title || 'Выберите фото')
                            }
                          </h2>
                          {viewMode === 'video' && selectedVideo?.video_type === 'youtube' && (
                            <span className="flex-shrink-0 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-bold">
                              YouTube
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {viewMode === 'video' 
                            ? (selectedVideo?.description || 'Выберите видео из списка для просмотра')
                            : 'Выберите фото из списка для просмотра'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Media List - Right sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center">
                      <div className="w-1 h-5 bg-orange-500 rounded mr-2"></div>
                      {viewMode === 'video' ? 'Видео' : 'Фотографии'}
                      <span className="ml-2 text-xs text-gray-500 font-normal">({itemCount})</span>
                    </h3>
                  </div>
                  
                  {/* Scrollable media list */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar" style={{ maxHeight: '500px' }}>
                    {viewMode === 'video' ? (
                      videos.length > 0 ? (
                        videos.map((video) => (
                          <VideoThumbnail
                            key={video.id}
                            video={video}
                            isSelected={selectedVideo?.id === video.id}
                            onClick={() => handleVideoSelect(video)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">Видео пока нет</p>
                        </div>
                      )
                    ) : (
                      photos.length > 0 ? (
                        photos.map((photo) => (
                          <PhotoThumbnail
                            key={photo.id}
                            photo={photo}
                            isSelected={selectedPhoto?.id === photo.id}
                            onClick={() => handlePhotoSelect(photo)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">Фото пока нет</p>
                        </div>
                      )
                    )}
                  </div>
                  
                  {/* CTA */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <Link
                      href="/contacts"
                      className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg"
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
        )}
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}</style>
    </div>
  );
}
