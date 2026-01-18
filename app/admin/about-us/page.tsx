'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/app/lib/supabase';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiEye, FiEyeOff, FiX, FiImage, FiLayout, FiGrid, FiBarChart2 } from 'react-icons/fi';
import Image from 'next/image';

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

interface FormData {
  block_key: string;
  title: string;
  content: string;
  image_url: string;
  icon: string;
  order: number;
  is_active: boolean;
  metadata: Record<string, unknown>;
}

// Section types for categorization
type SectionType = 'main' | 'advantage' | 'stats';

const MAIN_SECTION_KEYS = ['company_intro', 'history', 'about', 'intro', 'mission', 'Миссия', 'миссия'];
const STATS_KEYS = ['stats', 'statistics', 'статистика'];

const ICON_OPTIONS = [
  { value: 'FaCertificate', label: '📜 Сертификат' },
  { value: 'FaAward', label: '🏆 Награда' },
  { value: 'FaTools', label: '🔧 Инструменты' },
  { value: 'FaUsers', label: '👥 Пользователи' },
  { value: 'FaClock', label: '⏰ Часы' },
  { value: 'FaShield', label: '🛡️ Щит' },
  { value: 'FaCheck', label: '✓ Галочка' },
  { value: 'FaMedal', label: '🎖️ Медаль' },
];

function getSectionType(blockKey: string): SectionType {
  const key = blockKey.toLowerCase();
  if (STATS_KEYS.some(k => key.includes(k.toLowerCase()))) return 'stats';
  if (MAIN_SECTION_KEYS.some(k => key.includes(k.toLowerCase()))) return 'main';
  return 'advantage';
}

