# 🚀 Desplegar Supabase Edge Functions

## 📋 Pasos para Deploy:

### 1️⃣ Instalar Supabase CLI
```bash
# Windows (PowerShell como Admin):
scoop install supabase

# O con npm
npm install -g supabase
```

### 2️⃣ Login a Supabase
```bash
supabase login
```

### 3️⃣ Linkear tu Proyecto
```bash
cd loteria-dinamarca
supabase link --project-ref dtyckxrqyyvcitmityzv
```

### 4️⃣ Crear la Tabla de Cache
1. Entra a: https://supabase.com/dashboard/project/dtyckxrqyyvcitmityzv/editor
2. Ve a "SQL Editor"
3. Ejecuta el contenido de `CREATE_CACHE_TABLE.sql`

### 5️⃣ Configurar Variables de Entorno
```bash
# DeepSeek API Key
supabase secrets set DEEPSEEK_API_KEY=tu_clave_deepseek_aqui
```

### 6️⃣ Deploy Functions
```bash
# Deploy todas las funciones
supabase functions deploy generate-premium
supabase functions deploy check-license
supabase functions deploy create-key
```

### 7️⃣ URLs Finales
Tus Edge Functions estarán en:
```
https://dtyckxrqyyvcitmityzv.supabase.co/functions/v1/generate-premium
https://dtyckxrqyyvcitmityzv.supabase.co/functions/v1/check-license
https://dtyckxrqyyvcitmityzv.supabase.co/functions/v1/create-key
```

### 8️⃣ Actualizar Frontend
En `script.js`, cambiar:
```javascript
// ANTES:
const API_BASE_URL = 'http://localhost:3001/api';

// DESPUÉS:
const API_BASE_URL = 'https://dtyckxrqyyvcitmityzv.supabase.co/functions/v1';
```

### 9️⃣ Poblar Cache Inicial (Una vez)
Ejecuta `server.js` localmente UNA VEZ para scrapenar datos:
```bash
npm run populate-cache
```
O crea un script separado para esto.

---

## ⚙️ Optimizaciones Aplicadas:

✅ **Cache de datos scrapeados** → Evita timeout
✅ **Timeout de 30s en DeepSeek** → Si falla, usa fallback inteligente
✅ **Cálculos simplificados** → Solo lo esencial
✅ **Todo en Deno/TypeScript** → Compatible con Edge Functions
✅ **Manejo de errores robusto** → Siempre devuelve algo

---

## 🔄 Actualizar Cache:

Puedes crear un CRON job en Supabase (proyecto → Database → Cron Jobs) para actualizar el cache cada 6 horas con una función separada.

O ejecutar manualmente cuando necesites:
```bash
node update-cache-script.js
```

---

## 💡 Notas Importantes:

- Las Edge Functions tienen límite de 60s TOTAL
- DeepSeek tiene timeout de 30s
- Si DeepSeek falla, usa generación estadística inteligente
- El cache se actualiza automáticamente cada 6 horas (configurable)
