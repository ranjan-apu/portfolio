---
title: 'Designing Audit Trails You Can Actually Replay'
date: 2026-10-25
author: 'Apurba'
description: 'Why publishing an audit event is only the beginning: transaction boundaries, outbox delivery, stable identifiers, ordering and replay verification.'
tags: ['distributed-systems', 'backend', 'systems']
featured: false
draft: false
---

“We send every database change to Kafka” sounds like an audit trail. But the sentence hides several questions: What if the database commits and the event is lost? Can a consumer apply an event twice? What does replay mean when the schema has changed? And how do you know the reconstructed state is correct?

A useful audit system must do more than accumulate logs. It needs a **durable relationship between a business change and the record describing that change**. Below is a design exercise based on common event-driven patterns; it is not a disclosure of a particular internal production system.

## Start with the guarantee you need

An audit trail can serve several jobs: answer “who changed this record?”, reconstruct an entity's history, verify another copy of data, or meet a retention requirement. They are related, but they are not identical.

For replay-by-key verification, I would define a narrower contract first: given a stable entity ID and a sequence of ordered change events, we should be able to reconstruct a well-defined projection and compare it with the authoritative record. That immediately forces choices about event completeness, ordering and schema compatibility.

A generic event envelope might look like this:

```json
{
  "event_id": "d4f0f8bd-0e92-44c5-b5a5-a8eef458b123",
  "entity_type": "order",
  "entity_id": "order-42",
  "version": 7,
  "operation": "status_changed",
  "occurred_at": "2026-10-25T11:00:00Z",
  "schema_version": 1,
  "actor_id": "service-checkout",
  "payload": { "status": "packed" }
}
```

These are synthetic values. An event ID identifies a delivery, `entity_id` identifies the stream we want to replay, and `version` gives us a way to detect gaps or out-of-order application.

## The dual-write failure

Suppose an application updates an order in SQL and then publishes an event to Kafka. If it crashes between those steps, the order changed without an audit event. Reversing the order is no safer: the event could appear for a business transaction that later rolls back.

The **transactional outbox** pattern writes the domain change and a pending event in a single database transaction:

```sql
BEGIN;

UPDATE orders
SET status = 'packed', version = version + 1
WHERE id = 'order-42';

INSERT INTO outbox (event_id, entity_id, event_type, payload)
VALUES (
  'd4f0f8bd-0e92-44c5-b5a5-a8eef458b123',
  'order-42',
  'status_changed',
  '{"status":"packed"}'::jsonb
);

COMMIT;
```

This illustrates the atomic boundary; production code must verify that the `UPDATE` matched the intended row and capture the correct new entity version. An outbox relay then publishes committed rows. Change data capture (CDC) is another way to transport those committed changes.

The relay can crash _after_ publishing but _before_ recording delivery. When it restarts, the same event may be published again. That is why a durable `event_id` and consumer deduplication still matter. “Exactly once” in a broker configuration does not automatically extend to every database and downstream side effect.

## Ordering means ordering within a chosen scope

Total order across every entity is usually unnecessary and can become expensive. What matters for a replayable order history is preserving the logical order of events for **that order**.

Partitioning broker records by entity ID can help keep an entity's events together. But partition order alone is insufficient if multiple application writers assign conflicting versions or if an upstream producer sends old events late. Use an authoritative per-entity sequence, optimistic concurrency control, or another explicit ordering mechanism.

A consumer that has applied version `6` should expect `7`. Receiving `6` again is a duplicate; receiving `9` means there may be a gap. Do not casually apply `9` and report a verified history. You can buffer, fetch missing data, or flag the stream for reconciliation, depending on the product's consistency needs.

## Replay and verification are different operations

Replaying events builds a projection. **Verification** asks whether that projection agrees with something authoritative. If the event payload only says “status changed” without the new value, replay cannot reconstruct status on its own. If an entity was created before your audit service existed, you may need a snapshot or a clearly defined coverage start point.

For a practical replay process:

1. Select an entity ID and trusted starting snapshot or creation event.
2. Fetch its events and deduplicate by stable event ID.
3. Enforce increasing entity versions and detect gaps.
4. Upcast older payload versions into a supported representation.
5. Apply events to an isolated projection; never replay into the live primary by accident.
6. Compare selected deterministic fields with the authoritative state and report differences.

Do not compare an entire JSON document naïvely when it contains volatile timestamps, unordered arrays or fields that are intentionally excluded from the projection. Define what “same state” means for the entities you audit.

## Treat audit data as sensitive data

An audit stream often records identifiers, personal information and operational actions. Logging the full before/after object may violate least-privilege principles and make retention impossible to manage. Prefer a designed event schema, restricted access, redacted or tokenized sensitive fields and explicit retention rules. Also consider tamper detection and who can modify the audit store.

If you need a legal or regulatory audit guarantee, agree on it with the relevant security and compliance teams; a replayable technical log does not, by itself, satisfy every such requirement.

## What I would monitor

Operational visibility should include outbox age, publish lag, consumer lag, duplicate count, version gaps, failed schema upcasts and reconciliation mismatches. A healthy Kafka cluster does not prove that audit coverage is complete; those application-level signals are closer to the guarantee users actually need.

The central design choice is to make **every gap observable**. If a team can detect a missing event, distinguish duplicates from conflicts and explain a replay mismatch, the audit trail becomes an engineering tool rather than a comforting collection of messages.
