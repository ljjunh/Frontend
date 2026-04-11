// 문제 1
const obj = {
  name: "Alice",
  greet: function () {
    console.log(this.name);
  },
};

const fn = obj.greet;
fn();

// fn에 obj.greet를 넣으면 그냥 함수가 할당됨
// 그리고 fn을 실행하면 전역객체에서 name을 찾고 undefined 출력

// 문제 2
const obj2 = {
  name: "Alice",
  greet: () => {
    console.log(this.name);
  },
};
obj2.greet();
// greet는 화살표 함수기때문에 this가 호출위치가 아닌
// 정의된 위치의 상위 스코프를 따름
// 상위 스코프 = 전역 -> this = window -> undefined

// 문제 3
function Person3(name) {
  this.name = name;
  this.greet = function () {
    console.log(this.name);
  };
}
const alice3 = new Person3("Alice");
const fn3 = alice3.greet;
fn3();
// undefined
// new 생성자로 빈객체를 만들고 Person3의 프로토타입과 연결
// fn3에 alice3.greet함수만 할당
// fn3()는 전역에서 실행시키고 greet는 일반함수여서 window.name = undefined

// 문제 4
function Person4(name) {
  this.name = name;
  this.greet = () => {
    console.log(this.name);
  };
}
const alice4 = new Person4("Alice");
const fn4 = alice4.greet;
fn4();

// alice4를 생성자 함수로 만들면
// Person4의 프로토타입과 연결되고 this.name엔 Alice가 들어감
// 그리고 greet가 생성될때 this는 alice4고
// 함수만 빼서 fn4에 할당하더라도 화살표함수라서
// this는 정의된 시점의 상위스코프 따르고 실행하면 'Alice'가 출력됨

// 문제 5
const obj5 = {
  name: "Alice",
  outer: function () {
    const inner = () => {
      console.log(this.name);
    };
    inner();
  },
};

obj5.outer();
// inner는 화살표 함수라서 상위 스코프의 this를 따름
// 상위 스코프 = outer 함수
// outer의 this = obj5 (obj5가 호출했으니가)
// inner의 this = obj5 -> obj5.name = 'Alice'
