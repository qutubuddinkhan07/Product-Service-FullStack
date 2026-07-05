# Product Inventory System — Docker & Production Deployment Guide

A step-by-step guide to Dockerizing a Spring Boot backend, deploying it to Render, and deploying a React frontend to Netlify — connected to an Aiven-managed MySQL database.

## Prerequisites

You should already be comfortable with:

- ✅ Core Java
- ✅ Spring Boot
- ✅ Spring Security + JWT
- ✅ Docker basics
- ✅ MySQL (Aiven)
- ✅ React
- ✅ Git & GitHub

## Deployment Roadmap

```
Backend (Spring Boot)
        │
        ▼
Dockerize Backend
        │
        ▼
Push to GitHub
        │
        ▼
Deploy on Render
        │
        ▼
Connect to Aiven MySQL


Frontend (React)
        │
        ▼
Build Production Version
        │
        ▼
Deploy to Netlify
        │
        ▼
Connect with Render Backend
```

---

## Step 1: Backend Dockerization

Your project structure probably looks like this:

```
backend/
├── src/
├── target/
├── pom.xml
├── .env
├── application.properties
├── application-dev.properties
```

### Create a Dockerfile

Place it directly inside the `backend/` folder:

```
backend/
└── Dockerfile
```

**Dockerfile** (Java 21):

```dockerfile
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

> If you're using Java 17 instead, change the base image to:
>
> ```dockerfile
> FROM eclipse-temurin:17-jdk
> ```

### Build the JAR

```bash
mvn clean package
```

This produces:

```
target/
└── backend-0.0.1-SNAPSHOT.jar
```

### Build the Docker Image

```bash
docker build -t product-service .
```

### Handling Environment Variables

When you run the app **from your IDE (e.g. Eclipse)**, Spring Boot loads your `.env` or the IDE's environment variables automatically, so values like these are available:

```properties
MAIL_HOST=${MAIL_HOST}
MAIL_PORT=${MAIL_PORT}
MAIL_USERNAME=${MAIL_USERNAME}
MAIL_PASSWORD=${MAIL_PASSWORD}
```

However, when you run the **Docker container**:

```bash
docker run -p 8080:8080 product-inventory-system
```

the container **does not know anything about your `.env` file** — it only has what was copied into the image. Spring Boot starts, looks for `MAIL_HOST`, doesn't find it, and exits.

Here are three ways to fix this:

**Solution 1 (Recommended): Pass an env file**

```bash
docker run --env-file .env -p 8080:8080 product-inventory-system
```

Docker injects all variables from the file into the container.

**Solution 2: Pass variables individually**

```bash
docker run \
  -e MAIL_HOST=smtp.gmail.com \
  -e MAIL_PORT=587 \
  -e MAIL_USERNAME=your@gmail.com \
  -e MAIL_PASSWORD=yourpassword \
  -p 8080:8080 \
  product-inventory-system
```

**Solution 3 (Best for Docker Compose)**

```yaml
services:
  product-service:
    build: .
    env_file:
      - .env
```

Compose automatically loads the variables for you.

### Run the Container

```bash
docker run -p 8080:8080 product-service
```

---

## Upgrading to a Multi-Stage Dockerfile (Recommended Before Deploying to Render)

If your project already contains:

- ✅ `.mvn/`
- ✅ `mvnw`
- ✅ `mvnw.cmd`
- ✅ `pom.xml`

it's already set up to use a **multi-stage Docker build** — the recommended approach before deploying to Render.

### Why the Single-Stage Dockerfile Isn't Enough

The Dockerfile from Step 1:

```dockerfile
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

only works if the JAR has **already been built** — i.e. `target/*.jar` exists. That's true locally after running `mvn clean package`, but it **fails on Render**: Render clones your source code straight from GitHub, and the `target/` build output is never committed to the repo, so there's no JAR for `COPY` to find.

### Replace It With a Multi-Stage Dockerfile

