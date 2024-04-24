// 非纯，其内部调用saveUser方法时，使用了外部的 DB
const signUpImpure = (attrs) => {
  const user = saveUser(attrs);
  welcomeUser(user);
};

// 纯函数写法，这里从函数本身就可以看出，signUp方法将会使用到Db、Email以及attrs这三个依赖
// 同时，第一次调用时仅返回一个完成操作的函数，即，采用了延时执行的方式，使得这个函数变为一个纯函数
const signUp = (Db, Email, attrs) => () => {
  const user = saveUser(Db, attrs);
  welcomeUser(Email, user);
};

/*
 * 在这个例子中，显然使用纯函数的写法时，函数的可移植性更好，当我们需要使用不同的 Db 时，只需要将其传入即可
 * 而当我们想要在新的应用中使用这个函数时，只需要传入新的 Db 和 Email 就可以了
 */
