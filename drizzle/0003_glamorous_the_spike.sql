CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`amount` real NOT NULL,
	`description` text(512) NOT NULL,
	`expense_date` text,
	`created_at` text DEFAULT CURRENT_TIME,
	`updated_at` text DEFAULT CURRENT_TIME,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pending_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`verification_code` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIME
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pending_users_email_unique` ON `pending_users` (`email`);