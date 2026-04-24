# Set

ES6(ECMAScript 2015)에서 도입된 고유한 값(중복 없는 값)들의 컬렉션을 저장하는 자료형

### 기본 특징

1. 중복 불가: 모든 값은 유일해야 함
2. 순서 보장: 삽입 순서가 유지됨
3. 빠른 검색: 값 존재 여부를 빠르게 확인 가능
4. 크기 추적: size 프로퍼티로 요소 개수 확인 가능

### 기본 용법

```javascript
const set = new Set();

// 값 추가
set.add(1);
set.add("text");
set.add({ a: 1 });
set.add(1); // 중복 추가는 무시됨

// 값 존재 여부 확인
console.log(set.has(1)); // true
console.log(set.has(2)); // false

// 값 삭제
set.delete("text");

// 크기 확인
console.log(set.size); // 2

// 전체 초기화
set.clear();
```

주로 배열과 객체를 많이 사용해서 개발하지만 특정 상황에 대해
배열을 대체하는 방식으로 Set을 활욯하면 좋음

### 배열 vs Set 주요 차이점

| 특징              | Array                 | Set                |
| ----------------- | --------------------- | ------------------ |
| 중복허용          | O                     | X                  |
| 순서 보장         | O                     | O(삽입순서 유지)   |
| 값 존재 여부 확인 | indexOf/includes 사용 | has() 메서드 사용  |
| 크기 확인         | length 프로퍼티       | size 프로퍼티      |
| 요소 접근 방식    | 인덱스 사용           | 순회로만 접근 가능 |

### 가장 흔한 사용법: 중복 제거

```javascript
// 배열로 초기화
const set = new Set([1, 2, 3]);

// 중복 제거된 배열 생성
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = [...new Set(arr)];
```

### 실전 예시: 태그 입력 인풋 컴포넌트

```tsx
"use client";
import { useState } from "react";

const TagInput = () => {
  const [tags, setTags] = useState < Set < string >> new Set();
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    // Set중복방지만 보면 체크가 불필요하지만, 입력창을 안비우는 용도
    if (inputValue && !tags.has(inputValue)) {
      setTags(new Set(tags).add(inputValue));
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    const newTags = new Set(tags);
    newTags.delete(tag);
    setTags(newTags);
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTag()}
      />
      <button onClick={addTag}>Add Tag</button>
      <div>
        {Array.from(tags).map((tag: string) => (
          <span key={tag} className="tag">
            {tag}
            <button onClick={() => removeTag(tag)}>x</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
```

### 실전 예시: 쇼핑몰 장바구니 데이터

```tsx
const Cart = () => {
  const [cartItems, setCartItems] = useState(new Set());

  const addToCart = (productId: string) => {
    // 이미 존재하는 상품은 추가하지 않음
    setCartItems((prev) => new Set(prev).add(productId));
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const newCart = new Set(prev);
      newCart.delete(productId);
      return newCart;
    });
  };

  return (
    <div>
      <h2>장바구니 ({cartItems.size}개 상품)</h2>
      <ProductList onAddToCart={addToCart} />
      <ui>
        {Array.from(cartItems).map((id) => (
          <CartItem
            key={String(id)}
            productId={id as string}
            onRemove={removeFromCart}
          />
        ))}
      </ui>
    </div>
  );
};
```

### 실전 예시: 소셜 서비스(또는 커뮤니티 서비스)의 좋아요 캐싱

```tsx
import { useState } from "react";

const LikeButton = ({ postId }: { postId: string }) => {
  const [likePosts, setLikePosts] = useState(() => {
    //localStorage에서 초기 값 로드
    const saved = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    return new Set(saved);
  });

  const isLiked = likePosts.has(postId);

  const toggleLike = () => {
    setLikedPosts((prev) => {
      const newLikes = new Set(prev);
      if (newLikes.has(postId)) {
        newLikes.delete(postId);
      } else {
        newLikes.add(postId);
      }

      // localStorage에 저장
      localStorage.setItem("likedPosts", JSON.stringify([...newLikes]));
      return newLikes;
    });
  };

  return (
    <button onClick={toggleLike} style={{ color: isLiked ? "red" : "gray" }}>
      +{isLiked ? "Liked" : "Like"}
    </button>
  );
};
```

Set으로 캐싱된 좋아요 목록을 통해 빠른 존재 여부 확인(has), 직렬화 저장 용이

### 이것만큼은 무조건 외워야 하는 개념: Set은 집합 연산 문제 해결에 좋음

```javascript
// 합집합
const union = new Set([...setA, ...setB]);

// 교집합
const intersection = new Set([...setA].filter((x) => setB.has(x)));

// 차집합
const difference = new Set([...setA].filter((x) => !setB.has(x)));
```

### Set 사용 시 주의 사항

키에 객체 자체{ a:1 }를 넣은 경우 각각은 서로 다른 참조가 되어 has 연산으로 false를 반환하지만,
객체를 담은 변수를 추가한 경우엔 해당 참조가 동일하여 true를 반환함

```javascript
const set = new Set();
set.add({ a: 1 });
set.has({ a: 1 }); // false (다른 객체 참조)

const obj = { a: 1 };
set.add(obj);
set.has(obj); // true (같은 객체 참조)
```

### Set 자료형 선택 기준

1. 중복 데이터를 허용하지 않아야 할 때
2. 값의 존재 여부를 빈번히 확인해야 할 때
3. 컬렉션의 정확한 크기를 자주 확인해야 할 때
4. 삽입 순서가 중요하면서 중복을 배제해야 할 때
5. 집한 연산이 필요할 때

Set은 이러한 요구사항이 있을 때 일반 배열보다 더 나은 성능과 코드 가독성을 제공
