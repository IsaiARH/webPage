"use stric";

//funtions for recicle
const deleteContent = (...elements) => {
  for (let element of elements) {
    element.value = "";
  }
};

const addElements = (pElement, ...selements) => {
  for (let one of selements) {
    pElement.appendChild(one);
  }
};

const actions = (action, obj, id) => {
  const db = getIDB("readonly");
  const cursor = db.openCursor();
  cursor.addEventListener("success", (e) => {
    try {
      if (action == "delete") {
        cursor.result.value.nombre == obj ? deleteIDB(cursor.result.key) : null;
      } else if (action == "edit") {
        cursor.result.value.nombre == id
          ? editIDB(obj, cursor.result.key)
          : null;
      } else if (action == "search") {
        try {
          cursor.result.value.nombre === obj
            ? (containerP.innerHTML !== "" ? (containerP.innerHTML = "") : null,
              foundCode(
                cursor.result.value.imagen,
                cursor.result.value.nombre,
                cursor.result.value.cantidad,
                cursor.result.value.precio
              ))
            : null;
        } catch (error) {
          containerP.innerHTML == ""
            ? ((containerP.innerHTML = ""),
              (containerP.innerHTML = "no data found"))
            : null;
        }
      } else if (action == "delete multiples") {
        try {
          cursor.result.value.nombre == obj
            ? deleteIDB(cursor.result.key, "multiple")
            : null;
        } catch (error) {
          containerP.innerHTML = "";
        }
      }
      cursor.result.continue();
    } catch (error) {
      console.log("action complete");
    }
  });
};

const readInputs = (...inputs) => {
  for (let input of inputs) {
    input.addEventListener("change", (e) => {
      input = e.target.value;
    });
  }
};

//checkbox is checked
const cb = document.getElementById("flexCheckDefault");
const others = document.querySelector(".others");
cb.addEventListener("change", () => {
  containerP.innerHTML !== ""
    ? others.classList.contains("d-none")
      ? others.classList.remove("d-none")
      : others.classList.add("d-none")
    : null;
  if (containerP.innerHTML !== "") {
    if (cb.checked) {
      containerP.innerHTML !== ""
        ? ((containerP.innerHTML = ""), readObjects())
        : readObjects();
    } else {
      containerP.innerHTML = "";
      readObjects();
    }
  }
});

// input tipo numero
const sumar = document.querySelector(".add");
const restar = document.querySelector(".remove");

//accediendo a inputs de modal in de HTML
const numberInput = document.querySelector(".number-input");
const inputName = document.getElementById("nombreDelProducto");
const inputPrice = document.getElementById("precioDelProducto");
const inputCant = document.getElementById("cantidadDelProducto");
let cantidad = 0;

sumar.addEventListener("click", () => {
  cantidad++;
  numberInput.value = cantidad;
});

restar.addEventListener("click", () => {
  cantidad == 0 ? (cantidad = 0) : cantidad--;
  numberInput.value = cantidad;
});

//get d-none to buttonAdd and add d-none to $editButton
const $editButton = document.querySelector(".edit");
const iconAdd = document.querySelector(".fa-plus-square");
iconAdd.addEventListener("click", () => {
  buttonAdd.classList.remove("d-none");
  $editButton.classList.add("d-none");
  cantidad = 0;
  inputCant.value = 0;
  deleteContent(inputName, inputPrice, inputCant);
});

//creacion de indexceDB
const indexeDDB = indexedDB.open("database");
indexeDDB.addEventListener("upgradeneeded", () => {
  const db = indexeDDB.result;
  const storeDB = db.createObjectStore("informacion", {
    autoIncrement: true,
  });
  storeDB.createIndex("informacionColum", "nombre", { unique: false });
  indexeDDB.addEventListener("success", () => {
    console.log("activo");
  });
});

//funcion para acceder a indexedDB
const getIDB = (type) => {
  const db = indexeDDB.result;
  const transactionDB = db.transaction("informacion", type);
  const storeIDB = transactionDB.objectStore("informacion");

  return storeIDB;
};

//AGREGANDO INFORMACION AL SISTEMA

