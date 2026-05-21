# How to Test, Deploy, and Install FocusMind

FocusMind is a **Progressive Web App (PWA)**, which means you can test it locally, deploy it for free, and install it on your phone like a native app.

## ⚠️ CRITICAL: Create Icon Assets First

**Before deploying to production**, you MUST create these two PNG icon files in the root directory:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

Without these icons, the PWA installation prompt will NOT appear on mobile devices. Use tools like:
- [GIMP](https://www.gimp.org/) (free, open-source)
- [Figma](https://www.figma.com/) (free web-based)
- [Online PNG converter](https://convertio.co/) - upload your design and resize
- [Favicon Generator](https://favicon-generator.org/) - quick icon creation

**Recommendation**: Design a clean, simple icon (app logo) and export as PNG at both sizes.

## 1. Local Testing
Before deploying, you can test the app on your computer. See [TESTING.md](./TESTING.md) for a full checklist.

1. **Open the folder**: Navigate to the `ai_focus_app` directory.
2. **Start a local server**: 
   - If you have Python: `python3 -m http.server 8000`
   - If you have Node.js: `npx serve`
3. **Access the app**: Open your browser and go to `http://localhost:8000`.

## 2. Deployment (Hosting)
To install the app on mobile, it must be served over **HTTPS** (not HTTP).

**Important Note on Icons**: Before deploying, you should replace the placeholder `icon-192.png` and `icon-512.png` files with your own PNG images. Browsers require valid image files defined in the manifest for the "Install" prompt to appear.

Here are the easiest ways to deploy:

### Option A: GitHub Pages (Recommended)
1. Create a new GitHub repository.
2. Upload the contents of the `ai_focus_app` folder (the HTML, CSS, JS, manifest, etc.) to the root of the repository.
3. Go to **Settings > Pages**.
4. Under "Build and deployment", select the **main** branch and the **/(root)** folder. Click **Save**.
5. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

### Option B: Vercel / Netlify
1. Go to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
2. Drag and drop the `ai_focus_app` folder directly into their "Instant Deployment" or "Drop" zone.
3. They will provide a secure HTTPS URL instantly.

## 3. Local AI Coach Integration

To enable real AI-generated coach responses, run a local proxy server that forwards chat requests to OpenAI.

1. Install Node.js 18 or newer.
2. Copy `server.js`, `package.json`, and `.env.example` into your project root.
3. Set your OpenAI API key as an environment variable or in a local `.env` file:
   - macOS / Linux: `export OPENAI_API_KEY=your_key`
   - Windows PowerShell: `$env:OPENAI_API_KEY="your_key"`
   - Or copy `.env.example` to `.env` and add your key.
4. Start the local AI server:
   - `npm start`
5. Run the FocusMind app in your browser and send a message to the AI coach.

> Note: This proxy uses no additional npm dependencies; a modern Node 18+ runtime is enough.

The app will try to reach `http://localhost:3000/ai-chat`; if the server is unavailable, the coach will fall back to prebuilt responses.

## 4. Install on Mobile

Once your app is live on an HTTPS URL, follow these steps:

### On iPhone (iOS)
1. Open **Safari** and navigate to your hosted URL.
2. Tap the **Share** button (the square with an upward arrow at the bottom).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top right corner.

### On Android
1. Open **Chrome** and navigate to your hosted URL.
2. Tap the **three dots** in the top right corner.
3. Tap **Install app** or **Add to Home Screen**.
4. Confirm the installation.

Now FocusMind will appear as an app on your home screen!

## 4. How to Update
When you want to make changes to your app:
1. **Push Changes**: Simply upload your updated files to GitHub or Vercel.
2. **Increment Version**: In `sw.js`, change the `CACHE_NAME` (e.g., from `v1.1` to `v1.2`).
3. **Auto-Update**: Next time you open the app on your mobile, a message will appear: *"New version available! Click to update."*
4. **Refresh**: Click the message to instantly load the new version.

---
**Next Step:** Follow the [Full Testing Checklist](./TESTING.md) to ensure everything is configured correctly.
