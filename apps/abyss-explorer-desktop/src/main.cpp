/**
 * Abyss Explorer Desktop - Main Entry Point
 * 
 * Qt6-based desktop application for the Demiurge blockchain ecosystem.
 * Provides full AbyssOS functionality without browser restrictions.
 */

#include <QApplication>
#include <QWebEngineProfile>
#include <QWebEngineSettings>
#include <QDir>
#include <QStandardPaths>
#include "MainWindow.h"

int main(int argc, char *argv[])
{
    // Enable high DPI scaling
    QApplication::setHighDpiScaleFactorRoundingPolicy(
        Qt::HighDpiScaleFactorRoundingPolicy::PassThrough);
    
    // Initialize application
    QApplication app(argc, argv);
    app.setApplicationName(APP_NAME);
    app.setApplicationVersion(APP_VERSION);
    app.setOrganizationName(APP_ORGANIZATION);
    app.setOrganizationDomain("demiurge.cloud");
    
    // Configure WebEngine
    QWebEngineProfile *profile = QWebEngineProfile::defaultProfile();
    
    // Set persistent storage path
    QString dataPath = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation);
    profile->setPersistentStoragePath(dataPath + "/webengine");
    profile->setCachePath(dataPath + "/cache");
    
    // Enable local storage and IndexedDB
    QWebEngineSettings *settings = profile->settings();
    settings->setAttribute(QWebEngineSettings::LocalStorageEnabled, true);
    settings->setAttribute(QWebEngineSettings::LocalContentCanAccessRemoteUrls, true);
    settings->setAttribute(QWebEngineSettings::LocalContentCanAccessFileUrls, true);
    settings->setAttribute(QWebEngineSettings::JavascriptCanAccessClipboard, true);
    settings->setAttribute(QWebEngineSettings::AllowWindowActivationFromJavaScript, true);
    settings->setAttribute(QWebEngineSettings::WebGLEnabled, true);
    settings->setAttribute(QWebEngineSettings::Accelerated2dCanvasEnabled, true);
    
    // Create and show main window
    MainWindow mainWindow;
    mainWindow.show();
    
    return app.exec();
}
