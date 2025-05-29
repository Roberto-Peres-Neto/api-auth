import dotenv from 'dotenv';

dotenv.config();
export default {
  sqlHost: process.env.SQL_HOST || '172.21.178.136',
  sqlDataBase: process.env.SQL_DATABASE || 'SGBDDEV',
  sqlUsername: process.env.SQL_USERNAME || 'services-erp',
  sqlPassword: process.env.SQL_PASSWORD || '2526131v',
  sqlPort: Number(process.env.SQL_PORT) || 1433,
  sqlLoggin: process.env.SQL_LOGGIN || false,
  sqlTimeout: process.env.SQL_TIMEOUT || 50000,

  jwtSecret: process.env.JWT_SECRET || 'F4V3N1@2024#Boliche@2033@7VkecWpCEViU46vtiKS4LNROqD7U5XbZ',

  mongoUrl: process.env.MONGO_URL || 'mongodb://172.21.178.136:27017/ERP',

  appPort: process.env.APP_PORT || 5050
}