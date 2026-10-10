CREATE TABLE "vision_presentations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"content_base64" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
