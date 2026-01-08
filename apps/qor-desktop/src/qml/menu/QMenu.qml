import QtQuick
import QtQuick.Layouts

import "../components"
import "../dock"

/**
 * QMenu - Context-Aware App Launcher
 * 
 * The main application launcher that opens from the QOR button.
 * Automatically positions itself based on dock location.
 * 
 * Features:
 *   - Tabbed interface (Wallet, Mining, Apps, Settings)
 *   - Context-aware opening direction
 *   - Staggered item reveal animation
 */
Item {
    id: qMenu
    
    // ========================================================================
    // PUBLIC PROPERTIES
    // ========================================================================
    
    /** Dock position for context-aware opening */
    property int dockPosition: QDock.Position.Top
    
    /** QOR button rect for positioning */
    property rect dockRect: Qt.rect(0, 0, 0, 0)
    
    /** Connected QorID */
    property string abyssId: ""
    
    /** Premium tier */
    property int premiumTier: 0
    
    /** Whether menu is open */
    property bool isOpen: false
    
    // ========================================================================
    // SIGNALS
    // ========================================================================
    
    signal appLaunched(string appId)
    signal logoutRequested()
    signal lockRequested()
    
    // ========================================================================
    // PUBLIC METHODS
    // ========================================================================
    
    function toggle() {
        isOpen = !isOpen
    }
    
    function open() {
        isOpen = true
    }
    
    function close() {
        isOpen = false
    }
    
    // ========================================================================
    // LAYOUT
    // ========================================================================
    
    anchors.fill: parent
    z: 500
    visible: isOpen
    
    // Background overlay (click to close)
    Rectangle {
        anchors.fill: parent
        color: "transparent"
        
        MouseArea {
            anchors.fill: parent
            onClicked: qMenu.close()
        }
    }
    
    // ========================================================================
    // MENU PANEL
    // ========================================================================
    
    GlassPanel {
        id: menuPanel
        
        // Size
        width: 400
        height: 500
        depthLevel: 3
        showBorder: true
        
        // Position based on dock location
        x: {
            switch (dockPosition) {
                case QDock.Position.Top:
                case QDock.Position.Bottom:
                    return dockRect.x + dockRect.width / 2 - width / 2
                case QDock.Position.Left:
                    return dockRect.x + dockRect.width + Theme.spacingSmall
                case QDock.Position.Right:
                    return dockRect.x - width - Theme.spacingSmall
                default:
                    return (parent.width - width) / 2
            }
        }
        
        y: {
            switch (dockPosition) {
                case QDock.Position.Top:
                    return dockRect.y + dockRect.height + Theme.spacingSmall
                case QDock.Position.Bottom:
                    return dockRect.y - height - Theme.spacingSmall
                case QDock.Position.Left:
                case QDock.Position.Right:
                    return dockRect.y + dockRect.height / 2 - height / 2
                default:
                    return (parent.height - height) / 2
            }
        }
        
        // Animation
        opacity: isOpen ? 1 : 0
        scale: isOpen ? 1 : 0.9
        transformOrigin: {
            switch (dockPosition) {
                case QDock.Position.Top: return Item.Top
                case QDock.Position.Bottom: return Item.Bottom
                case QDock.Position.Left: return Item.Left
                case QDock.Position.Right: return Item.Right
                default: return Item.Center
            }
        }
        
        Behavior on opacity { NumberAnimation { duration: Theme.animNormal; easing.type: Easing.OutQuad } }
        Behavior on scale { NumberAnimation { duration: Theme.animNormal; easing.type: Easing.OutBack } }
        
        // ================================================================
        // MENU CONTENT
        // ================================================================
        
        ColumnLayout {
            anchors.fill: parent
            spacing: 0
            
            // ============================================================
            // HEADER
            // ============================================================
            
            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 60
                color: "transparent"
                
                RowLayout {
                    anchors.fill: parent
                    anchors.margins: Theme.spacingMedium
                    spacing: Theme.spacingMedium
                    
                    // User avatar
                    Rectangle {
                        width: 40
                        height: 40
                        radius: 20
                        color: Theme.accentFlame
                        
                        Text {
                            anchors.centerIn: parent
                            text: abyssId.charAt(0).toUpperCase()
                            font.family: Theme.fontHeader
                            font.pixelSize: 18
                            font.weight: Font.Bold
                            color: Theme.voidBlack
                        }
                    }
                    
                    // User info
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 2
                        
                        Text {
                            text: abyssId || "Anonymous"
                            font.family: Theme.fontBody
                            font.pixelSize: Theme.fontSizeBody
                            font.weight: Font.Medium
                            color: Theme.textPrimary
                        }
                        
                        Text {
                            text: ["Free", "Archon", "Genesis"][premiumTier] + " Tier"
                            font.family: Theme.fontBody
                            font.pixelSize: Theme.fontSizeSmall
                            color: premiumTier > 0 ? Theme.accentMagma : Theme.textSecondary
                        }
                    }
                }
            }
            
            // Divider
            Rectangle {
                Layout.fillWidth: true
                height: 1
                color: Theme.panelBorder
            }
            
            // ============================================================
            // TAB BAR
            // ============================================================
            
            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 44
                color: "transparent"
                
                RowLayout {
                    anchors.fill: parent
                    anchors.margins: Theme.spacingSmall
                    spacing: 0
                    
                    Repeater {
                        model: ["Apps", "Wallet", "Mining", "Settings"]
                        
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            radius: Theme.radiusSmall
                            color: tabIndex === index ? Theme.glassPanelWindow : "transparent"
                            
                            property int tabIndex: index
                            
                            Text {
                                anchors.centerIn: parent
                                text: modelData
                                font.family: Theme.fontBody
                                font.pixelSize: Theme.fontSizeSmall
                                font.weight: currentTab === index ? Font.Medium : Font.Normal
                                color: currentTab === index ? Theme.textPrimary : Theme.textSecondary
                            }
                            
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: currentTab = parent.tabIndex
                            }
                            
                            Behavior on color { ColorAnimation { duration: Theme.animFast } }
                        }
                    }
                }
            }
            
            // ============================================================
            // TAB CONTENT
            // ============================================================
            
            property int currentTab: 0
            
            StackLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                currentIndex: parent.currentTab
                
                // Apps Tab
                QMenuGrid {
                    apps: [
                        { id: "wallet", name: "Wallet", icon: "💰", description: "Manage your CGT" },
                        { id: "mining", name: "Mining", icon: "⛏️", description: "Mine CGT" },
                        { id: "explorer", name: "Explorer", icon: "🌐", description: "Browse the web" },
                        { id: "neon", name: "NEON", icon: "🎵", description: "Media player" },
                        { id: "wryt", name: "WRYT", icon: "📝", description: "Document editor" },
                        { id: "files", name: "Files", icon: "📁", description: "File manager" },
                        { id: "settings", name: "Settings", icon: "⚙️", description: "System settings" }
                    ]
                    
                    onAppClicked: {
                        qMenu.close()
                        qMenu.appLaunched(appId)
                    }
                }
                
                // Wallet Tab (placeholder)
                Item {
                    ColumnLayout {
                        anchors.centerIn: parent
                        spacing: Theme.spacingMedium
                        
                        Text {
                            text: "💰"
                            font.pixelSize: 48
                            Layout.alignment: Qt.AlignHCenter
                        }
                        
                        Text {
                            text: "0.00 CGT"
                            font.family: Theme.fontHeader
                            font.pixelSize: Theme.fontSizeH2
                            color: Theme.textPrimary
                            Layout.alignment: Qt.AlignHCenter
                        }
                        
                        Text {
                            text: "Wallet features coming soon"
                            font.family: Theme.fontBody
                            font.pixelSize: Theme.fontSizeSmall
                            color: Theme.textSecondary
                            Layout.alignment: Qt.AlignHCenter
                        }
                    }
                }
                
                // Mining Tab (placeholder)
                Item {
                    ColumnLayout {
                        anchors.centerIn: parent
                        spacing: Theme.spacingMedium
                        
                        Text {
                            text: "⛏️"
                            font.pixelSize: 48
                            Layout.alignment: Qt.AlignHCenter
                        }
                        
                        Text {
                            text: "Mining Inactive"
                            font.family: Theme.fontBody
                            font.pixelSize: Theme.fontSizeBody
                            color: Theme.textSecondary
                            Layout.alignment: Qt.AlignHCenter
                        }
                    }
                }
                
                // Settings Tab
                Item {
                    ColumnLayout {
                        anchors.fill: parent
                        anchors.margins: Theme.spacingMedium
                        spacing: Theme.spacingMedium
                        
                        FlameButton {
                            Layout.fillWidth: true
                            text: "Lock Screen"
                            iconSource: ""
                            onClicked: {
                                qMenu.close()
                                qMenu.lockRequested()
                            }
                        }
                        
                        FlameButton {
                            Layout.fillWidth: true
                            text: "Logout"
                            onClicked: {
                                qMenu.close()
                                qMenu.logoutRequested()
                            }
                        }
                        
                        Item { Layout.fillHeight: true }
                        
                        Text {
                            text: "QØЯ v1.0.0"
                            font.family: Theme.fontBody
                            font.pixelSize: Theme.fontSizeTiny
                            color: Theme.textMuted
                            Layout.alignment: Qt.AlignHCenter
                        }
                    }
                }
            }
        }
    }
}
