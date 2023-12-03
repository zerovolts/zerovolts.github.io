#version 300 es

in vec4 aPosition;

uniform mat4 uTransform;

void main() {
    gl_Position = aPosition * uTransform;
}