#version 300 es

in vec2 aPosition;
in vec4 aColor;

out vec4 vColor;

void main() {
    gl_Position = vec4(aPosition, 0., 1.);
    vColor = aColor;
}