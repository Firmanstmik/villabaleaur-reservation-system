-- Add jsonb column for rich text description (Tiptap JSON)
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS description_json jsonb DEFAULT NULL;

-- Migrate existing plain text descriptions to Tiptap JSON format.
-- Splits on double newlines to create multiple paragraph nodes,
-- preserving the natural structure of existing descriptions.
-- Single-paragraph descriptions are wrapped in a single paragraph node.
DO $$
DECLARE
    r RECORD;
    segments TEXT[];
    seg TEXT;
    content_arr jsonb;
BEGIN
    FOR r IN
        SELECT id, description
        FROM properties
        WHERE description IS NOT NULL
          AND description != ''
          AND description_json IS NULL
    LOOP
        -- Split description on double line breaks
        segments := string_to_array(r.description, E'\n\n');
        content_arr := '[]'::jsonb;

        FOREACH seg IN ARRAY segments
        LOOP
            -- Skip empty segments
            IF btrim(seg) != '' THEN
                content_arr := content_arr || jsonb_build_array(
                    jsonb_build_object(
                        'type', 'paragraph',
                        'content', jsonb_build_array(
                            jsonb_build_object('type', 'text', 'text', btrim(seg))
                        )
                    )
                );
            END IF;
        END LOOP;

        -- Only update if we produced content
        IF jsonb_array_length(content_arr) > 0 THEN
            UPDATE properties
            SET description_json = jsonb_build_object('type', 'doc', 'content', content_arr)
            WHERE id = r.id;
        END IF;
    END LOOP;
END $$;
