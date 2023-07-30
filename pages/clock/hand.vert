#version 300 es

in vec4 position;

uniform mat4 rotation;

void main() {
    gl_Position = position * rotation;
}