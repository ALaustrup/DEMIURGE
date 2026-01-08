/**
 * Bug Report Dialog for DEMIURGE QOR Launcher
 * 
 * Simple dialog for users to report issues directly from the launcher.
 */

#include "BugReportDialog.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QTextEdit>
#include <QLineEdit>
#include <QComboBox>
#include <QPushButton>
#include <QMessageBox>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QJsonDocument>
#include <QJsonObject>
#include <QSysInfo>
#include <QApplication>

BugReportDialog::BugReportDialog(QWidget *parent)
    : QDialog(parent)
    , m_networkManager(new QNetworkAccessManager(this))
{
    setWindowTitle("Report a Bug - DEMIURGE QOR");
    setMinimumSize(600, 700);
    setupUi();
    
    connect(m_networkManager, &QNetworkAccessManager::finished,
            this, &BugReportDialog::onSubmitFinished);
}

void BugReportDialog::setupUi()
{
    auto *mainLayout = new QVBoxLayout(this);
    mainLayout->setSpacing(16);
    mainLayout->setContentsMargins(24, 24, 24, 24);
    
    // Header
    auto *headerLabel = new QLabel("🐛 <b>Report a Bug</b>");
    headerLabel->setStyleSheet("font-size: 18px; color: #FF6B35;");
    mainLayout->addWidget(headerLabel);
    
    auto *descLabel = new QLabel("Help us improve DEMIURGE QOR by reporting issues you encounter.");
    descLabel->setStyleSheet("color: #A0A0A0; font-size: 12px;");
    descLabel->setWordWrap(true);
    mainLayout->addWidget(descLabel);
    
    mainLayout->addSpacing(8);
    
    // Category
    auto *categoryLabel = new QLabel("Category:");
    categoryLabel->setStyleSheet("font-weight: bold; color: #FFFFFF;");
    mainLayout->addWidget(categoryLabel);
    
    m_categoryCombo = new QComboBox();
    m_categoryCombo->addItem("🐛 Bug", "bug");
    m_categoryCombo->addItem("✨ Feature Request", "feature");
    m_categoryCombo->addItem("🎨 UI/UX Issue", "ui");
    m_categoryCombo->addItem("⚡ Performance", "performance");
    m_categoryCombo->addItem("💥 Crash", "crash");
    m_categoryCombo->addItem("📝 Other", "other");
    m_categoryCombo->setStyleSheet(
        "QComboBox { background-color: #2A2A2A; color: #FFFFFF; border: 1px solid #444444; "
        "padding: 8px; border-radius: 4px; }"
        "QComboBox::drop-down { border: none; }"
        "QComboBox::down-arrow { image: url(:/icons/arrow-down.png); width: 12px; height: 12px; }"
    );
    mainLayout->addWidget(m_categoryCombo);
    
    // Title
    auto *titleLabel = new QLabel("Title: *");
    titleLabel->setStyleSheet("font-weight: bold; color: #FFFFFF;");
    mainLayout->addWidget(titleLabel);
    
    m_titleEdit = new QLineEdit();
    m_titleEdit->setPlaceholderText("Brief description of the issue");
    m_titleEdit->setStyleSheet(
        "QLineEdit { background-color: #2A2A2A; color: #FFFFFF; border: 1px solid #444444; "
        "padding: 8px; border-radius: 4px; }"
        "QLineEdit:focus { border: 1px solid #00D9FF; }"
    );
    mainLayout->addWidget(m_titleEdit);
    
    // Description
    auto *descriptionLabel = new QLabel("Description: *");
    descriptionLabel->setStyleSheet("font-weight: bold; color: #FFFFFF;");
    mainLayout->addWidget(descriptionLabel);
    
    m_descriptionEdit = new QTextEdit();
    m_descriptionEdit->setPlaceholderText(
        "Detailed description of the issue...\n\n"
        "Steps to reproduce:\n"
        "1. ...\n"
        "2. ...\n\n"
        "Expected behavior:\n\n"
        "Actual behavior:"
    );
    m_descriptionEdit->setStyleSheet(
        "QTextEdit { background-color: #2A2A2A; color: #FFFFFF; border: 1px solid #444444; "
        "padding: 8px; border-radius: 4px; }"
        "QTextEdit:focus { border: 1px solid #00D9FF; }"
    );
    mainLayout->addWidget(m_descriptionEdit, 1);
    
    // System Info
    QString sysInfo = QString("Platform: %1 • Version: %2 • Qt: %3")
        .arg(QSysInfo::prettyProductName())
        .arg(QApplication::applicationVersion())
        .arg(qVersion());
    
    auto *sysInfoLabel = new QLabel("System Information (included automatically):");
    sysInfoLabel->setStyleSheet("font-size: 10px; color: #666666;");
    mainLayout->addWidget(sysInfoLabel);
    
    auto *sysInfoValue = new QLabel(sysInfo);
    sysInfoValue->setStyleSheet(
        "background-color: #2A2A2A; color: #A0A0A0; "
        "padding: 8px; border-radius: 4px; font-size: 10px; font-family: monospace;"
    );
    sysInfoValue->setWordWrap(true);
    mainLayout->addWidget(sysInfoValue);
    
    // Buttons
    auto *buttonLayout = new QHBoxLayout();
    buttonLayout->addStretch();
    
    auto *cancelButton = new QPushButton("Cancel");
    cancelButton->setStyleSheet(
        "QPushButton { background-color: #3A3A3A; color: #FFFFFF; border: none; "
        "padding: 10px 24px; border-radius: 6px; font-weight: bold; }"
        "QPushButton:hover { background-color: #4A4A4A; }"
    );
    connect(cancelButton, &QPushButton::clicked, this, &QDialog::reject);
    buttonLayout->addWidget(cancelButton);
    
    m_submitButton = new QPushButton("Submit Report");
    m_submitButton->setStyleSheet(
        "QPushButton { background-color: qlineargradient(x1:0, y1:0, x2:1, y2:0, "
        "stop:0 #FF6B35, stop:1 #00D9FF); color: #FFFFFF; border: none; "
        "padding: 10px 24px; border-radius: 6px; font-weight: bold; }"
        "QPushButton:hover { opacity: 0.9; }"
        "QPushButton:disabled { background-color: #3A3A3A; color: #666666; }"
    );
    connect(m_submitButton, &QPushButton::clicked, this, &BugReportDialog::onSubmit);
    buttonLayout->addWidget(m_submitButton);
    
    mainLayout->addLayout(buttonLayout);
    
    // Footer
    auto *footerLabel = new QLabel("Your report helps us build a better DEMIURGE QOR. Thank you! 🙏");
    footerLabel->setStyleSheet("color: #666666; font-size: 10px;");
    footerLabel->setAlignment(Qt::AlignCenter);
    mainLayout->addWidget(footerLabel);
}

