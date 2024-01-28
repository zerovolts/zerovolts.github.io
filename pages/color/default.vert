#version 300 es

in vec2 aPosition;

out vec2 uv;

void main() {
    gl_Position = vec4(aPosition, 0., 1.);
    uv = aPosition;
}