//funcion para agregar a indexedDb
const add = (obj) => {
  const storeDBAdd = getIDB("readwrite");
  let request = storeDBAdd.add(obj);
  request.addEventListener("success", (e) => {});
};

let image = null;
let image2 = null;
const inputCamera = document.getElementById("camara");
inputCamera.addEventListener("change", (e) => {
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.addEventListener("load", () => {
    image = reader.result;
    return image;
  });
});

//confirmacion para agregar elemento al sistema
const labelName = document.querySelector(".labelName");
const labelPrice = document.querySelector(".labelPrice");
const buttonAdd = document.querySelector(".acept");
buttonAdd.addEventListener("click", () => {
  if ((inputName.value !== "") & (inputPrice.value !== "")) {
    add({
      imagen: image,
      nombre: inputName.value,
      precio: inputPrice.value,
      cantidad: inputCant.value,
    });
    deleteContent(inputName, inputPrice);
    cantidad = 0;
    inputCant.value = 0;
    labelName.textContent = "Nombre del producto";
    labelPrice.textContent = "Precio";
    labelPrice.classList.remove("labelActive");
    labelName.classList.remove("labelActive");
  } else {
    labelName.textContent = "Field requiered!";
    labelName.classList.add("labelActive");
    labelPrice.textContent = "Field requiered!";
    labelPrice.classList.add("labelActive");
    alert("failed, required fields");
  }
});

//edit elements in the sistem

//SHOWING PRODUCTS
//container of products and fragment
const containerP = document.querySelector(".container-products");
const documentFragment = document.createDocumentFragment();

//funtion for read elements in indexedDb
const readObjects = () => {
  const reading = getIDB("readonly");
  const cursor = reading.openCursor();
  cursor.addEventListener("success", (e) => {
    if (cursor.result) {
      foundCode(
        cursor.result.value.imagen,
        cursor.result.value.nombre,
        cursor.result.value.cantidad,
        cursor.result.value.precio
      );
      cursor.result.continue();
    }
  });
};

//create elements in document
const foundCode = (image, nameText, stockText, priceText) => {
  //Principal Div
  const productsContainer = document.createElement("div");
  productsContainer.classList.add("products", "mt-2");
  //IMAGE AND CHECKBOX

  //container of image and checbox
  const divIC = document.createElement("div");
  divIC.classList.add("d-flex", "align-items-center");
  //checkbox
  const divC = document.createElement("div");
  divC.classList.add("form-check");
  const inputCheckbox = document.createElement("input");
  inputCheckbox.classList.add("form-check-input");
  inputCheckbox.setAttribute("type", "checkbox");
  inputCheckbox.setAttribute("id", "inputCheck");
  if (cb.checked) {
    inputCheckbox.setAttribute("checked", "true");
  } else {
    inputCheckbox.removeAttribute("checked");
  }
  divC.appendChild(inputCheckbox);
  let containerCheck = inputCheckbox.parentElement;
  const buttonDeleteM = document.querySelector(".delete-others");
  buttonDeleteM.addEventListener("click", () => {
    let img = containerCheck.nextElementSibling;
    let absolute = img.parentElement;
    if (inputCheckbox.checked == true) {
      actions("delete multiples", absolute.nextElementSibling.textContent);
    }
  });

  //image
  const img = document.createElement("img");
  img.classList.add("rounded", "ms-3");
  img.setAttribute("src", image);
  divIC.appendChild(divC);
  divIC.appendChild(img);
  divC.classList.add("col-2");

  //NAME, STOCK AND PRICE
  const name = document.createElement("h5");
  name.classList.add("col-2", "name-product", "text-center");
  name.textContent = nameText;
  const stock = document.createElement("h5");
  stock.classList.add("col-2", "stock", "text-center");
  stock.textContent = stockText;
  const price = document.createElement("h5");
  price.classList.add("col-2", "price", "text-center");
  price.textContent = priceText;

  //buttons container
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("d-flex", "flex-column", "rouded", "col-2");

  //buttons
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    actions("delete", name.textContent);
  });
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.setAttribute("data-bs-toggle", "modal");
  editButton.setAttribute("data-bs-target", "#staticbackdrop");

  //edit event
  editButton.addEventListener("click", () => {
    $editButton.classList.remove("d-none");
    buttonAdd.classList.add("d-none");
    inputName.value = name.textContent;
    inputCant.value = stock.textContent;
    inputPrice.value = price.textContent;
    let id = name.textContent;
    cantidad = stock.textContent;

    const inputCamera = document.getElementById("camara");
    inputCamera.addEventListener("change", (e) => {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener("load", () => {
        image2 = reader.result;
        return image2;
      });
    });

    $editButton.addEventListener("click", () => {
      if (image2 == null) {
        actions(
          "edit",
          {
            imagen: img.src,
            nombre: inputName.value,
            precio: inputPrice.value,
            cantidad: inputCant.value,
          },
          id
        );
      } else if (image !== image2) {
        actions(
          "edit",
          {
            imagen: image2,
            nombre: inputName.value,
            precio: inputPrice.value,
            cantidad: inputCant.value,
          },
          id
        );
      } else if (image == image2) {
        actions(
          "edit",
          {
            imagen: img.src,
            nombre: inputName.value,
            precio: inputPrice.value,
            cantidad: inputCant.value,
          },
          id
        );
      }
      image2 = null;
    });
  });
  addElements(buttonsContainer, deleteButton, editButton);
  //add to div Principal div
  addElements(productsContainer, divIC, name, stock, price, buttonsContainer);
  addElements(documentFragment, productsContainer);
  addElements(containerP, documentFragment);
};

