'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';

interface Video {
  id: string;
  title: string;
  filename: string;
  video_type: 'file' | 'url' | 'youtube';
  video_url?: string;
  youtube_id?: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface Photo {
  id: string;
  title: string;
  filename: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const SUPABASE_URL = 'https://qkvgjrywutnudwcoekmf.supabase.co';

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Get video URL based on type
function getVideoUrl(video: Video): string {
  switch (video.video_type) {
    case 'youtube':
      return `https://www.youtube.com/embed/${video.youtube_id}`;
    case 'url':
      return video.video_url || '';
    case 'file':
    default:
      return `${SUPABASE_URL}/storage/v1/object/public/video/${encodeURIComponent(video.filename)}`;
  }
}

// Get thumbnail URL
function getThumbnailUrl(video: Video): string {
  if (video.video_type === 'youtube' && video.youtube_id) {
    return `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`;
  }
  return '';
}

export default function AdminProjectsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'video' | 'photo'>('video');
  
  // Videos state
  const [videos, setVideos] = useState<Video[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addMethod, setAddMethod] = useState<'file' | 'url' | 'youtube'>('file');
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    file: null as File | null,
    url: '',
    youtubeUrl: '',
    is_active: true,
    sort_order: 0
  });
  
  // Photo form state
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    file: null as File | null,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  useEffect(() => {
    fetchVideos();
    fetchPhotos();
  }, []);

  async function fetchVideos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Ошибка загрузки видео');
    } finally {
      setLoading(false);
    }
  }

  async function fetchPhotos() {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  }

  // Get photo URL from filename
  function getPhotoUrl(filename: string): string {
    return `${SUPABASE_URL}/storage/v1/object/public/products_img/${encodeURIComponent(filename)}`;
  }

  // Upload video file to Supabase Storage
  async function uploadVideoFile(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('video')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      return fileName;
    } catch (err: unknown) {
      console.error('Upload error:', err);
      throw err;
    }
  }

  // Upload photo to products_img bucket
  async function uploadPhotoFile(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products_img')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      return fileName;
    } catch (err: unknown) {
      console.error('Upload error:', err);
      throw err;
    }
  }

  // Add new video
  async function handleAddVideo(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const videoData: Record<string, string | boolean | number | null> = {
        title: newVideo.title,
        description: newVideo.description,
        is_active: newVideo.is_active,
        sort_order: newVideo.sort_order,
        video_type: addMethod
      };

      if (addMethod === 'file') {
        if (!newVideo.file) {
          setError('Выберите файл для загрузки');
          return;
        }
        
        setUploading(true);
        setUploadProgress(10);
        
        const fileName = await uploadVideoFile(newVideo.file);
        if (!fileName) {
          setError('Ошибка загрузки файла');
          return;
        }
        
        setUploadProgress(100);
        videoData.filename = fileName;
        
      } else if (addMethod === 'url') {
        if (!newVideo.url) {
          setError('Введите URL видео');
          return;
        }
        videoData.video_url = newVideo.url;
        videoData.filename = `url_${Date.now()}`;
        
      } else if (addMethod === 'youtube') {
        const youtubeId = extractYouTubeId(newVideo.youtubeUrl);
        if (!youtubeId) {
          setError('Неверный формат YouTube ссылки');
          return;
        }
        videoData.youtube_id = youtubeId;
        videoData.filename = `youtube_${youtubeId}`;
      }

      const { error } = await supabase
        .from('videos')
        .insert([videoData]);

      if (error) throw error;

      setSuccess('Видео добавлено!');
      setNewVideo({ 
        title: '', 
        description: '', 
        file: null, 
        url: '', 
        youtubeUrl: '',
        is_active: true, 
        sort_order: 0 
      });
      setShowAddForm(false);
      fetchVideos();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Ошибка добавления');
    } finally {
      setSaving(false);
      setUploading(false);
      setUploadProgress(0);
    }
  }

  // Add new photo
  async function handleAddPhoto(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      if (!newPhoto.file) {
        setError('Выберите файл для загрузки');
        return;
      }
      
      setUploading(true);
      setUploadProgress(10);
      
      // Upload to storage
      const fileName = await uploadPhotoFile(newPhoto.file);
      if (!fileName) {
        setError('Ошибка загрузки файла');
        return;
      }
      
      setUploadProgress(70);
      
      // Save to database table
      const { error: dbError } = await supabase
        .from('photos')
        .insert([{
          title: newPhoto.title || newPhoto.file.name.replace(/\.[^/.]+$/, ''),
          filename: fileName,
          is_active: true,
          sort_order: photos.length
        }]);

      if (dbError) throw dbError;
      
      setUploadProgress(100);

      setSuccess('Фото добавлено!');
      setNewPhoto({ title: '', file: null });
      setShowAddPhotoForm(false);
      fetchPhotos();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Ошибка добавления');
    } finally {
      setSaving(false);
      setUploading(false);
      setUploadProgress(0);
    }
  }

  // Update video
  async function handleUpdateVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('videos')
        .update({
          title: editingVideo.title,
          description: editingVideo.description,
          is_active: editingVideo.is_active,
          sort_order: editingVideo.sort_order
        })
        .eq('id', editingVideo.id);

      if (error) throw error;

      setSuccess('Видео обновлено!');
      setEditingVideo(null);
      fetchVideos();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Ошибка обновления');
    } finally {
      setSaving(false);
    }
  }

  // Delete video
  async function handleDeleteVideo(video: Video) {
    if (!confirm('Удалить это видео?')) return;

    try {
      if (video.video_type === 'file' && video.filename) {
        await supabase.storage.from('video').remove([video.filename]);
      }

      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id);

      if (error) throw error;

      setSuccess('Видео удалено!');
      fetchVideos();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Ошибка удаления');
    }
  }

  // Delete photo
  async function handleDeletePhoto(photo: Photo) {
    if (!confirm('Удалить это фото?')) return;

    try {
      // Delete from storage
      await supabase.storage
        .from('products_img')
        .remove([photo.filename]);

      // Delete from database
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (error) throw error;

      setSuccess('Фото удалено!');
      fetchPhotos();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Ошибка удаления');
    }
  }

  // Toggle photo active status
  async function togglePhotoActive(photo: Photo) {
    try {
      const { error } = await supabase
        .from('photos')
        .update({ is_active: !photo.is_active })
        .eq('id', photo.id);

      if (error) throw error;
      fetchPhotos();
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Ошибка');
    }
  }

  // Toggle active status
  async function toggleActive(video: Video) {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_active: !video.is_active })
        .eq('id', video.id);

      if (error) throw error;
      fetchVideos();
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Ошибка');
    }
  }

  // Handle file selection
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('Файл слишком большой. Максимум 100MB');
        return;
      }
      setNewVideo({ ...newVideo, file, title: newVideo.title || file.name.replace(/\.[^/.]+$/, '') });
    }
  }

  // Handle photo selection
  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Файл слишком большой. Максимум 10MB');
        return;
      }
      setNewPhoto({ ...newPhoto, file, title: newPhoto.title || file.name.replace(/\.[^/.]+$/, '') });
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Наши проекты</h1>
          <p className="text-gray-600 mt-1">Управление фото и видео для страницы &quot;Наши работы&quot;</p>
        </div>
        <button
          onClick={() => activeTab === 'video' ? setShowAddForm(true) : setShowAddPhotoForm(true)}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {activeTab === 'video' ? 'Добавить видео' : 'Добавить фото'}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'video'
              ? 'bg-white text-amber-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Видео ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab('photo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'photo'
              ? 'bg-white text-amber-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Фото ({photos.length})
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
          <button onClick={() => setError(null)} className="ml-auto">&times;</button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* Add Photo Form Modal */}
      {showAddPhotoForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Добавить фото</h2>
                <button onClick={() => setShowAddPhotoForm(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddPhoto} className="p-6 space-y-4">
              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Фото *</label>
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    newPhoto.file 
                      ? 'border-amber-400 bg-amber-50' 
                      : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                >
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  {newPhoto.file ? (
                    <div>
                      <svg className="w-12 h-12 mx-auto text-amber-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-amber-700 font-medium">{newPhoto.file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(newPhoto.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 font-medium">Нажмите для выбора файла</p>
                      <p className="text-sm text-gray-400 mt-1">JPG, PNG, WebP до 10MB</p>
                    </div>
                  )}
                </div>
                {uploading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Загрузка...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPhotoForm(false);
                    setNewPhoto({ title: '', file: null });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading || !newPhoto.file}
                  className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 font-medium"
                >
                  {uploading ? 'Загрузка...' : saving ? 'Сохранение...' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Video Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Добавить новое видео</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Method tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setAddMethod('file')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    addMethod === 'file'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  С компьютера
                </button>
                <button
                  type="button"
                  onClick={() => setAddMethod('url')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    addMethod === 'url'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  По ссылке
                </button>
                <button
                  type="button"
                  onClick={() => setAddMethod('youtube')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    addMethod === 'youtube'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddVideo} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                <input
                  type="text"
                  required
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Монтаж крана на заводе"
                />
              </div>

              {/* File upload */}
              {addMethod === 'file' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Видео файл *</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      newVideo.file 
                        ? 'border-amber-400 bg-amber-50' 
                        : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {newVideo.file ? (
                      <div>
                        <svg className="w-12 h-12 mx-auto text-amber-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-amber-700 font-medium">{newVideo.file.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {(newVideo.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 font-medium">Нажмите для выбора файла</p>
                        <p className="text-sm text-gray-400 mt-1">MP4, WebM, MOV до 100MB</p>
                      </div>
                    )}
                  </div>
                  {uploading && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Загрузка...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* URL input */}
              {addMethod === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL видео *</label>
                  <input
                    type="url"
                    value={newVideo.url}
                    onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://example.com/video.mp4"
                  />
                  <p className="text-xs text-gray-500 mt-1">Прямая ссылка на видео файл</p>
                </div>
              )}

              {/* YouTube input */}
              {addMethod === 'youtube' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на YouTube *</label>
                  <input
                    type="text"
                    value={newVideo.youtubeUrl}
                    onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Поддерживаются форматы: youtube.com/watch?v=..., youtu.be/..., или ID видео
                  </p>
                  
                  {/* YouTube preview */}
                  {newVideo.youtubeUrl && extractYouTubeId(newVideo.youtubeUrl) && (
                    <div className="mt-3 rounded-lg overflow-hidden bg-black aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeId(newVideo.youtubeUrl)}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={2}
                  placeholder="Краткое описание проекта..."
                />
              </div>

              {/* Sort order & Active */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
                  <input
                    type="number"
                    value={newVideo.sort_order}
                    onChange={(e) => setNewVideo({ ...newVideo, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newVideo.is_active}
                      onChange={(e) => setNewVideo({ ...newVideo, is_active: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${newVideo.is_active ? 'bg-amber-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${newVideo.is_active ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                    </div>
                    <span className="ml-2 text-sm text-gray-700">Активно</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewVideo({ title: '', description: '', file: null, url: '', youtubeUrl: '', is_active: true, sort_order: 0 });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 font-medium"
                >
                  {uploading ? 'Загрузка...' : saving ? 'Сохранение...' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Редактировать видео</h2>
            </div>
            <form onSubmit={handleUpdateVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                <input
                  type="text"
                  required
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={editingVideo.description || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  rows={2}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
                  <input
                    type="number"
                    value={editingVideo.sort_order}
                    onChange={(e) => setEditingVideo({ ...editingVideo, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingVideo.is_active}
                      onChange={(e) => setEditingVideo({ ...editingVideo, is_active: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${editingVideo.is_active ? 'bg-amber-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${editingVideo.is_active ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                    </div>
                    <span className="ml-2 text-sm text-gray-700">Активно</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'video' ? (
        /* Videos List */
        loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            <p className="mt-2 text-gray-600">Загрузка...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-lg">Видео пока нет</p>
            <p className="text-gray-400 mt-1">Нажмите &quot;Добавить видео&quot; чтобы начать</p>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`bg-gray-50 rounded-xl p-4 flex items-center gap-4 ${!video.is_active ? 'opacity-60' : ''}`}
              >
                {/* Preview */}
                <div className="w-40 h-24 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {video.video_type === 'youtube' ? (
                    <img
                      src={getThumbnailUrl(video)}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={getVideoUrl(video)}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium text-white ${
                    video.video_type === 'youtube' ? 'bg-red-500' : 
                    video.video_type === 'url' ? 'bg-blue-500' : 'bg-gray-700'
                  }`}>
                    {video.video_type === 'youtube' ? 'YouTube' : 
                     video.video_type === 'url' ? 'URL' : 'Файл'}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-gray-500 truncate">{video.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Порядок: {video.sort_order}</p>
                </div>

                {/* Status */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  video.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                }`}>
                  {video.is_active ? 'Активно' : 'Скрыто'}
                </span>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(video)}
                    className={`p-2 rounded-lg ${video.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={video.is_active ? 'Скрыть' : 'Показать'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {video.is_active ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => setEditingVideo(video)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Редактировать"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Удалить"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Photos Grid */
        photos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-lg">Фото пока нет</p>
            <p className="text-gray-400 mt-1">Нажмите &quot;Добавить фото&quot; чтобы начать</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className={`group relative bg-gray-100 rounded-xl overflow-hidden aspect-square ${!photo.is_active ? 'opacity-50' : ''}`}>
                <Image
                  src={getPhotoUrl(photo.filename)}
                  alt={photo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Status badge */}
                {!photo.is_active && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-gray-800/80 text-white text-xs rounded">
                    Скрыто
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => togglePhotoActive(photo)}
                    className={`p-3 rounded-full transform scale-90 group-hover:scale-100 transition-transform ${photo.is_active ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                    title={photo.is_active ? 'Скрыть' : 'Показать'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {photo.is_active ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transform scale-90 group-hover:scale-100 transition-transform"
                    title="Удалить"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm truncate">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
