let observer = new IntersectionObserver((entries) => {
  console.log(entries);
});

observer.observe(document.getElementById("elementA"));
observer.observe(document.getElementById("elementC"));
