window.params = {
  page: 0,
  adminLimit: 10,
  total: 0,
};

document.addEventListener("DOMContentLoaded", async () => {
  const queryString = new URLSearchParams(window.params).toString();
  const res = await fetch(
    `http://localhost:8080/admin/api/v1/books?${queryString}`
  );
  const data = await res.json();
  const books = data.books;
  console.log(books);
  const pageCount = Math.ceil(data.total / window.params.adminLimit);

  renderButtons(pageCount);
  renderBookTable(books);

  document
    .getElementById("button-container")
    .addEventListener("click", async (event) => {
      const target = event.target;

      if (target.classList.contains("navigation-button")) {
        const pageNumber = Number(target.dataset.pageNumber);
        window.params.page = pageNumber;

        const queryString = new URLSearchParams(window.params).toString();
        const res = await fetch(
          `http://localhost:8080/admin/api/v1/books?${queryString}`
        );
        const data = await res.json();
        const books = data.books;
        renderBookTable(books);
      }
    });
});

function renderBookTable(books) {
  const table = document.getElementById("tbody");
  table.innerHTML = "";

  books.forEach((book) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.numbersOfView}</td>
      <td><button class="delete-btn btn btn-danger" data-id="${book.id}">Видалити</button></td>
      `;

    table.appendChild(tr);
  });
}

function renderButtons(pageCount) {
  const buttonContainer = document.getElementById("button-container");

  for (let i = 0; i < pageCount; i++) {
    const button = `<button id="button${i}" data-page-number=${i} class="navigation-button btn btn-link"> ${
      i + 1
    } </button>`;
    buttonContainer.innerHTML += button;
  }
}

window.renderBookTable = renderBookTable;
window.renderButtons = renderButtons;
