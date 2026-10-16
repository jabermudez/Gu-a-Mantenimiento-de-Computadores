# Guía de Despliegue en GitHub Pages

Esta aplicación ha sido adaptada con rutas relativas (`base: './'` en `vite.config.ts`) para que funcione perfectamente en **GitHub Pages** bajo cualquier subdominio o repositorio (ejemplo: `https://<tu-usuario>.github.io/<tu-repositorio>/`).

---

## Opción 1: Despliegue Automático con GitHub Actions (Recomendada)

1. En tu repositorio de GitHub, ve a **Settings** > **Pages**.
2. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
3. Crea un archivo en tu proyecto en la ruta `.github/workflows/deploy.yml` con el siguiente contenido:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

4. Haz `git add .`, `git commit -m "Deploy to GitHub Pages"` y `git push origin main`.
5. En 1-2 minutos tu aplicación estará publicada y en línea.

---

## Opción 2: Despliegue Manual con la rama `gh-pages`

1. Compila el proyecto localmente:
   ```bash
   npm run build
   ```
2. La carpeta compilada `dist/` contiene los archivos estáticos listos (HTML, JS, CSS con rutas relativas `./`).
3. Puedes subir directamente el contenido de `dist/` a la rama `gh-pages` usando la herramienta `gh-pages`:
   ```bash
   npx gh-pages -d dist
   ```
