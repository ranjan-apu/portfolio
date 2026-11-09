---
title: 'Idempotency Is a Workflow, Not Just a Request Header'
date: 2026-10-25
author: 'Apurba'
description: 'How to design retry-safe APIs with durable keys, transactional writes, leases, and an outbox—plus the failure cases a unique constraint cannot solve.'
tags: ['distributed-systems', 'backend', 'systems']
featured: true
draft: false
---

Imagine a client sends `POST /orders`. Your service commits the order, but the connection drops before the response reaches the client. The client sees a timeout. Did the order exist? It cannot know, so it retries.

If the endpoint treats every retry as a new command, you now have two orders. The problem was not a slow network: it was an **ambiguous outcome**.

An idempotent operation lets a caller retry the same intent without repeating the side effect. That sounds like one HTTP header, but the useful guarantee emerges from a complete lifecycle: identify the intent, reserve it, perform the work, remember the outcome, and recover when any step stops halfway.

## First, define what counts as the same request

An idempotency key should be **scoped to the caller or tenant** and represent one logical operation. A browser or mobile client can generate a random key for a checkout attempt, then reuse it for retries of that _same_ checkout. A new checkout uses a new key.

Store a digest of the canonicalized request alongside the key. If a client reuses a key with different contents, return a conflict instead of silently replaying an unrelated response.

```http
POST /orders
Idempotency-Key: 9b4b0a6f-8fd3-40ee-9e31-8b2b6dc9e2cb
Content-Type: application/json

{"cartId":"cart-42","currency":"INR"}
```

The key is an identifier, not a secret or a substitute for authorization. Do not let another account retrieve the original response merely by guessing or learning that key.

## Represent the lifecycle in durable storage

A single uniqueness rule is useful because competing retries may arrive simultaneously. A record with an explicit state also tells us what to do when the first attempt has not finished.

```sql
CREATE TABLE request_attempts (
  tenant_id       text NOT NULL,
  idempotency_key text NOT NULL,
  request_hash    text NOT NULL,
  status          text NOT NULL CHECK (status IN ('pending', 'completed')),
  response_body   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, idempotency_key)
);
```

In a database transaction, try to insert a `pending` record. The unique key makes **exactly one transaction** win the claim. When the same transaction can write the business entity and mark the attempt `completed`, those changes either commit together or roll back together.

The core logic, in pseudocode:

```text
BEGIN TRANSACTION
  claim (tenant, key, request hash), or find existing attempt

  if key exists with a different hash: return conflict
  if key exists and completed: return stored response
  if another request is processing it: return retryable status

  create order
  store response and mark attempt completed
COMMIT
return stored response
```

Actual implementations must handle transaction isolation and concurrent claims deliberately. For example, in PostgreSQL, an `INSERT ... ON CONFLICT DO NOTHING` can establish which transaction claimed the key; a conflicting insert may wait for the other transaction to finish. Avoid a separate read-then-insert outside a transaction, because two callers could both read “missing.”

## What happens while an attempt is pending?

There are two materially different situations. If all work and the status update are in **one short database transaction**, an uncommitted claim disappears if the process fails before commit. The retry can claim the key and try again. The transaction boundary is doing the recovery work.

For a long-running operation, the record often commits as `pending` before work finishes. Now a crash can leave it there forever. You need a lease or expiration policy, a worker that can resume, and a way to prevent a stale worker from committing after a newer one takes over. A monotonically increasing fencing token is one possible mechanism.

Do not solve that by deleting pending rows blindly after 30 seconds. A slow original attempt could still be running and produce two effects.

## The external side-effect trap

Transactions cannot atomically roll back an email provider, payment gateway, or message broker along with your SQL rows. Consider this sequence:

1. Charge the payment provider.
2. Lose the connection before recording success locally.
3. Retry the whole operation.

Your database key did not protect the external charge. The provider itself needs a stable idempotency identifier, or you need a reconciliation workflow with a uniquely identifiable external operation. For asynchronous downstream actions, a **transactional outbox** is often a better boundary: write the order and an outbox event in the same database transaction, then publish the event separately.

The outbox relay can publish the same event twice if it crashes after sending but before marking the row delivered. Consumers must still deduplicate using a durable event identifier. An outbox reduces lost messages; it does not magically deliver exactly once across every system.

## Decide how to answer a retry

An API contract should state the cases clearly:

| Observed state              | Response policy                                         |
| --------------------------- | ------------------------------------------------------- |
| No matching key             | Claim and process the request                           |
| Same key, different payload | `409 Conflict`                                          |
| Same key, completed         | Replay the saved result                                 |
| Same key, still processing  | `202 Accepted`, or a retryable `409` with `Retry-After` |
| Key expired                 | Treat according to a documented retention policy        |

The exact status code is a product decision. Consistency matters more than pretending one code fits every asynchronous workflow. If you replay a stored success, consider whether to include the original response status and useful headers too.

## Test failure windows, not just the happy path

Run two requests with the same key concurrently. Then inject a failure immediately before the business transaction commits, immediately after it commits, before the network response, and around any message publication. Verify that a retry does not create a second order, and that conflicting payloads are rejected.

Also test key scoping between tenants, retention expiry, a worker losing its lease, and a response large enough that storing it is undesirable. In that last case, you can persist a stable resource identifier and reconstruct a well-defined response, provided your API contract supports it.

Idempotency becomes dependable when the **state machine and the recovery path are explicit**. A header tells you which operation to protect; the rest of the system has to honor that identity all the way to the actual side effect.
