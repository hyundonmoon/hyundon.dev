---
title: "Web Storage API"
pubDate: "2023-06-29"
summary: "Exploring the Web Storage API and how it enables persistent client-side data storage in web applications"
language: "Korean"
---

## Web Storage API란

Web Storage API는 브라우저에 키/값 형태로 데이터를 저장할 수 있는 메커니즘을 제공한다. Web Storage API가 제공하는 Storage 객체는 페이지 로드 후에도 그대로 브라우저에 남아있다는 특징이 있다. Storage 객체의 키와 값은 항상 String 형태이며, String이 아닌 값을 Value로 저장하면 자동으로 String 형태로 변경된다.

## localStorage & sessionStorage

Web Storage API가 제공하는 데이터 보관 메커니즘에는 두 가지 종류가 있다. **sessionStorage는** 특정 origin (scheme, domain, port), 특정 브라우저 및 탭에 종속되는 특징을 갖는다. 현재 보고 있는 페이지가 refresh 되더라도 sessionStorage는 남아있다. 다만, 같은 페이지를 두 개의 탭에 열 경우, 탭별로 별개의 sessionStorage가 생성되는 특징이 있다. sessionStorage는 해당 탭 또는 브라우저가 종료될 때 삭제된다.

**localStorage는** sessionStorage와 동작 방식은 같지만, 특정 탭에 종속되지 않아 같은 브라우저에서 같은 페이지를 여러 번 열 때 동일한 로컬 스토리지 객체에 접근이 가능하다는 특징이 있다. 그 외에도 sessionStorage와 달리 localStorage는 JavaScript 또는 브라우저에서 데이터를 삭제하지 않는 이상 영구적으로 보존된다는 특징이 있다.

## Storage 객체

sessionStorage와 localStorage 모두 Storage 객체를 활용하기 때문에 동일한 API를 갖는다.

- `getItem(key: string)` -> Storage 객체에서 특정 키 값에 저장된 값을 불러옴
- `setItem(key: string)` -> Storage 객체에서 특정 키에 새로운 값을 저장하거나, 기존에 있던 값을 덮어씌움
- `removeItem(key: string)` -> 주어진 키 값을 Storage 객체에서 제거함
- `clear()` -> Storage 객체를 통째로 비움
- `key(n: number)` -> Storage 객체에 저장된 n 번째 키를 return함

## StorageEvent

StorageEvent는 특정 Storage 객체에 변화가 있을 때 발생한다. 이때, 객체를 바꾼 페이지에서는 해당 이벤트가 발생하지 않지만, 같은 객체에 접근이 가능한 다른 페이지에서는 이벤트가 발생한다. 예를 들어, 같은 페이지를 A, B 탭에서 보고 있을 때, A 탭에서 Storage에 새로운 값을 추가하면 A 탭에서는 StorageEvent가 발생하지 않지만, B 탭에서는 StorageEvent가 발생한다. 특정 탭에 종속되는 sessionStorage의 경우 해당 이벤트가 발생하지 않고 여러 탭을 걸쳐 같은 Storage 객체가 유지되는 localStorage에서만 해당 이벤트를 사용할 수 있다. StorageEvent를 활용하면 같은 페이지를 바라보고 있는 여러 탭 간 변화에 맞춰 동기화가 가능해진다.

StorageEvent는 다음 property를 포함한다.

- `key`: 변경된 Storage 아이템의 키값
- `oldValue`: 변경 전 값 (첫 변경이면 null)
- `newValue`: 변경 후 값 (삭제되었다면 null)
- `storageArea`: 변경된 Storage 객체
- `url`: Storage 변경이 발생한 Document의 url

## 쿠키와의 차이

Web Storage API가 도입되기 전까지는 브라우저에 데이터를 저장하는 유일한 방법은 쿠키뿐이었다. 하지만 쿠키는 매번 서버에 전달되고, 아주 적은 양의 데이터만을 보관할 수 있다는 한계가 존재한다. Web Storage API는 쿠키가 갖는 이런 한계를 극복하고자 도입되었다.

우선, localStorage와 sessionStorage는 쿠키 대비 훨씬 많은 양의 데이터를 저장할 수 있다. 쿠키는 최대 4,096바이트만을 저장할 수 있지만, localStorage는 약 5MB의 데이터를 저장할 수 있고, sessionStorage는 시스템에 따라 그보다 더 많은 데이터를 저장할 수 있다.

서버가 쿠키를 생성할 수 있고, HTTP 요청 시 쿠키가 서버에 매번 전달되는 반면, 서버는 localStorage와 sessionStorage에 접근할 수 없다.

쿠키는 Max-Age, Expires 속성 등이 포함되면 정해진 기간이 지날 때 삭제된다. 해당 속성이 지정되지 않으면 쿠키는 브라우저 세션이 종료될 때 삭제된다. sessionStorage도 브라우저 세션이 종료될 때 삭제되긴 하지만, localStorage의 경우 유저가 직접 브라우저를 통해 지우거나, 또는 JavaScript를 통해 데이터를 삭제하지 않는 이상 영구적으로 보존된다.

쿠키는 워낙 오래된 메커니즘이다 보니 데이터를 저장하고, 수정하고, 삭제하는 방법이 매우 불편하다. 그에 반해 Web Storage API는 데이터를 저장하고, 덮어쓰고, 삭제하는 메소드를 제공한다.

## 참고자료

- MDN. [StorageEvent][1]

- MDN. [Using the web storage API][2]

- MDN. [Web storage API][3]

- HTML Standard. [Web storage][4]

[1]: https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
[3]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
[4]: https://html.spec.whatwg.org/multipage/webstorage.html#introduction-15
