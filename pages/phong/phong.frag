#version 300 es

precision mediump float;

uniform int uLightFlags;

in vec4 vColor;
in vec2 vUv;
in vec3 vNormal;

out vec4 fragColor;

const float AMBIENT_INTENSITY = .3;
const float DIFFUSE_INTENSITY = .6;
const float SPECULAR_INTENSITY = .5;

const vec3 CAMERA_DIR = normalize(vec3(0, 0, 1));
const vec3 LIGHT_DIR = normalize(vec3(1, 1, .5));
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
    if ((uLightFlags & AMBIENT_FLAG) > 0) {
        color += AMBIENT_INTENSITY * vec3(0., .75, 1.);
    }
    if ((uLightFlags & DIFFUSE_FLAG) > 0) {
        color += diffuse(vNormal, LIGHT_DIR) * DIFFUSE_INTENSITY * vec3(1., 1., .5);
    }
    if ((uLightFlags & SPECULAR_FLAG) > 0) {
        color += specular(vNormal, LIGHT_DIR, CAMERA_DIR, 80.) * SPECULAR_INTENSITY * vec3(1);
    }
    
    vec3 srgb = pow(color, vec3(1. / 2.2));
    fragColor = vec4(srgb, 1.);
}