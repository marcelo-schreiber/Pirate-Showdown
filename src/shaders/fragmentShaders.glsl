
    uniform vec3 uSurfaceColor;
    uniform vec3 uDepthColor;
    uniform float uColorOffset;
    uniform float uColorMultiplier;
    uniform float uMetalness;
    uniform float uRoughness;
    uniform vec3 uLightDirection;
    uniform vec3 uReflectionColor;
    
    varying float vElevation;
    varying vec3 vNormal;

    vec3 getReflection(vec3 normal) {
      // Create a consistent upward reflection direction
      vec3 reflected = reflect(vec3(0.0, -1.0, 0.0), normal);
      // Simple sky/environment color based on reflection direction
      float skyMix = max(0.0, reflected.y);
      return mix(uDepthColor * 0.5, uReflectionColor, skyMix);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDirection = normalize(uLightDirection);
      
      // Base water color
      float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
      vec3 baseColor = mix(uDepthColor, uSurfaceColor, mixStrength);
      
      // Get reflection color (camera-independent)
      vec3 reflectionColor = getReflection(normal);
      
      // Constant reflection strength based on metalness
      float reflectionStrength = uMetalness * 0.8; // Constant reflection
      
      // Specular highlight (using a fixed view direction for consistency)
      vec3 fixedViewDirection = normalize(vec3(0.5, 1.0, 0.5));
      vec3 reflectedLight = reflect(-lightDirection, normal);
      float specular = pow(max(0.0, dot(fixedViewDirection, reflectedLight)), 32.0 / (uRoughness + 0.1));
      
      // Mix base color with reflection
      vec3 finalColor = mix(baseColor, reflectionColor, reflectionStrength);
      
      // Add specular highlights
      finalColor += specular * uReflectionColor * (1.0 - uRoughness) * 0.5;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  