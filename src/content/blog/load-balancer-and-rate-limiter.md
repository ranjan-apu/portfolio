---
title: "Load Balancers and Rate Limiters: A Practical Intro"
date: 2026-08-14
author: "Apurba"
description: "How load balancers distribute traffic and how rate limiters protect your backend from being overwhelmed."
tags: ["systems", "backend", "distributed-systems"]
draft: false
---

When you run a web service, two problems show up quickly: **too much traffic hitting one server**, and **too many requests from a single client**. Load balancers solve the first; rate limiters solve the second. They are almost always used together.

## Load balancer: spread the work

A load balancer sits in front of your application servers and routes incoming requests to one of several healthy backends. The simplest strategies are:

- **Round-robin**: take turns
- **Least-connections**: send to the server with the fewest active requests
- **IP hash**: same client always hits the same backend (useful for sticky sessions)

Here is a minimal round-robin selector in Python:

```python
backends = ["10.0.0.1", "10.0.0.2", "10.0.0.3"]
idx = 0

def next_backend():
    global idx
    backend = backends[idx]
    idx = (idx + 1) % len(backends)
    return backend
    ◊
    # health check before routing
    def next_healthy_backend():
        attempts = len(backends)
        while attempts > 0:
            backend = next_backend()
            if is_healthy(backend):
                return backend
            attempts -= 1
        raise RuntimeError("no healthy backends")
```

Real load balancers like **Nginx**, **HAProxy**, or cloud LBs also handle SSL termination, health checks, retries, and geographic routing.

## Rate limiter: slow the flood

A rate limiter caps how many requests a client can make in a time window. Common algorithms:

| Algorithm | Idea | Use case |
|-----------|------|----------|
| Token bucket | Refill tokens at a fixed rate; each request consumes one | Bursty traffic, average rate enforced |
| Leaky bucket | Requests enter a queue and exit at a fixed rate | Smooth output rate |
| Fixed window | Count requests per clock window | Simple, cheap |
| Sliding window | Smooth count over the last N seconds | More accurate than fixed window |

A token bucket in TypeScript:

```ts
class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private capacity: number,
    private refillPerSecond: number
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  allow(): boolean {
    const now = Date.now();
    const delta = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + delta * this.refillPerSecond);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}
```

## Where they fit together

1. Traffic hits the **load balancer** first.
2. The LB forwards to an application server.
3. The app checks the **rate limiter** before doing expensive work.
4. If the client is over the limit, return `429 Too Many Requests`.

```
Client ──► Load Balancer ──► App Server ──► Rate Limiter ──► Database
                              │
                              └─ 429 if over limit
```

## Key takeaways

- Use a load balancer when you have **more than one server**.
- Use a rate limiter when you want to **protect resources** from abuse or accidents.
- In distributed systems, rate limiting usually needs a shared store like **Redis** so all servers see the same counters.

Both are cheap insurance. You do not need a massive scale to benefit from either.
