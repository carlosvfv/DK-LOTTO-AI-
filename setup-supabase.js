const { createClient } = require('@supabase/supabase-js');

// TUS CREDENCIALES
const SUPABASE_URL = 'https://dtyckxrqyyvcitmityzv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ewHH1DPy7Jq8G722NqSjgQ_ufM_ZP8i';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupDatabase() {
    console.log("🚀 Iniciando configuración automática de Supabase...");

    // 1. Intentar insertar una clave de prueba.
    // Si la tabla no existe, esto fallará, pero en algunos casos
    // Supabase permite creación dinámica o nos dará info del error.
    // NOTA: Con la 'anon key' (public), NO PODEMOS crear tablas (DDL).
    // SOLO el 'service_role' key o el dashboard pueden crear tablas.

    console.log("⚠️ IMPORTANTE: La clave que me diste ('sb_publishable...') es PÚBLICA.");
    console.log("❌ Las claves públicas NO TIENEN PERMISO para crear tablas nuevas.");
    console.log("❌ Yo NO PUEDO crear la tabla 'licenses' desde aquí con esa clave.");

    console.log("\n✅ SOLUCIÓN REQUERIDA:");
    console.log("1. Entra a https://supabase.com/dashboard/project/dtyckxrqyyvcitmityzv/sql");
    console.log("2. Pega y ejecuta el código SQL que te he dejado en 'SUPABASE_SETUP.sql'");

    // Test connection
    const { data, error } = await supabase.from('licenses').select('*').limit(1);

    if (error) {
        if (error.code === '42P01') { // undefined_table
            console.error("\n❌ ERROR: La tabla 'licenses' NO EXISTE todavía.");
            console.error("👉 DEBES crearla manualmente en el Dashboard SQL Editor.");
        } else {
            console.error("\n❌ Error de conexión:", error.message);
        }
    } else {
        console.log("\n✅ ¡La tabla 'licenses' YA EXISTE! Todo está listo.");
    }
}

setupDatabase();
