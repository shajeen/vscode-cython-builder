const assert = require('assert');
const sinon = require('sinon');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');

suite('Extension Test Suite', () => {
	let sandbox;

	setup(() => {
		sandbox = sinon.createSandbox();
	});

	teardown(() => {
		sandbox.restore();
	});

	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('extension.buildCython command should be registered and callable', async () => {
		const showErrorMessageStub = sandbox.stub(vscode.window, 'showErrorMessage');

		await vscode.commands.executeCommand('extension.buildCython');

		// Expect an error message since no folder/venv is selected initially
		assert.ok(showErrorMessageStub.calledWith('No subfolder selected. Please select a subfolder first.'));
	});

	test('extension.selectFolder command should be registered', async () => {
		const showOpenDialogStub = sandbox.stub(vscode.window, 'showOpenDialog');
		showOpenDialogStub.returns(Promise.resolve(undefined));

		await vscode.commands.executeCommand('extension.selectFolder');

		assert.ok(showOpenDialogStub.called);
	});

	test('extension.selectVenv command should be registered', async () => {
		const showOpenDialogStub = sandbox.stub(vscode.window, 'showOpenDialog');
		showOpenDialogStub.returns(Promise.resolve(undefined));

		await vscode.commands.executeCommand('extension.selectVenv');

		assert.ok(showOpenDialogStub.called);
	});
});
