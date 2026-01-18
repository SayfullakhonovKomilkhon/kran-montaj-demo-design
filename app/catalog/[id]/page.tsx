'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

// Define interfaces for catalog items
interface Product {
	id: string
	title: string
	description: string
	image_url: string | null
	price: number | string | null
	category_id: string | null
	category_name: string | null
	characteristics: Record<string, string> | null
}

// Helper function to format price (handles both number and string with "от")
function formatPrice(price: number | string | null): string {
	if (!price) return ''
	
	// If price is a string that already contains "от", just return it formatted
	if (typeof price === 'string') {
		const cleanPrice = price.replace(/от\s*/gi, '').trim()
		const numPrice = parseFloat(cleanPrice.replace(/\s/g, ''))
		if (!isNaN(numPrice)) {
			return `от ${numPrice.toLocaleString()} сум`
		}
		return price
	}
	
	// If price is a number, format it
	return `от ${price.toLocaleString()} сум`
}

// Loading fallback component
function LoadingFallback() {
	return (
		<div className='py-12 pt-8 bg-[#F5F7FA] flex justify-center items-center min-h-[50vh]'>
			<div className='text-center'>
				<div className='inline-block animate-spin rounded-full h-12 w-12 md:h-14 md:w-14 border-t-2 border-b-2 border-amber-600 mb-4'></div>
				<p className='text-gray-700 font-medium text-base md:text-lg'>Загрузка товара...</p>
			</div>
		</div>
	)
}

