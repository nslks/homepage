# homepage

My personal homepage as a small, walkable 3D island — built with
[React Three Fiber](https://r3f.docs.pmnd.rs/), three.js and Rapier.

Walk a low-poly character across a floating island and visit stations for my career, work
experience, side projects and contact details. Day/night mode included.

> 🚧 Work in progress — see the [milestones](https://github.com/nslks/homepage/milestones)
> and the [specification](docs/spec.md).

## Documentation

- [Product specification](docs/spec.md)
- [Architecture decision records](docs/adr/)
- [Contributing / way of working](CONTRIBUTING.md)

## Development

Development happens exclusively in the dev container
([ADR 0002](docs/adr/0002-devcontainer-only.md)). Nothing besides a container runtime is
installed on the host.

**Locally** (macOS):

1. Install [OrbStack](https://orbstack.dev/) (or Docker Desktop) and VS Code with the
   *Dev Containers* extension.
2. Open the repository folder in VS Code → *Reopen in Container*.
3. Run `npm run dev` in the container terminal and open <http://localhost:5173/homepage/>.

**In the cloud:** *Code → Codespaces → Create codespace on main* on GitHub. Same setup,
nothing local at all.

The container uses Node 24 LTS (pinned in `.nvmrc`, also used by CI). `node_modules` is
kept in a named Docker volume for performance.

## License

- **Code:** [MIT](LICENSE)
- **Personal content** (texts in `content/`, personal data): © Enes Alkis, all rights reserved.
- **Third-party assets:** see [CREDITS.md](CREDITS.md).
