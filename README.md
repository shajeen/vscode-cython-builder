# Cython Builder

[![Visual Studio Code](https://img.shields.io/badge/VSC-1.60.0%2B-blue.svg)](https://code.visualstudio.com/updates/v1_60)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Description

Cython Builder is a Visual Studio Code extension that simplifies the build process for Cython files by providing a convenient button to execute `python setup.py build_ext` command.

## Features

- Build Cython files with a single button press.
- Automatically locates and executes the `python setup.py build_ext` command in the project's parent folder.
- Allows selection of a specific subfolder containing Cython files.
- Allows selection of a Python virtual environment for building.

## Requirements

- Visual Studio Code version 1.60.0 or above.
- Node.js and npm installed for development.
- Python and pip for Cython development.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view (`Ctrl + Shift + X`).
3. Search for "Cython Builder".
4. Click "Install" to install the extension.

## Development Setup

To set up the development environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/shajeen/vscode-cython-builder.git
   cd vscode-cython-builder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open the project in VS Code:
   ```bash
   code .
   ```

## Usage

1. Open a project containing Cython files.
2. **Select Cython Folder**: Click the "Select Cython Folder" button in the status bar (or use `Ctrl + Shift + P` and search for "Select Cython Folder") to choose the subfolder containing your `setup.py` file.
3. **Select Virtual Environment**: Click the "Select Venv" button in the status bar (or use `Ctrl + Shift + P` and search for "Select Venv") to choose your Python virtual environment.
4. **Build Cython**: Click the "Build Cython" button in the status bar (or use `Ctrl + Shift + P` and search for "Build Cython") to execute the build command.

## Building from Source

To build the VSIX package:

1. Ensure you have `vsce` installed globally:
   ```bash
   npm install -g vsce
   ```
2. Run the packaging command in the project root:
   ```bash
   vsce package
   ```
   This will generate a `.vsix` file in the project root.

## Running Tests

To run the extension tests:

```bash
npm test
```

## Dependencies

- `python-shell`: Used to execute Python scripts from Node.js.
- `eslint`: For linting JavaScript code.
- `mocha`: Test framework.
- `sinon`: For test spies, stubs, and mocks.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

**Enjoy!** If you find this extension helpful, consider [buying me a coffee](https://www.buymeacoffee.com/shajeen) or [contributing](https://github.com/shajeen/vscode-cython-builder/blob/feature/todo-fixes/docs/CONTRIBUTING.md).
