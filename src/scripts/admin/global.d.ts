import { Book } from "./Book.js";
declare global {
  interface Window {
    params: {
      page: number;
      adminLimit: number;
      total: number;
    };
    renderBookTable: (book: Book[]) => void;
    renderButtons: (pageCount: number) => void;
  }
}


export {};
