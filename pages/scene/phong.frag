#version 300 es

precision mediump float;

uniform vec3 uCameraPosition;

in vec3 vWorldPosition;
in vec4 vColor;
in vec2 vUv;
in vec3 vWorldNormal;
in vec3 vLightDirection;

out vec4 fragColor;

const float AMBIENT_INTENSITY = 1.;
const float DIFFUSE_INTENSITY = .3;
const float SPECULAR_INTENSITY = 0.;

const vec3 LIGHT_DIR = normalize(vec3(-1, 1, -.6));
const vec3 LIGHT_COLOR = vec3(1, 1, 1);

const int AMBIENT_FLAG = 1;
const int DIFFUSE_FLAG = 2;
const int SPECULAR_FLAG = 4;

float specular(vec3 normal, vec3 light_dir, vec3 camera_dir, float shininess) {
    vec3 reflection_vec = normalize(reflect(-light_dir, normal));
    return pow(max(0., dot(reflection_vec, camera_dir)), shininess);
}

float diffuse(vec3 normal, vec3 light_dir) {
    return max(0., dot(light_dir, normal));
}

void main() {
    vec3 color = vec3(0);
    color += AMBIENT_INTENSITY * vec3(0.02, 0.19, 0.28) * vColor.rgb;
    color += diffuse(vWorldNormal, LIGHT_DIR) * DIFFUSE_INTENSITY * vec3(0.12, 0.80, 0.23) * vColor.rgb;
    color += specular(vWorldNormal, LIGHT_DIR, normalize(uCameraPosition - vWorldPosition), 100.) * vColor.rgb * SPECULAR_INTENSITY * vec3(1);
    
    vec3 srgb = pow(color, vec3(1. / 2.2));
    fragColor = vec4(srgb, 1.);
}