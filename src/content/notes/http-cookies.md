---
title: "HTTP 쿠키"
pubDate: "2023-06-28"
summary: "HTTP Cookie 알아보기"
language: "Korean"
---

## HTTP Cookie란

HTTP 쿠키란 서버가 Set-Cookie HTTP 응답 헤더를 통해 클라이언트에 전달 및 저장한 정보를 가리킨다. 서버가 Set-Cookie 헤더를 통해 클라이언트에 전송한 정보는 브라우저에 저장되며, 추후 해당 서버로 보내는 모든 요청에 해당 서버가 전송한 모든 쿠키가 포함된다.

HTTP 프로토콜은 기본적으로 Stateless 하지만, 쿠키를 사용함으로써 특정 세션이나 유저와 관련된 State를 서버가 유지할 수 있게 된다. 따라서 쿠키는 HTTP 환경에서 이루어지는 상태 관리 메커니즘이라고 볼 수 있다.

HTTP 쿠키에 인증과 관련된 정보를 저장하면 HTTP 요청이 발생할 때마다 매번 유저가 인증해야 하는 수고를 덜 수 있다. 유저의 환경설정과 관련된 정보(ex: theme, language 등)를 쿠키에 저장하면 사용자가 다음에 다시 방문했을 때 개인화된 경험을 제공할 수 있다. 또한, 유저 관련 정보를 기록하고 분석하는 데 쓰일 수 있다.

## HTTP Cookie 속성 및 Prefix

서버가 쿠키를 생성하기 위해 사용하는 Syntax는 다음과 같다.

`Set-Cookie:<name>=<value>`

서버는 필요시 한 개 이상의 Set-Cookie 헤더를 응답에 포함할 수 있다. 이 외에도 쿠키 생성 시 그와 관련된 속성을 명시할 수 있으며, 쿠키 이름에 특정 Prefix를 포함해 쿠키가 반드시 특정 속성을 포함하도록 할 수 있다.

### 속성

쿠키의 속성을 통해 쿠키의 사용 범위, 유효 기간, 접근 권한 등을 제한할 수 있다.

#### Expires

예시: `Expires=Sun, 01-Jul-2023 12:00:00 GMT`

해당 속성을 사용해 쿠키의 유효기간을 명시할 수 있다. UTC 형식으로 날짜를 지정할 수 있는데, 이 날짜가 지나면 쿠키가 삭제된다. 명시된 유효기간에 쿠키가 삭제되는 것은 서버 시간 기준이 아니라 브라우저 시간 기준이다. 따라서 사용자가 브라우저의 시간을 바꾸면 실제로는 유효기간이 지났어도 쿠키가 그대로 살아있는 문제가 생길 수 있다.

#### Max-Age

예시: `Max-Age=3600`

해당 속성은 Expires 속성과 마찬가지로 쿠키의 수명을 정하지만, 특정 날짜가 아니라 브라우저가 해당 쿠키를 받았을 때부터의 유효 기간을 초 단위로 지정한다. 0 또는 음수를 지정하면 해당 쿠키는 곧바로 만료된다. 브라우저가 받고 나서 지정된 시간이 지나면 바로 만료되기 때문에 유저가 브라우저 시간을 조작해서 유효 기간을 무력화할 수 있는 Expires 속성의 한계를 보완한다. Expires와 Max-Age 속성이 모두 명시되어 있는 경우, Max-Age가 우선권을 갖는다.

Expires, Max-Age 속성이 모두 누락된 쿠키는 session cookie라고 부르며 브라우저 세션이 종료될 때 만료된다. Expires, Max-Age 속성이 하나라도 있는 경우 permanent cookie라고 부르며 해당 속성에 맞는 수명을 갖게 된다.

#### Domain

예시: `Domain=example.com`

