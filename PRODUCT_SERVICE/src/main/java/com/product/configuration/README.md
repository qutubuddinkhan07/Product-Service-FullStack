# How the SecurityFilterChain works
- ``http.csrf(csrf -> csrf.disable())`` — turns off CSRF protection. This is standard for stateless REST APIs because CSRF attacks only apply to session-based apps. Your JWT replaces the session.
- ``.cors(cors -> cors.configurationSource(corsConfigurationSource()))`` — wires up the CORS rules you defined in the other bean. This is what controls which origins (like your React app or ngrok URL) are allowed to make requests.
- ``.authorizeHttpRequests(...)`` — defines the access rules in order:

- ``/api/v3/auth/**`` → anyone can call it (no token needed — login endpoint)
- ``/api/v2/user/**`` → also public
- ``/api/v1.0/product/**`` → only requests that have ROLE_ADMIN in their JWT roles are allowed
- ``anyRequest().authenticated()`` → everything else just needs a valid token, any role

- ``.formLogin(form -> form.disable()).httpBasic(basic -> basic.disable())`` — disables the default Spring login form and browser popup. You're using JWT so you don't want Spring's built-in login mechanisms interfering.
- ``http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)`` — this is the key line. It inserts your JWTFilter into the filter chain before Spring's own authentication filter. This means your code runs first, validates the JWT, and populates the SecurityContextHolder. By the time Spring's filter runs, the authentication is already set, so it just passes through. Click any node above to explore a specific step further.