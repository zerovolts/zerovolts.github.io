#version 300 es

precision mediump float;

in highp vec2 vTextureCoord;

out vec4 fragColor;

uniform sampler2D uSampler;

void main() {
    fragColor = texture(uSampler, vTextureCoord);
}