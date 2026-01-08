/**
 * Flame Gradient Shader - QØЯ Desktop
 * 
 * Creates the living magma effect used for the eternal flame accent.
 * Animated gradient with subtle noise for organic movement.
 */

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_intensity;

// Noise function for organic feel
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Smooth noise
float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // Flame colors
    vec3 flameStart = vec3(1.0, 0.239, 0.0);  // #FF3D00
    vec3 flameEnd = vec3(1.0, 0.569, 0.0);    // #FF9100
    vec3 ember = vec3(1.0, 0.42, 0.0);        // #FF6B00
    
    // Animated gradient position
    float t = sin(u_time * 0.5) * 0.5 + 0.5;
    
    // Add noise for organic movement
    float n = smoothNoise(st * 5.0 + u_time * 0.3) * 0.1;
    
    // Mix colors based on position and time
    float mixVal = st.x + n + t * 0.2;
    
    vec3 color;
    if (mixVal < 0.5) {
        color = mix(flameStart, ember, mixVal * 2.0);
    } else {
        color = mix(ember, flameEnd, (mixVal - 0.5) * 2.0);
    }
    
    // Apply intensity
    color *= u_intensity;
    
    gl_FragColor = vec4(color, 1.0);
}