```dockerfile
# --------- Stage 1: Build ---------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven wrapper and configuration
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .

# Make wrapper executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# --------- Stage 2: Runtime ---------
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Why This Works

During the Docker build:

1. Docker downloads a Maven image.
2. It copies your project files into the build stage.
3. It runs `./mvnw clean package -DskipTests` **inside the container**.
4. This produces `/app/target/PRODUCT_SERVICE-0.0.1-SNAPSHOT.jar`.
5. The second stage copies **only that JAR** into a lightweight Java runtime image — Maven and the source code are discarded.

This is the standard production pattern: it produces a smaller final image and doesn't require Maven in the runtime container.

### After Changing the Dockerfile

```bash
git add Dockerfile
git commit -m "Use multi-stage Docker build"
git push origin main
```

Then go to Render and trigger a new deploy (or redeploy the latest commit).

### A Couple of Follow-Up Notes

- If `ls -la` shows a `docker-compose.yml` inside your backend folder (e.g. `PRODUCT_SERVICE`), that's fine as long as you're only deploying the backend. If you later add a Compose file to orchestrate backend **and** frontend together, move it to the parent directory instead so it can manage both projects.
- Render doesn't read your local `.env` file automatically. If the app fails in Docker due to missing variables (e.g. `MAIL_HOST`), that usually means the variables still need to be added under Render's **Environment Variables** section — check the runtime logs to confirm.

---

## Step 2: Don't Keep Secrets in `application.properties`

Instead of hardcoding credentials:

```properties
spring.datasource.username=avnadmin
spring.datasource.password=xxxx
```

Use environment variable placeholders:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

Do the same for mail configuration:

```properties
spring.mail.host=${MAIL_HOST}
spring.mail.port=${MAIL_PORT}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

Your project is now deployment-ready.

---

## Step 3: Local `.env` File

```bash
DB_URL=jdbc:mysql://....
DB_USERNAME=avnadmin
DB_PASSWORD=xxxx

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
```

⚠️ **Don't commit this file.** Add `.env` to your `.gitignore`.

---

## Step 4: Docker Compose (Optional, for Local Dev)

If you're using Aiven remotely, you don't need MySQL in Docker — your `docker-compose.yml` can simply run the backend:

```yaml
version: "3.8"

services:
  backend:
    build: .
    ports:
      - "8080:8080"
    env_file:
      - .env
```

Then run:

```bash
docker compose up
```

---

## Step 5: Push to GitHub

```bash
git init
git add .
git commit -m "Dockerized Spring Boot"
git branch -M main
git remote add origin <repo>
git push
```

---

## Step 6: Deploy the Backend on Render

Render works well for Spring Boot, especially when you already have a Dockerfile.

### 6.1 Create a New Service

Choose:

- ✅ **Web Service**

Don't choose:

- ❌ Static Site (frontend only)
- ❌ Background Worker
- ❌ Blueprint (unless you're using `render.yaml`)

### 6.2 Connect GitHub

Select your repository, e.g. `product_service_fullstack`.

### 6.3 Environment

Since you already have a Dockerfile, choose:

- ✅ **Docker**

Do **not** choose **Java (Native)** — you're deploying via Docker.

### 6.4 Root Directory

This is the important part. Set the root directory to the folder containing your Dockerfile, e.g.:

```
PRODUCT_SERVICE
```

**Not** `/` and **not** blank — otherwise Render won't find your Dockerfile:

```
product_service_fullstack/
│
├── PRODUCT_SERVICE/
│   ├── Dockerfile   ← Render finds this
│   ├── pom.xml
│   └── src/
│
└── product-service-frontend/
```

### 6.5 Branch

Select `main` (or whichever branch has your latest code).

### 6.6 Environment Variables

Your `.env` file is **not** uploaded to Render — you must manually add every variable under **Environment → Environment Variables**:

```
MAIL_HOST=...
MAIL_PORT=...
MAIL_USERNAME=...
MAIL_PASSWORD=...
DB_URL=...
DB_USERNAME=...
DB_PASSWORD=...
JWT_SECRET=...
```

Render injects these into the container at runtime.

### 6.7 Deploy

Click **Create Web Service**. Render will:

1. Clone your repository
2. Go into the `PRODUCT_SERVICE` directory
3. Build your Docker image
4. Start the container

**Build command:**

```bash
./mvnw clean package
# or
mvn clean package
```

**Start command:**

```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

_(or whatever your JAR file is named)_

---

## Step 7: Disabling Swagger in Production

By default, SpringDoc exposes:

- `/v3/api-docs`
- `/swagger-ui.html`

This means anyone who knows your URL can view your API documentation, for example:

```
https://your-app.onrender.com/swagger-ui.html
https://your-app.onrender.com/swagger-ui/index.html
https://your-app.onrender.com/v3/api-docs
```

**During development** → ✅ keep it enabled (very useful for testing APIs).
**In production** → ✅ disable it, unless you intentionally want to expose API docs.

### Recommended: Profile-Based Toggle

Since your project already uses profiles (dev/prod), this is the cleanest approach.

**`application.properties`**

```properties
spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}
```

**`application-dev.properties`**

```properties
springdoc.api-docs.enabled=true
springdoc.swagger-ui.enabled=true
```

**`application-prod.properties`**

```properties
springdoc.api-docs.enabled=false
springdoc.swagger-ui.enabled=false
```

Then, on Render, set:

```
SPRING_PROFILES_ACTIVE=prod
```

Result:

- **Local (dev):** Swagger works
- **Render (prod):** Swagger is disabled

### Additional Production Hardening

```properties
server.error.include-stacktrace=never
server.error.include-message=never

