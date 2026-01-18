'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'
interface NavLinkProps {
	href: string
	active: boolean
	children: ReactNode
}

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const [visible, setVisible] = useState(false)
	const pathname = usePathname()
	
	// Check if on home page
	const isHomePage = pathname === '/'

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY
			setScrolled(scrollY > 10)
			
			// On home page: show navbar after scrolling 100px
			// On other pages: always visible
			if (isHomePage) {
				setVisible(scrollY > 100)
			} else {
				setVisible(true)
			}
		}

		// Initial check
		if (!isHomePage) {
			setVisible(true)
		} else {
			setVisible(window.scrollY > 100)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [isHomePage])


	return (
		<div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
			visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
		}`}>
			{/* Top Bar - Industrial style */}
			<div
				className={`w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-sm transition-all duration-300 ${
					scrolled ? 'py-1' : 'py-2'
				}`}
			>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-col md:flex-row justify-between'>
						<div className='flex items-center justify-center md:justify-start mb-2 md:mb-0'>
							<FaMapMarkerAlt className='mr-2 text-orange-400' />
							<span className='text-gray-300'>E5 Nirman Nagar E DCM Ajmer road Jaipur 302019</span>
						</div>

						<div className='flex items-center justify-center md:justify-end space-x-2'>
							<Link
								href='tel:+998998279159'
								className='flex items-center px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 rounded-md font-semibold shadow-md shadow-orange-500/30'
							>
								<FaPhone className='mr-2' />
								<span>+998 99 827 91 59</span>
							</Link>

							<Link
								href='mailto:info@kran-montaj.uz'
								className='flex items-center px-3 py-1 bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 rounded-md border border-gray-600'
							>
								<FaEnvelope className='mr-2 text-orange-400' />
								<span>info@kran-montaj.uz</span>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Main Navbar - Industrial style */}
			<nav
				className={`w-full transition-all duration-300 ease-in-out
                    ${scrolled 
                      ? 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 shadow-lg shadow-orange-500/20 py-2' 
                      : 'bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 py-3'}`}
			>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div className='flex items-center'>
							<Link href='/' className='flex-shrink-0 flex items-center'>
								<div className='bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md'>
									<Image
										src='/img/services/logo.svg'
										alt='КРАН-МОНТАЖ Logo'
										width={scrolled ? 100 : 120}
										height={scrolled ? 25 : 30}
										priority
										className='transition-all duration-300 ease-in-out'
									/>
								</div>
							</Link>
						</div>

						{/* Desktop menu */}
						<div className='hidden md:flex md:items-center md:space-x-1'>
							<NavLink href='/' active={pathname === '/'}>
								Главная
							</NavLink>
							<NavLink href='/about' active={pathname === '/about'}>
								О нас
							</NavLink>

							<NavLink
								href='/services'
								active={pathname === '/services' || pathname.startsWith('/services/')}
							>
								Услуги
							</NavLink>

							<NavLink
								href='/catalog'
								active={pathname === '/catalog' || pathname.startsWith('/catalog/')}
							>
								Каталог
							</NavLink>
							<NavLink
								href='/works'
								active={pathname === '/works'}
							>
								Наши работы
							</NavLink>
							<NavLink href='/contacts' active={pathname === '/contacts'}>
								Контакты
							</NavLink>
						</div>

						{/* Mobile menu button */}
						<div className='flex md:hidden items-center'>
							<button
								onClick={() => setIsOpen(!isOpen)}
								className='inline-flex items-center justify-center p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300'
								aria-expanded={isOpen}
								aria-controls='mobile-menu'
							>
								<span className='sr-only'>Open main menu</span>
								{!isOpen ? (
									<svg
										className='block h-6 w-6'
										strokeWidth='2'
										stroke='currentColor'
										fill='none'
										viewBox='0 0 24 24'
									>
										<path d='M4 6h16M4 12h16M4 18h16' />
									</svg>
								) : (
									<svg
										className='block h-6 w-6'
										strokeWidth='2'
										stroke='currentColor'
										fill='none'
										viewBox='0 0 24 24'
									>
										<path d='M6 18L18 6M6 6l12 12' />
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile menu, show/hide based on menu state */}
				<div
					id='mobile-menu'
					className={`md:hidden absolute bg-gradient-to-b from-gray-800 to-gray-900 w-full shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform origin-top
                      ${
												isOpen
													? 'max-h-screen opacity-100 scale-y-100'
													: 'max-h-0 opacity-0 scale-y-95'
											}`}
				>
					<div className='px-3 pt-3 pb-4 space-y-2'>
						<MobileNavLink href='/' active={pathname === '/'} onClick={() => setIsOpen(false)}>
							Главная
						</MobileNavLink>
						<MobileNavLink
							href='/about'
							active={pathname === '/about'}
							onClick={() => setIsOpen(false)}
						>
							О нас
						</MobileNavLink>
					<MobileNavLink
						href='/services'
						active={pathname === '/services'}
						onClick={() => setIsOpen(false)}
					>
						Услуги
					</MobileNavLink>

					<MobileNavLink
							href='/catalog'
							active={pathname === '/catalog' || pathname.startsWith('/catalog/')}
							onClick={() => setIsOpen(false)}
						>
							Каталог
						</MobileNavLink>
						<MobileNavLink
							href='/works'
							active={pathname === '/works'}
							onClick={() => setIsOpen(false)}
						>
							Наши работы
						</MobileNavLink>
						<MobileNavLink
							href='/contacts'
							active={pathname === '/contacts'}
							onClick={() => setIsOpen(false)}
						>
							Контакты
						</MobileNavLink>
					</div>
				</div>
			</nav>
		</div>
	)
}

interface CustomNavLinkProps extends NavLinkProps {
	onClick?: () => void
}

// Desktop navigation link component - Industrial style
const NavLink = ({ href, active, children, onClick }: CustomNavLinkProps) => {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 ease-in-out group rounded-lg uppercase tracking-wide
                  ${active 
                    ? 'bg-white/20 text-white' 
                    : 'text-white hover:bg-white/20'}`}
		>
			{children}
			<span
				className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-white transition-all duration-300 ease-out rounded-full
                    ${active ? 'w-1/2' : 'w-0 group-hover:w-1/2'}`}
			/>
		</Link>
	)
}

// Mobile navigation link component - Industrial style
const MobileNavLink = ({ href, active, children, onClick }: CustomNavLinkProps) => {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={`block px-4 py-3 rounded-lg text-base font-bold transition-all duration-300 uppercase tracking-wide
                  ${
										active
											? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
											: 'text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-orange-500/50'
									}`}
		>
			{children}
		</Link>
	)
}
