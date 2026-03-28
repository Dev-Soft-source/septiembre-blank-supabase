
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlobalVideoTestimonials } from './GlobalVideoTestimonials';
import { EnglishVideoTestimonials } from './EnglishVideoTestimonials';

export function GlobalTestimonials() {
  const location = useLocation();
  const { i18n } = useTranslation();
  
  // Allowed pages for testimonials (ONLY these specific pages)
  const allowedPaths = [
    '/faq',
    '/afinidades',
    '/promotor-local',
    '/embajador'
  ];
  
  // Check if current path is in allowed pages or is ANY type of dashboard/panel/admin
  const isDashboard = location.pathname.includes('/dashboard') || 
                      location.pathname.includes('/panel') || 
                      location.pathname.includes('/agentes') ||
                      location.pathname.includes('/admin') ||
                      location.pathname.includes('/hotel') ||
                      location.pathname.includes('/association') ||
                      location.pathname.includes('/promoter') ||
                      location.pathname.includes('/user') ||
                      location.pathname.includes('/profile');
  
  // Check if any testimonial videos have been manually closed this session
  const anyTestimonialsClosed = sessionStorage.getItem('dismissed_video_spanish_testimonials') === 'true' ||
                                sessionStorage.getItem('dismissed_video_english_testimonials') === 'true';
  
  // ONLY allow on specified pages and NOT if any testimonials were closed
  const shouldShow = allowedPaths.includes(location.pathname) && !isDashboard && !anyTestimonialsClosed;
  
  // Always render both components but conditionally show them
  // This ensures consistent hook calls
  return (
    <>
      {shouldShow && i18n.language === 'es' && <GlobalVideoTestimonials />}
      {shouldShow && i18n.language !== 'es' && <EnglishVideoTestimonials />}
    </>
  );
}
