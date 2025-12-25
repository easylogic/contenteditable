# Giscus Setup Guide

This project uses [Giscus](https://giscus.app/) for comments and discussions on each page. Giscus uses GitHub Discussions as the backend.

## Setup Instructions

1. **Install Giscus App**
   - Go to https://github.com/apps/giscus
   - Click "Install" and authorize the app for the `easylogic/contenteditable` repository
   - Make sure to grant access to Discussions

2. **Enable Discussions**
   - Go to your repository settings: https://github.com/easylogic/contenteditable/settings
   - Navigate to "General" → "Features"
   - Enable "Discussions"

3. **Create Discussion Categories**
   - Go to https://github.com/easylogic/contenteditable/discussions
   - Click "New category"
   - Create categories:
     - **Q&A** (for general questions and answers)
     - **Announcements** (for project announcements)
     - **General** (for general discussions)

4. **Get Repository IDs**
   - Visit https://giscus.app/
   - Enter your repository: `easylogic/contenteditable`
   - Select the "Q&A" category
   - The page will show you:
     - **Repository ID** (e.g., `R_kgDO...`)
     - **Category ID** (e.g., `DIC_kwDO...`)

5. **Update Comments Component**
   - Edit `src/components/Comments.astro`
   - Update the `repoId` and `categoryId` props with the values from step 4
   - Or set them in each page that uses the component

## Alternative: Utterances

If you prefer GitHub Issues over Discussions, you can use [Utterances](https://utteranc.es/) instead:

1. Install Utterances app: https://github.com/apps/utterances
2. Replace the Comments component with Utterances script
3. Utterances uses Issues, so no need to enable Discussions

## Current Configuration

The Comments component is currently configured with:
- **Repository**: `easylogic/contenteditable`
- **Mapping**: `pathname` (each page gets its own discussion thread)
- **Theme**: `preferred_color_scheme` (follows user's system preference)
- **Input Position**: `bottom`
- **Reactions**: Enabled

**Note**: You need to complete steps 1-4 above and update the `repoId` and `categoryId` in the Comments component for comments to work.

