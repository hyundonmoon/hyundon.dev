---
title: "Understanding CORS"
pubDate: "2021-06-10"
summary: "Trying to figure out what CORS is and how you can solve CORS-related problems"
language: "English"
---

While working on my [travel-companion finder project](https://travellrs.co), I encountered the CORS error multiple times. I had a basic grasp of CORS, and I knew what I had to do to work around it. Having said that, I also knew that I probably wouldn’t have been able to give a comprehensive answer on the subject if it came up during an interview. So, I decided to read a few articles on CORS and summarize them here to gain a deeper understanding of it.

### What is CORS?

CORS stands for Cross-Origin Resource Sharing. According to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), CORS is “an HTTP-header based mechanism that allows a server to indicate any other origins (domain, scheme, or port) than its own from which a browser should permit loading of resources”. In other words, it’s a mechanism that allows a site running on origin A to securely make requests for resources from origin B (cross-origin requests).

## Why do we need it?

Browsers implement a security policy called the same-origin policy for, well, security reasons. According to [MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), the same-origin policy requires that a script only interacts with resources loaded from a single origin. URLs have the same origin if they share the same domain, scheme, and port number. This policy can help stop the browser from loading malicious content from other servers without the user’s knowledge. But with the growth of web applications, cross-origin access to resources became necessary, and the CORS mechanism came to be.

## How does CORS work?

There are two types of CORS requests: **"simple"** and **pre-flighted** requests.

A **“simple” request** (which apparently is not an official term?) does not cause side effects on data stored in a server. A simple request meets the following criteria.

- Methods:
  - GET
  - HEAD
  - POST
- Manually set headers:
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type (with limits)
- Content-Type:
  - application/x-www-form-urlencoded
  - multipart/form-data
  - text/plain

A simple request contains the above data and a header called Origin, which shows where the request is sent from. The corresponding response will contain a header called Access-Control-Allow-Origin, which dictates whether the request will have access to the resource or not. A simple request does not involve other, additional requests and responses.

In contrast, a **pre-flighted request** involves a preliminary request, before the actual request for the resource is made. If a request does not meet the criteria for a simple request, the browser will automatically send an HTTP request using the OPTIONS method. The corresponding response determines whether or not to send a request with the actual request parameters. The automatically sent pre-flight request uses the OPTIONS method and sets several headers that tell the server what to expect from the actual request that follows.

- Access-Control-Request-Method: notifies server of the method with which the actual request will be sent

- Access-Control-Request-Headers: notifies server of headers that will be included in the actual request
- Origin

The server then responds with Access-Control-\* headers of its own.

- Access-Control-Allow-Origin: determines the domains that have access to a resource
- Access-Control-Allow-Methods: list of methods that can “ask” for the resource
- Access-Control-Allow-Headers: list of headers that can be used with the actual request
- Access-Control-Max-Age: determines the duration during which this response can be cached

The browser decides whether or not to send the real request with actual parameters based on this response. It’s worth noting that the real request will not contain the Access-Control-\* headers.

---

### Works Cited

Mozilla. (n.d.). Cross-Origin Resource Sharing (CORS) - HTTP: MDN. MDN Web Docs. [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Mozilla. (n.d.). Same-origin policy - Web security: MDN. MDN. [https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).

Steve Hobbs. What is CORS? Complete Tutorial on Cross-Origin Resource Sharing. Auth0. [https://auth0.com/blog/cors-tutorial-a-guide-to-cross-origin-resource-sharing/](https://auth0.com/blog/cors-tutorial-a-guide-to-cross-origin-resource-sharing/).
