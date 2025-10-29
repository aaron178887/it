// resources/js/Helpers/sanitizeSvg.js
import DOMPurify from 'dompurify';
export function sanitizeSvg(raw = '') {
  return DOMPurify.sanitize(raw, { USE_PROFILES: { svg: true } });
}
