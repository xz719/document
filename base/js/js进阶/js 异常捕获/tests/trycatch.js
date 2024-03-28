function fn() {
  console.log("fn->s");
  error;
  console.log("fn->e");
}

setTimeout(() => {
  try {
    fn();
  } catch (error) {
    console.log("catch", error);
  }
});
