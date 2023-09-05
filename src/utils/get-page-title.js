import { defaultSettings } from '@/settings'

const title = defaultSettings.title || 'Vue3-Element+'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
