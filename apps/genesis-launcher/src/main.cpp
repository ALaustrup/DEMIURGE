/**
 * DEMIURGE QOR - Main Entry Point (Simplified)
 */

#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>
#include <QFontDatabase>
#include <QIcon>

#include "core/LauncherCore.h"
#include "auth/AuthManager.h"
#include "auth/KeyVault.h"
#include "ipc/IPCServer.h"
#include "updater/UpdateEngine.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    
    // Application metadata
    app.setApplicationName("DemiurgeQor");
    app.setApplicationVersion("1.0.0");
    app.setOrganizationName("Demiurge");
    app.setOrganizationDomain("demiurge.cloud");
    
    // Set application icon
    app.setWindowIcon(QIcon(":/icons/genesis.png"));
    
    // Use custom style
    QQuickStyle::setStyle("Basic");
    
    // Load custom fonts
    QFontDatabase::addApplicationFont(":/fonts/Orbitron-Bold.ttf");
    QFontDatabase::addApplicationFont(":/fonts/Rajdhani-Medium.ttf");
    QFontDatabase::addApplicationFont(":/fonts/JetBrainsMono-Regular.ttf");
    
    // Initialize core systems
    LauncherCore launcherCore;
    AuthManager authManager;
    KeyVault keyVault;
    IPCServer ipcServer;
    UpdateEngine updateEngine;
    
    // Create QML engine
    QQmlApplicationEngine engine;
    
    // Expose C++ objects to QML
    engine.rootContext()->setContextProperty("LauncherCore", &launcherCore);
    engine.rootContext()->setContextProperty("AuthManager", &authManager);
    engine.rootContext()->setContextProperty("KeyVault", &keyVault);
    engine.rootContext()->setContextProperty("IPCServer", &ipcServer);
    engine.rootContext()->setContextProperty("UpdateEngine", &updateEngine);
    
    // Add QML import paths
    engine.addImportPath("qrc:/qml");
    
    // Load main QML file
    const QUrl mainUrl(QStringLiteral("qrc:/qml/LauncherWindow.qml"));
    
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
                     &app, [mainUrl](QObject *obj, const QUrl &objUrl) {
        if (!obj && mainUrl == objUrl) {
            qCritical() << "Failed to load QML";
            QCoreApplication::exit(-1);
        }
    }, Qt::QueuedConnection);
    
    engine.load(mainUrl);
    
    return app.exec();
}
