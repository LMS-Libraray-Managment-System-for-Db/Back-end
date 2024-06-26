// userModel.ts


export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: "patron" | "librarian" | "administrator";
    account_type?: "student" | "faculty" | "librarian" | "administrator"; // Optional
    verificationCode?: string | null; // Optional
    verificationCode_expiration?: string | null; // Optional
    verified?: boolean; // Optional
    avatar?: string | null; // Optional
    reset_token?: string | null; // Optional
    reset_token_expiration?: string | null; // Optional
    library_name?: string | null; // Optional
    is_active: boolean;
}
export interface UserFilters {
    role?: UserRole; // 'patron', 'librarian', 'administrator'
    account_type?: AccountType; // 'student', 'faculty','librarian', 'administrator'
    verified?: boolean;
    is_active?: boolean;
    library_name?: string;
    email?: string;
    username?: string;
    user_id?: number;
}
// bookModel.ts
export enum BookType {
    Reference = 'reference',
    Fiction = 'fiction',
    NonFiction = 'non-fiction'
}

export interface Book {
    book_id?: number;
    title: string;
    author: string;
    isbn?: string | null; // Optional
    type: BookType;
    total_copies: number;
    available_copies: number;
    library_name?: string | null; // Optional
}
export interface BookFilters {
    [key: string]: any;
    title?: string;
    author?: string;
    isbn?: string;
    type?: BookType; // 'reference', 'fiction', 'non-fiction'
    library_name?: string;
    book_id?: number;
    genreName?: string;
}
// genreModel.ts

export interface Genre {
    genre_id: number;
    name: string;
}
// transactionModel.ts

export interface Transaction {
    transaction_id: number;
    user_id: number;
    book_id: number;
    transaction_type: "Borrow_request" | "Returned"|"Borrowed";// as state in borrow
    transaction_date: Date; // Assuming it's a string for simplicity, can be a Date object if needed
}
// reservationModel.ts

export interface Reservation {
    reservation_id: number;
    user_id: number;
    book_id: number;
    reservation_date: Date; // Assuming it's a string for simplicity, can be a Date object if needed
    expiry_date?: string | null; // Optional
    status: "Pending" | "Confirmed" | "Expired";// as status in get reservation
}



// Define enum for user role
export enum UserRole {
    Patron = 'patron',
    Librarian = 'librarian',
    Administrator = 'administrator'
}
export enum transactionTypes {
    BorrowRequest = 'Borrow_request',
    Return = 'Returned',
    Borrowed = 'Borrowed'
}

// Define enum for account type
export enum AccountType {
    Student = 'student',
    Faculty = 'faculty',
    Librarian = 'librarian',
    Administrator = 'administrator'
}



export interface UserLibrary {
    userId: number;
    libraryName: string;
    isActive: boolean;
  }
