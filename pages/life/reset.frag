#version 300 es

precision mediump float;

uniform float uTime;

in vec2 vUv;

out vec4 fragColor;

float rand(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123); 
}

void main() {
    vec3 color = rand(vUv + vec2(uTime / 100.)) < .5 ? vec3(0) : vec3(1);
    fragColor = vec4(color, 1.);
}