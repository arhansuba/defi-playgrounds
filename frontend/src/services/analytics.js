// frontend/src/services/Analytics.js
import axios from 'axios';

const API_URL = 'https://your-backend-api.com/analytics';

class Analytics {
  trackEvent(category, action, label, value) {
    const data = {
      category,
      action,
      label,
      value,
      timestamp: new Date().getTime(),
    };
    this.sendAnalyticsData(data);
  }

  trackPageView(path) {
    const data = {
      category: 'page_view',
      action: 'view',
      label: path,
      value: 1,
      timestamp: new Date().getTime(),
    };
    this.sendAnalyticsData(data);
  }

  sendAnalyticsData(data) {
    axios.post(API_URL, data)
      .then(response => {
        console.log('Analytics data sent successfully');
      })
      .catch(error => {
        console.error('Error sending analytics data:', error);
      });
  }
}

export default new Analytics();