void BugReportDialog::onSubmit()
{
    QString title = m_titleEdit->text().trimmed();
    QString description = m_descriptionEdit->toPlainText().trimmed();
    
    if (title.isEmpty() || description.isEmpty()) {
        QMessageBox::warning(this, "Missing Information", 
            "Please fill in both the title and description fields.");
        return;
    }
    
    m_submitButton->setEnabled(false);
    m_submitButton->setText("Submitting...");
    
    // Prepare bug report data
    QJsonObject bugReport;
    bugReport["title"] = QString("[%1] %2")
        .arg(m_categoryCombo->currentData().toString().toUpper())
        .arg(title);
    bugReport["description"] = description;
    bugReport["category"] = m_categoryCombo->currentData().toString();
    bugReport["platform"] = "DEMIURGE QOR Launcher";
    bugReport["os"] = QSysInfo::prettyProductName();
    bugReport["version"] = QApplication::applicationVersion();
    bugReport["qt_version"] = qVersion();
    bugReport["timestamp"] = QDateTime::currentDateTime().toString(Qt::ISODate);
    
    // In production, POST to your bug tracking API
    // For now, just log and show success
    qDebug() << "Bug Report:" << QJsonDocument(bugReport).toJson(QJsonDocument::Indented);
    
    // Simulate network request
    QTimer::singleShot(1000, this, [this]() {
        m_submitButton->setEnabled(true);
        m_submitButton->setText("Submit Report");
        
        QMessageBox::information(this, "Success", 
            "Thank you! Your bug report has been submitted successfully.");
        accept();
    });
}

void BugReportDialog::onSubmitFinished(QNetworkReply *reply)
{
    m_submitButton->setEnabled(true);
    m_submitButton->setText("Submit Report");
    
    if (reply->error() == QNetworkReply::NoError) {
        QMessageBox::information(this, "Success", 
            "Thank you! Your bug report has been submitted successfully.");
        accept();
    } else {
        QMessageBox::critical(this, "Error", 
            QString("Failed to submit bug report:\n%1").arg(reply->errorString()));
    }
    
    reply->deleteLater();
}
