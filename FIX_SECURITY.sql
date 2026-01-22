-- ============================================================
-- 🔒 PARCHE DE SEGURIDAD: PROTEGER HISTORIAL DE JUGADAS
-- ============================================================

-- 1. Eliminar la política insegura anterior (si existe)
DROP POLICY IF EXISTS "Public Read History" ON prediction_history;

-- 2. Crear nueva política: NADIE puede leer el historial públicamente
-- (Solo el 'service_role' desde el backend podrá leerlo)
CREATE POLICY "No Public Read" ON prediction_history
FOR SELECT
USING (false);  -- 'false' significa: nadie pasa

-- 3. Confirmar que la inserción sigue permitida (para guardar jugadas)
-- (Esta política ya debería existir, pero por si acaso)
DROP POLICY IF EXISTS "Public Insert History" ON prediction_history;
CREATE POLICY "Public Insert History" ON prediction_history
FOR INSERT
WITH CHECK (true);  -- Cualquiera puede escribir (guardar su jugada)

-- 4. Proteger también la tabla de LICENCIAS (muy importante)
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Nadie puede leer las licencias públicamente
DROP POLICY IF EXISTS "Public Read Licenses" ON licenses;
CREATE POLICY "No Public Read Licenses" ON licenses
FOR SELECT
USING (false);

-- Solo permitir verificar licencia a través de la Edge Function (service_role)
-- (El usuario final NO consulta la tabla directa, usa la API)
