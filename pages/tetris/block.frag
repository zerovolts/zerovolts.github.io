#version 300 es

precision mediump float;

uniform vec3 uColor;

in vec2 vUv;

out vec4 fragColor;

void main() {
    vec2 uv = vUv - .5;
    float d = max(abs(uv.x), abs(uv.y));
    float border_mask = step(.4, d);
    float inside_mask = 1. - border_mask;
    float shadow_mask = (uv.x + uv.y < 0. ? 1. : 0.) * border_mask;
    float highlight_mask = (uv.x + uv.y >= 0. ? 1. : 0.) * border_mask;

    vec3 color = vec3(0);
    color += uColor * inside_mask;
    color += (uColor - .2) * shadow_mask;
    color += (uColor + .2) * highlight_mask;

    vec3 srgb = pow(color, vec3(1. / 2.2));
    fragColor = vec4(srgb, 1.);
}