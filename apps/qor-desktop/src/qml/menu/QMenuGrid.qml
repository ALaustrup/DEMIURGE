import QtQuick
import QtQuick.Layouts

import "../components"

/**
 * QMenuGrid - App Grid for Q-Menu
 * 
 * Displays available applications in a grid layout
 * with staggered reveal animation.
 */
Item {
    id: menuGrid
    
    // ========================================================================
    // PUBLIC PROPERTIES
    // ========================================================================
    
    /** List of app objects { id, name, icon, description } */
    property var apps: []
    
    // ========================================================================
    // SIGNALS
    // ========================================================================
    
    signal appClicked(string appId)
    
    // ========================================================================
    // GRID
    // ========================================================================
    
    GridLayout {
        anchors.fill: parent
        anchors.margins: Theme.spacingMedium
        columns: 3
        rowSpacing: Theme.spacingMedium
        columnSpacing: Theme.spacingMedium
        
        Repeater {
            model: apps
            
            Rectangle {
                id: appItem
                Layout.fillWidth: true
                Layout.preferredHeight: 100
                radius: Theme.radiusMedium
                color: mouseArea.containsMouse ? Theme.glassPanelWindow : "transparent"
                border.width: mouseArea.containsMouse ? 1 : 0
                border.color: Theme.panelBorder
                
                property int itemIndex: index
                
                // Staggered reveal
                opacity: 0
                Component.onCompleted: {
                    revealAnim.start()
                }
                
                NumberAnimation {
                    id: revealAnim
                    target: appItem
                    property: "opacity"
                    from: 0
                    to: 1
                    duration: Theme.animNormal
                    easing.type: Easing.OutQuad
                    // Stagger based on index
                    Component.onCompleted: {
                        revealAnim.delay = appItem.itemIndex * 50
                    }
                }
                
                ColumnLayout {
                    anchors.centerIn: parent
                    spacing: Theme.spacingSmall
                    
                    Text {
                        text: modelData.icon
                        font.pixelSize: 32
                        Layout.alignment: Qt.AlignHCenter
                    }
                    
                    Text {
                        text: modelData.name
                        font.family: Theme.fontBody
                        font.pixelSize: Theme.fontSizeSmall
                        font.weight: Font.Medium
                        color: Theme.textPrimary
                        Layout.alignment: Qt.AlignHCenter
                    }
                }
                
                MouseArea {
                    id: mouseArea
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    
                    onClicked: menuGrid.appClicked(modelData.id)
                }
                
                Behavior on color { ColorAnimation { duration: Theme.animFast } }
                Behavior on border.width { NumberAnimation { duration: Theme.animFast } }
            }
        }
    }
}
