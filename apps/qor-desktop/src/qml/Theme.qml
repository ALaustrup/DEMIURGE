pragma Singleton
import QtQuick

/**
 * QØЯ Theme - "Obsidian Glass & Digital Aether"
 * 
 * The design system singleton containing all color tokens, 
 * typography definitions, and depth layer configurations.
 * 
 * Aesthetic: Ancient Gnostic Tech meets Cyberpunk
 * Vibe: Eternal Flame code cyphers emerging from the digital abyss
 */
QtObject {
    id: theme
    
    // ========================================================================
    // COLOR PALETTE
    // ========================================================================
    
    // The Void - Background colors
    readonly property color voidBlack: "#050505"           // Almost pure black
    readonly property color voidDeep: "#080808"            // Slightly lighter for contrast
    
    // The Glass - Panel colors (use with opacity)
    readonly property color glassPanel: "#0A0A0A"          // Dark charcoal base
    readonly property color glassPanelDock: "#101010"      // Dock panels
    readonly property color glassPanelWindow: "#0C0C0C"    // Window panels
    readonly property color glassPanelPopup: "#0E0E0E"     // Popup/menu panels
    
    // Panel borders
    readonly property color panelBorder: "#303030"         // Subtle edge definition
    readonly property color panelBorderActive: "#404040"   // Active/focused edge
    
    // Text colors
    readonly property color textPrimary: "#E0E0E0"         // High readability white
    readonly property color textSecondary: "#7A7A7A"       // Gunmetal grey for labels
    readonly property color textMuted: "#505050"           // Very dim text
    readonly property color textDisabled: "#3A3A3A"        // Disabled state
    
    // The Eternal Flame - Accent colors (living magma gradient)
    readonly property color accentFlame: "#FF3D00"         // Flame start (red-orange)
    readonly property color accentMagma: "#FF9100"         // Flame end (orange)
    readonly property color accentEmber: "#FF6B00"         // Mid-point ember
    
    // The Cipher - Data/code accent
    readonly property color cipherCyan: "#00FFC8"          // Subtle cyan for data lines
    readonly property color cipherCyanDim: "#00664F"       // Dimmed cyan
    
    // State colors
    readonly property color success: "#00FF88"
    readonly property color warning: "#FFB800"
    readonly property color error: "#FF3366"
    readonly property color info: "#00AAFF"
    
    // ========================================================================
    // DEPTH LAYERS (Z-Axis Atmospheric Perspective)
    // ========================================================================
    
    // Layer configurations: { blur, opacity, borderOpacity }
    readonly property var layerDesktop: ({ blur: 0, opacity: 1.0, borderOpacity: 0 })
    readonly property var layerDock: ({ blur: 25, opacity: 0.85, borderOpacity: 0.3 })
    readonly property var layerWindow: ({ blur: 35, opacity: 0.88, borderOpacity: 0.4 })
    readonly property var layerPopup: ({ blur: 45, opacity: 0.92, borderOpacity: 0.5 })
    
    // ========================================================================
    // TYPOGRAPHY
    // ========================================================================
    
    // Font families (loaded from resources)
    readonly property string fontHeader: "Orbitron"        // Futuristic headers
    readonly property string fontAncient: "Cinzel"         // Ancient/mystical headers
    readonly property string fontBody: "Rajdhani"          // Clean body text
    readonly property string fontCode: "JetBrains Mono"    // Code/data display
    
    // Font sizes
    readonly property int fontSizeHuge: 48
    readonly property int fontSizeH1: 32
    readonly property int fontSizeH2: 24
    readonly property int fontSizeH3: 18
    readonly property int fontSizeBody: 16
    readonly property int fontSizeSmall: 14
    readonly property int fontSizeLabel: 12
    readonly property int fontSizeTiny: 10
    
    // ========================================================================
    // SPACING & DIMENSIONS
    // ========================================================================
    
    readonly property int spacingTiny: 4
    readonly property int spacingSmall: 8
    readonly property int spacingMedium: 16
    readonly property int spacingLarge: 24
    readonly property int spacingXLarge: 32
    readonly property int spacingHuge: 48
    
    // Border radius
    readonly property int radiusSmall: 4
    readonly property int radiusMedium: 8
    readonly property int radiusLarge: 12
    readonly property int radiusXLarge: 16
    
    // Dock dimensions
    readonly property int dockHeight: 56
    readonly property int dockItemSize: 44
    readonly property int dockPadding: 6
    
    // Window dimensions
    readonly property int windowHeaderHeight: 36
    readonly property int windowMinWidth: 320
    readonly property int windowMinHeight: 240
    readonly property int windowResizeMargin: 8
    
    // ========================================================================
    // ANIMATIONS
    // ========================================================================
    
    readonly property int animFast: 150
    readonly property int animNormal: 250
    readonly property int animSlow: 400
    readonly property int animVerySlow: 600
    
    // Breathing glow animation (for QOR button)
    readonly property int breatheDuration: 3000
    readonly property real breatheMinOpacity: 0.6
    readonly property real breatheMaxOpacity: 1.0
    
    // ========================================================================
    // GLOW EFFECTS
    // ========================================================================
    
    readonly property int glowRadiusSmall: 8
    readonly property int glowRadiusMedium: 16
    readonly property int glowRadiusLarge: 24
    readonly property int glowRadiusHuge: 40
    
    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================
    
    /**
     * Get layer configuration by depth level
     * @param level 0=desktop, 1=dock, 2=window, 3=popup
     */
    function getLayer(level: int): var {
        switch (level) {
            case 0: return layerDesktop
            case 1: return layerDock
            case 2: return layerWindow
            case 3: return layerPopup
            default: return layerWindow
        }
    }
    
    /**
     * Create a flame gradient for use in items
     */
    function flameGradient(): Gradient {
        return Qt.createQmlObject(
            'import QtQuick; Gradient { 
                GradientStop { position: 0.0; color: "#FF3D00" }
                GradientStop { position: 0.5; color: "#FF6B00" }
                GradientStop { position: 1.0; color: "#FF9100" }
            }', theme)
    }
}
