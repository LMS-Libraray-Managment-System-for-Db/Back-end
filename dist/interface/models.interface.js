"use strict";
// userModel.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountType = exports.transactionTypes = exports.UserRole = exports.BookType = void 0;
// bookModel.ts
var BookType;
(function (BookType) {
    BookType["Reference"] = "reference";
    BookType["Fiction"] = "fiction";
    BookType["NonFiction"] = "non-fiction";
})(BookType || (exports.BookType = BookType = {}));
// Define enum for user role
var UserRole;
(function (UserRole) {
    UserRole["Patron"] = "patron";
    UserRole["Librarian"] = "librarian";
    UserRole["Administrator"] = "administrator";
})(UserRole || (exports.UserRole = UserRole = {}));
var transactionTypes;
(function (transactionTypes) {
    transactionTypes["BorrowRequest"] = "Borrow_request";
    transactionTypes["Return"] = "Returned";
    transactionTypes["Borrowed"] = "Borrowed";
})(transactionTypes || (exports.transactionTypes = transactionTypes = {}));
// Define enum for account type
var AccountType;
(function (AccountType) {
    AccountType["Student"] = "student";
    AccountType["Faculty"] = "faculty";
    AccountType["Librarian"] = "librarian";
    AccountType["Administrator"] = "administrator";
})(AccountType || (exports.AccountType = AccountType = {}));
//# sourceMappingURL=models.interface.js.map