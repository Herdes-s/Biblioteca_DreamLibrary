// =============================
// ESTADO
// =============================

const state = {
  books: [],
  searchResults: [],
  sortOrder: "asc",
};

// =============================
// ELEMENTOS DOM
// =============================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");
const libraryContainer = document.getElementById("library");
const sortBtn = document.getElementById("sortBtn");

// =============================
// FUNÇÕES API
// =============================

async function fetchBooks(query) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${query}`,
  );

  const data = await response.json();

  return data.docs;
}

// =============================
// FUNÇÕES DE MANIPULAÇÃO
// =============================

async function handleSearch() {
  const inputValue = searchInput.value.trim();

  if (!inputValue) {
    alert("digite algo para buscar!");
    return;
  }

  console.log("Buscar por: ", inputValue);

  const result = await fetchBooks(inputValue);

  state.searchResults = result;

  renderSearchResults();
}

function saveLibrary() {
  localStorage.setItem("library", JSON.stringify(state.books));
}

function loadLibrary() {
  const saveBooks = localStorage.getItem("library");

  if (saveBooks) {
    state.books = JSON.parse(saveBooks);
    renderLibrary();
  }
}

// =============================
// FUNÇÕES DE RENDER
// =============================

function renderSearchResults() {
  resultsContainer.innerHTML = "";

  state.searchResults.forEach((book) => {
    const div = document.createElement("div");
    div.classList.add("book");

    if (book.cover_i) {
      const img = document.createElement("img");
      img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      div.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.classList.add("book-placeholder");
      placeholder.textContent = book.title[0];
      div.appendChild(placeholder);
    }

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = book.author_name
      ? book.author_name[0]
      : "Autor Desconhecido";

    const button = document.createElement("button");
    button.classList.add("add-btn");
    button.dataset.key = book.key;
    button.textContent = "Adicionar";

    div.appendChild(title);
    div.appendChild(author);
    div.appendChild(button);

    resultsContainer.appendChild(div);
  });
}

function renderLibrary() {
  libraryContainer.innerHTML = "";

  const sortedBook = [...state.books].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return state.sortOrder === "asc" ? comparison : -comparison;
  });

  sortedBook.forEach((book) => {
    const div = document.createElement("div");
    div.classList.add("book");

    if (book.cover_i) {
      const img = document.createElement("img");
      img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      div.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.classList.add("book-placeholder");
      placeholder.textContent = book.title[0];
      div.appendChild(placeholder);
    }

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = book.author_name
      ? book.author_name[0]
      : "Autor desconhecido";

    const button = document.createElement("button");
    button.classList.add("remove-btn");
    button.dataset.key = book.key;
    button.textContent = "Remover";

    div.appendChild(title);
    div.appendChild(author);
    div.appendChild(button);

    libraryContainer.appendChild(div);
  });
}

loadLibrary();
// =============================
// EVENTOS
// =============================

resultsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const key = e.target.dataset.key;

    const selectedBook = state.searchResults.find((book) => book.key === key);

    const alreadyExists = state.books.some(
      (book) => book.key === selectedBook.key,
    );

    if (alreadyExists) {
      alert("Livro já adicionado");
      return;
    }

    state.books.push(selectedBook);
    saveLibrary();
    renderLibrary();
  }
});

libraryContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const key = e.target.dataset.key;

    state.books = state.books.filter((book) => book.key !== key);
    saveLibrary();
    renderLibrary();
  }
});

sortBtn.addEventListener("click", () => {
  state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";

  sortBtn.textContent =
    state.sortOrder === "asc" ? "Ordenar: A -> Z" : "Ordenar: Z -> A";

  renderLibrary();
});

searchBtn.addEventListener("click", handleSearch);
