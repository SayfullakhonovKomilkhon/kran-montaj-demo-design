'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Define service type based on the database structure
interface Service {
	id: string
	name: string
	description: string
	image_url: string | null
	category_id: string | null
}

interface Category {
	id: string
	name: string
	description: string | null
	slug?: string
}

// Loading fallback component
function LoadingFallback() {
	return (
		<div className='py-12 pt-8 bg-gradient-to-b from-slate-100 to-gray-50 flex justify-center items-center min-h-[50vh]'>
			<div className='text-center'>
				<div className='inline-block animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-orange-500 mb-5'></div>
				<p className='text-gray-700 font-bold text-lg'>Загрузка услуг...</p>
			</div>
		</div>
	)
}

// Main services component
function ServicesContent() {
	const searchParams = useSearchParams()
	const categoryParam = searchParams.get('category')
	const router = useRouter()

	const [services, setServices] = useState<Service[]>([])
	const [filteredServices, setFilteredServices] = useState<Service[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam)

	// Service image error handling
	const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({})

	const handleImageError = (id: string) => {
		setImgErrors(prev => ({ ...prev, [id]: true }))
	}

	// Fetch services and categories from Supabase
	useEffect(() => {
		async function fetchServicesAndCategories() {
			try {
				setLoading(true)
				console.log('Fetching services from Supabase...')

				// Test Supabase connection first
				console.log('Testing Supabase connection...')
				const { data: testData, error: testError } = await supabase
					.from('services')
					.select('count')
					.limit(1)

				if (testError) {
					console.error('Supabase connection test error:', {
						code: testError.code,
						message: testError.message,
						details: testError.details,
						hint: testError.hint,
					})
				} else {
					console.log('Supabase connection successful, count:', testData)
				}

				// Fetch all categories
				const { data: categoriesData, error: categoriesError } = await supabase
					.from('categories')
					.select('*')

				if (categoriesError) {
					console.error('Supabase categories fetch error:', {
						code: categoriesError.code,
						message: categoriesError.message,
						details: categoriesError.details,
						hint: categoriesError.hint,
					})
					throw categoriesError
				}

				setCategories(categoriesData || [])
				console.log('Categories:', categoriesData)

				// Proceed with services fetch
				const { data, error } = await supabase.from('services').select('*')

				if (error) {
					console.error('Supabase error details:', {
						code: error.code,
						message: error.message,
						details: error.details,
						hint: error.hint,
					})
					throw error
				}

				console.log('Services data received:', data)
				setServices(data || [])

				// Set initial filtered services based on URL parameter
				if (categoryParam) {
					setFilteredServices((data || []).filter(service => service.category_id === categoryParam))
				} else {
					setFilteredServices(data || [])
				}
		} catch (err: unknown) {
			console.error('Error fetching services:', err)
			const error = err as { message?: string }
			if (error.message) {
				setError(`Не удалось загрузить услуги: ${error.message}`)
			} else {
				setError('Не удалось загрузить услуги')
			}
			} finally {
				setLoading(false)
			}
		}

		fetchServicesAndCategories()
	}, [])

	// Filter services when active category changes
	useEffect(() => {
		if (activeCategory) {
			setFilteredServices(services.filter(service => service.category_id === activeCategory))
		} else {
			setFilteredServices(services)
		}
	}, [activeCategory, services])

	// Handle category change
	const handleCategoryChange = (categoryId: string | null) => {
		setActiveCategory(categoryId)

		// Update URL without refreshing the page
		if (categoryId) {
			router.push(`/services?category=${categoryId}`, { scroll: false })
		} else {
			router.push('/services', { scroll: false })
		}
	}

	// Listen for changes in URL query parameters
	useEffect(() => {
		const categoryId = searchParams.get('category')

		// Only update if different from current active category
		if (categoryId !== activeCategory) {
			// Check if category exists in our categories
			if (categoryId && categories.some(cat => cat.id === categoryId)) {
				setActiveCategory(categoryId)
			} else if (!categoryId) {
				setActiveCategory(null)
			}
		}
	}, [searchParams, categories, activeCategory])

	// SVG icons as fallbacks instead of using external files
	const fallbackIcons = {
		service1: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M21 10H3M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10M21 10L15.5 3.5C15.1673 3.1673 14.6836 3 14.1716 3H9.82843C9.31641 3 8.83266 3.1673 8.5 3.5L3 10M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16ZM9 16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55229 15 9 15.4477 9 16Z' />
			</svg>
		),
		service2: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M9 21H6C4.34315 21 3 19.6569 3 18V16.5M9 21L11 19M9 21V18M15 21H18C19.6569 21 21 19.6569 21 18V16.5M15 21L13 19M15 21V18M3 16.5V6C3 4.34315 4.34315 3 6 3H9M3 16.5H9M21 16.5V6C21 4.34315 19.6569 3 18 3H15M21 16.5H15M9 3L11 5M9 3V6M15 3L13 5M15 3V6M9 6H15M9 12H15M9 18H15' />
			</svg>
		),
		service3: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M10.5421 20.0018C6.71886 18.8578 3.86002 15.3071 3.86002 11.11C3.86002 5.8287 8.1387 1.55002 13.42 1.55002C16.8137 1.55002 19.7913 3.37238 21.3657 6.10002M10.5421 20.0018L6.74198 17.2018M10.5421 20.0018L11.02 15.5018M13.42 5.77952C15.7537 5.77952 17.6405 7.66636 17.6405 10.0001C17.6405 12.3337 15.7537 14.2206 13.42 14.2206C11.0863 14.2206 9.19943 12.3337 9.19943 10.0001C9.19943 7.66636 11.0863 5.77952 13.42 5.77952Z' />
				<path d='M18.3594 17.0001C17.9742 17.0001 17.6605 17.3138 17.6605 17.699C17.6605 18.0841 17.9742 18.3978 18.3594 18.3978C18.7445 18.3978 19.0582 18.0841 19.0582 17.699C19.0582 17.3138 18.7445 17.0001 18.3594 17.0001Z' />
				<path d='M18.3594 22.4492C17.9742 22.4492 17.6605 22.7629 17.6605 23.1481C17.6605 23.5332 17.9742 23.8469 18.3594 23.8469C18.7445 23.8469 19.0582 23.5332 19.0582 23.1481C19.0582 22.7629 18.7445 22.4492 18.3594 22.4492Z' />
				<path d='M21.0989 19.7501C20.7138 19.7501 20.4001 20.0638 20.4001 20.449C20.4001 20.8341 20.7138 21.1478 21.0989 21.1478C21.4841 21.1478 21.7978 20.8341 21.7978 20.449C21.7978 20.0638 21.4841 19.7501 21.0989 19.7501Z' />
				<path d='M15.6198 19.7501C15.2346 19.7501 14.9209 20.0638 14.9209 20.449C14.9209 20.8341 15.2346 21.1478 15.6198 21.1478C16.0049 21.1478 16.3186 20.8341 16.3186 20.449C16.3186 20.0638 16.0049 19.7501 15.6198 19.7501Z' />
			</svg>
		),
		service4: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M11 14.9861C11 15.5384 11.4477 15.9861 12 15.9861C12.5523 15.9861 13 15.5384 13 14.9861C13 14.4338 12.5523 13.9861 12 13.9861C11.4477 13.9861 11 14.4338 11 14.9861Z' />
				<path d='M3 20.9998H21M6.5 17.9998H17.5M5.5 8.5V10.3598C5.19057 10.7348 5 11.1992 5 11.7032V14.0118C5 14.8283 5.5 15.9998 7 15.9998H17C18.5 15.9998 19 14.8283 19 14.0118V11.7032C19 11.1992 18.8094 10.7348 18.5 10.3598V8.5C18.5 4.91015 15.5899 2 12 2C8.41015 2 5.5 4.91015 5.5 8.5Z' />
			</svg>
		),
		service5: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
			</svg>
		),
	}

	// Get the appropriate fallback icon for a service
	const getFallbackIcon = (index: number) => {
		const iconKeys = Object.keys(fallbackIcons)
		const iconKey = iconKeys[index % iconKeys.length] as keyof typeof fallbackIcons
		return fallbackIcons[iconKey]
	}

	return (
		<div className='bg-gradient-to-b from-slate-100 to-gray-50 min-h-screen overflow-hidden'>
			{/* Industrial-themed header */}
			<div className='relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
				{/* Industrial grid pattern */}
				<div className='absolute inset-0 opacity-5' style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
				
				{/* Diagonal stripes accent */}
				<div className='absolute top-0 right-0 w-96 h-96 opacity-10'>
					<div className='absolute inset-0' style={{backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 2px, transparent 2px, transparent 20px)'}}></div>
				</div>
				
				{/* Orange accent glow */}
				<div className='absolute -left-20 top-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl'></div>
				<div className='absolute -right-20 bottom-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl'></div>

				<div className='max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative'>
					<div className='text-center relative'>
						{/* Industrial icon */}
						<div className='inline-flex items-center justify-center mb-6' data-aos='fade-up' data-aos-duration='800'>
							<div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30'>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
								</svg>
							</div>
						</div>
						
						<h1
							className='text-3xl font-black text-white sm:text-5xl tracking-tight uppercase'
							data-aos='fade-up'
							data-aos-delay='100'
						>
							Наши <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400'>услуги</span>
						</h1>
						
						{/* Industrial underline */}
						<div className='flex items-center justify-center mt-4 space-x-2' data-aos='fade-up' data-aos-delay='150'>
							<div className='w-12 h-1 bg-gray-600 rounded'></div>
							<div className='w-24 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded'></div>
							<div className='w-12 h-1 bg-gray-600 rounded'></div>
						</div>
						
						<p
							className='mt-6 max-w-2xl mx-auto text-base text-gray-300 leading-relaxed'
							data-aos='fade-up'
							data-aos-delay='200'
						>
							Полный спектр решений по <span className='text-orange-400 font-semibold'>изготовлению, монтажу и обслуживанию</span> грузоподъемного оборудования
						</p>
						
						{/* Stats row */}
						<div className='mt-10 flex flex-wrap justify-center gap-8' data-aos='fade-up' data-aos-delay='300'>
							<div className='text-center'>
								<div className='text-3xl font-black text-orange-400'>24/7</div>
								<div className='text-xs text-gray-400 uppercase tracking-wider'>Поддержка</div>
							</div>
							<div className='text-center'>
								<div className='text-3xl font-black text-yellow-400'>500+</div>
								<div className='text-xs text-gray-400 uppercase tracking-wider'>Проектов</div>
							</div>
							<div className='text-center'>
								<div className='text-3xl font-black text-orange-400'>100%</div>
								<div className='text-xs text-gray-400 uppercase tracking-wider'>Качество</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom edge */}
				<div className='absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500'></div>
			</div>

			{/* Industrial-style category filter */}
			{categories.length > 0 && !loading && !error && (
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
					<div className='bg-white rounded-xl shadow-lg p-4 border border-gray-200'>
						<div className='flex items-center mb-4'>
							<div className='w-1 h-6 bg-orange-500 rounded mr-3'></div>
							<h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider'>Фильтр по категориям</h3>
						</div>
						<div className='flex flex-wrap gap-3'>
							<button
								onClick={() => handleCategoryChange(null)}
								className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center ${
									!activeCategory
										? 'bg-gradient-to-r from-gray-800 to-gray-700 text-yellow-400 shadow-lg'
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
								}`}
							>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-2' viewBox='0 0 20 20' fill='currentColor'>
									<path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
								</svg>
								Все услуги
							</button>

							{categories.map(category => (
								<button
									key={category.id}
									onClick={() => handleCategoryChange(category.id)}
									className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center ${
										activeCategory === category.id
											? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
											: 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
									}`}
								>
									<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-2' viewBox='0 0 20 20' fill='currentColor'>
										<path fillRule='evenodd' d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z' clipRule='evenodd' />
									</svg>
									{category.name}
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Services content */}
			<div className='max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-4 relative'>
				{loading ? (
					<div className='flex justify-center items-center py-16'>
						<div className='text-center'>
							<div className='inline-block animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-orange-500 mb-5'></div>
							<p className='text-gray-700 font-bold text-lg'>Загрузка услуг...</p>
						</div>
					</div>
				) : error ? (
					<div className='text-center py-10'>
						<div className='bg-red-50 border border-red-200 rounded-lg p-6 inline-block'>
							<svg xmlns='http://www.w3.org/2000/svg' className='h-12 w-12 text-red-400 mx-auto mb-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
							</svg>
							<p className='text-red-600 font-semibold'>{error}</p>
						</div>
					</div>
				) : filteredServices.length === 0 ? (
					<div className='text-center py-12'>
						<div className='bg-gray-100 rounded-xl p-8 inline-block'>
							<svg xmlns='http://www.w3.org/2000/svg' className='h-16 w-16 text-gray-300 mx-auto mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
							</svg>
							<p className='text-gray-500 text-xl font-semibold'>
								{activeCategory ? 'В данной категории нет доступных услуг' : 'Нет доступных услуг'}
							</p>
						</div>
					</div>
				) : (
					<div className='space-y-12 relative z-10'>
						{filteredServices.map((service, index) => (
							<div
								key={service.id}
								className='group'
								style={{ scrollMarginTop: '120px' }}
								data-aos='fade-up'
								data-aos-delay={100 * (index % 3)}
								data-aos-duration='600'
							>
								{/* Industrial service card */}
								<div className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200'>
									{/* Top accent bar */}
									<div className='h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500'></div>
									
									<div className={`lg:grid lg:grid-cols-12 lg:gap-0 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
										{/* Image section */}
										<div className={`lg:col-span-5 ${index % 2 !== 0 ? 'lg:order-2' : 'lg:order-1'}`}>
											<div className='relative h-72 lg:h-full min-h-[300px] bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 overflow-hidden'>
												{/* Grid pattern */}
												<div className='absolute inset-0 opacity-[0.03]' style={{backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
												
												{/* Industrial badge */}
												<div className='absolute top-4 left-4 z-10'>
													<div className='bg-gray-800 text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center shadow-lg'>
														<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-1.5' viewBox='0 0 20 20' fill='currentColor'>
															<path fillRule='evenodd' d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z' clipRule='evenodd' />
														</svg>
														Услуга
													</div>
												</div>
												
												{/* Service number badge */}
												<div className='absolute bottom-4 right-4 z-10'>
													<div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg'>
														<span className='text-white font-black text-lg'>0{index + 1}</span>
													</div>
												</div>
												
												{imgErrors[`service-${service.id}`] || !service.image_url ? (
													<div className='w-full h-full flex items-center justify-center p-6'>
														{getFallbackIcon(index)}
													</div>
												) : (
													<div className='relative w-full h-full transform duration-500 group-hover:scale-105'>
														<Image
															src={service.image_url}
															alt={service.name}
															fill
															className='object-contain p-8'
															onError={() => handleImageError(`service-${service.id}`)}
														/>
													</div>
												)}
											</div>
										</div>
										
										{/* Content section */}
										<div className={`lg:col-span-7 p-6 lg:p-8 flex flex-col justify-center ${index % 2 !== 0 ? 'lg:order-1' : 'lg:order-2'}`}>
											{/* Category tag */}
											<div className='inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-sm mb-4 w-fit'>
												<svg xmlns='http://www.w3.org/2000/svg' className='h-3.5 w-3.5 mr-1.5' viewBox='0 0 20 20' fill='currentColor'>
													<path fillRule='evenodd' d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z' clipRule='evenodd' />
												</svg>
												{(() => {
													const category = categories.find(c => c.id === service.category_id)
													return category ? category.name : 'Услуги'
												})()}
											</div>
											
											{/* Title */}
											<h2 className='text-2xl lg:text-3xl font-black text-gray-800 group-hover:text-orange-600 transition-colors leading-tight'>
												{service.name}
											</h2>
											<div className='w-20 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400 mt-3 rounded-full'></div>
											
											{/* Description */}
											<p className='mt-4 text-gray-600 text-base leading-relaxed'>
												{service.description}
											</p>
											
											{/* Features list */}
											<div className='mt-5 grid grid-cols-2 gap-3'>
												<div className='flex items-center text-sm text-gray-600'>
													<div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2'>
														<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-green-600' viewBox='0 0 20 20' fill='currentColor'>
															<path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
														</svg>
													</div>
													Гарантия качества
												</div>
												<div className='flex items-center text-sm text-gray-600'>
													<div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2'>
														<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-green-600' viewBox='0 0 20 20' fill='currentColor'>
															<path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
														</svg>
													</div>
													Опытные специалисты
												</div>
												<div className='flex items-center text-sm text-gray-600'>
													<div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2'>
														<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-green-600' viewBox='0 0 20 20' fill='currentColor'>
															<path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
														</svg>
													</div>
													Быстрые сроки
												</div>
												<div className='flex items-center text-sm text-gray-600'>
													<div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2'>
														<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-green-600' viewBox='0 0 20 20' fill='currentColor'>
															<path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
														</svg>
													</div>
													Доступные цены
												</div>
											</div>
											
											{/* Buttons */}
											<div className='mt-6 flex flex-wrap gap-3'>
												<Link
													href='/contacts'
													className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-white font-bold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl'
												>
													<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
														<path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
													</svg>
													Заказать услугу
												</Link>

												{service.category_id && (
													<button
														onClick={() => handleCategoryChange(service.category_id)}
														className='inline-flex items-center px-6 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:border-orange-500 hover:text-orange-600 transition-all duration-300'
													>
														<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
															<path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
														</svg>
														Похожие услуги
													</button>
												)}
											</div>
										</div>
									</div>
									
									{/* Bottom bar */}
									<div className='h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Industrial-style footer CTA */}
				<div className='mt-20' data-aos='fade-up' data-aos-delay='300'>
					<div className='bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden'>
						{/* Grid pattern */}
						<div className='absolute inset-0 opacity-5' style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
						
						{/* Accent glow */}
						<div className='absolute -left-10 top-1/2 w-32 h-32 bg-orange-500/30 rounded-full blur-3xl'></div>
						<div className='absolute -right-10 top-1/2 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl'></div>
						
						<div className='relative'>
							<div className='inline-flex items-center justify-center mb-4'>
								<div className='w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg'>
									<svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-white' viewBox='0 0 20 20' fill='currentColor'>
										<path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
									</svg>
								</div>
							</div>
							<h3 className='text-xl md:text-2xl font-bold text-white mb-3'>
								Нужна консультация специалиста?
							</h3>
							<p className='text-gray-400 mb-6 max-w-xl mx-auto'>
								Наши эксперты помогут подобрать оптимальное решение для вашего предприятия. Свяжитесь с нами для бесплатной консультации.
							</p>
							<div className='flex flex-wrap justify-center gap-4'>
								<Link
									href='/contacts'
									className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
								>
									<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
										<path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
									</svg>
									Связаться с нами
								</Link>
								<Link
									href='/catalog'
									className='inline-flex items-center px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 font-bold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-300'
								>
									<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
										<path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
									</svg>
									Смотреть каталог
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function ServicesPage() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<ServicesContent />
		</Suspense>
	)
}
