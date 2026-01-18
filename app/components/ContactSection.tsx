'use client';

import { useState, useEffect } from 'react';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState<{username?: string} | null>(null);

  // Bot configuration
  const BOT_TOKEN = '7943897874:AAFN0SB8zF6QW2sH3hJA1DaJ12Y1qnyDozk';
  // Use this actual chat ID from my account for testing
  const CHAT_ID = '575698739';

  // Fetch bot information when component mounts
  useEffect(() => {
    const fetchBotInfo = async () => {
      try {
        const response = await fetch('/api/telegram-bot-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bot_token: BOT_TOKEN }),
        });
        
        const data = await response.json();
        
        if (data.success && data.bot_info) {
          console.log('Bot info retrieved:', data.bot_info);
          setBotInfo(data.bot_info);
        } else {
          console.error('Failed to get bot info:', data.error);
        }
      } catch (error) {
        console.error('Error fetching bot info:', error);
      }
    };
    
    fetchBotInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendToTelegram = async (data: typeof formState) => {
    const text = `📨 New request from website:
👤 Name: ${data.name}
📞 Phone: ${data.phone}
💬 Message: ${data.message}`;

    console.log('Preparing to send message to Telegram');
    console.log('Using chat_id:', CHAT_ID);
    
    try {
      // Use our proxy API endpoint instead of calling Telegram directly
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_token: BOT_TOKEN,
          chat_id: CHAT_ID,
          text: text,
        }),
      });

      const responseText = await response.text();
      console.log('Raw API response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('API response data:', responseData);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        responseData = { error: 'Invalid JSON response' };
      }

      if (response.ok) {
        return responseData;
      } else {
        setDebugInfo(`API Error: ${responseData.error || 'Unknown error'}`);
        throw new Error(`Failed to send message: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending to Telegram:', error);
      setDebugInfo(`Fetch Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!CHAT_ID) {
      alert('Please set the CHAT_ID variable in ContactSection.tsx with your Telegram chat ID');
      return;
    }

    setIsSubmitting(true);
    setDebugInfo(null);
    console.log('Form submitted with data:', formState);
    
    try {
      await sendToTelegram(formState);
      alert('Сообщение отправлено!');
      setFormState({
        name: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      alert(`Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the bot activation link
  const getBotActivationLink = () => {
    if (botInfo && botInfo.username) {
      return `https://t.me/${botInfo.username}`;
    }
    // Fallback to a hardcoded link
    return 'https://t.me/cranmontaj_bot';
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Contact Form Card - Industrial style */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 group hover:shadow-2xl transition-all duration-500">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>
        
        <div className="p-8">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Обратная связь
            </div>
            <h3 className="text-2xl font-black text-gray-800">
              Оставьте заявку
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mt-3 rounded-full"></div>
            <p className="mt-4 text-gray-600">
              Заполните форму и мы свяжемся с вами <span className="text-orange-600 font-semibold">в ближайшее время</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Имя
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formState.name}
                onChange={handleChange}
                autoComplete="given-name"
                required
                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-xl text-gray-700 bg-gray-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                placeholder="Ваше имя"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                Телефон
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formState.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-xl text-gray-700 bg-gray-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                placeholder="+998 XX XXX XX XX"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                Сообщение
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formState.message}
                onChange={handleChange}
                required
                className="py-3 px-4 block w-full border-2 border-gray-200 rounded-xl text-gray-700 bg-gray-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                placeholder="Опишите ваш вопрос..."
              ></textarea>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </div>
            
            {debugInfo && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="font-bold">Debug info: {debugInfo}</p>
                {debugInfo.includes('chat not found') && (
                  <div className="mt-2">
                    <p>Вам нужно активировать бота, отправив ему сообщение первым:</p>
                    <a 
                      href={getBotActivationLink()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 font-bold underline"
                    >
                      Активировать бота в Telegram
                    </a>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
        
        {/* Bottom bar */}
        <div className="h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
      </div>
      
      {/* Contact Information Card - Industrial style */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 group hover:shadow-2xl transition-all duration-500">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>
        
        <div className="p-8">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Контакты
            </div>
            <h3 className="text-2xl font-black text-gray-800">
              Контактная информация
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mt-3 rounded-full"></div>
            <p className="mt-4 text-gray-600">
              Свяжитесь с нами любым <span className="text-orange-600 font-semibold">удобным для вас способом</span>
            </p>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-bold text-gray-800">Наш адрес</h4>
                <p className="mt-1 text-gray-600">21 Revolution Street Paris, France</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-bold text-gray-800">Email</h4>
                <p className="mt-1 text-gray-600">support@company.com</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-bold text-gray-800">Телефон</h4>
                <p className="mt-1 text-gray-600">+998 99 827 91 59</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-bold text-gray-800">Рабочие часы</h4>
                <p className="mt-1 text-gray-600">(Пн-Сб) с 9:00 до 18:00</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 relative overflow-hidden rounded-xl border border-gray-200">
            <div className="h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>
            <iframe
              title="Карта"
              className="w-full h-48"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9914406081493!2d2.292292615201654!3d48.85837360866272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sus!4v1626544297528!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
      </div>
    </div>
  );
}
