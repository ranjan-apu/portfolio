---
title: "Building a CLI Tool That Stays Useful"
date: 2026-06-10
author: "Apurba"
description: "A few lessons from building command-line tools that you actually use after the first week."
tags: ["tools", "cli", "typescript"]
draft: false
---

I have built a lot of small CLI tools. Most of them died after a week. A few stuck around. The ones that survived share a few traits.

## Solve one annoying thing

The best tools fix a specific friction you hit repeatedly. "Manage my whole workflow" is too big. "Rename these files the way I always rename them" is just right.

## Default to safe

Never delete or overwrite by default. Print the plan and ask for confirmation. Add a `--yes` flag for automation later.

```bash
# good
$ renamer '*.txt' --dry-run
Would rename: report.txt → 2026-06-10-report.txt

# then
$ renamer '*.txt' --yes
```

## Error messages are part of the UI

A stack trace is not a message. Tell the user what went wrong, why, and what they can do next.

## Keep dependencies tiny

Every dependency is a future problem. Use the standard library until it hurts.

The tools I still use are under 200 lines and have zero external dependencies. That is not a coincidence.
