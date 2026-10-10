DROP TABLE IF EXISTS "vision_presentations";

CREATE TABLE "vision_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"content_base64" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
