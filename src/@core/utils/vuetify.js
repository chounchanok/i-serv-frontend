import { cookieRef } from '@layouts/stores/config'

export const resolveVuetifyTheme = defaultTheme => {
  const cookieColorScheme = cookieRef('color-scheme', usePreferredDark().value ? 'light' : 'dark')
  const storedTheme = cookieRef('theme', defaultTheme).value
  
  return storedTheme === 'system'
    ? cookieColorScheme.value === 'light'
      ? 'light'
      : 'dark'
    : storedTheme
}
