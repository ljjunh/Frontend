# 원시타입 데이터

원시 타입은 객체가 아니며 메서드를 가지지 않는 기본적인 데이터 타입

1. number

- 숫자 타입 (정수, 실수 모두 포함)
- 예 : 42, 3.14, NaN, Infinity

2. string

- 문자열(텍스트 데이터)
- 예 : 'hello', 'world', `템플릿 리터럴`

3. boolean

- 논리값(true or false)

4. undefined

- 값이 할당되지 않은 변수의 기본 값
- 예 : let x; -> undefined

5. null

- 의도적으로 '값이 없음'을 나타냄
- 예 : let y = null;

6. symbol (ES6 추가)

- 고유하고 변경 불가능한 식별자
- 예 : const sym = Symbol('description);

* BigInt(ES2020 추가)

- 아주 큰 정수를 저장할 수 있는 타입
- 예 : 1234567890122345678901234567890n

원시 타입은 변경 불가능(Immutable)하며, 변수에 할당될 때 값 자체가 복사

```
let a = 10;
let b = a; // 값 복사 (깊은 복사와 유사)

b = 20; // b를 변경해도 a는 영향받지 않음
console.log(a); // 10 (변화 없음)
console.log(b); // 20
```

반면 객체는 참조(주소)가 복사되는 방식

```
// 객체는 참조(주소)가 복사됨 (얕은 복사)
let obj1 = { num: 10 };
let obj2 = obj1; // 참조 복사

obj2.num = 20; // obj1도 같이 변경됨
console.log(obj1.num); // 20 (함께 영향 받음)
```
