const {
    PUBLIC_MODE: enviroment = 'development',
    ASTRO_PORT: port = '4321',
    PUBLIC_BASE_URL_DEV: url_dev = 'http://localhost:8000',
    PUBLIC_BASE_URL_PROD: url_prod = 'https://salon-factorisado.onrender.com',
} = import.meta.env

export const EnvConfig = () => ({
    enviroment,
    port: Number(port),
    api_url: enviroment === 'development' ? url_dev : url_prod,
}) as const