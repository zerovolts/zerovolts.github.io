#version 300 es

precision mediump float;

in vec4 vColor;

out vec4 fragColor;

void main() {
    vec3 srgb = pow(vColor.rgb, vec3(1. / 2.2));
    fragColor = vec4(srgb, vColor.a);
}