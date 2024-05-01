-- CreateTable
CREATE TABLE `books` (
    `book_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `author` VARCHAR(100) NOT NULL,
    `isbn` VARCHAR(20) NULL,
    `type` VARCHAR(191) NOT NULL,
    `total_copies` INTEGER NOT NULL,
    `available_copies` INTEGER NOT NULL,
    `library_name` VARCHAR(100) NULL,

    PRIMARY KEY (`book_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `books_genres` (
    `book_id` INTEGER NOT NULL,
    `genre_id` INTEGER NOT NULL,

    INDEX `genre_id`(`genre_id`),
    PRIMARY KEY (`book_id`, `genre_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genres` (
    `genre_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`genre_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations` (
    `reservation_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `book_id` INTEGER NULL,
    `reservation_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expiry_date` TIMESTAMP(0) NULL,
    `status` ENUM('Pending', 'Confirmed', 'Expired') NOT NULL DEFAULT 'Pending',

    INDEX `book_id`(`book_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`reservation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `book_id` INTEGER NULL,
    `transaction_type` ENUM('Borrow_request', 'Borrowed', 'Returned') NOT NULL,
    `transaction_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expiry_date` TIMESTAMP(0) NULL,

    INDEX `book_id`(`book_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NULL,
    `role` ENUM('patron', 'librarian', 'administrator') NOT NULL,
    `account_type` ENUM('student', 'faculty', 'librarian', 'administrator') NULL,
    `verificationCode` VARCHAR(50) NULL,
    `verificationCode_expiration` VARCHAR(50) NULL,
    `verified` BOOLEAN NULL,
    `avatar` VARCHAR(255) NULL,
    `reset_token` VARCHAR(50) NULL,
    `reset_token_expiration` VARCHAR(50) NULL,
    `library_name` VARCHAR(100) NULL,
    `is_active` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_libraries` (
    `user_id` INTEGER NOT NULL,
    `library_name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`user_id`, `library_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `books_genres` ADD CONSTRAINT `books_genres_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `books_genres` ADD CONSTRAINT `books_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`genre_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_libraries` ADD CONSTRAINT `user_libraries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
