#version 300 es

precision mediump float;

in vec4 vColor;
in vec2 vUv;
in vec3 vNormal;

out vec4 fragColor;

const float AMBIENT_INTENSITY = .0;
const float DIRECTIONAL_INTENSITY = .6;
const vec3 LIGHT_POS = normalize(vec3(1., 2., -1.));

void main() {
    vec2 uv = vUv;
    uv.x = uv.x < .5 ? uv.x : 1. - uv.x;
    uv.y = uv.y < .5 ? uv.y : 1. - uv.y;

    float corner_mask = length(uv);
    vec3 color = vec3(0);
    float ambient_light = AMBIENT_INTENSITY;
    float directional_light = dot(vNormal, LIGHT_POS) * DIRECTIONAL_INTENSITY + DIRECTIONAL_INTENSITY;
    float back_light_intensity = .4;
    vec3 back_light = (dot(vNormal, vec3(-1., -2., 1.)) * back_light_intensity + back_light_intensity) * vec3(0.01, 0.27, 0.45);
    color += vec3(ambient_light + directional_light) * vec3(0.98, 0.97, 0.54);
    color += back_light;

    vec3 srgb = pow(color, vec3(1. / 2.2));
    fragColor = vec4(srgb, 1.);
}