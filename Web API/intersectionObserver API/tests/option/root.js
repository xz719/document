var opts = {
  root: document.querySelector(".container"),
};

let flag = 0

let observer = new IntersectionObserver((entries) => {
  console.log(entries);
}, opts);

observer.observe(document.getElementById("elementA"));
