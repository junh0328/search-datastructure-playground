# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Development commands (uses pnpm as package manager):
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint to check code quality

## Architecture

This is a Next.js 15 application with App Router architecture:

- **Framework**: Next.js 15.4.7 with React 19
- **Package Manager**: pnpm 10.11.0 (specified in packageManager field)
- **TypeScript**: Strict mode enabled with ES2017 target
- **Styling**: Currently minimal, uses Geist fonts
- **Structure**: 
  - `src/app/` - App Router pages and layouts
  - `src/app/layout.tsx` - Root layout with Geist font configuration
  - `src/app/page.tsx` - Main page (currently minimal client component)
  - Path alias `@/*` maps to `./src/*`

## Configuration

- **ESLint**: Uses Next.js recommended rules with TypeScript support
- **TypeScript**: Strict mode, bundler module resolution, incremental compilation
- **Next.js**: Default configuration with no custom settings
- **Turbopack**: Enabled for development server for faster builds

## Project Structure

This is a search data structure playground with interactive examples of different search algorithms:

### Route Structure
- `/` - Main navigation page with algorithm overview
- `/search/hash-table` - Hash Table exact match search (O(1) average)
- `/search/binary-search` - Binary Search on sorted arrays (O(log n))
- `/search/trie` - Trie/Prefix Tree for autocomplete (O(m))
- `/search/substring` - Substring matching with Naive and KMP algorithms

### Search Algorithm Implementations

**Exact Match Search (완전 일치 검색):**
1. **Hash Table**: Uses JavaScript Map for O(1) average lookup time
2. **Binary Search**: Requires sorted array, O(log n) time complexity

**Text Search (텍스트 검색):**
1. **Trie (Prefix Tree)**: Optimized for autocomplete, O(m) where m is query length
2. **Substring Matching**: 
   - Naive algorithm: O(n×m) time complexity
   - KMP algorithm: O(n+m) with LPS preprocessing

### Interactive Features
- Real-time algorithm visualization
- Step-by-step execution tracking
- Time complexity explanations
- Performance comparison between algorithms
- Sample data with Korean translations

## Development Notes

Each algorithm page includes:
- Interactive input controls
- Visual representation of data structures
- Step-by-step operation logging
- Time/space complexity analysis
- Educational explanations in Korean and English