# VoCo GitHub Repository Setup Script (PowerShell)
# This script helps you quickly create and push your VoCo repository to GitHub

Write-Host "🚀 VoCo GitHub Repository Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if git is installed
try {
    git --version | Out-Null
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check if we're in a git repository
if (!(Test-Path ".git")) {
    Write-Host "❌ This is not a Git repository. Please run this script from the voco-clean directory." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Before we start, make sure you have:" -ForegroundColor Yellow
Write-Host "   1. Created a new repository on GitHub" -ForegroundColor White
Write-Host "   2. Have your GitHub username ready" -ForegroundColor White
Write-Host "   3. Repository name (e.g., 'voco')" -ForegroundColor White
Write-Host ""

# Get GitHub username
$GITHUB_USERNAME = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($GITHUB_USERNAME)) {
    Write-Host "❌ GitHub username is required" -ForegroundColor Red
    exit 1
}

# Get repository name
$REPO_NAME = Read-Host "Enter your repository name (default: voco)"
if ([string]::IsNullOrWhiteSpace($REPO_NAME)) {
    $REPO_NAME = "voco"
}

# Confirm details
Write-Host ""
Write-Host "📝 Repository Details:" -ForegroundColor Cyan
Write-Host "   GitHub Username: $GITHUB_USERNAME" -ForegroundColor White
Write-Host "   Repository Name: $REPO_NAME" -ForegroundColor White
Write-Host "   Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" -ForegroundColor White
Write-Host ""

$CONFIRM = Read-Host "Is this correct? (y/N)"
if ($CONFIRM -notmatch "^[Yy]$") {
    Write-Host "❌ Setup cancelled" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔗 Setting up remote repository..." -ForegroundColor Yellow

# Remove any existing origin remote
try {
    git remote remove origin 2>$null
} catch {
    # Ignore error if origin doesn't exist
}

# Add new origin remote
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

Write-Host "✅ Remote repository added" -ForegroundColor Green

# Rename main branch to main if it's master
$CURRENT_BRANCH = git branch --show-current
if ($CURRENT_BRANCH -eq "master") {
    Write-Host "🔄 Renaming branch from master to main..." -ForegroundColor Yellow
    git branch -M main
}

Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow

# Push to GitHub
try {
    git push -u origin main
    Write-Host ""
    Write-Host "🎉 Success! Your VoCo repository has been created on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor Cyan
    Write-Host "📱 Clone URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Set up environment variables (.env.local)" -ForegroundColor White
    Write-Host "   2. Install dependencies: npm install" -ForegroundColor White
    Write-Host "   3. Start development: npm run dev" -ForegroundColor White
    Write-Host "   4. Visit: http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 For detailed setup instructions, see GITHUB_SETUP_GUIDE.md" -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "❌ Failed to push to GitHub. Please check:" -ForegroundColor Red
    Write-Host "   1. Repository exists on GitHub" -ForegroundColor White
    Write-Host "   2. Repository URL is correct" -ForegroundColor White
    Write-Host "   3. You have push permissions" -ForegroundColor White
    Write-Host "   4. Your Git credentials are set up" -ForegroundColor White
    Write-Host ""
    Write-Host "Manual setup:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" -ForegroundColor White
    Write-Host "   git branch -M main" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}