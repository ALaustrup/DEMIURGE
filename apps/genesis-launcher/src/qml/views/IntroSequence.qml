/**
 * IntroSequence.qml - Cinematic Intro Sequence
 * 
 * Shows branded intro animations in sequence:
 * 1. Genesis Logo (3s)
 * 2. Abyss OS Logo (3s)
 * 3. Demiurge Blockchain Logo (3s)
 * 
 * Uses animated text with glow effects.
 * Video support can be added later when video files are available.
 */
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Effects

Item {
    id: root
    
    signal sequenceComplete()
    signal skipRequested()
    
    // Theme colors
    readonly property color voidColor: "#050505"
    readonly property color textPrimary: "#E0E0E0"
    readonly property color textSecondary: "#7A7A7A"
    readonly property color flameOrange: "#FF3D00"
    readonly property color flameGold: "#FF9100"
    readonly property color cipherCyan: "#00FFC8"
    
    // Sequence configuration
    readonly property var logoSequence: [
        { text: "GENESIS", color: flameOrange, duration: 3000 },
        { text: "ABYSS OS", color: cipherCyan, duration: 3000 },
        { text: "DEMIURGE", color: "#8844FF", duration: 3000 }
    ]
    
    property int currentIndex: 0
    property bool canSkip: false
    property bool isRunning: false
    
    // Full black background
    Rectangle {
        anchors.fill: parent
        color: voidColor
    }
    
    // Logo display
    Item {
        id: logoContainer
        anchors.centerIn: parent
        width: parent.width
        height: 120
        
        Text {
            id: logoText
            anchors.centerIn: parent
            text: currentIndex < logoSequence.length ? logoSequence[currentIndex].text : ""
            font.family: "Orbitron"
            font.pixelSize: 56
            font.weight: Font.Bold
            color: textPrimary
            opacity: 0
            
            // Glow effect
            layer.enabled: true
            layer.effect: MultiEffect {
                blurEnabled: true
                blur: 0.4
                blurMax: 24
                colorization: 1.0
                colorizationColor: currentIndex < logoSequence.length ? 
                    logoSequence[currentIndex].color : flameOrange
            }
        }
    }
    
    // Animation sequence
    SequentialAnimation {
        id: logoAnimation
        
        // Fade in
        NumberAnimation {
            target: logoText
            property: "opacity"
            from: 0
            to: 1
            duration: 400
            easing.type: Easing.OutQuad
        }
        
        // Scale pulse
        ParallelAnimation {
            NumberAnimation {
                target: logoText
                property: "scale"
                from: 0.95
                to: 1.0
                duration: 300
                easing.type: Easing.OutBack
            }
        }
        
        // Hold
        PauseAnimation { 
            duration: currentIndex < logoSequence.length ? 
                logoSequence[currentIndex].duration - 800 : 2000
        }
        
        // Fade out
        NumberAnimation {
            target: logoText
            property: "opacity"
            from: 1
            to: 0
            duration: 400
            easing.type: Easing.InQuad
        }
        
        onFinished: {
            playNext()
        }
    }
    
    // Skip button (appears after first logo)
    Rectangle {
        anchors.bottom: parent.bottom
        anchors.right: parent.right
        anchors.margins: 30
        
        width: skipText.implicitWidth + 30
        height: 36
        radius: 18
        
        color: Qt.rgba(1, 1, 1, 0.1)
        border.width: 1
        border.color: Qt.rgba(1, 1, 1, 0.2)
        
        visible: canSkip
        opacity: skipMouseArea.containsMouse ? 1.0 : 0.6
        
        Behavior on opacity {
            NumberAnimation { duration: 150 }
        }
        
        Text {
            id: skipText
            anchors.centerIn: parent
            text: "SKIP →"
            color: textSecondary
            font.family: "Rajdhani"
            font.pixelSize: 13
            font.letterSpacing: 1
        }
        
        MouseArea {
            id: skipMouseArea
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            
            onClicked: {
                logoAnimation.stop()
                root.skipRequested()
                root.sequenceComplete()
            }
        }
    }
    
    // Progress dots
    Row {
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottomMargin: 30
        spacing: 12
        
        Repeater {
            model: logoSequence.length
            
            Rectangle {
                width: 8
                height: 8
                radius: 4
                color: index <= currentIndex ? textPrimary : "#404040"
                
                Behavior on color {
                    ColorAnimation { duration: 300 }
                }
            }
        }
    }
    
    // Click to skip after first logo
    MouseArea {
        anchors.fill: parent
        enabled: canSkip
        
        onDoubleClicked: {
            logoAnimation.stop()
            root.skipRequested()
            root.sequenceComplete()
        }
    }
    
    // Keyboard shortcuts
    Keys.onPressed: (event) => {
        if (event.key === Qt.Key_Escape || event.key === Qt.Key_Space || 
            event.key === Qt.Key_Return) {
            if (canSkip) {
                logoAnimation.stop()
                root.skipRequested()
                root.sequenceComplete()
            }
            event.accepted = true
        }
    }
    
    function playNext() {
        currentIndex++
        
        if (currentIndex >= logoSequence.length) {
            // Sequence complete
            isRunning = false
            root.sequenceComplete()
            return
        }
        
        // Enable skip after first logo
        if (currentIndex >= 1) {
            canSkip = true
        }
        
        // Play next logo animation
        logoAnimation.start()
    }
    
    function start() {
        currentIndex = 0
        canSkip = false
        isRunning = true
        logoText.opacity = 0
        logoText.scale = 0.95
        
        // Start first animation
        logoAnimation.start()
    }
    
    Component.onCompleted: {
        // Auto-start when component loads
        start()
        
        // Enable keyboard focus
        forceActiveFocus()
    }
}
