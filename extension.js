const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let buildButton;
let selectFolderButton;
let selectVenvButton;
let selectedFolder;
let selectedVenv;
let activeTerminal;

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

        // Validate that the selected folder contains setup.py
        const setupPyPath = path.join(selectedFolder, 'setup.py');
        if (!fs.existsSync(setupPyPath)) {
            vscode.window.showErrorMessage('Selected folder does not contain setup.py file.');
            return;
        }

        // Construct the path to the Python interpreter inside the virtual environment
        const pythonInterpreter = getPythonInterpreter(selectedVenv);
        
        // Validate that the Python interpreter exists
        if (!fs.existsSync(pythonInterpreter)) {
            vscode.window.showErrorMessage('Python interpreter not found in the selected virtual environment.');
            return;
        }

        try {
            // Close any existing terminal
            if (activeTerminal) {
                activeTerminal.dispose();
            }

            // Execute the build command using the Python interpreter inside the virtual environment
            activeTerminal = vscode.window.createTerminal('Cython Build');
            activeTerminal.show();
            
            // Use proper shell escaping for paths
            const escapedFolder = selectedFolder.replace(/"/g, '\\"');
            const escapedInterpreter = pythonInterpreter.replace(/"/g, '\\"');
            
            activeTerminal.sendText(`cd "${escapedFolder}" && "${escapedInterpreter}" setup.py build_ext`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to execute build command: ${error.message}`);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.selectFolder', async () => {
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Cython Folder',
        });

        if (folderUri && folderUri.length > 0) {
            const folderPath = folderUri[0].fsPath;
            
            // Validate that the folder contains setup.py
            const setupPyPath = path.join(folderPath, 'setup.py');
            if (!fs.existsSync(setupPyPath)) {
                const response = await vscode.window.showWarningMessage(
                    'The selected folder does not contain setup.py. Do you want to continue?',
                    'Yes', 'No'
                );
                if (response !== 'Yes') {
                    return;
                }
            }
            
            selectedFolder = folderPath;
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
            const venvPath = folderUri[0].fsPath;
            
            // Validate that the virtual environment contains a Python interpreter
            const pythonInterpreter = getPythonInterpreter(venvPath);
            if (!fs.existsSync(pythonInterpreter)) {
                vscode.window.showErrorMessage('Selected folder does not appear to be a valid Python virtual environment.');
                return;
            }
            
            selectedVenv = venvPath;
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

function getPythonInterpreter(venvPath) {
    if (process.platform === 'win32') {
        // Try both python.exe and python3.exe on Windows
        const pythonExe = path.join(venvPath, 'Scripts', 'python.exe');
        const python3Exe = path.join(venvPath, 'Scripts', 'python3.exe');
        return fs.existsSync(pythonExe) ? pythonExe : python3Exe;
    } else {
        // Try both python3 and python on Unix-like systems
        const python3 = path.join(venvPath, 'bin', 'python3');
        const python = path.join(venvPath, 'bin', 'python');
        return fs.existsSync(python3) ? python3 : python;
    }
}

function deactivate() {
    if (activeTerminal) {
        activeTerminal.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
