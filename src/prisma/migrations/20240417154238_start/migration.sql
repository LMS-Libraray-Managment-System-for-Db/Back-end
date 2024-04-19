/*
  Warnings:

  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(50) NOT NULL,
    MODIFY `account_type` ENUM('student', 'faculty', 'librarian', 'administrator') NULL;