//SEARCH ELEMENTS
const inputSearch = document.getElementById("search");

//event that show the objets in the DOM
const buttonShow = document.querySelector(".show");
buttonShow.addEventListener("click", () => {
  containerP.innerHTML = "";
  if (inputSearch.value != "") {
    containerP.innerHTML = "";
    actions("search", inputSearch.value);
  } else {
    containerP.children.length >= 1
      ? ((containerP.innerHTML = ""), readObjects())
      : readObjects();
  }
  readIDBExcel();
});

//DELTE AND EDIT ELEMENTS IN IDB FROM PRODUCTS'S BUTTON

//funtion for delete elements in idb
const deleteIDB = (key, specific) => {
  const deleting = getIDB("readwrite", "multiple");
  if (specific == "multiple") {
    deleting.delete(key);
    window.location.reload();
  } else {
    deleting.delete(key);
    containerP.innerHTML !== ""
      ? ((containerP.innerHTML = ""), readObjects())
      : readObjects();
  }
};

//funtion for edit elements in idb
const editIDB = (obj, key) => {
  const editing = getIDB("readwrite");
  editing.put(obj, key);
  window.location.reload();
};

//EXPORTING CODE TO EXCEL
//funtion for read IDB especially for excel
const readIDBExcel = () => {
  const reading = getIDB("readonly");
  const cursor = reading.openCursor();
  cursor.addEventListener("success", (e) => {
    if (cursor.result) {
      createATable(
        cursor.result.value.nombre,
        cursor.result.value.precio,
        cursor.result.value.cantidad
      );
      cursor.result.continue();
    }
  });
};
//funtion what create tables
const table = document.createElement("table");
table.classList.add("border");
const prueba = document.querySelector(".prueba");
table.classList.add("tableInventory");
const containerTitlesTable = document.createElement("tr");
const titleTableName = document.createElement("th");
titleTableName.textContent = "Name";
const titleTablePrice = document.createElement("th");
titleTablePrice.textContent = "Price";
const titleTableStock = document.createElement("th");
titleTableStock.textContent = "Stock";
addElements(
  containerTitlesTable,
  titleTableName,
  titleTablePrice,
  titleTableStock
);
addElements(table, containerTitlesTable);
const createATable = (name, price, stock) => {
  const containerContet = document.createElement("tr");
  const nameTable = document.createElement("td");
  nameTable.textContent = name;
  const priceTable = document.createElement("td");
  priceTable.textContent = price;
  const stockTable = document.createElement("td");
  stockTable.textContent = stock;
  addElements(containerContet, nameTable, priceTable, stockTable);
  addElements(table, containerContet);
  addElements(prueba, table);
};
