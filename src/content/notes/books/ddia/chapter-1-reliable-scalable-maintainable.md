---
title: "Reliable, Scalable, and Maintainable Applications"
category: "books"
topic: "ddia"
order: 1
description: "Notes on Chapter 1 of Designing Data-Intensive Applications."
date: 2026-05-01
---

## Reliability

The system should continue to work correctly even in the face of adversity. This means hardware faults, software faults, and human errors.

- **Hardware faults**: add redundancy (disks, power, servers)
- **Software faults**: isolate failures, test thoroughly, monitor
- **Human errors**: good UX, sandbox environments, quick rollback

## Scalability

As the system grows in data volume, traffic, or complexity, there should be reasonable ways of dealing with that growth.

- Measure load with a **load parameter** (requests/sec, data size, etc.)
- Performance metrics: throughput, response time percentiles

## Maintainability

Three ingredients:

1. **Operability**: easy to keep running
2. **Simplicity**: easy for new engineers to understand
3. **Evolvability**: easy to change

Martin Kleppmann argues that removing accidental complexity is the main battle.