function CatalogItemContent() {
	const params = useParams()
	const id = params.id as string
	const [imageError, setImageError] = useState(false)
	const [product, setProduct] = useState<Product | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const handleImageError = () => {
		setImageError(true)
	}

	useEffect(() => {
		async function fetchProduct() {
			try {
				setLoading(true)

				const { data, error } = await supabase
					.from('products_with_category')
					.select('*')
					.eq('id', id)
					.single()

				if (error) {
					console.error('Error fetching product:', error)
					throw error
				}

				if (!data) {
					setError('Товар не найден')
					return
				}

				setProduct(data)
			} catch (err) {
				console.error('Error:', err)
				setError('Не удалось загрузить информацию о товаре')
			} finally {
				setLoading(false)
			}
		}

		fetchProduct()
	}, [id])

	// Convert characteristics object to array for rendering
	const characteristicsArray = product?.characteristics
		? Object.entries(product.characteristics).map(([key, value]) => ({ key, value }))
		: []

	if (loading) {
		return <LoadingFallback />
	}

	if (error || !product) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] px-4'>
				<div className='text-center' data-aos='fade-up' data-aos-duration='800'>
					<h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
						{error || 'Товар не найден'}
					</h1>
					<p className='mt-4 text-gray-600'>
						Вернуться в{' '}
						<Link
							href='/catalog'
							className='text-amber-600 hover:text-amber-700 transition-colors border-b border-amber-300 hover:border-amber-500'
						>
							каталог
						</Link>
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen overflow-hidden'>
			{/* Enhanced header with subtle design elements */}
			<div className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-r from-[#ECF0F1] to-[#F8F9FA]/50 opacity-70'></div>
				<div className="absolute inset-0 bg-[url('/img/services/catalog-background.png')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
				<div className='absolute right-0 top-0 w-64 md:w-96 h-64 md:h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl -translate-x-1/3 -translate-y-1/2'></div>
				<div className='absolute left-0 bottom-0 w-64 md:w-96 h-64 md:h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl translate-x-1/3 translate-y-1/2'></div>

				{/* Breadcrumb navigation - improved for mobile */}
				<div className='max-w-7xl mx-auto pt-6 md:pt-8 pb-3 md:pb-4 px-4 sm:px-6 lg:px-8 relative'>
					<nav
						className='flex overflow-x-auto no-scrollbar py-1'
						aria-label='Breadcrumb'
						data-aos='fade-right'
						data-aos-duration='800'
					>
						<ol className='flex items-center space-x-3 md:space-x-4 whitespace-nowrap'>
							<li>
								<div>
									<Link
										href='/'
										className='text-xs md:text-sm text-gray-500 hover:text-amber-600 transition-colors'
									>
										Главная
									</Link>
								</div>
							</li>
							<li>
								<div className='flex items-center'>
									<svg
										className='flex-shrink-0 h-4 w-4 text-gray-400'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										fill='currentColor'
										aria-hidden='true'
									>
										<path
											fillRule='evenodd'
											d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
											clipRule='evenodd'
										/>
									</svg>
									<Link
										href='/catalog'
										className='ml-3 text-xs md:text-sm text-gray-500 hover:text-amber-600 transition-colors'
									>
										Каталог
									</Link>
								</div>
							</li>
							<li>
								<div className='flex items-center'>
									<svg
										className='flex-shrink-0 h-4 w-4 text-gray-400'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										fill='currentColor'
										aria-hidden='true'
									>
										<path
											fillRule='evenodd'
											d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
											clipRule='evenodd'
										/>
									</svg>
									<span className='ml-3 text-xs md:text-sm font-medium text-amber-600 truncate max-w-[150px] md:max-w-xs'>
										{product.title}
									</span>
								</div>
							</li>
						</ol>
					</nav>
				</div>

				{/* Decorative elements */}
				<div className='absolute left-0 bottom-0 w-full h-8 bg-gradient-to-b from-transparent to-[#EFF6FF]/80'></div>
				<div className='absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent'></div>
			</div>

			<div className='relative max-w-7xl mx-auto px-4 pb-16 md:pb-24 sm:px-6 lg:px-8 overflow-hidden'>
				{/* Adjust decorative elements to prevent overflow on smaller screens */}
				<div className='absolute sm:-left-32 md:-left-64 top-1/3 w-64 md:w-96 h-64 md:h-96 bg-amber-100/20 rounded-full blur-3xl'></div>
				<div className='absolute sm:-right-32 md:-right-64 bottom-1/3 w-64 md:w-96 h-64 md:h-96 bg-amber-100/20 rounded-full blur-3xl'></div>

				{/* Main content grid - optimized for mobile first */}
				<div className='relative z-10 md:grid md:grid-cols-12 md:gap-8 pt-4 md:pt-8 lg:pt-12'>
					{/* Product image column - full width on mobile */}
					<div className='md:col-span-5' data-aos='fade-up' data-aos-duration='1000'>
						<div className='sticky top-32'>
							<div className='relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group hover:shadow-2xl bg-white'>
								{/* Decorative corner accents */}
								<div className='absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-amber-500/20 to-transparent rounded-tl-2xl z-20'></div>
								<div className='absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-br-2xl z-20'></div>
								
								{/* Main image container */}
								<div className='relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100'>
									{imageError || !product.image_url ? (
										<div className='w-full h-full flex items-center justify-center p-6'>
											<div className='text-center'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													className='h-20 w-20 md:h-28 md:w-28 text-gray-300 mx-auto'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={1}
														d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
													/>
												</svg>
												<p className='mt-3 text-sm text-gray-400'>Изображение недоступно</p>
											</div>
										</div>
									) : (
										<div className='relative w-full h-full transform duration-700 ease-out group-hover:scale-105'>
											<Image
												src={product.image_url}
												alt={product.title}
												fill
												className='object-contain p-6 md:p-10'
												onError={handleImageError}
												loading='eager'
												priority
												sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px'
											/>
										</div>
									)}
								</div>

								{/* Image caption with gradient */}
								<div className='p-4 text-center bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500'>
									<p className='text-sm md:text-base text-white font-semibold tracking-wide'>{product.title}</p>
								</div>
							</div>
							
							{/* Trust badges */}
							<div className='mt-4 grid grid-cols-3 gap-2'>
								<div className='bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-100 shadow-sm'>
									<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mx-auto text-amber-500 mb-1' viewBox='0 0 20 20' fill='currentColor'>
										<path fillRule='evenodd' d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
									</svg>
									<p className='text-xs text-gray-600 font-medium'>Гарантия</p>
								</div>
								<div className='bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-100 shadow-sm'>
									<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mx-auto text-amber-500 mb-1' viewBox='0 0 20 20' fill='currentColor'>
										<path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
										<path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z' />
									</svg>
									<p className='text-xs text-gray-600 font-medium'>Доставка</p>
								</div>
								<div className='bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-100 shadow-sm'>
									<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mx-auto text-amber-500 mb-1' viewBox='0 0 20 20' fill='currentColor'>
										<path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
									</svg>
									<p className='text-xs text-gray-600 font-medium'>Консультация</p>
								</div>
							</div>
						</div>
					</div>

					{/* Product details column - positioned below image on mobile */}
					<div
						className='mt-8 md:mt-0 md:col-span-7'
						data-aos='fade-up'
						data-aos-duration='1000'
						data-aos-delay='200'
					>
						<div className='inline-flex items-center px-4 py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm mb-4 md:mb-5'>
							<svg xmlns='http://www.w3.org/2000/svg' className='h-3.5 w-3.5 mr-1.5' viewBox='0 0 20 20' fill='currentColor'>
								<path fillRule='evenodd' d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z' clipRule='evenodd' />
							</svg>
							{product.category_name || 'Каталог'}
						</div>

						<h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight leading-tight'>
							{product.title}
						</h1>
						<div className='w-20 md:w-24 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 mt-3 md:mt-4 rounded-full'></div>

						<div
							className='mt-5 md:mt-7'
							data-aos='fade-up'
							data-aos-duration='800'
							data-aos-delay='300'
						>
							<div className='bg-white/50 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-gray-100 shadow-sm'>
								<p className='text-sm md:text-base text-gray-600 leading-relaxed'>
									{product.description}
								</p>
							</div>
						</div>

						{/* Price display if available */}
						{product.price && (
							<div
								className='mt-6 md:mt-8'
								data-aos='fade-up'
								data-aos-duration='800'
								data-aos-delay='350'
							>
								<div className='inline-flex items-center bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-3 rounded-lg border border-amber-200/60 shadow-sm'>
									<span className='text-gray-600 text-sm md:text-base mr-2'>Цена:</span>
									<span className='text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent'>
										{formatPrice(product.price)}
									</span>
								</div>
							</div>
						)}

						{/* Technical specifications - improved design */}
						{characteristicsArray.length > 0 && (
							<div
								className='mt-8 md:mt-10'
								data-aos='fade-up'
								data-aos-duration='800'
								data-aos-delay='400'
							>
								<div className='bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden'>
									{/* Header */}
									<div className='bg-gradient-to-r from-gray-800 to-gray-700 px-5 py-4'>
										<h2 className='text-lg md:text-xl font-semibold text-white flex items-center'>
											<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2 text-amber-400' viewBox='0 0 20 20' fill='currentColor'>
												<path fillRule='evenodd' d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z' clipRule='evenodd' />
											</svg>
											Технические характеристики
										</h2>
									</div>
									
									{/* Specs grid */}
									<div className='divide-y divide-gray-100'>
										{characteristicsArray.map((char, index) => (
											<div
												key={index}
												className={`flex items-center justify-between px-5 py-4 hover:bg-amber-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}
												data-aos='fade-up'
												data-aos-duration='600'
												data-aos-delay={450 + index * 50}
											>
												<div className='flex items-center'>
													<div className='flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm mr-3'>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-3.5 w-3.5'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
																clipRule='evenodd'
															/>
														</svg>
													</div>
													<span className='text-sm md:text-base text-gray-700 font-medium'>{char.key}</span>
												</div>
												<span className='text-sm md:text-base text-gray-900 font-semibold bg-amber-100/60 px-3 py-1 rounded-md'>{char.value}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Call to action buttons */}
						<div
							className='mt-8 md:mt-10 pt-4 md:pt-6'
							data-aos='fade-up'
							data-aos-duration='800'
							data-aos-delay='600'
						>
							<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
								{/* Primary CTA */}
								<Link
									href='/contacts'
									className='relative flex justify-center items-center px-6 md:px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-500 rounded-lg text-white font-semibold hover:from-amber-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] group overflow-hidden'
								>
									<span className='relative z-10 flex items-center justify-center'>
										<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
											<path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
										</svg>
										Получить консультацию
									</span>
									<span className='absolute bottom-0 left-0 w-0 h-1 bg-white/40 transition-all duration-500 group-hover:w-full'></span>
								</Link>
								
								{/* Secondary CTA */}
								<Link
									href='/catalog'
									className='relative flex justify-center items-center px-6 md:px-8 py-3.5 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:border-amber-500 hover:text-amber-600 transition-all duration-300 shadow-md hover:shadow-lg group'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1'
										viewBox='0 0 20 20'
										fill='currentColor'
									>
										<path
											fillRule='evenodd'
											d='M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z'
											clipRule='evenodd'
										/>
									</svg>
									Вернуться в каталог
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// Add no-scrollbar utility class for breadcrumbs
function addGlobalStyles() {
	// Only run in browser
	if (typeof window !== 'undefined') {
		// Add styles if they don't exist yet
		if (!document.getElementById('custom-global-styles')) {
			const style = document.createElement('style')
			style.id = 'custom-global-styles'
			style.innerHTML = `
        @media (max-width: 767px) {
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
      `
			document.head.appendChild(style)
		}
	}
}

// Export the wrapped component with Suspense
export default function CatalogItemPage() {
	useEffect(() => {
		addGlobalStyles()
	}, [])

	return (
		<Suspense fallback={<LoadingFallback />}>
			<CatalogItemContent />
		</Suspense>
	)
}
