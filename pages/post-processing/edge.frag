#version 300 es

precision mediump float;

in highp vec2 vTextureCoord;

out vec4 fragColor;

uniform sampler2D uSampler;
uniform vec2 uDimensions;

void main() {
    mat3 kernel = mat3(
        -1.0, -1.0, -1.0,
        -1.0, 8.0, -1.0,
        -1.0, -1.0, -1.0
    );
    vec2 textureCoordPx = vTextureCoord * uDimensions;
    vec4 color = vec4(0.0);
    for (int y = -1; y < 2; y++) {
        for (int x = -1; x < 2; x++) {
            vec4 pxColor = texture(uSampler, (textureCoordPx + vec2(x, y)) / uDimensions);
            color += pxColor * kernel[y + 1][x + 1];
        }
    }
    fragColor = vec4(color.rgb, 1.0);
}