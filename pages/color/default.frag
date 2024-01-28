#version 300 es

precision mediump float;

uniform float mode;
uniform vec3 color;

in vec2 uv;

out vec4 fragColor;

const float SQRT_3 = 1.732;
const float HEIGHT = SQRT_3 / 4.;
const float HALF_HEIGHT = HEIGHT / 2.;
const float RADIUS = .5;

const vec2 TOP = vec2(0., HALF_HEIGHT);
const vec2 BOTTOM_LEFT = vec2(-.25, -HALF_HEIGHT);
const vec2 BOTTOM_RIGHT = vec2(.25, -HALF_HEIGHT);

float circleMask(float radius, vec2 position) {
    float px = .01;
    return smoothstep(radius + px, radius - px, distance(uv, position));
}

void main() {
    float px = .01;

    float r = circleMask(RADIUS, TOP) * color.r;
    float g = circleMask(RADIUS, BOTTOM_LEFT) * color.g;
    float b = circleMask(RADIUS, BOTTOM_RIGHT) * color.b;

    float c = 1. - color.r;
    float m = 1. - color.g;
    float y = 1. - color.b;

    float nr = circleMask(RADIUS, TOP) * (c);
    float ng = circleMask(RADIUS, BOTTOM_LEFT) * (m);
    float nb = circleMask(RADIUS, BOTTOM_RIGHT) * (y);

    vec3 color = mode < .5
        ? vec3(r, g, b)
        : 1. - vec3(nr, ng, nb);

    px = .02;
    float outlineMask = smoothstep(px, -px, abs(distance(uv, TOP) - .5)) +
        smoothstep(px, -px, abs(distance(uv, BOTTOM_LEFT) - .5)) +
        smoothstep(px, -px, abs(distance(uv, BOTTOM_RIGHT) - .5));

    // TODO: there's likely there's likely a mathematical way of finding this
    float verticalOffset = -.07;
    outlineMask *= circleMask(.5 / SQRT_3, vec2(0, verticalOffset));
    // color -= vec3(outlineMask) * .3;

    fragColor = vec4(color, 1.);
}