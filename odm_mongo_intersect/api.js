import fetch from 'node-fetch';//este es for ESM module newer
//const fetch = require('node-fetch')//CommonJS older
//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));// solución for both compatibility
let API = 'http://localhost:8000';

export async function getdata() {
    try {
        console.log('Intentando conectar a:', API);
        const res = await fetch(API);
        console.log('Estado de la respuesta:', res.status);
        console.log('Headers de la respuesta:', res.headers);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Datos recibidos:', JSON.stringify(data, null, 2));
        return data;
    } catch (e) {
        console.error('Error en getdata:', e);
        throw e;
    }
}
