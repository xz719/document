let observer = new IntersectionObserver((entries) => {
  entries.forEach((item) => {
    console.log(item)
  })
});

observer.observe(document.getElementById("elementA"));
observer.observe(document.getElementById("elementC"));
