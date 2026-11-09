const URL_PADRAO = 'http://localhost:8080/api/v1';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || URL_PADRAO).replace(/\/$/, '');