management.endpoints.web.exposure.include=health

springdoc.api-docs.enabled=false
springdoc.swagger-ui.enabled=false
```

These reduce the amount of internal information exposed if something goes wrong.

### Recommendation for a Portfolio Project

- ✅ Keep Swagger enabled in `application-dev.properties`
- ✅ Disable it in `application-prod.properties`
- ✅ Set `SPRING_PROFILES_ACTIVE=prod` on Render

This demonstrates environment-specific configuration and security awareness — something interviewers appreciate.

---

## Swagger / OpenAPI JWT Configuration

```java
package com.product.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

    private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Product Inventory System API")
                        .version("1.0")
                        .description("REST APIs for Product Inventory System"))
                // Tell Swagger that secured endpoints require JWT
                .addSecurityItem(new SecurityRequirement()
                        .addList(SECURITY_SCHEME_NAME))
                // Define Bearer Authentication
                .schemaRequirement(
                        SECURITY_SCHEME_NAME,
                        new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT"));
    }
}
```

### What Is Swagger/OpenAPI?

If your APIs look like this:

```
POST   /api/v3/auth/login
GET    /api/v1.0/product/all
POST   /api/v1.0/product
DELETE /api/v1.0/product/{id}
```

Swagger generates a webpage where you can:

- View all APIs
- Read request/response models
- Test APIs directly from the browser
- See documentation automatically generated

Without configuration, Swagger doesn't know **which** APIs require authentication, **what** mechanism is used, or **how** to send a JWT token. The configuration above answers all three.

### Line-by-Line Walkthrough

| Code                                                      | Purpose                                                                                                                              |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `@Configuration`                                          | Tells Spring this class contains configuration to load at startup — same idea as `SecurityConfiguration` or `DatabaseConfiguration`. |
| `private static final String SECURITY_SCHEME_NAME`        | Avoids repeating the literal `"Bearer Authentication"` string everywhere. Rename it once, and every reference updates.               |
| `@Bean public OpenAPI customOpenAPI()`                    | Tells Spring to build one `OpenAPI` object and register it in the container; Swagger reads this object to render its UI.             |
| `new OpenAPI()`                                           | The root configuration object — everything (info, security, servers, schemas) attaches here.                                         |
| `.info(...)`                                              | Sets the title, version, and description shown at the top of the Swagger page. Documentation only — doesn't affect auth.             |
| `.addSecurityItem(...)`                                   | Tells Swagger "yes, attach a JWT token to requests." Without it, the _Try it out_ button won't send an `Authorization` header.       |
| `new SecurityRequirement().addList(SECURITY_SCHEME_NAME)` | References the security scheme by name — it doesn't define it, just says "use the one called Bearer Authentication."                 |
| `.schemaRequirement(...)`                                 | This is where `"Bearer Authentication"` is actually _defined_.                                                                       |
| `.type(SecurityScheme.Type.HTTP)`                         | Since JWT travels in the HTTP `Authorization` header (not as an API key or OAuth2 flow), the type is `HTTP`.                         |
| `.scheme("bearer")`                                       | Tells Swagger to prepend `Bearer` to the token automatically.                                                                        |
| `.bearerFormat("JWT")`                                    | Purely descriptive — tells the UI the token format is JWT rather than an opaque or OAuth token.                                      |

The `SECURITY_SCHEME_NAME` used in `.addSecurityItem(...)` and `.schemaRequirement(...)` must match exactly — it's the same idea as matching `@Bean("myBean")` with `@Qualifier("myBean")` in Spring.

### The Full Flow

```
Application Starts
        │
        ▼
