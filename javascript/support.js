"use strict";

const question = document.querySelector(".question");
const main = document.querySelector(".select");
const formA = document.querySelector(".Actions");

const selecImage = document.querySelector(".select-image");
const selectVideo = document.querySelector(".select-video");
const file = document.querySelector(".files");
const buttonEvidencia = document.querySelector(".evidencia");
const inputFiles = document.getElementById("input-files");
const containerFiless = document.querySelector(".container-files");
const containerShow = document.querySelector(".multimedia");
const modalV = document.querySelector(".modal-bodyV");
const titleV = document.querySelector(".modal-titleV");

const changeColor = (obj, color) => {
  obj.style.color = `${color}`;
};

const documentFS = document.createDocumentFragment();

const showAr = (url, name) => {
  const containerSfiles = document.createElement("div");
  containerSfiles.classList.add(
    "d-flex",
    "justify-content-center",
    "align-items-center",
    "border-bottom",
    "Sfile"
  );
  const divI = document.createElement("div");
  divI.classList.add("col-2", "d-flex", "justify-content-center");

  const i = document.createElement("i");
  i.classList.add("fas", "fa-image");
  divI.appendChild(i);

  const imageName = document.createElement("p");
  imageName.classList.add("mx-auto", "my-auto", "col-6");
  imageName.textContent = name;

  const divDV = document.createElement("div");
  divDV.classList.add("d-flex", "col-4", "mx-auto");

  const download = document.createElement("a");
  download.setAttribute("href", url);
  download.setAttribute("download", "true");
  download.classList.add("me-2");
  download.textContent = "download";
  divDV.appendChild(download);

  const visualizar = document.createElement("p");
  visualizar.textContent = "visualizar";
  visualizar.classList.add("my-auto");
  visualizar.setAttribute("data-bs-toggle", "modal");
  visualizar.setAttribute("data-bs-target", "#exampleModal");
  visualizar.addEventListener("click", () => {
    titleV.innerHTML = "";
    modalV.innerHTML = "";
    const imgV = document.createElement("img");
    imgV.setAttribute("src", url);
    titleV.textContent = name;
    modalV.appendChild(imgV);
  });
  divDV.appendChild(visualizar);

  containerSfiles.appendChild(divI);
  containerSfiles.appendChild(imageName);
  containerSfiles.appendChild(divDV);
  documentFS.appendChild(containerSfiles);

  containerShow.appendChild(documentFS);
};

const dropImage = (ar, name) => {
  const reader = new FileReader();
  reader.readAsDataURL(ar);
  reader.addEventListener("load", (e) => {
    let url = URL.createObjectURL(ar);
    showAr(url, name);
  });
};

const dropVideo = (ar) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(ar);
  reader.addEventListener("load", (e) => {
    let video = new Blob(new Uint8Array(ar), { type: "video/mp3" });
    let url = URL.createObjectURL(video);
  });
};

selecImage.addEventListener("click", (e) => {
  e.preventDefault();
  containerFiless.classList.remove("d-none");
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-images");
  inputFiles.textContent = "Choose the images";
  file.appendChild(icon);
  buttonEvidencia.classList.add("d-none");

  icon.addEventListener("dragover", (e) => {
    e.preventDefault();
    changeColor(icon, "#ccc");
  });

  icon.addEventListener("dragleave", (e) => {
    e.preventDefault();
    changeColor(icon, "#000");
  });

  icon.addEventListener("drop", (e) => {
    e.preventDefault();
    changeColor(icon, "#ccc");
    dropImage(e.dataTransfer.files[0], e.dataTransfer.files[0].name);
  });
});

selectVideo.addEventListener("click", (e) => {
  e.preventDefault();
  containerFiless.classList.remove("d-none");
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-video");
  file.appendChild(icon);
  buttonEvidencia.classList.add("d-none");
  inputFiles.textContent = "Choose one video";

  icon.addEventListener("dragover", (e) => {
    e.preventDefault();
    changeColor(icon, "#ccc");
  });
  icon.addEventListener("dragleave", (e) => {
    e.preventDefault();
    changeColor(icon, "#000");
  });
  icon.addEventListener("drop", (e) => {
    e.preventDefault();
    changeColor(icon, "#ccc");
    dropVideo(e.dataTransfer.files[0]);
  });
});

inputFiles.addEventListener("change", (e) => {
  const reader = new FileReader();
  let fName = e.currentTarget.files[0].name;
  console.log(e.currentTarget.files[0].name);
  reader.readAsDataURL(e.currentTarget.files[0]);
  reader.addEventListener("load", () => {
    showAr(reader.result, fName);
  });
});
