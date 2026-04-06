# Migración de Yarn a pnpm

This document outlines the steps taken to migrate this project from **Yarn** to **pnpm**.

## Changes Made

### 1. **package.json**
- Updated `engines.yarn` to `engines.pnpm >= 8.0.0`
- Changed all npm script references from `yarn` to `pnpm`
  - `yarn build` → `pnpm build`
  - `yarn dev` → `pnpm dev`
  - `yarn format` → `pnpm format`
  - `yarn lint` → `pnpm lint`

### 2. **README.md**
- Updated prerequisites from `yarn >= 1.22` to `pnpm >= 8.0.0`
- Updated all command examples to use `pnpm` instead of `yarn`

### 3. **.pnpmrc** (New File)
- Created pnpm configuration file with recommended settings:
  - `auto-install-peers=true`: Automatically install peer dependencies
  - `node-linker=symlink`: Use symlink mode for faster installation
  - `strict-peer-dependencies=false`: More lenient peer dependency handling

### 4. **Dockerfile**
- Updated both build and deploy stages to use `pnpm`
- Changed from `yarn.lock` to `pnpm-lock.yaml`
- Added `npm install -g pnpm` to install pnpm in Docker image

## Fast-track Installation Steps

### Step 1: Install pnpm globally
```bash
# Using npm (recommended)
npm install -g pnpm

# Or using PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Or using Homebrew (macOS)
brew install pnpm

# Or using Chocolatey (Windows)
choco install pnpm
```

### Step 2: Remove yarn.lock and install dependencies
```bash
# Remove the old lock file
rm yarn.lock
# or on Windows PowerShell:
Remove-Item yarn.lock

# Install dependencies with pnpm
pnpm install
```

### Step 3: Verify installation
```bash
# Check pnpm version
pnpm --version

# Build the project
pnpm build

# Run development server
pnpm dev

# Run tests
pnpm test
```

## Key Benefits of pnpm

1. **Faster Installation**: ~3x faster than Yarn/npm for most projects
2. **Disk Space**: Uses hard links instead of copying files
3. **Monorepo Support**: Better native support for workspaces
4. **Stricter Dependency Management**: Better control over peer dependencies
5. **Better Performance**: Significantly faster operation in CI/CD pipelines

## Reverting to Yarn (if needed)

If you need to revert back to Yarn:

```bash
# Remove pnpm install
npm uninstall -g pnpm

# Remove pnpm-lock.yaml
rm pnpm-lock.yaml

# Restore yarn.lock (if you backed it up)
# Then reinstall with yarn
yarn install
```

## Troubleshooting

### Issue: Module not found during development
**Solution**: Run `pnpm install` again to ensure all dependencies are properly linked.

### Issue: pnpm not found globally
**Solution**: Verify installation with `pnpm --version` or reinstall using one of the methods above.

### Issue: Different dependency resolution
**Solution**: This is expected behavior. pnpm has stricter dependency resolution. Update your imports if needed and ensure proper peer dependency declarations.

### Issue: Docker build fails
**Solution**: Make sure `pnpm-lock.yaml` is committed to the repository and `yarn.lock` is removed.

## CI/CD Considerations

When deploying with Docker Compose or CI/CD pipelines:

1. Ensure `pnpm-lock.yaml` is committed to version control
2. Use `pnpm install --frozen-lockfile` in CI/CD (already configured in Dockerfile)
3. Update any CI/CD scripts that reference `yarn` commands to use `pnpm` instead

## References

- [pnpm Official Documentation](https://pnpm.io/)
- [pnpm vs Yarn vs npm Comparison](https://pnpm.io/npm-vs-yarn-vs-pnpm)
- [pnpm Workspaces](https://pnpm.io/workspaces)
