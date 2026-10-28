# Way of working

- **Issues:** user stories (`story`) are grouped as sub-issues under epics (`epic`).
  Every story has Given/When/Then acceptance criteria.
- **Branches:** one short-lived branch per issue, e.g. `feat/12-island-terrain`.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `refactor:`, `test:`).
- **Pull requests:** reference the issue (`Closes #12`), CI must be green, **squash merge**.
- **`main`** is protected and deployed automatically.
- **Decisions** with lasting impact get an ADR in `docs/adr/`.
