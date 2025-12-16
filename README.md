## contenteditable.lab

Interactive playground and knowledge base for observing and documenting `contenteditable`
behavior across operating systems, devices, browsers, and keyboard setups.

All current documentation is written in English. The content layout is prepared to support
additional locales in the future.

## Commands

All commands are run from the root of the project, from a terminal:

| Command            | Action                                        |
| :----------------- | :-------------------------------------------- |
| `pnpm dev`         | Starts local dev server at `localhost:4321`  |
| `pnpm build`       | Builds the production site to `./dist/`      |
| `pnpm preview`     | Previews your build locally before deploying |
| `pnpm astro ...`   | Runs Astro CLI commands                      |
| `pnpm astro --help`| Shows Astro CLI help                         |

## Pages

- `/`  
  - Main `contenteditable` playground.  
  - Logs key events (`keydown`, `beforeinput`, `input`, composition events) and can copy a GitHub
    issue template including the log payload.

- `/cases`  
  - Lists Markdown-based cases, filterable by `locale`, `status`, and text search.  
  - Each case includes free-form metadata for OS, device, browser, keyboard, and tags, and links
    back to the playground with a query string parameter.

## Content layout and locales

- `src/content/config.ts` defines the `cases` collection, including:
  - `id`, `locale`, `os`, `device`, `browser`, `keyboard`, `caseTitle`, `tags`, and `status`.
- Example English content lives under `src/content/en/cases/`.  
  To introduce another language, add a parallel directory such as `src/content/ko/cases/` with
  Markdown files that use the same frontmatter schema and `locale` value.

## GitHub Pages and custom domain

This project is configured to deploy automatically to GitHub Pages:

1. Push this repository to GitHub.
2. Go to repository Settings → Pages.
3. Under "Source", select "GitHub Actions" as the source.
4. The workflow (`.github/workflows/deploy.yml`) will automatically build and deploy on every push to `main`.
5. Add a `CNAME` record at your DNS provider for `contenteditable.realerror.com` that points to
   your GitHub Pages host (for example, `<user>.github.io`).
6. In the GitHub repository's Pages settings, set `contenteditable.realerror.com` as the custom
   domain. GitHub will then serve this site at that hostname.

The `public/CNAME` file is included to configure the custom domain automatically.
