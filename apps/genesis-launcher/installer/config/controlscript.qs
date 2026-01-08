/**
 * DEMIURGE QOR Installer - Control Script
 * 
 * Optional control script for installer customization.
 * This file is referenced but not required - installer will work without it.
 */

function Controller() {
    installer.autoRejectMessageBoxes();
    installer.setMessageBoxAutomaticAnswer("OverwriteTargetDirectory", QMessageBox.Yes);
}

Controller.prototype.ComponentSelectionPageCallback = function() {
    // Customize component selection if needed
}

Controller.prototype.IntroductionPageCallback = function() {
    // Customize introduction page if needed
}

Controller.prototype.TargetDirectoryPageCallback = function() {
    // Customize target directory page if needed
}

Controller.prototype.ReadyForInstallationPageCallback = function() {
    // Customize ready page if needed
}

Controller.prototype.FinishedPageCallback = function() {
    // Customize finished page if needed
}
