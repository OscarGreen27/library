import Book from "../interfaces/Book.js";

const add_button = document.querySelector("#add");

const newBookName = document.querySelector<HTMLInputElement>("#new-book-name");
const newBookYear = document.querySelector<HTMLInputElement>("#new-book-year");
const newPagesCount = document.querySelector<HTMLInputElement>(
  "#new-book-pages-count"
);
const newBookIsbn = document.querySelector<HTMLInputElement>("#new-book-isbn");
const authors = document.querySelectorAll<HTMLInputElement>(".authors");
const newBookDescription = document.querySelector<HTMLInputElement>(
  "#new-book-description"
);

add_button?.addEventListener("click", () => {
  if (
    newBookName &&
    newBookYear &&
    newPagesCount &&
    newBookIsbn &&
    newBookDescription
  ) {
    const titel: string = newBookName.value;
    const year: string = newBookYear.value;
    const author: string = authorsValidator(authors);
    const pages: string = newPagesCount.value;
    const isbn: string = newBookIsbn.value;
    const description: string = newBookDescription.value;

    const newBook: Book = makeNewBook(
      titel,
      year,
      author,
      pages,
      isbn,
      description
    );
    send(newBook);
  }
});

async function send(arg: {}){
  const response = await fetch("localhost:8080/admin/api/v1/", {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

function makeNewBook(
  titel: string,
  year: string,
  authors: string,
  pages: string,
  isbn: string,
  description: string
): Book {
  if (
    titel === "" &&
    year === "" &&
    authors === "" &&
    pages === "" &&
    isbn === "" &&
    description === ""
  ) {
    alert("Не заповленні всі обов'язкові поля!");
    throw new Error("Не заповнені всі обов'язкові поля!");
  }
  return {
    title: titel,
    year: Number(year),
    author: authors,
    pages: Number(pages),
    isbn: Number(isbn),
    description: description,
  };
}

function authorsValidator(list: NodeListOf<HTMLInputElement>): string {
  if (list[0].value) {
    alert("");
  }
  const authors: string[] = [];
  list.forEach((elem) => {
    if (elem.value !== null) {
      authors.push(elem.value);
    }
  });
  const authorString = joinAuthors(authors);
  return authorString;
}

function joinAuthors(authors: string[]): string {
  if (authors.length > 1) return authors.join(", ");
  return authors[0];
}
