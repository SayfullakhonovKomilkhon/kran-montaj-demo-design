'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiBox, FiFolder, FiHome, FiInfo, FiList, FiLogOut, FiPhone, FiSettings } from 'react-icons/fi'
import { useSupabase } from '../providers/supabase-provider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const { user, isLoading, signOut } = useSupabase()
	const router = useRouter()
	const pathname = usePathname()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	// Protect admin routes - redirect to login if not authenticated
	useEffect(() => {
		if (!isLoading) {
			// If user is not authenticated and not on login page, redirect to login
			if (!user && pathname !== '/admin/login') {
				router.push('/admin/login')
			}

			// If user is authenticated and on login page or root admin page, redirect to dashboard
			if (user && (pathname === '/admin/login' || pathname === '/admin')) {
				router.push('/admin/dashboard')
			}
		}
	}, [user, isLoading, router, pathname])

	// If still loading or not on login page and not authenticated, show loading
	if (isLoading || (!user && pathname !== '/admin/login')) {
		return (
			<div className='flex h-screen items-center justify-center bg-gray-50'>
				<div className='text-center'>
					<div
						className='animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full'
						role='status'
						aria-label='loading'
					>
						<span className='sr-only'>Loading...</span>
					</div>
					<p className='mt-4 text-gray-600'>Проверка авторизации...</p>
				</div>
			</div>
		)
	}

	// If on login page, render only the login page without the admin layout
	if (pathname === '/admin/login') {
		return <>{children}</>
	}

	// If not authenticated and not on login page, don't render anything
	// (the redirect will happen via the useEffect)
	if (!user && pathname !== '/admin/login') {
		return null
	}

	const handleSignOut = async () => {
		await signOut()
		router.push('/admin/login')
	}

	const menuItems = [
		{ path: '/admin', label: 'Панель управления', icon: <FiHome /> },
		{ path: '/admin/categories', label: 'Категории', icon: <FiList /> },
		{ path: '/admin/services', label: 'Услуги', icon: <FiSettings /> },
		{ path: '/admin/catalog', label: 'Каталог', icon: <FiBox /> },
		{ path: '/admin/videos', label: 'Наши проекты', icon: <FiFolder /> },
		{ path: '/admin/about-us', label: 'О компании', icon: <FiInfo /> },
		{ path: '/admin/contacts', label: 'Контакты', icon: <FiPhone /> },
	]

	return (
		<div className='min-h-screen bg-gray-100'>
			{/* Top Navigation */}
			<nav className='bg-white shadow-sm'>
				<div className='mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16'>
						<div className='flex'>
							<div className='flex-shrink-0 flex items-center'>
								<Link href='/admin' className='text-gray-900 text-xl font-bold'>
									Админ Панель
								</Link>
							</div>
						</div>
						<div className='hidden sm:ml-6 sm:flex sm:items-center space-x-4'>
							<button
								onClick={handleSignOut}
								className='text-gray-500 hover:text-gray-700 p-2 rounded-md flex items-center text-sm'
							>
								<FiLogOut className='mr-1' /> Выйти
							</button>
						</div>
						<div className='flex items-center sm:hidden'>
							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none'
							>
								<span className='sr-only'>Open main menu</span>
								<svg
									className='h-6 w-6'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									{isMobileMenuOpen ? (
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M6 18L18 6M6 6l12 12'
										/>
									) : (
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M4 6h16M4 12h16M4 18h16'
										/>
									)}
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				{isMobileMenuOpen && (
					<div className='sm:hidden'>
						<div className='pt-2 pb-3 space-y-1'>
							{menuItems.map(item => (
								<Link
									key={item.path}
									href={item.path}
									className={`${
										pathname === item.path
											? 'bg-blue-50 border-blue-500 text-blue-700'
											: 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
									} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
								>
									<span className='flex items-center'>
										<span className='mr-2'>{item.icon}</span>
										{item.label}
									</span>
								</Link>
							))}
						</div>
						<div className='pt-4 pb-3 border-t border-gray-200'>
							<div className='mt-3 space-y-1'>
								<button
									onClick={handleSignOut}
									className='block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
								>
									<span className='flex items-center'>
										<FiLogOut className='mr-2' />
										Выйти
									</span>
								</button>
							</div>
						</div>
					</div>
				)}
			</nav>

			<div className='py-6'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-col sm:flex-row'>
						{/* Sidebar for larger screens */}
						<div className='hidden sm:block w-64 mr-8'>
							<div className='bg-white shadow rounded-lg overflow-hidden'>
								<div className='px-4 py-5 sm:p-6'>
									<nav className='space-y-1'>
										{menuItems.map(item => (
											<Link
												key={item.path}
												href={item.path}
												className={`${
													pathname === item.path
														? 'bg-blue-50 text-blue-700'
														: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
												} group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
											>
												<span className='mr-3 h-5 w-5'>{item.icon}</span>
												{item.label}
											</Link>
										))}
									</nav>
								</div>
							</div>
						</div>

						{/* Main content */}
						<div className='flex-1'>
							<main>{children}</main>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
