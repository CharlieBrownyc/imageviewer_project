// src/utils/logger.ts
import { logger } from 'react-native-logs';

const config = {
  severity: __DEV__ ? 'debug' : 'warn', // 개발모드: 모두, 프로덕션: warn 이상만
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
      debug: 'white',
    },
  },
  transport: console.log, // 기본 transport는 console.log
};

const log = logger.createLogger(config);

export default log;
