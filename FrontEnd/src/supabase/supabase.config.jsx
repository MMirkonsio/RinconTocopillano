import { createClient } from '@supabase/supabase-js';

const VITE_APP_SUPABASE_URL = 'https://nnbbsaidwgehcewuocrb.supabase.co'; // Reemplaza 'TU_URL_DE_SUPABASE' con tu URL real de Supabase
const VITE_APP_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uYmJzYWlkd2dlaGNld3VvY3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE2MzY1MjgsImV4cCI6MjAyNzIxMjUyOH0.C6No6vqndRHL5MJu9bVILYQrUqqwhHAFnPUc3bjCvrc'; // Reemplaza 'TU_CLAVE_DE_ACCESO' con tu clave real de Supabase

const supabase = createClient(VITE_APP_SUPABASE_URL, VITE_APP_SUPABASE_ANON_KEY);

export default supabase;


