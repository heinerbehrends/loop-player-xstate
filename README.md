# Loop Player XState

A web-based audio player implementation using XState for state management. Features include timeline seeking, drag-and-drop controls, and loop functionality.

## Features

- 🎵 Audio playback controls (play/pause)
- 🎯 Timeline seeking via click
- 🖱️ Drag-and-drop timeline control
- 🔁 Loop functionality
- 🎭 State management with XState
- ✅ Comprehensive test coverage

## Tech Stack

- TypeScript
- React
- XState (for state management)
- Playwright (for testing)

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm, pnpm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/loop-player-xstate.git
cd loop-player-xstate
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development

To start the development server:

```bash
npm run dev
# or
pnpm run dev
# or
yarn dev
```

### Testing

The project uses Playwright for end-to-end testing. To run the tests:

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npm run test
# or
pnpm run test
# or
yarn test

# Run tests with UI
npm run test --ui
# or
pnpm run test --ui
# or
yarn test --ui
```

## Project Structure

```
loop-player-xstate/
├── src/            # Source files
├── tests/          # Test files
│   ├── test-utils.ts           # Test utilities
│   ├── drag-drop-time.spec.ts  # Drag-drop timeline tests
│   └── seek-click.spec.ts      # Timeline seeking tests
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License
