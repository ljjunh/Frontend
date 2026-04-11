// 문제 1
let a = 10;
let b = a;
b = 20;

console.log(a);
console.log(b);

// 정답 : a = 10, b = 20
// 원시타입은 값 자체가 복사됨 b를 바꿔도 a는 영향 없음

// 문제 2
let obj1 = { num: 10 };
let obj2 = obj1;
obj2.num = 20;

console.log(obj1.num);
console.log(obj2.num);

// 정답 20, 20
// 참조타입은 참조(주소)가 복사됨 obj2는 obj1과 같은 메모리르 가리킴
// obj2.num 바꾸면 obj1.num도 같이 바뀜

// 문제 3
let x = "hello";
let y = x;
y = "world";

console.log(x);
console.log(y);

// 정답 'hello' 'world'
// string도 원시타입이라 값 자체 복사

let obj11 = { num: 10 };
let obj12 = { num: 10 };

console.log(obj11 === obj12);

// 정답 false
// 값이 같아도 서로 다른 메모리를 가리킴
// 객체는 참조 비교라서 참조(주소)가 다르면 False

let obj111 = { num: 10 };
let obj222 = obj111;

console.log(obj111 === obj222);
// 정답 true
// 같은 주소를 가리킴. 참조 비교에서 같은 주소면 true

let obj1111 = { num: 10 };
let obj2222 = obj1111;

obj2222 = { num: 10 };

console.log(obj1111 === obj2222);
// 정답 false
// obj2222에 새로운 객체를 만들어서 할당
// obj2222가 가리키는 주소가 바뀜
