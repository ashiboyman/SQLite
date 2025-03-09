ALTER TABLE `users` RENAME COLUMN "time" TO "created_at";--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` text DEFAULT CURRENT_TIME;