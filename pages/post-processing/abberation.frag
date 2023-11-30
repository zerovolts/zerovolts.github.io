#version 300 es

precision mediump float;

in highp vec2 vUv;

out vec4 fragColor;

uniform sampler2D uTexture;
uniform vec2 uDimensions;

void main() {
    vec2 textureCoordPx = vUv * uDimensions;
    vec4 color = texture(uTexture, vUv);
    float red = texture(uTexture, (textureCoordPx + vec2(4.0, 0.0)) / uDimensions).r;
    float blue = texture(uTexture, (textureCoordPx + vec2(-4.0, 0.0)) / uDimensions).b;
    fragColor = vec4(red, color.g, blue, color.a);
}