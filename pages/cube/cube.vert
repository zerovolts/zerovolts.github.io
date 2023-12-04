#version 300 es

uniform vec2 uDimensions;
uniform mat4 uTransform;

in vec3 aPosition;
in vec4 aColor;
in vec2 aUv;
in vec3 aNormal;

out vec4 vColor;
out vec2 vUv;
out vec3 vNormal;

void main() {
    vec4 clip_pos = uTransform * vec4(aPosition.xyz, 1.);
    gl_Position = clip_pos;
    vColor = aColor;
    vUv = aUv;
    vNormal = (uTransform * vec4(aNormal, 1.)).xyz;
}