export default function AboutUsManagement() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useSupabase();
  const [items, setItems] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingType, setAddingType] = useState<SectionType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    block_key: '',
    title: '',
    content: '',
    image_url: '',
    icon: '',
    order: 0,
    is_active: true,
    metadata: {},
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching about content:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  // Categorize items
  const mainSections = items.filter(item => getSectionType(item.block_key) === 'main');
  const advantageCards = items.filter(item => getSectionType(item.block_key) === 'advantage');
  const statsSection = items.find(item => getSectionType(item.block_key) === 'stats');

  function startEditing(item: AboutContent) {
    setEditingId(item.id);
    setAddingType(null);
    setFormData({
      block_key: item.block_key,
      title: item.title || '',
      content: item.content || '',
      image_url: item.image_url || '',
      icon: item.icon || '',
      order: item.order || 0,
      is_active: item.is_active,
      metadata: item.metadata || {},
    });
    setError(null);
    setSuccess(null);
  }

  function openAddModal(type: SectionType) {
    setAddingType(type);
    setEditingId(null);
    
    let defaultKey = '';
    let defaultOrder = 0;
    
    if (type === 'main') {
      defaultKey = mainSections.length === 0 ? 'company_intro' : 'mission';
      defaultOrder = mainSections.length + 1;
    } else if (type === 'advantage') {
      defaultKey = `advantage_${advantageCards.length + 1}`;
      defaultOrder = 10 + advantageCards.length;
    } else if (type === 'stats') {
      defaultKey = 'stats';
      defaultOrder = 0;
    }
    
    setFormData({
      block_key: defaultKey,
      title: '',
      content: '',
      image_url: '',
      icon: type === 'advantage' ? 'FaCertificate' : '',
      order: defaultOrder,
      is_active: true,
      metadata: type === 'stats' ? { experience: 18, projects: 500, clients: 250, employees: 80 } : {},
    });
    setError(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setAddingType(null);
    setFormData({
      block_key: '',
      title: '',
      content: '',
      image_url: '',
      icon: '',
      order: 0,
      is_active: true,
      metadata: {},
    });
    setError(null);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (name === 'order' ? parseInt(value) || 0 : value),
    });
  };

  const handleMetadataChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        [key]: parseInt(value) || 0,
      },
    });
  };

  async function saveChanges(id: string) {
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('about_content')
        .update({
          block_key: formData.block_key,
          title: formData.title || null,
          content: formData.content || null,
          image_url: formData.image_url || null,
          icon: formData.icon || null,
          order: formData.order,
          is_active: formData.is_active,
          metadata: formData.metadata,
        })
        .eq('id', id);

      if (error) throw error;

      await fetchItems();
      setSuccess('Данные успешно сохранены');
      setEditingId(null);
    } catch (error) {
      console.error('Error saving about content:', error);
      setError('Ошибка сохранения');
    }
  }

  async function addItem() {
    setError(null);

    if (!formData.block_key.trim()) {
      setError('Ключ блока обязателен');
      return;
    }

    try {
      const { error } = await supabase
        .from('about_content')
        .insert([{
          block_key: formData.block_key,
          title: formData.title || null,
          content: formData.content || null,
          image_url: formData.image_url || null,
          icon: formData.icon || null,
          order: formData.order,
          is_active: formData.is_active,
          metadata: formData.metadata,
        }]);

      if (error) throw error;

      await fetchItems();
      setSuccess('Блок успешно добавлен');
      cancelEditing();
    } catch (error: unknown) {
      console.error('Error adding about content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        setError('Блок с таким ключом уже существует. Используйте другой ключ.');
      } else {
        setError('Ошибка добавления: ' + errorMessage);
      }
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Вы уверены, что хотите удалить этот блок?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('about_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(i => i.id !== id));
      setSuccess('Блок успешно удален');
    } catch (error) {
      console.error('Error deleting about content:', error);
      setError('Ошибка удаления');
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('about_content')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setItems(items.map(i => 
        i.id === id ? { ...i, is_active: !currentStatus } : i
      ));
    } catch (error) {
      console.error('Error toggling status:', error);
      setError('Ошибка изменения статуса');
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Render item card
  const renderItemCard = (item: AboutContent, type: SectionType) => {
    const isEditing = editingId === item.id;
    
    if (isEditing) {
      return (
        <div key={item.id} className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-800">Редактирование</h4>
            <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700">
              <FiX size={20} />
            </button>
          </div>
          {renderForm(type, false)}
        </div>
      );
    }

    return (
      <div 
        key={item.id} 
        className={`bg-white rounded-lg shadow p-4 border-l-4 ${
          item.is_active ? 'border-l-green-500' : 'border-l-yellow-500'
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                item.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {item.is_active ? 'Активно' : 'Скрыто'}
              </span>
              {type === 'advantage' && item.icon && (
                <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                  {ICON_OPTIONS.find(o => o.value === item.icon)?.label || item.icon}
                </span>
              )}
            </div>
            <h4 className="font-bold text-gray-800">{item.title || '(Без заголовка)'}</h4>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">{item.content || '(Без текста)'}</p>
            {type === 'main' && item.image_url && (
              <div className="flex items-center text-gray-400 text-xs mt-2">
                <FiImage className="mr-1" size={12} />
                {item.image_url}
              </div>
            )}
          </div>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => toggleActive(item.id, item.is_active)}
              className={`p-1.5 rounded ${item.is_active ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
              title={item.is_active ? 'Скрыть' : 'Показать'}
            >
              {item.is_active ? <FiEye size={16} /> : <FiEyeOff size={16} />}
            </button>
            <button
              onClick={() => startEditing(item)}
              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
              title="Редактировать"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
              title="Удалить"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render form based on type
  const renderForm = (type: SectionType, isNew: boolean) => (
    <div className="space-y-4">
      {type === 'main' && (
        <>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Тип секции</label>
            <select
              name="block_key"
              value={formData.block_key}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="company_intro">О компании (Кто мы)</option>
              <option value="mission">Миссия</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Заголовок</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Например: История компании"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Текст</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              rows={5}
              placeholder="Подробное описание..."
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">URL изображения</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="/img/services/example.jpg"
            />
            {formData.image_url && (
              <div className="mt-2 w-32 h-20 relative rounded overflow-hidden border">
                <Image src={formData.image_url} alt="Preview" fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>
        </>
      )}

      {type === 'advantage' && (
        <>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Заголовок карточки</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Например: Качество"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Описание</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="Краткое описание преимущества..."
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Иконка</label>
            <select
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            >
              {ICON_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Ключ (уникальный)</label>
            <input
              type="text"
              name="block_key"
              value={formData.block_key}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="quality, safety, support..."
            />
          </div>
        </>
      )}

      {type === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Лет опыта</label>
            <input
              type="number"
              value={(formData.metadata.experience as number) || ''}
              onChange={(e) => handleMetadataChange('experience', e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-xl font-bold"
              placeholder="18"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Проектов</label>
            <input
              type="number"
              value={(formData.metadata.projects as number) || ''}
              onChange={(e) => handleMetadataChange('projects', e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-xl font-bold"
              placeholder="500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Клиентов</label>
            <input
              type="number"
              value={(formData.metadata.clients as number) || ''}
              onChange={(e) => handleMetadataChange('clients', e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-xl font-bold"
              placeholder="250"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Специалистов</label>
            <input
              type="number"
              value={(formData.metadata.employees as number) || ''}
              onChange={(e) => handleMetadataChange('employees', e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-xl font-bold"
              placeholder="80"
            />
          </div>
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleInputChange}
          className="h-5 w-5 text-blue-600 rounded"
        />
        <label className="ml-2 text-gray-700">Показывать на сайте</label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="button"
          onClick={cancelEditing}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={() => isNew ? addItem() : saveChanges(editingId!)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
        >
          <FiSave className="mr-2" /> {isNew ? 'Добавить' : 'Сохранить'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Страница &quot;О компании&quot;</h1>
        <p className="text-gray-600 mt-1">Управление контентом страницы</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-lg">Загрузка данных...</div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* STATISTICS SECTION */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FiBarChart2 className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Статистика</h2>
                  <p className="text-sm text-gray-600">Цифры в шапке страницы: опыт, проекты, клиенты, специалисты</p>
                </div>
              </div>
              {!statsSection && !addingType && (
                <button
                  onClick={() => openAddModal('stats')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm"
                >
                  <FiPlus className="mr-1" /> Добавить
                </button>
              )}
            </div>
            
            {addingType === 'stats' ? (
              <div className="bg-white rounded-lg p-6 border">
                <h4 className="font-bold text-gray-800 mb-4">Новая статистика</h4>
                {renderForm('stats', true)}
              </div>
            ) : statsSection ? (
              editingId === statsSection.id ? (
                <div className="bg-white rounded-lg p-6 border">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-800">Редактирование статистики</h4>
                    <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700">
                      <FiX size={20} />
                    </button>
                  </div>
                  {renderForm('stats', false)}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-4 border">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-black text-blue-600">{(statsSection.metadata?.experience as number) || 18}</p>
                      <p className="text-xs text-gray-500 uppercase">Лет опыта</p>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-blue-600">{(statsSection.metadata?.projects as number) || 500}+</p>
                      <p className="text-xs text-gray-500 uppercase">Проектов</p>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-blue-600">{(statsSection.metadata?.clients as number) || 250}+</p>
                      <p className="text-xs text-gray-500 uppercase">Клиентов</p>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-blue-600">{(statsSection.metadata?.employees as number) || 80}</p>
                      <p className="text-xs text-gray-500 uppercase">Специалистов</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      onClick={() => startEditing(statsSection)}
                      className="px-3 py-1.5 text-blue-500 hover:bg-blue-50 rounded flex items-center text-sm"
                    >
                      <FiEdit2 className="mr-1" size={14} /> Редактировать
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-white rounded-lg p-6 border text-center text-gray-500">
                Статистика не добавлена. Используются значения по умолчанию.
              </div>
            )}
          </div>

          {/* MAIN SECTIONS */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <FiLayout className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Основные секции</h2>
                  <p className="text-sm text-gray-600">Большие блоки с изображениями: &quot;Кто мы&quot; и &quot;Миссия&quot;</p>
                </div>
              </div>
              {mainSections.length < 2 && !addingType && (
                <button
                  onClick={() => openAddModal('main')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center text-sm"
                >
                  <FiPlus className="mr-1" /> Добавить секцию
                </button>
              )}
            </div>
            
            {addingType === 'main' && (
              <div className="bg-white rounded-lg p-6 border mb-4">
                <h4 className="font-bold text-gray-800 mb-4">Новая секция</h4>
                {renderForm('main', true)}
              </div>
            )}
            
            {mainSections.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {mainSections.map(item => renderItemCard(item, 'main'))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border text-center text-gray-500">
                Секции не добавлены. Используются тексты по умолчанию.
              </div>
            )}
          </div>

          {/* ADVANTAGE CARDS */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FiGrid className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Карточки преимуществ</h2>
                  <p className="text-sm text-gray-600">Маленькие карточки с иконками: Качество, Безопасность и т.д.</p>
                </div>
              </div>
              {!addingType && (
                <button
                  onClick={() => openAddModal('advantage')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm"
                >
                  <FiPlus className="mr-1" /> Добавить карточку
                </button>
              )}
            </div>
            
            {addingType === 'advantage' && (
              <div className="bg-white rounded-lg p-6 border mb-4">
                <h4 className="font-bold text-gray-800 mb-4">Новая карточка преимущества</h4>
                {renderForm('advantage', true)}
              </div>
            )}
            
            {advantageCards.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {advantageCards.map(item => renderItemCard(item, 'advantage'))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border text-center text-gray-500">
                Карточки не добавлены. Используются значения по умолчанию.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
