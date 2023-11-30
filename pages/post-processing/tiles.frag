#version 300 es

precision mediump float;

in highp vec2 vUv;

out vec4 fragColor;

uniform sampler2D uSampler;

void main() {
    vec2 uv = fract(vUv * 32.) - .5;
    vec3 texColor = texture(uSampler, vUv).rgb;

    float d = max(abs(uv.x), abs(uv.y));
    float border_mask = step(.4, d);
    float inside_mask = 1. - border_mask;
    float shadow_mask = (uv.x + uv.y < 0. ? 1. : 0.) * border_mask;
    float highlight_mask = (uv.x + uv.y >= 0. ? 1. : 0.) * border_mask;

    vec3 color = vec3(0);
    color += texColor * inside_mask;
    color += (texColor - .1) * shadow_mask;
    color += (texColor + .1) * highlight_mask;

    fragColor = vec4(color, 1.);
}