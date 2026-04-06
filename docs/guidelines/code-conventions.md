# Code Conventions

> Standards followed by all codeXperts team members.
> Consistent style speeds up code reviews and makes the codebase easier to maintain.

---

## 1. File & Folder Naming

| Target | Rule | Example |
|--------|------|---------|
| Component files | PascalCase | `UserCard.jsx` |
| General JS files | camelCase | `authService.js` |
| Hook files | camelCase, `use` prefix | `useAuth.js` |
| Style files | Match component name | `UserCard.css` |
| Folders | camelCase | `components/`, `meetingNotes/` |
| Constant files | camelCase | `constants.js` |

---

## 2. Components

### Functional components only
```jsx
// Good
const UserCard = ({ name, role }) => {
  return <div>{name}</div>;
};

// Bad — class components are not allowed
class UserCard extends React.Component { ... }
```

### Destructure props
```jsx
// Good
const UserCard = ({ name, role, onClick }) => { ... };

// Bad
const UserCard = (props) => {
  return <div>{props.name}</div>;
};
```

### Export style
```jsx
// Default export at the bottom of the file
export default UserCard;

// Named export for reusable hooks and utilities
export const useAuth = () => { ... };
```

---

## 3. Variable & Function Naming

```js
// Variables — camelCase
const currentUser = null;
const isLoggedIn = false;

// Booleans — is / has / can prefix
const isAdmin = true;
const hasPermission = false;

// Functions — verb + noun
const fetchUserData = async () => { ... };
const handleLoginClick = () => { ... };
const formatDate = (date) => { ... };

// Constants — UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const ROLES = { ADMIN: 'admin', MEMBER: 'member' };
```

---

## 4. Import Order

```js
// 1. React
import React, { useState, useEffect } from 'react';

// 2. Next.js built-ins
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 3. Third-party libraries
import { createClient } from '@supabase/supabase-js';

// 4. Internal components
import Button from '@/components/ui/Button';
import Navbar from '@/components/common/Navbar';

// 5. Hooks / Contexts
import { useAuth } from '@/hooks/useAuth';

// 6. Services / Utilities
import { getUserById } from '@/services/userService';
import { formatDate } from '@/utils/formatDate';
```

---

## 5. Tailwind CSS

- Use inline utility classes as the default approach
- Extract repeated combinations into components — do not store class strings in variables
- Use template literals or `clsx` for conditional classes

```jsx
// Good
<button className={`px-4 py-2 rounded ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}>
  Click
</button>

// Bad — inline styles are not allowed when Tailwind can handle it
<button style={{ padding: '8px 16px' }}>Click</button>
```

---

## 6. Async / Await

- Use `async/await` — `.then().catch()` chaining is not allowed
- Always wrap in `try/catch`

```js
// Good
const fetchUser = async (uid) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};

// Bad
const fetchUser = (uid) => {
  supabase.from('profiles').select('*').eq('id', uid)
    .then(({ data }) => data)
    .catch((err) => console.error(err));
};
```

---

## 7. Comments

- Do not comment self-explanatory code
- Only comment to explain **why** — business logic, complex conditions, Firebase rules

```js
// Good — explains the reason
// Pending users cannot access the dashboard until approved by an admin
if (user.status === 'pending') return <PendingScreen />;

// Bad — just restates the code
// If user status is pending, return PendingScreen
if (user.status === 'pending') return <PendingScreen />;
```

---

## 8. Prohibited Practices

- No `var` — use `const` or `let`
- No `console.log` in commits — remove all debug logs before pushing
- No hardcoded role strings — use the `ROLES` constant from `constants.js`
- No direct Supabase calls inside components — always go through the `services/` layer