SwaggerConfig executes
        │
        ▼
Creates OpenAPI object
        │
        ▼
Adds API information
        │
        ▼
Adds security requirement
        │
        ▼
Defines Bearer Authentication
        │
        ▼
Swagger UI reads configuration
        │
        ▼
"Authorize" button appears
```

### What Happens When You Click "Authorize"

Suppose your login endpoint returns:

```json
{
  "token": "abc.xyz.123"
}
```

You click **Authorize**, paste `abc.xyz.123`, and Swagger remembers it. From then on, every request Swagger sends includes:

```http
GET /products HTTP/1.1
Host: localhost:8080
Authorization: Bearer abc.xyz.123
```

Your JWT filter then does the usual work:

```java
String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
// receives: "Bearer abc.xyz.123"
String jwt = authHeader.substring(7);
// validates it, builds the Authentication object,
// and stores it in the SecurityContext
```

From there, Spring Security treats the request as authenticated.

### Recommended Improvement: Scope Security Per-Endpoint

Instead of applying the security requirement **globally** with:

```java
.addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
```

Define only the security _scheme_ in `SwaggerConfig`, then annotate individual controllers or methods that actually need authentication:

```java
@SecurityRequirement(name = "Bearer Authentication")
```

This way, public endpoints like **login**, **register**, and **forgot password** stay unlocked in Swagger, while protected endpoints show the lock icon — matching the pattern you'll see in most professional Spring Boot projects, since the docs then accurately reflect which APIs are public.

For this to work, your `SwaggerConfig` needs to register the scheme in `components` rather than add it globally:

```java
.components(
    new Components().addSecuritySchemes(
        SECURITY_SCHEME_NAME,
        new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
    )
)
```

**Example — mixed controller:**

```java
@RestController
@RequestMapping("/api/v2/user")
public class UserController {

    @PostMapping("/register")
    public ResponseEntity<?> register() { ... }

    @PostMapping("/login")
    public ResponseEntity<?> login() { ... }

    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/profile")
    public ResponseEntity<?> profile() { ... }

    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile() { ... }
}
```

Resulting Swagger UI:

| Endpoint         | Requires JWT |
| ---------------- | :----------: |
| `POST /register` |      ❌      |
| `POST /login`    |      ❌      |
| `GET /profile`   |      🔒      |
| `PUT /profile`   |      🔒      |

---

## Step 8: Deploy the Frontend

### Netlify

1. Connect GitHub
2. Framework: **React**
3. Build command:
   ```bash
   npm run build
   ```
4. Publish directory:
   - `dist` (Vite)
   - `build` (Create React App)
5. Environment variable:
   ```
   VITE_API_URL=https://your-render-service.onrender.com
   # or
   REACT_APP_API_URL=...
   ```
   depending on how the app was scaffolded.

### Render (Static Site, Alternative)

Render also supports static sites:

- Build command: `npm run build`
- Publish directory: `dist`

---

## Final Architecture

```
                    Internet
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
     Netlify                        Render
    React App                  Spring Boot API
        │                             │
        └──────────────┬──────────────┘
                        │
                        ▼
                  Aiven MySQL
```

- **Netlify** serves the React frontend
- **Render** runs the Spring Boot backend
- **Aiven** hosts the managed MySQL database

---

## Recommended Roadmap for a Production-Grade Setup

Going beyond "just getting it running," a portfolio-quality setup should cover:

1. ✅ Proper project structure
2. ✅ Multi-stage Dockerfile (smaller images)
3. ✅ Docker Compose for local development
4. ✅ Environment variable management
5. ✅ GitHub Actions for automatic deployment
6. ✅ Deploy backend to Render
7. ✅ Deploy frontend to Netlify
8. ✅ Configure CORS between frontend and backend
9. ✅ Use a custom domain (optional)
10. ✅ Enable HTTPS and production-ready settings

This gives you not just a working app, but hands-on experience with practices used in real professional development.
