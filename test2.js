// 1. await 后面调用的是一个方法，这个方法要返回的是 promise 对象
// 2. await 需要用在 async 的方法里面。
// 3. reject() 的参数，会作为 catch 里面 error 数据
// 4. resolve() 的参数， 会作为这个方法 使用 await 调用的时候的返回值

const sleep = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(123);
      resolve("真三"); // 告诉 await 我异步执行完成。

      // reject(new Error("我错了，真的错了"));
    }, 1000);
  });
};

// console.log(456);

// sleep().then(() => {
//   console.log(456);
// }).then().then().then()

const main = async () => {
  try {
    let str = await sleep();
    console.log(str);
    console.log(456);
  } catch (error) {
    console.log(error.message);
  }
};

main();
