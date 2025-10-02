#!/bin/bash

# VoCo GitHub Repository Setup Script
# This script helps you quickly create and push your VoCo repository to GitHub

echo "🚀 VoCo GitHub Repository Setup"
echo "================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ This is not a Git repository. Please run this script from the voco-clean directory."
    exit 1
fi

echo "📋 Before we start, make sure you have:"
echo "   1. Created a new repository on GitHub"
echo "   2. Have your GitHub username ready"
echo "   3. Repository name (e.g., 'voco')"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Get repository name
read -p "Enter your repository name (default: voco): " REPO_NAME
REPO_NAME=${REPO_NAME:-voco}

# Confirm details
echo ""
echo "📝 Repository Details:"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository Name: $REPO_NAME"
echo "   Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""

read -p "Is this correct? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🔗 Setting up remote repository..."

# Remove any existing origin remote
git remote remove origin 2>/dev/null || true

# Add new origin remote
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo "✅ Remote repository added"

# Rename main branch to main if it's master
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "master" ]; then
    echo "🔄 Renaming branch from master to main..."
    git branch -M main
fi

echo "📤 Pushing to GitHub..."

# Push to GitHub
if git push -u origin main; then
    echo ""
    echo "🎉 Success! Your VoCo repository has been created on GitHub!"
    echo ""
    echo "🌐 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo "📱 Clone URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Set up environment variables (.env.local)"
    echo "   2. Install dependencies: npm install"
    echo "   3. Start development: npm run dev"
    echo "   4. Visit: http://localhost:3000"
    echo ""
    echo "📖 For detailed setup instructions, see GITHUB_SETUP_GUIDE.md"
else
    echo ""
    echo "❌ Failed to push to GitHub. Please check:"
    echo "   1. Repository exists on GitHub"
    echo "   2. Repository URL is correct"
    echo "   3. You have push permissions"
    echo "   4. Your Git credentials are set up"
    echo ""
    echo "Manual setup:"
    echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi