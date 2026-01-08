import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

import "components"

/**
 * LoginView - AbyssID Authentication
 * 
 * A centered glass-morphic login modal for AbyssID authentication.
 * Supports both new identity creation and existing identity import.
 */
Item {
    id: loginView
    
    // ========================================================================
    // SIGNALS
    // ========================================================================
    
    signal loginSuccess(string abyssId, int tier)
    
    // ========================================================================
    // STATE
    // ========================================================================
    
    property bool isCreating: false
    property bool isLoading: false
    property string errorMessage: ""
    
    // ========================================================================
    // BACKGROUND OVERLAY
    // ========================================================================
    
    Rectangle {
        anchors.fill: parent
        color: Qt.rgba(Theme.voidBlack.r, Theme.voidBlack.g, Theme.voidBlack.b, 0.7)
    }
    
    // ========================================================================
    // LOGIN PANEL
    // ========================================================================
    
    GlassPanel {
        id: loginPanel
        anchors.centerIn: parent
        width: 420
        height: isCreating ? 500 : 400
        depthLevel: 3
        showBorder: true
        
        Behavior on height {
            NumberAnimation { duration: Theme.animNormal; easing.type: Easing.OutQuad }
        }
        
        ColumnLayout {
            anchors.fill: parent
            anchors.margins: Theme.spacingLarge
            spacing: Theme.spacingLarge
            
            // ================================================================
            // HEADER
            // ================================================================
            
            ColumnLayout {
                Layout.fillWidth: true
                spacing: Theme.spacingSmall
                
                GlowText {
                    text: "QØЯ"
                    fontFamily: Theme.fontHeader
                    fontSize: Theme.fontSizeH1
                    glowing: true
                    Layout.alignment: Qt.AlignHCenter
                }
                
                Text {
                    text: isCreating ? "Create Your AbyssID" : "Enter the Abyss"
                    font.family: Theme.fontAncient
                    font.pixelSize: Theme.fontSizeBody
                    color: Theme.textSecondary
                    Layout.alignment: Qt.AlignHCenter
                }
            }
            
            // ================================================================
            // INPUT FIELDS
            // ================================================================
            
            ColumnLayout {
                Layout.fillWidth: true
                spacing: Theme.spacingMedium
                
                // Username field
                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: Theme.spacingTiny
                    
                    Text {
                        text: "AbyssID"
                        font.family: Theme.fontBody
                        font.pixelSize: Theme.fontSizeLabel
                        color: Theme.textSecondary
                    }
                    
                    Rectangle {
                        Layout.fillWidth: true
                        height: 44
                        color: Theme.glassPanelDock
                        radius: Theme.radiusSmall
                        border.width: 1
                        border.color: usernameInput.activeFocus ? Theme.accentFlame : Theme.panelBorder
                        
                        TextInput {
                            id: usernameInput
                            anchors.fill: parent
                            anchors.margins: Theme.spacingSmall
                            font.family: Theme.fontCode
                            font.pixelSize: Theme.fontSizeBody
                            color: Theme.textPrimary
                            selectionColor: Theme.accentFlame
                            clip: true
                            
                            Text {
                                anchors.fill: parent
                                text: "your-abyss-id"
                                font: parent.font
                                color: Theme.textMuted
                                visible: !parent.text && !parent.activeFocus
                            }
                        }
                    }
                }
                
                // Password field
                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: Theme.spacingTiny
                    
                    Text {
                        text: "Secret Phrase"
                        font.family: Theme.fontBody
                        font.pixelSize: Theme.fontSizeLabel
                        color: Theme.textSecondary
                    }
                    
                    Rectangle {
                        Layout.fillWidth: true
                        height: 44
                        color: Theme.glassPanelDock
                        radius: Theme.radiusSmall
                        border.width: 1
                        border.color: passwordInput.activeFocus ? Theme.accentFlame : Theme.panelBorder
                        
                        TextInput {
                            id: passwordInput
                            anchors.fill: parent
                            anchors.margins: Theme.spacingSmall
                            font.family: Theme.fontCode
                            font.pixelSize: Theme.fontSizeBody
                            color: Theme.textPrimary
                            echoMode: TextInput.Password
                            selectionColor: Theme.accentFlame
                            clip: true
                            
                            Text {
                                anchors.fill: parent
                                text: "Enter your secret phrase"
                                font: parent.font
                                color: Theme.textMuted
                                visible: !parent.text && !parent.activeFocus
                            }
                        }
                    }
                }
                
                // Confirm password (create mode only)
                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: Theme.spacingTiny
                    visible: isCreating
                    
                    Text {
                        text: "Confirm Phrase"
                        font.family: Theme.fontBody
                        font.pixelSize: Theme.fontSizeLabel
                        color: Theme.textSecondary
                    }
                    
                    Rectangle {
                        Layout.fillWidth: true
                        height: 44
                        color: Theme.glassPanelDock
                        radius: Theme.radiusSmall
                        border.width: 1
                        border.color: confirmInput.activeFocus ? Theme.accentFlame : Theme.panelBorder
                        
                        TextInput {
                            id: confirmInput
                            anchors.fill: parent
                            anchors.margins: Theme.spacingSmall
                            font.family: Theme.fontCode
                            font.pixelSize: Theme.fontSizeBody
                            color: Theme.textPrimary
                            echoMode: TextInput.Password
                            selectionColor: Theme.accentFlame
                            clip: true
                        }
                    }
                }
            }
            
            // ================================================================
            // ERROR MESSAGE
            // ================================================================
            
            Text {
                text: errorMessage
                font.family: Theme.fontBody
                font.pixelSize: Theme.fontSizeSmall
                color: Theme.error
                visible: errorMessage !== ""
                Layout.alignment: Qt.AlignHCenter
            }
            
            // ================================================================
            // BUTTONS
            // ================================================================
            
            ColumnLayout {
                Layout.fillWidth: true
                spacing: Theme.spacingSmall
                
                FlameButton {
                    Layout.fillWidth: true
                    text: isCreating ? "Create Identity" : "Authenticate"
                    primary: true
                    enabled: !isLoading && usernameInput.text.length > 0 && passwordInput.text.length > 0
                    
                    onClicked: {
                        if (isCreating && passwordInput.text !== confirmInput.text) {
                            errorMessage = "Phrases do not match"
                            return
                        }
                        
                        isLoading = true
                        errorMessage = ""
                        
                        // Simulate authentication (would call actual auth here)
                        authTimer.start()
                    }
                }
                
                FlameButton {
                    Layout.fillWidth: true
                    text: isCreating ? "Back to Login" : "Create New Identity"
                    
                    onClicked: {
                        isCreating = !isCreating
                        errorMessage = ""
                    }
                }
            }
            
            // Spacer
            Item { Layout.fillHeight: true }
            
            // ================================================================
            // FOOTER
            // ================================================================
            
            Text {
                text: "QØЯ v1.0.0 • Demiurge Blockchain"
                font.family: Theme.fontBody
                font.pixelSize: Theme.fontSizeTiny
                color: Theme.textMuted
                Layout.alignment: Qt.AlignHCenter
            }
        }
    }
    
    // ========================================================================
    // LOADING OVERLAY
    // ========================================================================
    
    Rectangle {
        anchors.fill: loginPanel
        radius: loginPanel.radius
        color: Qt.rgba(Theme.voidBlack.r, Theme.voidBlack.g, Theme.voidBlack.b, 0.8)
        visible: isLoading
        
        ColumnLayout {
            anchors.centerIn: parent
            spacing: Theme.spacingMedium
            
            // Simple loading spinner
            Rectangle {
                width: 40
                height: 40
                radius: 20
                color: "transparent"
                border.width: 3
                border.color: Theme.accentFlame
                Layout.alignment: Qt.AlignHCenter
                
                RotationAnimation on rotation {
                    from: 0
                    to: 360
                    duration: 1000
                    loops: Animation.Infinite
                    running: isLoading
                }
                
                // Gap in the spinner
                Rectangle {
                    width: 10
                    height: 10
                    radius: 5
                    color: Theme.voidBlack
                    anchors.top: parent.top
                    anchors.horizontalCenter: parent.horizontalCenter
                    anchors.topMargin: -2
                }
            }
            
            Text {
                text: "Authenticating..."
                font.family: Theme.fontBody
                font.pixelSize: Theme.fontSizeSmall
                color: Theme.textSecondary
                Layout.alignment: Qt.AlignHCenter
            }
        }
    }
    
    // ========================================================================
    // AUTH SIMULATION
    // ========================================================================
    
    Timer {
        id: authTimer
        interval: 1500
        onTriggered: {
            isLoading = false
            // Simulate successful login
            loginSuccess(usernameInput.text, 0)
        }
    }
}
