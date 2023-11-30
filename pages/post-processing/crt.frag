#version 300 es

precision mediump float;

in highp vec2 vUv;

out vec4 fragColor;

uniform sampler2D uTexture;
uniform vec2 uDimensions;

float rand(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123); 
}

vec4 darken(vec4 color) {
    return vec4(color.xyz * 0.4, color.w);
}

void main() {
    mat3 kernel = mat3(
        1.0, 2.0, 1.0,
        2.0, 4.0, 2.0,
        1.0, 2.0, 1.0
    );
    // gaussian blur
    vec4 color = vec4(0.0);
    for (int y = -1; y < 2; y++) {
        for (int x = -1; x < 2; x++) {
            vec2 coord = gl_FragCoord.xy + vec2(x, y);
            vec2 scanlineCoord = floor(coord) / 3.0;
            vec2 uv = coord / uDimensions;
            vec4 texColor = texture(uTexture, uv);
            // chromatic abberation
            vec4 abberation = vec4(
                texture(uTexture, uv + vec2(0.004, 0.0)).r,
                texture(uTexture, uv).g,
                texture(uTexture, uv + vec2(-0.004, 0.0)).b,
                1.0
            );
            // scanlines
            vec4 scanlines = int(scanlineCoord.y) % 2 == 0
                ? darken(abberation)
                : abberation;
            color += scanlines * kernel[y + 1][x + 1];
        }
    }
    // noise
    float r = (rand(vec2(gl_FragCoord)) - 0.5) * 0.05;
    fragColor = vec4((color / 16.0).rgb , 1.0);
}