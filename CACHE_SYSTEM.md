# ⚡ Sistema de Cache Optimizado

## 🎯 Cómo Funciona:

### **Arquitectura:**
```
┌─────────────────────────────────────┐
│  Script Local (cada 6 horas)       │
│  update-cache.mjs                   │
│  ├─ Scraping completo ✅            │
│  ├─ Chi² Test ✅                    │
│  ├─ Entropía ✅                     │
│  ├─ Correlaciones de Pares ✅       │
│  ├─ Gap Analysis ✅                 │
│  └─ Guarda en Supabase              │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Supabase: lottery_cache            │
│  ├─ game: "lotto"                   │
│  ├─ data: [últimos 100 sorteos]    │
│  ├─ analysis: { hotNumbers, ... }  │
│  └─ updated_at: timestamp           │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Edge Function (instantáneo)        │
│  ├─ Lee cache (0.1s) ✅             │
│  ├─ Llama DeepSeek (15-30s) ✅      │
│  └─ Devuelve resultado              │
└─────────────────────────────────────┘
```

## ✅ Garantías:

1. **Mismos Cálculos:** El código de `update-cache.mjs` es IDÉNTICO a `server.js`
2. **Misma Precisión:** Chi², entropía, gaps - todo igual
3. **Misma Calidad:** DeepSeek recibe los mismos datos
4. **Solo más Rápido:** Edge Function tarda 15-35s (antes podía tardar 50s+)

## 🔄 Uso:

### Primera Vez (Poblar Cache):
```bash
cd loteria-dinamarca
npm install --prefix . -f axios cheerio @supabase/supabase-js
node update-cache.mjs
```

### Automatizar (Windows Task Scheduler):
```bash
# Crear tarea que ejecute cada 6 horas:
schtasks /create /tn "UpdateLotteryCache" /tr "node C:\...\update-cache.mjs" /sc HOURLY /mo 6
```

### O Manualmente cuando quieras:
```bash
node update-cache.mjs
```

## 📊 Verificar Cache:

Entra a Supabase Dashboard → Table Editor → `lottery_cache`

Deberías ver:
```
| game        | updated_at          | data (100 arrays) | analysis (JSON) |
|-------------|---------------------|-------------------|-----------------|
| lotto       | 2026-01-14 19:00    | [[1,2,3...], ...] | {hotNumbers:...}|
| vikinglotto | 2026-01-14 19:01    | [[5,8,12...], ...| {hotNumbers:...}|
| eurojackpot | 2026-01-14 19:02    | [[3,7,15...], ...| {hotNumbers:...}|
```

## 🚀 Deploy Edge Functions:

Una vez el cache está poblado:
```bash
supabase functions deploy generate-premium
supabase functions deploy check-license
supabase functions deploy create-key
```

## ⚙️ Configuración Avanzada (Opcional):

### Usar Supabase Cron (para que se actualice solo):
1. Ve a Dashboard → Database → Cron Jobs
2. Configura:
   - Schedule: `0 */6 * * *` (cada 6 horas)
   - SQL: `SELECT net.http_post(url := 'TU_WEBHOOK_URL')`
3. Crea un webhook endpoint que ejecute `update-cache.mjs`

O más simple: déjalo correr en tu PC con Task Scheduler ✅
