CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_popup_enabled" boolean DEFAULT false NOT NULL,
	"video_popup_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
