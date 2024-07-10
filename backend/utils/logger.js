// logger.js
class Logger {
    static log(level, message) {
      const levels = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
      };
      const currentLevel = process.env.LOG_LEVEL || 'INFO';
      if (levels[level] >= levels[currentLevel]) {
        console.log(`[${level}] ${message}`);
      }
    }
  
    static debug(message) {
      this.log('DEBUG', message);
    }
  
    static info(message) {
      this.log('INFO', message);
    }
  
    static warn(message) {
      this.log('WARN', message);
    }
  
    static error(message) {
      this.log('ERROR', message);
    }
  }
  
  module.exports = Logger;