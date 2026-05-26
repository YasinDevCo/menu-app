'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const savedColors = localStorage.getItem('theme-colors')
        if (savedColors) {
            try {
                const colors = JSON.parse(savedColors)
                if (colors.primaryColor) {
                    document.documentElement.style.setProperty('--primary', colors.primaryColor)
                    document.documentElement.style.setProperty('--ring', colors.primaryColor)
                }
            } catch (e) {
                console.error('Error loading theme', e)
            }
        }
    }, [])

    return <>{children}</>
}