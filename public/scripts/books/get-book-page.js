document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", async (event) => {
    const target = event.target;
    if (target.classList.contains("book_item")) {
      const bookId = Number(target.dataset.bookId);
      console.log(bookId);
      const queryString = new URLSearchParams(bookId).toString();
      const res = await fetch(`http://localhost:8080/book/${queryString}`);
    }
  });
});
