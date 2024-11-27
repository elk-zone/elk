# Contribution Guideline

## Introduction

Thank you for considering contributions. This document describes the technology used in Masto.js and some useful information.

I will assume that you have basic TypeScript knowledge, so if you want to learn from the basics, I recommend that you refer to the official TypeScript or Node.js documentation.

## Technology and Tips

### Mastodon Types and Proxy API

In principle, Masto.js contains as little runtime code as possible in order to reduce bundle size.

All accesses to the Mastodon API (`masto.v1.statuses.create`, `masto.v1.accounts.$select`, etc.) are interpreted by a [Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and converted into an abstract object called `Action`.

The `Action` is converted to the corresponding URL in the layer described below, and the request is sent.

### Architecture

The architecture follows the class diagram below. In principle, interfaces and implementations are separated, with interfaces placed under `src/interfaces` and implementations placed in `src/adapters`.

[![](https://mermaid.ink/img/pako:eNqlVU1v4jAQ_SvIp5YC4qMhbIQqVUWr7aGrajlUWuVinAGsJnZqTxAU8d_XSWCbDyeLtLkkmryZNzNvxj4SJgMgHmEh1XrB6UbRyBcd82SWzhIUpyH_BNU55vb0mc-5QFBryuDh4ct8py_om9uCNYCa_VTkeGTIpVhwHVNk2-uYgjP6hmbOt95O8sAS-w1WS8neAZ-kWPPNNaEVaBnu4JXitlTGBvCF7h8RIYpRWyv5gRj_P1EEagO_4CMBjc-C4xvH7QLWNAlbaK8hNBWUiGKpK4aspWXtQkC7bMXWCmAorxKOso-Eq_KAsFDqf3Ask5Vmisep2EWaux0NTZ9K4RKhc_SqGNQ-1T8p8h08R3FYn8hXJfeHElm1gTSOw0OjJNW5rv63c_8tuc293vs8TI4pLO2832-pNhucFGJLx6JvCm2ibnDp97t2FXOP2u5fsrFXb4W3dOyrzJpn13gWdC40pNuaQiObPaKlJd32nCsKdhvkKZw1TZBKlGuVu4RsH7J8EJ9CDgK_0_RveVeYAor1BSyu1nwwKAdoalnK24QuF96Esu2ADesL0iPmAI4oD8y1mBXkE9xCBD7xzGdA1btPfHEyOJqgXB4EIx6qBHokiQNT8vkWJd6ahtpYYyqIdyR74o2mo4F77w4njvNtNnSGbo8ciDd2p4PZaOaMncnMcd3RxDn1yKeUJsJw4M6G4-nY-Izvncl0NOkRCLhJ9eV8baevjOJ35pDmcfoDWe-DdQ?type=png)](https://mermaid.live/edit#pako:eNqlVU1v4jAQ_SvIp5YC4qMhbIQqVUWr7aGrajlUWuVinAGsJnZqTxAU8d_XSWCbDyeLtLkkmryZNzNvxj4SJgMgHmEh1XrB6UbRyBcd82SWzhIUpyH_BNU55vb0mc-5QFBryuDh4ct8py_om9uCNYCa_VTkeGTIpVhwHVNk2-uYgjP6hmbOt95O8sAS-w1WS8neAZ-kWPPNNaEVaBnu4JXitlTGBvCF7h8RIYpRWyv5gRj_P1EEagO_4CMBjc-C4xvH7QLWNAlbaK8hNBWUiGKpK4aspWXtQkC7bMXWCmAorxKOso-Eq_KAsFDqf3Ask5Vmisep2EWaux0NTZ9K4RKhc_SqGNQ-1T8p8h08R3FYn8hXJfeHElm1gTSOw0OjJNW5rv63c_8tuc293vs8TI4pLO2832-pNhucFGJLx6JvCm2ibnDp97t2FXOP2u5fsrFXb4W3dOyrzJpn13gWdC40pNuaQiObPaKlJd32nCsKdhvkKZw1TZBKlGuVu4RsH7J8EJ9CDgK_0_RveVeYAor1BSyu1nwwKAdoalnK24QuF96Esu2ADesL0iPmAI4oD8y1mBXkE9xCBD7xzGdA1btPfHEyOJqgXB4EIx6qBHokiQNT8vkWJd6ahtpYYyqIdyR74o2mo4F77w4njvNtNnSGbo8ciDd2p4PZaOaMncnMcd3RxDn1yKeUJsJw4M6G4-nY-Izvncl0NOkRCLhJ9eV8baevjOJ35pDmcfoDWe-DdQ)

The main classes are described as follows

- `Serializer` - A class that converts from JavaScript objects to formats such as JSON and FormData, and vice versa. In addition, the conversion from SnakeCase to CamelCase is performed here.
- `ActionDispatcher` - In Masto.js, streaming subscriptions, HTTP requests, etc. are treated as abstract `Action` data structures, from which `ActionDispatchers` make the actual request.
- `Http` - The class that creates the HTTP communication, used to implement `mastodon.rest.Client`.
- `WebSocketConnector`: class for creating WebSocket instances, used in the implementation of `mastodon.streaming`.

### Testing

Masto.js uses both E2E tests and unit tests. In principle, we write mainly E2E tests, and use unit tests to cover only those areas that cannot be covered, such as exception handling.

In the Jest environment for E2E testing, an object called `session` is exposed in the global space, and you can easily obtain a test account by doing the following.

```typescript
// To simulate a single user
await using session = await sessions.acquire();
await session.rest.v1.statuses.$select("123").fetch();

// To simulate an interaction between two users
await using alice = await sessions.acquire();
await using bob = await sessions.acquire();
await alice.rest.v1.statuses.create({ status: `Hello @${bob.account.acct}` });
```

The tests are automatically run by CI, but if you need to check them locally, please refer to the GitHub Actions workflow in the repository to set up your environment. For other ways to write tests, please refer to the official Jest documentation.

## Review and Releases

Once you have verified your changes locally, create a Pull Request and have it reviewed by the author. If your changes are merged, they will be automatically released by the following 0:00 UTC.
