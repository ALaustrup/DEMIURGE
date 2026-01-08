import QtQuick
import QtQuick.Layouts

import "../components"

/**
 * QDock - The Modular Taskbar
 * 
 * A smoky glass strip that can be positioned on any edge of the screen.
 * Contains the QOR button (center by default), running app indicators,
 * and quick access shortcuts.
 * 
 * Positioning Logic:
 *   Top/Bottom: Horizontal, full width, 56px height
 *   Left/Right: Vertical, full height, 56px width
 */
Item {
    id: qDock
    
    // ========================================================================
    // POSITION ENUM
    // ========================================================================
    
    enum Position {
        Top,
        Bottom,
        Left,
        Right
    }
    
    // ========================================================================
    // PUBLIC PROPERTIES
    // ========================================================================
    
    /** Dock position (Top, Bottom, Left, Right) */
    property int position: QDock.Position.Top
    
    /** QOR button position along dock (0-1) */
    property real qorButtonOffset: 0.5
    
    /** Whether edit mode is active */
    property bool editMode: false
    
    /** List of running app IDs */
    property var runningApps: []
    
    /** Dock size (height for horizontal, width for vertical) */
    readonly property int dockSize: Theme.dockHeight
    
    /** QOR button's rectangle (for menu positioning) */
    readonly property rect qorButtonRect: Qt.rect(
        qorButton.mapToItem(null, 0, 0).x,
        qorButton.mapToItem(null, 0, 0).y,
        qorButton.width,
        qorButton.height
    )
    
    // ========================================================================
    // SIGNALS
    // ========================================================================
    
    signal qorButtonClicked()
    signal appClicked(string appId)
    
    // ========================================================================
    // LAYOUT PROPERTIES
    // ========================================================================
    
    readonly property bool isHorizontal: position === QDock.Position.Top || position === QDock.Position.Bottom
    
    // Position the dock based on setting
    anchors.left: parent.left
    anchors.right: isHorizontal ? parent.right : undefined
    anchors.top: position === QDock.Position.Top || position === QDock.Position.Left ? parent.top : undefined
    anchors.bottom: position === QDock.Position.Bottom || position === QDock.Position.Right ? parent.bottom : undefined
    
    width: isHorizontal ? parent.width : dockSize
    height: isHorizontal ? dockSize : parent.height
    
    // ========================================================================
    // DOCK BACKGROUND
    // ========================================================================
    
    GlassPanel {
        id: dockPanel
        anchors.fill: parent
        depthLevel: 1
        showBorder: true
        contentMargins: Theme.dockPadding
        radius: 0  // No rounded corners on dock
        
        // ================================================================
        // DOCK CONTENT LAYOUT
        // ================================================================
        
        Item {
            anchors.fill: parent
            
            // Left/Top section - Quick actions
            Row {
                id: leftSection
                anchors {
                    left: parent.left
                    verticalCenter: isHorizontal ? parent.verticalCenter : undefined
                    top: isHorizontal ? undefined : parent.top
                }
                spacing: Theme.spacingSmall
                layoutDirection: Qt.LeftToRight
                
                // System info
                QDockItem {
                    icon: "🕐"
                    tooltip: Qt.formatTime(new Date(), "hh:mm")
                    showLabel: false
                    
                    Timer {
                        interval: 60000
                        running: true
                        repeat: true
                        onTriggered: parent.tooltip = Qt.formatTime(new Date(), "hh:mm")
                    }
                }
            }
            
            // Center - QOR Button (draggable in edit mode)
            QORButton {
                id: qorButton
                
                // Position based on offset
                x: isHorizontal ? 
                    (parent.width * qorButtonOffset - width / 2) :
                    (parent.width - width) / 2
                y: isHorizontal ?
                    (parent.height - height) / 2 :
                    (parent.height * qorButtonOffset - height / 2)
                
                editMode: qDock.editMode
                
                onClicked: qDock.qorButtonClicked()
                
                // Drag in edit mode
                Drag.active: dragArea.drag.active
                
                MouseArea {
                    id: dragArea
                    anchors.fill: parent
                    drag.target: qDock.editMode ? qorButton : null
                    drag.axis: isHorizontal ? Drag.XAxis : Drag.YAxis
                    drag.minimumX: 50
                    drag.maximumX: qDock.width - qorButton.width - 50
                    drag.minimumY: 50
                    drag.maximumY: qDock.height - qorButton.height - 50
                    
                    onReleased: {
                        if (qDock.editMode) {
                            // Update offset based on new position
                            if (isHorizontal) {
                                qDock.qorButtonOffset = (qorButton.x + qorButton.width / 2) / qDock.width
                            } else {
                                qDock.qorButtonOffset = (qorButton.y + qorButton.height / 2) / qDock.height
                            }
                        }
                    }
                    
                    onClicked: if (!qDock.editMode) qDock.qorButtonClicked()
                }
            }
            
            // Right/Bottom section - Running apps
            Row {
                id: rightSection
                anchors {
                    right: parent.right
                    verticalCenter: isHorizontal ? parent.verticalCenter : undefined
                    bottom: isHorizontal ? undefined : parent.bottom
                }
                spacing: Theme.spacingSmall
                layoutDirection: Qt.RightToLeft
                
                // Running apps
                Repeater {
                    model: runningApps
                    
                    QDockItem {
                        icon: getAppIcon(modelData)
                        tooltip: getAppName(modelData)
                        running: true
                        
                        onClicked: qDock.appClicked(modelData)
                    }
                }
            }
        }
    }
    
    // ========================================================================
    // EDIT MODE DRAG ZONES
    // ========================================================================
    
    // Drag to reposition dock (only in edit mode)
    MouseArea {
        id: dockDragArea
        anchors.fill: parent
        visible: editMode
        cursorShape: Qt.SizeAllCursor
        
        property point pressPos
        
        onPressed: pressPos = Qt.point(mouseX, mouseY)
        
        onReleased: {
            // Determine new position based on drop location
            var globalPos = mapToItem(null, mouseX, mouseY)
            var parentWidth = qDock.parent.width
            var parentHeight = qDock.parent.height
            
            // Check which edge is closest
            var distTop = globalPos.y
            var distBottom = parentHeight - globalPos.y
            var distLeft = globalPos.x
            var distRight = parentWidth - globalPos.x
            
            var minDist = Math.min(distTop, distBottom, distLeft, distRight)
            
            if (minDist === distTop) position = QDock.Position.Top
            else if (minDist === distBottom) position = QDock.Position.Bottom
            else if (minDist === distLeft) position = QDock.Position.Left
            else position = QDock.Position.Right
        }
    }
    
    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================
    
    function getAppIcon(appId) {
        switch (appId) {
            case "wallet": return "💰"
            case "mining": return "⛏️"
            case "explorer": return "🌐"
            case "neon": return "🎵"
            case "wryt": return "📝"
            case "files": return "📁"
            case "settings": return "⚙️"
            default: return "📦"
        }
    }
    
    function getAppName(appId) {
        switch (appId) {
            case "wallet": return "Abyss Wallet"
            case "mining": return "Mining"
            case "explorer": return "Explorer"
            case "neon": return "NEON"
            case "wryt": return "WRYT"
            case "files": return "Files"
            case "settings": return "Settings"
            default: return appId
        }
    }
}
