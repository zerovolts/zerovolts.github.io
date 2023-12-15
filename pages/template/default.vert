#version 300 es

uniform vec2 uDimensions;

in vec2 aPosition;
in vec4 aColor;

out vec4 vColor;

vec4 pixelCoordToClipCoord(vec2 pxCoord) {
    return vec4(
        pxCoord.x / uDimensions.x * 2.0 - 1.0,
        -(pxCoord.y / uDimensions.y * 2.0 - 1.0),
        0.0,
        1.0
    );
}

void main() {
    gl_Position = pixelCoordToClipCoord(aPosition);
    vColor = aColor;
}