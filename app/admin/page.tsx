'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSupabase } from '../providers/supabase-provider'
import { supabase } from '../lib/supabase'
import { FiBox, FiSettings, FiList, FiPackage, FiUsers, FiFileText, FiImage, FiVideo, FiTrendingUp } from 'react-icons/fi'

interface Stats {
  categories: number;
  services: number;
  products: number;
  aboutContent: number;
  contacts: number;
}

export default function AdminDashboard() {
  const { user, isLoading } = useSupabase()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    categories: 0,
    services: 0,
    products: 0,
    aboutContent: 0,
    contacts: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/admin/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch counts from all tables
        const [categoriesRes, servicesRes, productsRes, aboutRes, contactsRes] = await Promise.all([
          supabase.from('categories').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('about_content').select('id', { count: 'exact', head: true }),
          supabase.from('contacts').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          categories: categoriesRes.count || 0,
          services: servicesRes.count || 0,
          products: productsRes.count || 0,
          aboutContent: aboutRes.count || 0,
          contacts: contactsRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const statCards = [
    {
      title: 'Категории',
      value: stats.categories,
      icon: <FiList className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Услуги',
      value: stats.services,
      icon: <FiSettings className="h-8 w-8" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Товары',
      value: stats.products,
      icon: <FiPackage className="h-8 w-8" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'О компании',
      value: stats.aboutContent,
      icon: <FiUsers className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Контакты',
      value: stats.contacts,
      icon: <FiFileText className="h-8 w-8" />,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
    },
  ]

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
            <FiTrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Панель управления</h1>
            <p className="text-gray-600">Статистика сайта</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div 
            key={index}
            className={`${card.bgColor} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg text-white`}>
                {card.icon}
              </div>
              {loadingStats ? (
                <div className="animate-pulse bg-gray-200 h-10 w-16 rounded"></div>
              ) : (
                <span className={`text-4xl font-black ${card.textColor}`}>{card.value}</span>
              )}
            </div>
            <h3 className="text-gray-700 font-semibold">{card.title}</h3>
            <p className="text-gray-500 text-sm mt-1">Всего записей</p>
          </div>
        ))}
      </div>

      {/* Welcome message */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <FiBox className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Добро пожаловать!</h2>
            <p className="text-gray-300 leading-relaxed">
              Используйте меню слева для управления контентом сайта. 
              Вы можете редактировать категории, услуги, товары, информацию о компании и контакты.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiImage className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Изображения</h3>
          </div>
          <p className="text-gray-600 text-sm">Загружайте изображения через разделы Каталог и Услуги</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiVideo className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Видео</h3>
          </div>
          <p className="text-gray-600 text-sm">Управляйте видео через раздел &quot;Наши проекты&quot;</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiUsers className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800">О компании</h3>
          </div>
          <p className="text-gray-600 text-sm">Редактируйте информацию через раздел &quot;О компании&quot;</p>
        </div>
      </div>
    </div>
  )
}
