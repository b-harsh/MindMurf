export function getBrowserLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  return lang?.split('-')[0] || 'en';
}
