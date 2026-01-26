# Git Workflow Cheatsheet

## Standard Workflow: Develop → Main

### 1. Working on Develop Branch

#### Check current branch
```bash
git branch
# or
git status
```

#### Switch to develop branch (if not already on it)
```bash
git checkout develop
# or (newer syntax)
git switch develop
```

#### Pull latest changes from remote develop
```bash
git pull origin develop
```

#### Create a new feature branch (optional, recommended)
```bash
git checkout -b feature/your-feature-name
# or
git switch -c feature/your-feature-name
```

---

### 2. Making Changes

#### Check what files have changed
```bash
git status
```

#### See what changed in files
```bash
git diff
# or for specific file
git diff path/to/file
```

---

### 3. Adding and Committing to Develop

#### Stage all changes
```bash
git add .
```

#### Stage specific files
```bash
git add path/to/file1 path/to/file2
```

#### Stage all changes in a directory
```bash
git add directory/
```

#### Commit with message
```bash
git commit -m "Your commit message here"
```

#### Commit with detailed message (opens editor)
```bash
git commit
```

#### Amend last commit (if you forgot something)
```bash
git add .
git commit --amend
# or to just update message
git commit --amend -m "New message"
```

---

### 4. Pushing to Develop

#### Push to remote develop branch
```bash
git push origin develop
```

#### Push and set upstream (first time)
```bash
git push -u origin develop
```

#### Force push (⚠️ USE WITH CAUTION - only if you're sure)
```bash
git push --force origin develop
```

---

### 5. Merging Develop to Main

#### Switch to main branch
```bash
git checkout main
# or
git switch main
```

#### Pull latest changes from remote main
```bash
git pull origin main
```

#### Merge develop into main
```bash
git merge develop
```

#### Push merged changes to remote main
```bash
git push origin main
```

#### Switch back to develop
```bash
git checkout develop
```

---

## Complete Workflow Example

### Daily Development Workflow
```bash
# 1. Start your day - get latest changes
git checkout develop
git pull origin develop

# 2. Create feature branch (optional but recommended)
git checkout -b feature/add-new-section

# 3. Make your changes, then:
git add .
git commit -m "Add new section to homepage"
git push origin feature/add-new-section

# 4. Merge feature back to develop (or create PR)
git checkout develop
git merge feature/add-new-section
git push origin develop

# 5. Clean up feature branch (optional)
git branch -d feature/add-new-section
```

### Release Workflow (Develop → Main)
```bash
# 1. Make sure develop is up to date
git checkout develop
git pull origin develop

# 2. Switch to main
git checkout main
git pull origin main

# 3. Merge develop into main
git merge develop

# 4. Push to main
git push origin main

# 5. Tag the release (optional)
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 6. Switch back to develop
git checkout develop
```

---

## Useful Commands

### Viewing History
```bash
# View commit history
git log

# View commit history (one line per commit)
git log --oneline

# View commit history with graph
git log --oneline --graph --all

# View changes in last commit
git show
```

### Undoing Changes

#### Unstage files (keep changes)
```bash
git reset HEAD path/to/file
# or
git restore --staged path/to/file
```

#### Discard changes in working directory
```bash
git checkout -- path/to/file
# or
git restore path/to/file
```

#### Undo last commit (keep changes staged)
```bash
git reset --soft HEAD~1
```

#### Undo last commit (keep changes unstaged)
```bash
git reset HEAD~1
```

#### Undo last commit (discard changes)
```bash
git reset --hard HEAD~1
```

### Branch Management
```bash
# List all branches
git branch

# List all branches (including remote)
git branch -a

# Create new branch
git branch branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name
```

### Stashing (Save work without committing)
```bash
# Save current changes
git stash

# Save with message
git stash save "Work in progress"

# List stashes
git stash list

# Apply last stash
git stash apply

# Apply and remove stash
git stash pop

# Drop stash
git stash drop
```

---

## Best Practices

1. **Always pull before pushing** - `git pull` before `git push`
2. **Write clear commit messages** - Be descriptive
3. **Commit often** - Small, logical commits are better
4. **Use feature branches** - Don't work directly on develop/main
5. **Test before merging** - Make sure everything works
6. **Don't force push to shared branches** - Only use `--force` on your own branches
7. **Keep develop stable** - Only merge tested code
8. **Tag releases** - Use tags for version releases

---

## Common Issues & Solutions

### Merge Conflicts
```bash
# If merge conflict occurs:
# 1. Git will mark conflicted files
# 2. Open files and resolve conflicts manually
# 3. Stage resolved files
git add resolved-file.txt
# 4. Complete the merge
git commit
```

### Accidentally committed to wrong branch
```bash
# 1. Note the commit hash
git log --oneline

# 2. Reset the branch (soft keeps changes)
git reset --soft HEAD~1

# 3. Switch to correct branch
git checkout correct-branch

# 4. Apply the commit
git cherry-pick <commit-hash>
```

### Undo a merge
```bash
# Before pushing
git reset --hard HEAD~1

# After pushing (creates revert commit)
git revert -m 1 HEAD
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Check status | `git status` |
| Stage all | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin branch-name` |
| Pull | `git pull origin branch-name` |
| Switch branch | `git checkout branch-name` |
| Create branch | `git checkout -b branch-name` |
| Merge | `git merge branch-name` |
| View log | `git log --oneline` |
| Discard changes | `git restore path/to/file` |
