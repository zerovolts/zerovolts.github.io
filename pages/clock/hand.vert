#version 300 es

in vec4 aPosition;

uniform mat4 uRotation;

void main() {
    gl_Position = aPosition * uRotation;
}