해당 속성은 어느 도메인으로 보내는 요청에 특정 쿠키가 포함될지 명시한다. Domain 속성을 쿠키에 포함하면 해당 도메인과 서브 도메인이 쿠키의 사용 범위로 지정된다. Domain 속성이 누락될 경우, 쿠키가 생성된 도메인으로 범위가 제한되며 서브 도메인은 유효 범위에 포함되지 않는다. Domain 속성을 포함할 때, 쿠키를 생성하는 도메인이나 그 서브 도메인만 명시할 수 있고, 그 외 나머지 도메인은 허용되지 않는다. 쿠키가 사용될 도메인을 제한함으로써 불필요한 도메인에서 쿠키에 접근하는 것을 방지할 수 있다.

#### Path

예시: `Path=/abc`

해당 속성을 통해 쿠키의 유효 범위를 특정 경로로 제한할 수 있다. Path 속성에 명시된 경로가 포함된 URL로 요청을 보낼 때만 쿠키가 포함된다. Path 속성의 값을 "/abc"라고 지정할 경우, "/abc", "/abc/", "/abc/def"에 대한 요청에는 쿠키가 포함되지만, "/abcd", "/xyz/abc"에 대한 요청에는 쿠키가 포함되지 않는다. Domain 속성과 마찬가지로 Path 속성을 지정함으로써 쿠키가 사용될 경로를 제한하고, 불필요한 접근을 막을 수 있다.

#### SameSite

해당 속성은 cross-site 요청 시 쿠키를 포함할 지 말지를 명시한다. SameSite 속성에 지정할 수 있는 값은 다음과 같다.

- Strict: 이 값이 지정될 경우, 브라우저는 쿠키가 생성된 Site와 같은 Site에서 발생한 HTTP 요청(same-site request: same scheme, same domain)의 경우에만 쿠키를 포함한다. 요청이 발생한 곳과 쿠키가 생성된 서버의 Domain이나 Scheme이 다를 경우 쿠키가 포함되지 않는다. 쉽게 말해, 지금 URL 바에 있는 Site와 HTTP 요청의 Site가 같을 경우 쿠키가 포함되고, 그렇지 않은 경우에는 포함되지 않는다.

- Lax: 이 값이 지정될 경우, 쿠키가 생성된 same-site request 외에도 외부에서 쿠키가 생성된 Site로 이동할 때(**top-level navigation**) 쿠키가 요청에 포함된다. 예를 들어, *abc.com*이라는 웹 사이트에 SameSite 속성이 Lax로 지정된 쿠키가 있고, 이 웹 사이트의 이미지와 내용을 *xyz.com*이라는 웹 사이트가 참조한다고 가정하자. 이때 *xyz.com*에서 해당 이미지를 불러오기 위해 *abc.com*에 요청을 보낼 때는 쿠키가 포함되지 않지만, 유저가 링크를 눌러 *xyz.com*에서 *abc.com*으로 이동할 때는 쿠키가 포함된다. SameSite 속성이 지정되지 않을 경우, Lax가 기본값이 된다. Strict와 마찬가지로 SameSite 속성이 Lax로 지정된 쿠키의 경우 cross-site request에는 포함되지 않는다.

- None: 이 값이 지정될 경우, same-site request 외에도 모든 cross-site request에서 쿠키가 포함된다. 위의 예시에서 쿠키의 SameSite 속성이 Lax가 아니라 None이었다면, xyz.com에서 abc.com의 이미지를 불러올 때도 쿠키가 포함된다. 이런 작동 방식은 보안 위험이 있을 수 있기 때문에 반드시 Secure 속성과 함께 명시되어야 한다.

#### Secure

해당 속성은 쿠키가 암호화된 HTTPS 통신을 통해서만 전송되도록 제한한다. HTTPS 통신으로 웹 페이지에 접속했을 경우에만 쿠키가 전송되기 떄문에 Secure 속성을 사용하지 않는 쿠키보다는 상대적으로 안전한다. `<속성이름>=<속성값>` 형태를 따르는 다른 속성들과는 달리 쿠키 생성 시 속성 이름만 명시한다.

#### HttpOnly

