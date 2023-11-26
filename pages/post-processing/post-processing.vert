#version 300 es

in vec4 aPosition;
in vec2 aTexCoord;

out highp vec2 vTextureCoord;

void main() {
    gl_Position = aPosition;
    vTextureCoord = aTexCoord;
}