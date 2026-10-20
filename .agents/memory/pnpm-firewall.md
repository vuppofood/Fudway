---
name: Replit package firewall
description: Avoid fresh workspace install failures from an older Express transitive dependency.
---

Fresh full-workspace pnpm installs returned HTTP 403 for `proxy-addr@2.0.7`. The current `2.0.8` release installs cleanly. Keep the workspace override and lockfile aligned rather than switching registries or leaving a partially installed workspace.

**Why:** A single blocked transitive package prevents multiple artifact workflows from starting after import.

**How to apply:** If a clean pnpm install fails on `proxy-addr@2.0.7`, verify the `2.0.8` override in `pnpm-workspace.yaml` before retrying.
