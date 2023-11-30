#version 300 es

precision mediump float;

in highp vec2 vUv;

out vec4 fragColor;

uniform sampler2D uTexture;

void main() {
    fragColor = texture(uTexture, vUv);
}