#ifndef BUGREPORTDIALOG_H
#define BUGREPORTDIALOG_H

#include <QDialog>

class QLineEdit;
class QTextEdit;
class QComboBox;
class QPushButton;
class QNetworkAccessManager;
class QNetworkReply;

class BugReportDialog : public QDialog
{
    Q_OBJECT

public:
    explicit BugReportDialog(QWidget *parent = nullptr);

private slots:
    void onSubmit();
    void onSubmitFinished(QNetworkReply *reply);

private:
    void setupUi();

    QComboBox *m_categoryCombo;
    QLineEdit *m_titleEdit;
    QTextEdit *m_descriptionEdit;
    QPushButton *m_submitButton;
    QNetworkAccessManager *m_networkManager;
};

#endif // BUGREPORTDIALOG_H
