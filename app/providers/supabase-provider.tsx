'use client'

import { AuthError, Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface SignInResult {
	data?: { user: User; session: Session }
	error?: AuthError | { message: string }
}

interface SignOutResult {
	error: AuthError | { message: string } | null
}

interface SupabaseContextProps {
	user: User | null
	session: Session | null
	isLoading: boolean
	signIn: (email: string, password: string) => Promise<SignInResult>
	signOut: () => Promise<SignOutResult>
	supabase: typeof supabase
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		const setData = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession()
				if (session) {
					setSession(session)
					setUser(session.user)
				}
			} catch (error) {
				console.error('Error getting session:', error)
			} finally {
				setIsLoading(false)
			}
		}

		setData()

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
			setUser(session?.user ?? null)
			setIsLoading(false)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	const signIn = async (email: string, password: string) => {
		try {
			console.log('Attempting sign in with email:', email)
			
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email.trim().toLowerCase(),
				password: password,
			})

			if (error) {
				console.error('Sign in error:', error)
				console.error('Error code:', error.status)
				console.error('Error message:', error.message)
				return { error }
			}

			console.log('Sign in successful:', data.user?.email)
			return { data }
		} catch (error) {
			console.error('Sign in catch error:', error)
			return { error: { message: 'An unexpected error occurred' } }
		}
	}

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut()
			if (error) {
				console.error('Sign out error:', error)
			}
			return { error }
		} catch (error) {
			console.error('Sign out error:', error)
			return { error: { message: 'An unexpected error occurred' } }
		}
	}

	const value = {
		user,
		session,
		isLoading,
		signIn,
		signOut,
		supabase,
	}

	return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
	const context = useContext(SupabaseContext)
	if (context === undefined) {
		throw new Error('useSupabase must be used within a SupabaseProvider')
	}
	return context
}
