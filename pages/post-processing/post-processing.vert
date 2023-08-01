#version 300 es

in vec4 aPosition;
in vec2 aTextureCoord;

out highp vec2 vTextureCoord;

void main() {
    gl_Position = aPosition;
    vTextureCoord = aTextureCoord;
}