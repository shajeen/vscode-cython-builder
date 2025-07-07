const vscode = require('vscode');
const path = require('path');

let buildButton;
let selectFolderButton;
let selectVenvButton;
let selectedFolder;
let selectedVenv;

function activate(context) {
    // Button to trigger the Cython build
    buildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    buildButton.text = "$(tools) Build Cython";
    buildButton.tooltip = "Build Cython files";
    buildButton.command = 'extension.buildCython';
    buildButton.show();

    // Button to select a subfolder
    selectFolderButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    selectFolderButton.text = "$(file-directory) Select Cython Folder";
    selectFolderButton.tooltip = "Select Folder";
    selectFolderButton.command = 'extension.selectFolder';
    selectFolderButton.show();

    // Button to select a virtual environment
    selectVenvButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);
    selectVenvButton.text = "$(activate) Select Venv";
    selectVenvButton.tooltip = "Select Virtual Environment";
    selectVenvButton.command = 'extension.selectVenv';
    selectVenvButton.show();

    context.subscriptions.push(vscode.commands.registerCommand('extension.buildCython', async () => {
        if (!selectedFolder) {
            vscode.window.showErrorMessage('No subfolder selected. Please select a subfolder first.');
            return;
        }

        if (!selectedVenv) {
            vscode.window.showErrorMessage('No virtual environment selected. Please select a virtual environment first.');
            return;
        }

        // Construct the path to the Python interpreter inside the virtual environment
        const pythonInterpreter = process.platform === 'win32'
            ? path.join(selectedVenv, 'Scripts', 'python.exe')
            : path.join(selectedVenv, 'bin', 'python3');

        // Execute the build command using the Python interpreter inside the virtual environment
        const terminal = vscode.window.createTerminal('Cython Build');
        terminal.show();
        terminal.sendText(`cd "${selectedFolder}" && "${pythonInterpreter}" setup.py build_ext`);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.selectFolder', async () => {
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Cython Folder',
        });

        if (folderUri && folderUri.length > 0) {
            selectedFolder = folderUri[0].fsPath;
            updateSelectFolderButton(path.basename(selectedFolder));
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.selectVenv', async () => {
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Virtual Environment',
        });

        if (folderUri && folderUri.length > 0) {
            selectedVenv = folderUri[0].fsPath;
            updateSelectVenvButton(path.basename(selectedVenv));
        }
    }));

    context.subscriptions.push(buildButton);
    context.subscriptions.push(selectFolderButton);
    context.subscriptions.push(selectVenvButton);
}

function updateSelectVenvButton(venvName) {
    selectVenvButton.text = `$(activate) Selected Venv: ${venvName}`;
    selectVenvButton.tooltip = `Selected Venv: ${venvName}`;
}

function updateSelectFolderButton(folderName) {
    selectFolderButton.text = `$(file-directory) Selected: ${folderName}`;
    selectFolderButton.tooltip = `Selected Folder: ${folderName}`;
}

module.exports = {
    activate
};
