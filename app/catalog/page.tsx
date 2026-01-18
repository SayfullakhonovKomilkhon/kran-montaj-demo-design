'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Define interface for catalog items
interface Product {
	id: string
	title: string
	description: string
	image_url: string | null
	price: number | string | null
	category_id?: string | null
	category_name?: string
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

interface Category {
	id: string
	name: string
}

// Loading fallback component
function LoadingFallback() {
	return (
		<div className='py-12 pt-8 bg-[#F5F7FA] flex justify-center items-center min-h-[50vh]'>
			<div className='text-center'>
				<div className='inline-block animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-amber-600 mb-5'></div>
				<p className='text-gray-700 font-medium text-lg'>Загрузка каталога...</p>
			</div>
		</div>
	)
}

// Catalog item component with error handling
function CatalogItem({ item }: { item: Product }) {
	const [imageError, setImageError] = useState(false)

	const handleImageError = () => {
		setImageError(true)
	}

	return (
		<div className='group relative flex flex-col overflow-hidden h-[520px]'>
			{/* Industrial-style card */}
			<div className='relative flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-200'>
				
				{/* Top industrial stripe */}
				<div className='absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 z-20'></div>
				
				{/* Industrial corner badge */}
				<div className='absolute top-4 right-4 z-20'>
					<div className='bg-gray-800 text-yellow-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center shadow-lg'>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-3.5 w-3.5 mr-1' viewBox='0 0 20 20' fill='currentColor'>
							<path fillRule='evenodd' d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z' clipRule='evenodd' />
						</svg>
						Кран
					</div>
				</div>

				{/* Image container with industrial background */}
				<div className='h-56 relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100'>
					{/* Industrial grid pattern */}
					<div className='absolute inset-0 opacity-[0.03]' style={{backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
					
					{/* Crane hook decorative element */}
					<div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-400 z-10'></div>
					<div className='absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 border-2 border-gray-400 rounded-full z-10'></div>

					{imageError || !item.image_url ? (
						<div className='w-full h-full flex items-center justify-center'>
							<div className='text-center'>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-16 w-16 text-gray-300 mx-auto' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
								</svg>
								<p className='mt-2 text-xs text-gray-400'>Фото недоступно</p>
							</div>
						</div>
					) : (
						<div className='relative w-full h-full transform duration-500 ease-out group-hover:scale-110'>
							<Image
								src={item.image_url}
								alt={item.title}
								fill
								className='object-contain p-4'
								onError={handleImageError}
								loading='lazy'
								sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
							/>
						</div>
					)}
					
					{/* Bottom fade */}
					<div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent'></div>
				</div>

				{/* Content area */}
				<div className='flex-1 p-5 flex flex-col bg-white relative'>
					{/* Industrial accent line */}
					<div className='absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>
					
					<div className='flex-1'>
						{/* Title */}
						<h3 className='text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors leading-tight'>
							<Link href={`/catalog/${item.id}`} className='block'>
								{item.title}
							</Link>
						</h3>
						
						{/* Category tag */}
						{item.category_name && (
							<div className='mt-2 inline-flex items-center'>
								<span className='w-2 h-2 bg-orange-500 rounded-full mr-2'></span>
								<span className='text-xs font-semibold text-orange-600 uppercase tracking-wide'>{item.category_name}</span>
							</div>
						)}
						
						{/* Description */}
						<p className='mt-3 text-sm text-gray-500 line-clamp-2 leading-relaxed'>
							{item.description}
						</p>
						
						{/* Price with industrial styling */}
						{item.price && (
							<div className='mt-4 flex items-center'>
								<div className='bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 rounded-lg shadow-md'>
									<span className='text-yellow-400 font-bold text-lg'>
										{formatPrice(item.price)}
									</span>
								</div>
							</div>
						)}
					</div>

					{/* CTA Button with industrial style */}
					<div className='mt-5'>
						<Link
							href={`/catalog/${item.id}`}
							className='relative flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-white font-bold uppercase tracking-wide text-sm shadow-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 overflow-hidden group/btn'
						>
							{/* Animated shine effect */}
							<span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></span>
							
							<span className='relative flex items-center'>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
									<path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
									<path fillRule='evenodd' d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z' clipRule='evenodd' />
								</svg>
								Подробнее
								<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform' viewBox='0 0 20 20' fill='currentColor'>
									<path fillRule='evenodd' d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z' clipRule='evenodd' />
								</svg>
							</span>
						</Link>
					</div>
				</div>
				
				{/* Bottom industrial stripe */}
				<div className='h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'></div>
			</div>
		</div>
	)
}

// Main catalog content component
function CatalogContent() {
	const searchParams = useSearchParams()
	const categoryParam = searchParams.get('category')
	const router = useRouter()

	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam)
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

	// Fetch data on initial load
	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true)

				// Fetch all products from the products_with_category view
				const { data: productsData, error: productsError } = await supabase
					.from('products_with_category')
					.select('*')

				if (productsError) {
					console.error('Error fetching products:', productsError)
					throw productsError
				}

				// Set the products
				setProducts(productsData || [])

				// Extract unique categories from the products data
				const uniqueCategories = Array.from(
					new Set(
						productsData
							?.filter(p => p.category_id && p.category_name)
							.map(p => JSON.stringify({ id: p.category_id, name: p.category_name }))
					)
				).map(c => JSON.parse(c))

				setCategories(uniqueCategories)

				// Set initial filtered products based on URL parameter
				if (categoryParam) {
					setFilteredProducts(
						productsData?.filter(product => product.category_id === categoryParam) || []
					)
				} else {
					setFilteredProducts(productsData || [])
				}
			} catch (err) {
				console.error('Error:', err)
				setError('Failed to load products')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	// Filter products when active category changes
	useEffect(() => {
		if (activeCategory) {
			setFilteredProducts(products.filter(product => product.category_id === activeCategory))
		} else {
			setFilteredProducts(products)
		}
	}, [activeCategory, products])

	// Handle category change
	const handleCategoryChange = (categoryId: string | null) => {
		setActiveCategory(categoryId)

		// Update URL without refreshing the page
		if (categoryId) {
			router.push(`/catalog?category=${categoryId}`, { scroll: false })
		} else {
			router.push('/catalog', { scroll: false })
		}
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
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
								</svg>
							</div>
						</div>
						
						<h1
							className='text-3xl font-black text-white sm:text-5xl tracking-tight uppercase'
							data-aos='fade-up'
							data-aos-delay='100'
						>
							Каталог <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400'>оборудования</span>
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
							Надёжное грузоподъёмное оборудование для промышленных предприятий. 
							<span className='text-orange-400 font-semibold'> Краны, тали, запчасти</span> — всё для вашего производства.
						</p>
						
						{/* Stats row */}
						<div className='mt-10 flex flex-wrap justify-center gap-8' data-aos='fade-up' data-aos-delay='300'>
							<div className='text-center'>
								<div className='text-3xl font-black text-orange-400'>50+</div>
								<div className='text-xs text-gray-400 uppercase tracking-wider'>Моделей</div>
							</div>
							<div className='text-center'>
								<div className='text-3xl font-black text-yellow-400'>10+</div>
								<div className='text-xs text-gray-400 uppercase tracking-wider'>Лет опыта</div>
							</div>
							<div className='text-center'>
								<div className='text-3xl font-black text-orange-400'>100%</div>
								<div className='text-xs text-gray-400 uppercase tracking-wider'>Гарантия</div>
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
								Все
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
										<path fillRule='evenodd' d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z' clipRule='evenodd' />
									</svg>
									{category.name}
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Industrial-themed catalog grid */}
			<div className='max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-4 relative overflow-hidden'>
				{loading ? (
					<div className='flex justify-center items-center py-16'>
						<div className='text-center'>
							<div className='inline-block animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-orange-500 mb-5'></div>
							<p className='text-gray-700 font-bold text-lg'>Загрузка оборудования...</p>
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
				) : filteredProducts.length === 0 ? (
					<div className='text-center py-12'>
						<div className='bg-gray-100 rounded-xl p-8 inline-block'>
							<svg xmlns='http://www.w3.org/2000/svg' className='h-16 w-16 text-gray-300 mx-auto mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
							</svg>
							<p className='text-gray-500 text-xl font-semibold'>
								{activeCategory
									? 'В данной категории нет доступных продуктов'
									: 'Нет доступных продуктов'}
							</p>
						</div>
					</div>
				) : (
					<div className='grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 relative z-10'>
						{filteredProducts.map((item, index) => (
							<div
								key={item.id}
								data-aos='fade-up'
								data-aos-delay={100 * (index % 3 + 1)}
								data-aos-duration='600'
							>
								<CatalogItem item={item} />
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
							<h3 className='text-xl md:text-2xl font-bold text-white mb-3'>
								Не нашли нужное оборудование?
							</h3>
							<p className='text-gray-400 mb-6 max-w-xl mx-auto'>
								Представлены не все модели. Свяжитесь с нами для получения полного каталога и индивидуального предложения.
							</p>
							<Link
								href='/contacts'
								className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
							>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
									<path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
								</svg>
								Связаться с нами
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function CatalogPage() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<CatalogContent />
		</Suspense>
	)
}
