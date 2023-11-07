export const config = {
  siteName: 'Windus',
  locale: 'en-US',
  
  
  dev: {
    mode: 'production',
    database: 'mariadb', // supabase or mariadb
    apiURL: 'https://windus-api.vercel.app/api' // full url to your API backend
  }
}