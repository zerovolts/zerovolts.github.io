#version 300 es

precision mediump float;

in vec2 vUv;

out vec4 fragColor;

void main() {
    vec2 uv = fract(vUv * vec2(10., 22.));
    float y = floor(vUv.y * 22.);
    uv -= .5;

    float d = max(abs(uv.x), abs(uv.y));
    float border_mask = step(.4, d);
    float inside_mask = 1. - border_mask;
    float shadow_mask = (uv.x + uv.y < 0. ? 1. : 0.) * border_mask;
    float highlight_mask = (uv.x + uv.y >= 0. ? 1. : 0.) * border_mask;

    vec3 bg_color = vec3(.05, .06, .07);
    vec3 color = vec3(0);
    color += bg_color * inside_mask;
    color += (bg_color - .02) * shadow_mask;
    color += (bg_color + .02) * highlight_mask;
    color += y > 19. ? vec3(.2, 0., 0.) : vec3(0.);

    vec3 srgb = pow(color, vec3(1. / 2.2));
    fragColor = vec4(srgb, 1.);
}