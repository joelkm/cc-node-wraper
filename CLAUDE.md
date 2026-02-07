# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run build     # Compile TypeScript to dist/
npm run dev       # Run directly with tsx (no build needed)
npm link          # Install commands globally after building
```

## Architecture

This is a CLI wrapper for Claude Code that maps custom command names to preconfigured Claude invocations.

**How it works:**
1. User runs a command like `kimi` or `q3`
2. The script detects which command was invoked via `process.argv[1]`
3. Looks up the command in `commands.json` to get settings file path and args
4. Spawns `claude` with `--settings <path>` plus any configured args

**Key files:**
- `commands.json` - Maps command names to settings files and CLI args (no rebuild needed to modify)
- `src/index.ts` - Single entry point shared by all commands
- `providers/` - Contains settings JSON files for different providers
- `package.json` bin section - Must list each command pointing to `dist/index.js`

## Adding a New Command

1. Add entry to `commands.json` with `settings` path and optional `args` array
2. Add bin entry in `package.json`: `"mycommand": "dist/index.js"`
3. Run `npm run build && npm link`
