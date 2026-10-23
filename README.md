# gtc-gh.github.io

Project pages, served by GitHub Pages at `https://gtc-gh.github.io/<Project>/`.

| Folder | Page | Code |
|---|---|---|
| [`SATE-Bench/`](SATE-Bench/) | https://gtc-gh.github.io/SATE-Bench/ | https://github.com/gtc-gh/SATE-Bench |

## Adding a project

1. Create a folder named after the project (e.g. `NewProject/`) with its own `index.html` and `static/`, using relative paths only.
2. Do not enable GitHub Pages on the code repository with the same name: it would take over `https://gtc-gh.github.io/<Project>/`.

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/SATE-Bench/`.
