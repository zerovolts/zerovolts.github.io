#version 300 es

precision mediump float;

in highp vec2 vUv;

out vec4 fragColor;

uniform sampler2D uTexture;
uniform vec2 uDimensions;

const float PI = 3.141592;
const float FROST_INTENSITY = .03;

float rand(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123); 
}

void main() {
    float angle = rand(vUv.xy);
    float radius = rand(vUv.yx);
    vec2 offset = vec2(cos(angle * PI * 2.), sin(angle * PI * 2.)) * radius * FROST_INTENSITY;
    vec3 color = texture(uTexture, vUv + offset).rgb;
    vec3 srgb = pow(color, vec3(1. / 2.2));
    fragColor = vec4(color, 1.);
}