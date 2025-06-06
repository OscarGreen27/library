const params = {
  offset: 0,
  limit: 18,
  total: 0,
};

document.addEventListener("DOMContentLoaded", async () => {
  const getMoreB = document.getElementById("get-more");
  const bookCount = document.getElementById("content");

  const observer = new MutationObserver(() => {
  });
  observer.observe(bookCount, { childList: true });

  const books = await makeRequest(params);
  render(books);
  checkVisible(getMoreB, bookCount.children.length);

  getMoreB.addEventListener("click", async () => {
    const books = await makeRequest(params);
    render(books);
    checkVisible(getMoreB, bookCount.children.length);
  });
});

async function makeRequest(params) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(
    `http://localhost:8080/api/v1/books?${queryString}`
  );
  const data = await response.json();
  params.offset = data.offset;
  params.total = data.total;
  return data.books;
}

function checkVisible(elem, count) {
  if (count !== params.total) {
    elem.style.display = "block";
  } else {
    elem.style.display = "none";
  }
}

function render(books) {
  const content = document.getElementById("content");

  books.forEach((book) => {
    const newElem = `<div class="book_item col-xs-6 col-sm-3 col-md-2 col-lg-2" data-book-id="${book.id}">
          <div class="book">
            <a href="/book/${book.id}">
              <img src="public/images/${book.cover}" alt="${book.id}">
              <div class="blockI" style="height: 46px;">
                <div class="title size_text">${book.title}</div>
                <div class="author">${book.author}</div>
              </div>
            </a>
            <a href="/book/${book.id}">
              <button type="button" class="details btn btn-success" >Читать</button>
            </a>
          </div>
        </div>
    `;
    content.innerHTML += newElem;
  });
}
