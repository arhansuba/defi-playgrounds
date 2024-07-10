// helper.js
export const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  export const truncateText = (text, length) => {
    return text.substring(0, length) + (text.length > length ? '...' : '');
  };
  
  export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };
  
  export const isObjectEmpty = (obj) => {
    return Object.entries(obj).every(([key, value]) => value === null || value === undefined);
  };
  
  export const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      const later = function () {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  export const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };
  
  export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };