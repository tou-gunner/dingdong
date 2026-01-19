// +----------------------------------------------------------------------
// | i18n Configuration - ການຕັ້ງຄ່າ i18n
// +----------------------------------------------------------------------
// | Default Language: Lao (lo)
// +----------------------------------------------------------------------
import Vue from 'vue'
import VueI18n from 'vue-i18n'

// Import language files
import lo from './lo'
import zhCN from './zh-CN'

Vue.use(VueI18n)

// Available locales
const messages = {
  'lo': lo,
  'zh-CN': zhCN
}

// Locale display names
const localeNames = {
  'lo': 'ພາສາລາວ',
  'zh-CN': '简体中文'
}

// Default locale (Lao)
const DEFAULT_LOCALE = 'lo'
const FALLBACK_LOCALE = 'zh-CN'
const STORAGE_KEY = 'APP_LOCALE'

/**
 * Get saved locale from storage or detect system language
 * @returns {string} locale code
 */
function getDefaultLocale() {
  // First check if user has saved a preference
  const savedLocale = uni.getStorageSync(STORAGE_KEY)
  if (savedLocale && messages[savedLocale]) {
    return savedLocale
  }

  // If no saved preference, detect system language
  try {
    const systemInfo = uni.getSystemInfoSync()
    const systemLang = systemInfo.language || ''

    // Map system language to our supported locales
    if (systemLang.startsWith('lo')) return 'lo'
    if (systemLang.startsWith('zh')) return 'zh-CN'
    
    // Default to Lao
    return DEFAULT_LOCALE
  } catch (e) {
    return DEFAULT_LOCALE
  }
}

// Create i18n instance
const i18n = new VueI18n({
  locale: getDefaultLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  messages,
  silentTranslationWarn: true, // Suppress missing translation warnings in console
  silentFallbackWarn: true
})

/**
 * Change the current locale
 * @param {string} locale - Locale code ('lo', 'zh-CN')
 * @returns {boolean} - Whether the change was successful
 */
export function setLocale(locale) {
  if (messages[locale]) {
    i18n.locale = locale
    uni.setStorageSync(STORAGE_KEY, locale)
    
    // Emit event for components that need to react to language change
    uni.$emit('locale-changed', locale)
    
    return true
  }
  return false
}

/**
 * Get the current locale
 * @returns {string} - Current locale code
 */
export function getLocale() {
  return i18n.locale
}

/**
 * Get all available locales
 * @returns {Array} - Array of locale objects with code and name
 */
export function getLocales() {
  return Object.keys(messages).map(code => ({
    code,
    name: localeNames[code] || code
  }))
}

/**
 * Get the display name for a locale
 * @param {string} locale - Locale code
 * @returns {string} - Display name
 */
export function getLocaleName(locale) {
  return localeNames[locale] || locale
}

/**
 * Check if a locale is supported
 * @param {string} locale - Locale code
 * @returns {boolean}
 */
export function isLocaleSupported(locale) {
  return !!messages[locale]
}

/**
 * Translate function for use outside Vue components
 * @param {string} key - Translation key
 * @param {Object} values - Values for interpolation
 * @returns {string}
 */
export function t(key, values) {
  return i18n.t(key, values)
}

export default i18n
