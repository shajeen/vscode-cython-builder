# Cython Builder

[![Visual Studio Code](https://img.shields.io/badge/VSC-1.60.0%2B-blue.svg)](https://code.visualstudio.com/updates/v1_60)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Description

Cython Builder is a Visual Studio Code extension that simplifies the build process for Cython files by providing a convenient button to execute `python setup.py build_ext` command.

## Features

- Build Cython files with a single button press.
- Automatically locates and executes the `python setup.py build_ext` command in the project's parent folder.

## Requirements

- Visual Studio Code version 1.60.0 or above.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view (`Ctrl + Shift + X`).
3. Search for "Cython Builder".
4. Click "Install" to install the extension.

## Usage

1. Open a project containing Cython files.
2. Press `Ctrl + Shift + P` to open the command palette.
3. Type "Build Cython" and select the "Build Cython" command.

## Configuration

Cython Builder does not require any specific configuration. It automatically detects the location of the `setup.py` file in the parent folder.

---

**Enjoy!** If you find this extension helpful, consider [buying me a coffee](#) or [contributing](CONTRIBUTING.md).
