# Spring Boot Best Practices

This skill provides best practices for building scalable, secure, and maintainable Spring Boot applications.
Rules are prioritized by impact and focus on real-world backend development.

## Use when:
- Building REST APIs with Spring Boot
- Designing layered backend architectures
- Implementing authentication and authorization
- Optimizing API performance
- Reviewing Spring Boot production code

---

## Rules

### 🟥 Critical (Must Follow)

1. **Do not expose JPA entities directly from controllers**
   - Always use DTOs for API responses and requests.
   - Prevents over-fetching, security leaks, and tight coupling.

2. **Follow layered architecture strictly**
   - Controller → Service → Repository
   - Controllers should contain no business logic.

3. **Use `@ControllerAdvice` for global exception handling**
   - Centralize error handling.
   - Return consistent error responses.

4. **Validate all incoming request data**
   - Use `@Valid` with Bean Validation annotations.
   - Never trust client input.

5. **Avoid business logic in repositories**
   - Repositories should only handle database access.

---

### 🟧 High Priority

6. **Use pagination for all list endpoints**
   - Use `Pageable` and `Page<T>` for large datasets.
   - Prevents memory and performance issues.

7. **Secure APIs using Spring Security**
   - Prefer JWT or OAuth2 for stateless authentication.
   - Never store secrets in source code.

8. **Use constructor injection instead of field injection**
   - Improves testability and immutability.

9. **Handle nulls explicitly**
   - Prefer `Optional` for nullable return values.
   - Avoid `NullPointerException` risks.

10. **Version your APIs**
    - Use `/api/v1/...`
    - Enables backward compatibility.

---

### 🟨 Medium Priority

11. **Use proper HTTP status codes**
    - 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error.

12. **Log meaningfully**
    - Avoid `System.out.println`
    - Use SLF4J with log levels (`INFO`, `WARN`, `ERROR`).

13. **Avoid hardcoded configuration**
    - Use `application.yml` or environment variables.

14. **Use Flyway or Liquibase for DB migrations**
    - Never manage schema manually in production.

15. **Avoid blocking calls in reactive applications**
    - Do not mix blocking JDBC with WebFlux.

---

### 🟩 Low Priority / Optimization

16. **Enable caching for frequently accessed data**
    - Use `@Cacheable` where appropriate.

17. **Limit response payload size**
    - Avoid returning unnecessary fields.

18. **Use connection pooling**
    - Prefer HikariCP (default in Spring Boot).

19. **Enable graceful shutdown**
    - Avoid abrupt termination in production.

20. **Document APIs using OpenAPI / Swagger**
    - Improves developer experience.

---

## Anti-Patterns to Avoid

- Fat controllers
- Catching generic `Exception`
- Using `@Autowired` on fields
- Returning `Map<String, Object>` as API responses
- Ignoring validation errors

---

## References
See the `references/` folder for deeper explanations and examples.
