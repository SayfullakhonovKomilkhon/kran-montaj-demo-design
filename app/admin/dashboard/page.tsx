'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';
import { FiBox, FiUsers, FiImage, FiVideo } from 'react-icons/fi';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useSupabase();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Welcome message */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <FiBox className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Добро пожаловать!</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Используйте меню слева для управления контентом сайта. 
              Вы можете редактировать категории, услуги, товары, информацию о компании и контакты.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiImage className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Изображения</h3>
          </div>
          <p className="text-gray-500 text-xs">Загружайте изображения через разделы Каталог и Услуги</p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <FiVideo className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Видео</h3>
          </div>
          <p className="text-gray-500 text-xs">Управляйте видео через раздел &quot;Наши проекты&quot;</p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiUsers className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">О компании</h3>
          </div>
          <p className="text-gray-500 text-xs">Редактируйте информацию через раздел &quot;О компании&quot;</p>
        </div>
      </div>
    </div>
  );
}
