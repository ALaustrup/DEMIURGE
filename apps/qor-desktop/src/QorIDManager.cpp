/**
 * QorIDManager Implementation
 */

#include "QorIDManager.h"

#include <QSettings>
#include <QCryptographicHash>
#include <QRandomGenerator>
#include <QDebug>

QorIDManager::QorIDManager(QObject *parent)
    : QObject(parent)
{
    // Try to load existing credentials from keychain
    loadFromKeychain();
}

QorIDManager::~QorIDManager()
{
}

bool QorIDManager::login()
{
    // In a full implementation, this would open a login dialog
    // For now, we generate a new identity if none exists
    
    if (m_privateKey.isEmpty()) {
        generateKeyPair();
        m_username = "Anonymous";
        m_authenticated = true;
        saveToKeychain();
        emit authChanged();
        return true;
    }
    
    m_authenticated = true;
    emit authChanged();
    return true;
}

bool QorIDManager::loginWithCredentials(const QString &username, const QString &password)
{
    // In production, this would authenticate against the QorID service
    // For now, we just store the username and generate keys
    
    m_username = username;
    
    // Derive key from password (simplified - use proper KDF in production)
    QByteArray seed = QCryptographicHash::hash(
        (username + password).toUtf8(),
        QCryptographicHash::Sha256
    );
    
    // Use seed to generate deterministic keypair
    // In production, use proper Ed25519 key derivation
    m_privateKey = seed;
    m_publicKey = QCryptographicHash::hash(seed, QCryptographicHash::Sha256);
    
    m_authenticated = true;
    saveToKeychain();
    emit authChanged();
    
    return true;
}

void QorIDManager::logout()
{
    m_authenticated = false;
    emit authChanged();
}

QString QorIDManager::signMessage(const QString &message)
{
    if (!m_authenticated || m_privateKey.isEmpty()) {
        return QString();
    }
    
    emit signatureRequested(message);
    
    // Simplified signing - in production use proper Ed25519
    QByteArray toSign = message.toUtf8() + m_privateKey;
    QByteArray signature = QCryptographicHash::hash(toSign, QCryptographicHash::Sha256);
    
    QString sig = signature.toHex();
    emit signatureCompleted(sig);
    
    return sig;
}

QString QorIDManager::getPublicKey() const
{
    return m_publicKey.toHex();
}

void QorIDManager::saveToKeychain()
{
    // In production, use platform keychain (Windows Credential Manager,
    // macOS Keychain, Linux Secret Service)
    
    // For now, use QSettings with obfuscation
    QSettings settings("Demiurge", "AbyssExplorer");
    settings.beginGroup("QorID");
    settings.setValue("username", m_username);
    // Note: Never store private keys in plain QSettings in production!
    // This is just a placeholder
    settings.setValue("publicKey", m_publicKey.toHex());
    settings.endGroup();
}

void QorIDManager::loadFromKeychain()
{
    QSettings settings("Demiurge", "AbyssExplorer");
    settings.beginGroup("QorID");
    
    m_username = settings.value("username").toString();
    QString pubKeyHex = settings.value("publicKey").toString();
    
    if (!pubKeyHex.isEmpty()) {
        m_publicKey = QByteArray::fromHex(pubKeyHex.toUtf8());
        // Note: We don't store/load private key in this demo
    }
    
    settings.endGroup();
}

void QorIDManager::generateKeyPair()
{
    // Generate random 32-byte private key
    m_privateKey.resize(32);
    for (int i = 0; i < 32; ++i) {
        m_privateKey[i] = static_cast<char>(QRandomGenerator::global()->bounded(256));
    }
    
    // Derive public key (simplified - use Ed25519 in production)
    m_publicKey = QCryptographicHash::hash(m_privateKey, QCryptographicHash::Sha256);
}
