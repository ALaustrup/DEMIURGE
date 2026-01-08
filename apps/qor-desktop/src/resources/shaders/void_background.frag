/**
 * Void Background Shader - QØЯ Desktop
 * 
 * Creates the animated abyss background with floating particles
 * and subtle color shifts.
 */

#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

// Hash function for pseudo-random
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Star/particle function
float star(vec2 uv, vec2 pos, float brightness) {
    float d = length(uv - pos);
    return brightness / (d * d * 500.0 + 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Base void color (almost black)
    vec3 voidColor = vec3(0.02, 0.02, 0.02);
    
    // Add subtle gradient
    float gradient = 1.0 - length(uv - vec2(0.5)) * 0.3;
    voidColor *= gradient;
    
    // Particle accumulator
    float particles = 0.0;
    
    // Generate particles
    for (int i = 0; i < 50; i++) {
        float fi = float(i);
        
        // Particle position with slow drift
        vec2 pos = vec2(
            hash(vec2(fi, 0.0)) + sin(u_time * 0.1 + fi) * 0.02,
            hash(vec2(0.0, fi)) + cos(u_time * 0.08 + fi * 1.3) * 0.015
        );
        
        // Wrap position
        pos = fract(pos);
        
        // Particle brightness with flicker
        float brightness = hash(vec2(fi * 0.1, fi * 0.2)) * 0.5 + 0.5;
        brightness *= 0.8 + sin(u_time * (1.0 + hash(vec2(fi, fi)) * 2.0)) * 0.2;
        
        particles += star(uv, pos, brightness * 0.15);
    }
    
    // Particle color (mix of white and accent colors)
    vec3 particleColor = vec3(0.6, 0.6, 0.6);
    
    // Add occasional flame-colored particles
    float accentParticles = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i) + 100.0;
        vec2 pos = vec2(
            hash(vec2(fi, 0.0)) + sin(u_time * 0.05 + fi) * 0.03,
            hash(vec2(0.0, fi)) + cos(u_time * 0.04 + fi) * 0.02
        );
        pos = fract(pos);
        float brightness = hash(vec2(fi * 0.1, fi)) * 0.5 + 0.5;
        brightness *= 0.7 + sin(u_time * 0.5 + fi) * 0.3;
        accentParticles += star(uv, pos, brightness * 0.3);
    }
    
    vec3 flameColor = vec3(1.0, 0.239, 0.0);  // #FF3D00
    
    // Combine
    vec3 finalColor = voidColor;
    finalColor += particleColor * particles;
    finalColor += flameColor * accentParticles * 0.5;
    
    // Vignette
    float vignette = 1.0 - pow(length(uv - vec2(0.5)) * 1.2, 2.0);
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
