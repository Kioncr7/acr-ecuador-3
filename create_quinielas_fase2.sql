-- Crea la tabla para Road to the Final en Supabase/PostgreSQL
-- Ejecútalo en SQL editor de Supabase o en tu conexión a la base de datos.

CREATE TABLE IF NOT EXISTS public.quinielas_fase2 (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name TEXT NOT NULL,
    finalist_left TEXT,
    finalist_right TEXT,
    scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Otorga permisos básicos al rol anon si usas la clave pública de Supabase
-- (necesario si tu cliente web accede sin sesión de usuario).
GRANT SELECT, INSERT ON public.quinielas_fase2 TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.quinielas_fase2_id_seq TO authenticated;

-- Si tu proyecto usa Row Level Security, desactívalo o agrega políticas para permitir
-- el acceso de lectura/escritura desde el cliente web con la clave pública.
-- En Supabase Dashboard > Auth > Policies:
--   - Habilita RLS para la tabla si está deshabilitado.
--   - Crea políticas para SELECT e INSERT donde true.

-- Ejemplo de migración simple desde la tabla existente `quinielas`:
-- Solo funciona si `quinielas` ya tiene columnas compatibles.
-- Ajusta los nombres de columna según tu esquema real.

-- INSERT INTO public.quinielas_fase2 (user_name, finalist_left, finalist_right, scores, created_at)
-- SELECT
--     user_name,
--     finalist_left,
--     finalist_right,
--     scores,
--     created_at
-- FROM public.quinielas
-- WHERE finalist_left IS NOT NULL AND finalist_right IS NOT NULL;
