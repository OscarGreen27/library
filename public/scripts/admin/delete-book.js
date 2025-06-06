document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const bookId = event.target.dataset.id;
    console.log(bookId);

    if (!confirm("Ви дійсно хочете видалити цю книгу?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/admin/api/v1/${bookId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });

      if (res.ok) {
        alert("Книгу видалено!");
        const queryString = new URLSearchParams(window.params).toString();
        const response = await fetch(
          `http://localhost:8080/admin/api/v1/books/?${queryString}`
        );
        const data = await response.json();
        const books = data.books;
        const pageCount = Math.ceil(data.total / window.params.adminLimit);

        renderButtons(pageCount);
        renderBookTable(books);

        const buttonContainer = document.getElementById("button-container");
        buttonContainer.innerHTML = "";

        if (books.lenght === 0 && window.params.page > 0) {
          window.params.pahe -= 1;
          const newQuery = new URLSearchParams(window.params).toString();
          const res2 = await fetch(`http://localhost:8080/admin/api/v1/books?${newQuery}`);
          const newData = await res2.json();
          renderButtons(Math.ceil(newData.total / window.params.adminLimit));
          renderBookTable(newData.books);
        }else{
          renderButtons(pageCount);
          renderBookTable(books);
        }
      } else {
        alert("Не вдалося видалити книгу!");
      }
    } catch (err) {
      console.log(err);
    }
  }
});
