# ADR 0005 — GitHub Pages first, Azure next

- Status: accepted
- Date: 2026-10-28

## Context

The site needs to be live early for testing. Long term it should run on Azure as part of a
Cloud/DevOps showcase (IaC, pipelines).

## Decision

- **M0/M1:** deploy to **GitHub Pages** via GitHub Actions on every push to `main`
  (served under `/homepage/`, configured via Vite `base`).
- **M2:** move to **Azure Static Web Apps**, provisioned with **Terraform** and deployed by
  GitHub Actions. Details are refined in the M2 epic.

## Consequences

- Fast feedback from day one at zero cost.
- The base path changes when moving to Azure / a custom domain; it must stay configurable.
