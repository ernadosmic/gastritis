# Deployment Guide for Gastritis Diet Website

## GitHub Pages Deployment

### Option 1: Using GitHub Web Interface

1. **Create a new repository**:
   - Go to GitHub.com and sign in
   - Click "New" to create a new repository
   - Name it something like `gastritis-diet-guide`
   - Make sure it's public (required for free GitHub Pages)
   - Initialize with README if desired

2. **Upload your files**:
   - Click "uploading an existing file"
   - Drag and drop or select all the website files:
     - `index.html`
     - `styles.css`
     - `script.js`
     - `README.md`
     - `LICENSE`
     - `_config.yml`
     - `.gitignore`

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

4. **Access your website**:
   - Your site will be available at: `https://yourusername.github.io/repository-name`
   - It may take a few minutes to deploy

### Option 2: Using Git Command Line

1. **Clone and setup**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Add your files** (copy all website files to the cloned directory)

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Initial commit: Gastritis diet guide website"
   git push origin main
   ```

4. **Enable GitHub Pages** (follow step 3 from Option 1)

## Alternative Deployment Options

### Netlify (Free)
1. Go to netlify.com and sign up
2. Drag and drop your project folder to deploy
3. Get instant HTTPS URL

### Vercel (Free)
1. Go to vercel.com and sign up
2. Import your GitHub repository
3. Automatic deployments on every push

### GitHub Codespaces (For Development)
1. Open repository in GitHub
2. Click "Code" → "Codespaces" → "Create codespace"
3. Use VS Code in browser for editing

## Custom Domain (Optional)

If you want to use your own domain:

1. **Purchase a domain** from providers like:
   - Namecheap
   - GoDaddy
   - Google Domains

2. **Configure DNS**:
   - Add CNAME record pointing to `yourusername.github.io`

3. **Update GitHub Pages settings**:
   - In repository settings → Pages
   - Add your custom domain
   - Enable "Enforce HTTPS"

## Testing Your Deployment

### Pre-deployment Checklist
- [ ] All files are in the repository
- [ ] Links work correctly
- [ ] Images load (if any added later)
- [ ] Mobile responsiveness works
- [ ] Search functionality works
- [ ] Navigation is smooth

### Testing Tools
- **Mobile**: Use browser dev tools or real devices
- **Performance**: Use Google PageSpeed Insights
- **Accessibility**: Use Wave Web Accessibility Evaluator
- **SEO**: Use Google Search Console

## Maintenance

### Regular Updates
- Review medical information for accuracy
- Update food lists based on new research
- Monitor user feedback through GitHub issues

### Analytics (Optional)
Add Google Analytics by inserting tracking code in `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## Troubleshooting

### Common Issues
1. **Site not loading**: Check if GitHub Pages is enabled
2. **CSS not working**: Ensure file paths are correct
3. **Search not working**: Check if JavaScript file is loading
4. **Mobile issues**: Test responsive breakpoints

### Support Resources
- GitHub Pages Documentation
- GitHub Community Forums
- Web development communities (Stack Overflow, Reddit)

---

**Note**: This website is for educational purposes. Always include proper medical disclaimers and encourage users to consult healthcare providers.