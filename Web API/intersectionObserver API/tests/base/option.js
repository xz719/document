let flag = 0

let observer = new IntersectionObserver((entries) => {
  if (!flag) {
    flag = 1
    return
  }
  console.log(entries);
},
{
    threshold: [0, 0.25, 0.75, 1]
});

observer.observe(document.getElementById("elementA"));
