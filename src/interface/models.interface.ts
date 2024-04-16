// userModel.ts

export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: "patron" | "librarian" | "administrator";
    account_type?: "student" | "faculty"; // Optional
    verificationCode?: string | null; // Optional
    verificationCode_expiration?: string | null; // Optional
    verified?: boolean; // Optional
    avatar?: string | null; // Optional
    reset_token?: string | null; // Optional
    reset_token_expiration?: string | null; // Optional
    library_name?: string | null; // Optional
    is_active: boolean;
}
// bookModel.ts

export interface Book {
    book_id: number;
    title: string;
    author: string;
    isbn?: string | null; // Optional
    type: "reference" | "fiction" | "non-fiction";
    total_copies: number;
    available_copies: number;
    library_name?: string | null; // Optional
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
    transaction_type: "Borrow" | "Return";
    transaction_date: Date; // Assuming it's a string for simplicity, can be a Date object if needed
}
// reservationModel.ts

export interface Reservation {
    reservation_id: number;
    user_id: number;
    book_id: number;
    reservation_date: Date; // Assuming it's a string for simplicity, can be a Date object if needed
    expiry_date?: string | null; // Optional
    status: "Pending" | "Confirmed" | "Expired";
}
