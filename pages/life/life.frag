#version 300 es

precision mediump float;

uniform vec2 uResolution;
uniform sampler2D board;

in vec2 vUv;

out vec4 fragColor;

const vec2 DIRECTION[8] = vec2[8](
    vec2(1, 0),
    vec2(1, 1),
    vec2(0, 1),
    vec2(-1, 1),
    vec2(-1, 0),
    vec2(-1, -1),
    vec2(0, -1),
    vec2(1, -1)
);

void main() {
    vec3 cellColor = texture(board, vUv).rgb;
    bool state = cellColor.r > .5;

    int neighbors = 0;
    for (int i = 0; i < 8; i++) {
        vec2 offset = DIRECTION[i] / uResolution;
        if (texture(board, vUv + offset).r > .5) {
            neighbors += 1;
        }
    }

    bool nextState = neighbors == 3 || (state && neighbors == 2);

    vec3 color = vec3(nextState ? 1. : 0.);
    vec3 srgb = pow(color, vec3(1. / 2.2));
    fragColor = vec4(srgb, 1.);
}