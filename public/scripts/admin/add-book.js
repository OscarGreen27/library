document.addEventListener("DOMContentLoaded", async () => {
  const addNewBook = document.getElementById("add-new-book");
  const addBookForm = document.getElementById("add-book-container");
  const closeButton = document.getElementById("close-butoon");
  const submite = document.getElementById("submit");

  addNewBook.addEventListener("click", () => {
    addBookForm.style.display = "flex";
  });
  closeButton.addEventListener("click", () => {
    addBookForm.style.display = "none";
  });

  submite.addEventListener("click", async () => {
    const form = document.getElementById("add-book-form");
    const inputs = form.querySelectorAll(
      "input[data-field], textarea[data-field]"
    );
    const formData = new FormData();
    inputs.forEach((input) => {
      const key = input.dataset.field;

      if(input.type === "file"){
        if(input.files.length > 0){
          formData.append(key, input.files[0]);
        }
      }else{
        formData.append(key, input.value)
      }
    });

    const res = await fetch("http://localhost:8080/admin/api/v1", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      alert("Кинигу додано");
    } else {
      alert("Книгу не додано, пеервірте параметри!");
    }
  });
});
