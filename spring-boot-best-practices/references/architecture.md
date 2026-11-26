# Spring Boot Architecture Guidelines

- Controllers handle HTTP concerns only.
- Services encapsulate business logic.
- Repositories interact with the database.
- DTOs isolate internal models from external APIs.
- Use interfaces for services when business logic is complex.

Recommended packages:
- controller
- service
- repository
- dto
- entity
- config
- exception
