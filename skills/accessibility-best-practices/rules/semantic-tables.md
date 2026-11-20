---
title: Use Proper Table Markup with Headers and Captions
impact: HIGH
impactDescription: Screen readers use th/scope to associate data cells with headers
tags: semantic, tables, screen-reader, data
wcag: "1.3.1 Level A"
---

## Use Proper Table Markup with Headers and Captions

**Impact: HIGH (Screen readers use th/scope to associate data cells with headers)**

When presenting tabular data, use `<table>`, `<thead>`, `<tbody>`, `<th>`, and `<td>`. Include `<caption>` for a table description and `scope` attributes on headers. Screen readers read "Column: Name, Row: 3" — without `<th>`, data cells have no context.

**Incorrect (divs styled as a grid):**

```tsx
function UserTable({ users }) {
  return (
    <div className="grid grid-cols-3">
      <div className="font-bold">Name</div>
      <div className="font-bold">Email</div>
      <div className="font-bold">Role</div>
      {users.map((u) => (
        <>
          <div>{u.name}</div>
          <div>{u.email}</div>
          <div>{u.role}</div>
        </>
      ))}
    </div>
  )
}
```

**Correct (semantic table):**

```tsx
function UserTable({ users }) {
  return (
    <table>
      <caption>Team members and their roles</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

Use `scope="col"` for column headers and `scope="row"` for row headers. Do not use `<table>` for layout — only for actual tabular data.

Reference: [WCAG 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
