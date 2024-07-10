// formatter.js
class Formatter {
    static formatCurrency(amount, currency) {
      const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
      };
      const symbol = currencySymbols[currency];
      return `${symbol}${amount.toFixed(2)}`;
    }
  
    static formatDateTime(date) {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  
    static formatAddress(address) {
      return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
    }
  
    static formatPhoneNumber(phoneNumber) {
      const cleaned = phoneNumber.replace(/\D+/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
      return phoneNumber;
    }
  
    static formatName(name) {
      return name.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
  }
  
  module.exports = Formatter;