해당 속성은 브라우저에서 JavaScript를 사용해 쿠키에 접근하는 것을 막는다. 따라서 이 속성이 적용된 쿠키는 Document.cookie 등을 활용해도 접근하지 못한다. 서버가 생성한 쿠키가 아닌 JavaScript로 생성된 쿠키는 해당 속성을 포함할 수 없다.

### Prefixes

쿠키 속성 이외에도 쿠키 이름에 “\_\_Secure-” 또는 “\_\_Host-” Prefix를 더하는 방법을 통해 쿠키의 보안을 확보할 수 있다. 해당 Prefix를 사용하면 반드시 쿠키에 특정 속성들이 추가되어야만 하도록 제한해서, 공격자들이 쿠키에 접근을 하거나 쿠키를 덮어씌우는 것을 방지할 수 있다.

- \_\_Secure-: 해당 Prefix가 쿠키 이름에 사용된 경우, 쿠키에 반드시 Secure 속성이 포함되어야 한다. 따라서 해당 쿠키는 암호화된 HTTPS를 사용하는 웹 사이트에서만 접근할 수 있다. HTTP 사이트는 이 쿠키를 읽을 수도 없고, 동일한 이름을 갖는 쿠키를 만들 수도 없다.

- \_\_Host-: 해당 Prefix가 쿠키 이름에 사용된 경우, Domain 속성이 누락되어야 하고, Path는 “/” 값으로 지정되어야 하며, Secure 속성이 반드시 포함되어야 한다. 해당 속성들을 포함한 쿠키는 쿠키가 생성된 도메인에서만 접근이 가능하다. 서브도메인에서는 해당 쿠키를 접근하거나 덮어쓸 수 없다.

## 쿠키 사용 시 유의할 점

쿠키는 데이터를 서버에 저장하지 않고 유저의 컴퓨터에 저장한다는 점에서 서버의 부담을 줄여주는 등 여러 이점이 있지만 쿠키 사용 시 유의해야 할 점들 또한 존재한다.

우선, 쿠키는 애초에 많은 양의 데이터를 저장할 수 있도록 설계되지 않았다. 보다 많은 양의 데이터를 브라우저에서 관리하기 위해서는 Web Storage API 등 대체재들이 존재한다.

쿠키는 HttpOnly 등 속성을 사용하지 않는 이상, JavaScript로 유저가 얼마든지 접근할 수 있어서 변조되거나 삭제되기 쉽다. Secure, Domain 등 속성을 조합해 보안을 확보하지 않은 쿠키는 유저뿐만 아니라 중간에 가로채 데이터를 조작하는 것도 가능하다. 따라서 전달받은 쿠키가 유효한지 아닌지를 판단하는 검증 단계가 필요하다.

또한, 쿠키가 필요 여부와 관계없이 모든 HTTP 요청에 포함되기 때문에 불필요한 트래픽을 발생시킨다. 따라서 쿠키를 남발하는 것을 지양해야 하며, Expires와 Max-Age 속성을 적절히 활용해 필요한 만큼만 쿠키가 살아있도록 관리해야 한다.

## 참고자료

- The Chromium Projects. [Cookie Legacy SameSite Policies][1]
- http.dev. [HTTP cookies][2]
- Langkemper, S. [Securing cookies with cookie prefixes][3]
- Lock, A. [Understanding samesite cookies][4]
- Merewood, R. [Samesite Cookies explained][5]
- Merewood, R. [Understanding cookies][6]
- MDN. [Set-cookie][7]
- MDN. [Using HTTP cookies][8]

[1]: https://www.chromium.org/administrators/policy-list-3/cookie-legacy-samesite-policies/
[2]: https://http.dev/cookies
[3]: https://www.sjoerdlangkemper.nl/2017/02/09/cookie-prefixes/
[4]: https://andrewlock.net/understanding-samesite-cookies/
[5]: https://web.dev/i18n/en/samesite-cookies-explained/#explicitly-state-cookie-usage-with-the-samesite-attribute
[6]: https://web.dev/understanding-cookies/
[7]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
[8]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
