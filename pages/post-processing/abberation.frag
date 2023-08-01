#version 300 es

precision mediump float;

in highp vec2 vTextureCoord;

out vec4 fragColor;

uniform sampler2D uSampler;
uniform vec2 uDimensions;

void main() {
    vec2 textureCoordPx = vTextureCoord * uDimensions;
    vec4 color = texture(uSampler, vTextureCoord);
    float red = texture(uSampler, (textureCoordPx + vec2(4.0, 0.0)) / uDimensions).r;
    float blue = texture(uSampler, (textureCoordPx + vec2(-4.0, 0.0)) / uDimensions).b;
    fragColor = vec4(red, color.g, blue, color.a);
}