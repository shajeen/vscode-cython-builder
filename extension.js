const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

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
        const rootFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

        const subfolders = fs.readdirSync(rootFolder)
            .filter(item => fs.statSync(path.join(rootFolder, item)).isDirectory());

        if (subfolders.length === 0) {
            vscode.window.showErrorMessage(`No subfolders found in ${rootFolder}.`);
            return;
        }

        const folderItems = subfolders.map(subfolder => ({
            label: subfolder,
            description: path.join(rootFolder, subfolder)
        }));

        const selectedFolderItem = await vscode.window.showQuickPick(folderItems, {
            placeHolder: 'Select a subfolder to build',
            ignoreFocusOut: true,
        });

        if (selectedFolderItem) {
            selectedFolder = selectedFolderItem.description;
            updateSelectFolderButton(selectedFolderItem.label);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.selectVenv', async () => {
        const venvFolders = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        const venvItems = fs.readdirSync(venvFolders)
            .filter(item => fs.statSync(path.join(venvFolders, item)).isDirectory());

        if (venvItems.length === 0) {
            vscode.window.showErrorMessage('No virtual environments found. Please create a virtual environment first.');
            return;
        }

        const venvFolderItems = venvItems.map(venv => ({
            label: venv,
            description: path.join(venvFolders, venv)
        }));

        const selectedVenvItem = await vscode.window.showQuickPick(venvFolderItems, {
            placeHolder: 'Select a virtual environment',
            ignoreFocusOut: true,
        });

        if (selectedVenvItem) {
            selectedVenv = selectedVenvItem.description;
            updateSelectVenvButton(selectedVenvItem.label);
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
