-- Add media_id column to posts table (run manually if column doesn't exist)
ALTER TABLE posts ADD COLUMN media_id VARCHAR(48);

-- Create index on media_id



CREATE INDEX IF NOT EXISTS idx_posts_media_id ON posts(media_id);

