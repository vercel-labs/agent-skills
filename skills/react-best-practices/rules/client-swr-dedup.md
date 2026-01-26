---
title: Use Data Fetching Libraries for Automatic Deduplication
impact: MEDIUM-HIGH
impactDescription: automatic deduplication
tags: client, swr, react-query, deduplication, data-fetching
---

## Use Data Fetching Libraries for Automatic Deduplication

Data fetching libraries like React Query or SWR enable request deduplication, caching, and revalidation across component instances.

**Incorrect (no deduplication, each instance fetches):**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

**Correct (with React Query - multiple instances share one request, preferred if using React Query):**

```tsx
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
  })
}
```

**Correct (with SWR - multiple instances share one request):**

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**For immutable data (with React Query - preferred if using React Query):**

```tsx
import { useQuery } from '@tanstack/react-query'

function StaticContent() {
  const { data } = useQuery({
    queryKey: ['/api/config'],
    queryFn: () => fetch('/api/config').then(r => r.json()),
    staleTime: Infinity,  // Never refetch
    gcTime: Infinity      // Never garbage collect
  })
}
```

**For immutable data (with SWR):**

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

**For mutations (with React Query - preferred if using React Query):**

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function UpdateButton() {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: (data) => fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(r => r.json()),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/user'] })
    }
  })
  
  return <button onClick={() => mutate({ name: 'John' })}>Update</button>
}
```

**For mutations (with SWR):**

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

References: 
- [https://tanstack.com/query](https://tanstack.com/query)
- [https://swr.vercel.app](https://swr.vercel.app)
