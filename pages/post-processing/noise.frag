#version 300 es

precision mediump float;

in highp vec2 vTextureCoord;

out vec4 fragColor;

uniform sampler2D uSampler;
uniform vec2 uDimensions;

float rand(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123); 
}

void main() {
    vec2 textureCoordPx = vTextureCoord * uDimensions;
    vec4 color = texture(uSampler, vTextureCoord);
    float r = (rand(vec2(vTextureCoord)) - 0.5) * 0.1;
    fragColor = vec4(color.rgb + r, 1.0);
}