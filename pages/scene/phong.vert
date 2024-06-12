#version 300 es

uniform mat4 uModel;
uniform mat4 uMvp;

in vec3 aPosition;
in vec4 aColor;
in vec2 aUv;
in vec3 aNormal;

out vec3 vWorldPosition;
out vec4 vColor;
out vec2 vUv;
out vec3 vWorldNormal;

void main() {
    vec4 clip_pos = uMvp * vec4(aPosition, 1.);
    gl_Position = clip_pos;
    vWorldPosition = (uModel * vec4(aPosition, 1.)).xyz;
    vColor = aColor;
    vUv = aUv;
    vWorldNormal = (uModel * vec4(aNormal, 0.)).xyz;
}