# Deploying FocusMind to GitHub Pages

This repository includes a GitHub Actions workflow that publishes the repository contents to GitHub Pages whenever `master` is pushed.

How it works:

- The workflow `.github/workflows/pages.yml` runs on every push to `master`.
- It uploads the repository root as an artifact and uses the official `actions/deploy-pages` to publish to Pages.

To enable Pages on the repository (if not already enabled):

1. Go to the GitHub repository settings > Pages.
2. Choose the deployment source "GitHub Actions" (the first option) if prompted.

Notes:
- Ensure `icon-192.png` and `icon-512.png` exist in the repo root for the PWA install prompt.
- The site will be available at `https://<your-username>.github.io/<repo-name>/` once the workflow completes.

## Backend (Render Free Web Service)

This repo now includes `render.yaml` for backend deployment.

1. In Render, click **New +** > **Blueprint**.
2. Connect/select this GitHub repo: `jab-cloud/NeuroFocus-AI`.
3. Keep the service name as `neurofocus-ai-api` (so frontend `config.js` matches).
4. Set `OPENAI_API_KEY` when prompted.
5. Deploy the Blueprint.

After deploy, confirm this URL returns `{"ok":true}`:

`https://neurofocus-ai-api.onrender.com/health`

If Render gives you a different subdomain, update `config.js` with your actual backend URL and push again.
