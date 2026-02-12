CREATE TABLE `adminEmails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminEmails_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminEmails_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`registrationId` int NOT NULL,
	`firstNameHe` varchar(100) NOT NULL,
	`lastNameHe` varchar(100) NOT NULL,
	`firstNameEn` varchar(100) NOT NULL,
	`lastNameEn` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320) NOT NULL,
	`birthDate` date NOT NULL,
	`passportConfirmed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tourId` int NOT NULL,
	`orderNumber` int NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`datePreference` enum('may_4_6','may_25_27','no_preference'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `registrations_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`flightDetails` text,
	`luggageDetails` text,
	`hotelDetails` text,
	`itinerary` text,
	`price` decimal(10,2),
	`capacity` int NOT NULL DEFAULT 32,
	`availableSpots` int NOT NULL DEFAULT 32,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tours_id` PRIMARY KEY(`id`)
);
