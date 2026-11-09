---
title: 'How I Would Evaluate a RAG Assistant Before Trusting Its Answers'
date: 2026-10-25
author: 'Apurba'
description: 'A practical evaluation framework for retrieval, citations, refusals, document freshness and end-to-end RAG quality, with a small reproducible scoring example.'
tags: ['ai', 'rag', 'systems']
featured: false
draft: false
---

A retrieval-augmented generation (RAG) demo is easy to make convincing: upload a PDF, ask a question that appears verbatim in the document, and watch the model cite an answer. That test says very little about how the system behaves when a document is stale, two policies conflict, or the answer is simply absent.

For an assistant that influences a real decision, I would evaluate three things separately: **did we retrieve the right evidence, did the model use it faithfully, and did the experience make uncertainty visible?** The method below is a general blueprint, not a report of unpublished production experiments.

## Build questions from actual tasks

Start with the questions the audience would ask, then construct a small labeled set that covers both ordinary and adversarial situations. A useful initial sample might have 40–60 reviewed questions, expanded as failures appear; that number is a starting suggestion, not a statistical guarantee.

I would include at least these types:

- **Direct lookup:** a single paragraph contains the answer.
- **Synthesis:** an answer needs evidence from two sections or documents.
- **Version conflict:** an older policy disagrees with the current policy.
- **Unanswerable:** no authorized source contains the answer.
- **Ambiguous:** the question omits a store, jurisdiction, date or product variant.
- **Permission boundary:** a relevant document exists but this user must not access it.

For each case, store the question, authorized corpus snapshot, document IDs containing relevant evidence, a human-written answer rubric, and an explicit `answerable` flag. A reference answer can help graders, but it should not force one narrow wording as the only correct answer.

```json
{
  "id": "policy-014",
  "question": "Which return period applies to this item?",
  "answerable": false,
  "required_context": ["item category", "region", "purchase date"],
  "evidence_doc_ids": [],
  "expected_behavior": "Ask for missing context before deciding"
}
```

That example is deliberately synthetic. It tests whether the assistant notices a missing constraint instead of producing an attractive guess.

## Measure retrieval before generation

When the answer fails, first ask whether the retriever ever supplied adequate evidence. Useful metrics include **recall@k** (fraction of labeled relevant documents found among the top `k`) and **precision@k** (fraction of retrieved documents that are relevant). A single result can contain several independently relevant passages, so decide whether you are scoring documents or chunks and keep that unit stable.

Here is a small document-level recall example. For a real evaluation, labels need to be checked by people who understand the documents.

```python
def recall_at_k(relevant: set[str], retrieved: list[str], k: int) -> float:
    if not relevant:
        raise ValueError("Use a separate metric for unanswerable queries")
    return len(relevant.intersection(retrieved[:k])) / len(relevant)

gold = {"policy-2026", "regional-exception"}
top_ids = ["policy-2026", "old-handbook", "regional-exception"]
assert recall_at_k(gold, top_ids, 2) == 0.5
assert recall_at_k(gold, top_ids, 3) == 1.0
```

These numbers are illustrative, not results from a deployed assistant. When analyzing a regression, retain the query, embedding model/version, index snapshot, filters, reranker settings and retrieved document IDs. Otherwise you cannot tell whether a change improved retrieval or merely changed the corpus.

## Separate factual support from fluent language

Even perfect retrieval does not ensure a grounded answer. A model may add a condition the document never mentions, cite an irrelevant paragraph, or combine two different policy versions.

For each answer, I would grade four dimensions independently:

| Dimension         | What a reviewer checks                                           |
| ----------------- | ---------------------------------------------------------------- |
| Evidence coverage | Did the retrieved context contain the necessary facts?           |
| Faithfulness      | Are the answer's claims actually supported by those facts?       |
| Citation quality  | Does each citation resolve to the specific supporting span?      |
| Decision behavior | Did the assistant answer, qualify, ask or abstain appropriately? |

A groundedness judge can speed up review, but LLM-based graders are themselves fallible. Calibrate them against a human-labeled subset, inspect disagreements, and report uncertainty instead of treating the judge score as ground truth.

## The hardest metric is knowing when not to answer

An assistant that answers every question can look fast and helpful while being dangerous. Unanswerable questions should be a first-class evaluation category. Track **incorrect answer rate on unanswerable questions**, **appropriate abstention rate**, and the rate of unnecessary refusals on answerable questions.

The goal is not “refuse more.” It is to draw the boundary accurately. When the question lacks a key qualifier, asking a clarifying question can be more useful than either a guessed answer or a blanket refusal.

The same applies to authorization. Documents excluded by permissions must never appear in the retriever context; relying on the final prompt to conceal private content is the wrong boundary. Test permission filtering before generation.

## Versions, freshness and operational behavior

Indexing a new policy can change previously correct answers. Include time-sensitive cases and keep a versioned corpus or deterministic snapshot so every evaluation run can be reproduced. Score whether the assistant identifies the relevant effective date when two documents disagree. Assess whether citations point to the current authorized version.

Quality has a cost dimension, too. Alongside answer metrics, measure p50/p95 end-to-end latency, retrieval latency, token use, timeout frequency and cost per completed task. A slower answer is only better if the extra work changes something that matters to the user.

One helpful pattern is a **failure ledger**: each production or test failure becomes a labeled example with a root-cause category (retrieval, parsing, permissions, synthesis, citation, ambiguity) and a regression test. Over time this makes evaluation less like a launch checklist and more like an engineering feedback loop.

## A practical release gate

Before release, I would compare the candidate against the current baseline on the _same_ labeled dataset and corpus snapshot. Look for regressions by question category; an aggregate score can hide a serious failure on permission boundaries or unanswerable queries. Review a sample of generated answers manually, and rerun the tests after any index, prompt, model or tool change.

An assistant deserves trust when it can **show its evidence, preserve permissions, detect missing information and behave predictably on the edge cases**. Good wording is the last stage of that process, not the first.
