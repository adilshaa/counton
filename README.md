# Complete React Components Teaching Guide

## Table of Contents
1. [Introduction to React Components](#introduction-to-react-components)
2. [Functional Components](#functional-components)
3. [Class Components](#class-components)
4. [JSX Syntax](#jsx-syntax)
5. [Props](#props)
6. [State Management](#state-management)
7. [Event Handling](#event-handling)
8. [Conditional Rendering](#conditional-rendering)
9. [Lists and Keys](#lists-and-keys)
10. [Component Lifecycle](#component-lifecycle)
11. [React Hooks](#react-hooks)
12. [Context API](#context-api)
13. [Higher-Order Components (HOCs)](#higher-order-components-hocs)
14. [Render Props](#render-props)
15. [Error Boundaries](#error-boundaries)
16. [Refs and DOM Manipulation](#refs-and-dom-manipulation)
17. [Memoization](#memoization)
18. [Custom Hooks](#custom-hooks)

## Introduction to React Components

React components are the building blocks of React applications. They are reusable pieces of code that return JSX elements to be rendered to the screen.

### Types of Components:
- **Functional Components**: JavaScript functions that return JSX
- **Class Components**: ES6 classes that extend React.Component

---

## Functional Components

Functional components are the modern way to write React components. They're simpler and more performant.

### Basic Example:
```jsx
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Arrow function syntax
const Welcome = () => {
  return <h1>Hello, World!</h1>;
};

// Implicit return for simple components
const Welcome = () => <h1>Hello, World!</h1>;
```

### With Parameters:
```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage
<Greeting name="Alice" />
```

---

## Class Components

Class components are the traditional way to create components with state and lifecycle methods.

### Basic Example:
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, World!</h1>;
  }
}
```

### With Props:
```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

---

## JSX Syntax

JSX is a syntax extension for JavaScript that looks like HTML but gets compiled to JavaScript.

### Key Rules:
```jsx
function JSXExample() {
  const isVisible = true;
  const items = ['apple', 'banana', 'orange'];
  
  return (
    <div className="container"> {/* className instead of class */}
      <h1 style={{ color: 'blue', fontSize: '24px' }}>JSX Example</h1>
      <p>JavaScript expressions in curly braces: {2 + 2}</p>
      
      {/* Conditional rendering */}
      {isVisible && <p>This is visible!</p>}
      
      {/* Lists */}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      
      {/* Self-closing tags must end with /> */}
      <img src="image.jpg" alt="Example" />
      <br />
    </div>
  );
}
```

---

## Props

Props (properties) are how you pass data from parent to child components.

### Basic Props:
```jsx
function UserCard({ name, age, email }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

// Usage
<UserCard name="John Doe" age={30} email="john@example.com" />
```

### Default Props:
```jsx
function Button({ text = "Click me", color = "blue" }) {
  return (
    <button style={{ backgroundColor: color }}>
      {text}
    </button>
  );
}
```

### Props Validation with PropTypes:
```jsx
import PropTypes from 'prop-types';

function UserCard({ name, age, email }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string.isRequired
};
```

---

## State Management

State represents data that can change over time in your component.

### useState Hook (Functional Components):
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}
```

### Complex State:
```jsx
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const handleInputChange = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };
  
  return (
    <form>
      <input
        type="text"
        placeholder="Name"
        value={user.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={user.age}
        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
      />
    </form>
  );
}
```

### Class Component State:
```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

---

## Event Handling

React uses SyntheticEvents, which are wrappers around native DOM events.

### Basic Event Handling:
```jsx
function EventExample() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log('Button clicked!');
  };
  
  const handleInputChange = (e) => {
    console.log('Input value:', e.target.value);
  };
  
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <input onChange={handleInputChange} placeholder="Type something" />
    </div>
  );
}
```

### Event with Parameters:
```jsx
function TodoList() {
  const [todos, setTodos] = useState(['Learn React', 'Build an app']);
  
  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };
  
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          {todo}
          <button onClick={() => removeTodo(index)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Conditional Rendering

Different ways to conditionally render elements in React.

### If-Else with &&:
```jsx
function ConditionalExample({ isLoggedIn, user }) {
  return (
    <div> 
      {isLoggedIn && <h1>Welcome back, {user.name}!</h1>}
      {!isLoggedIn && <h1>Please log in</h1>}
    </div>
  );
}
```

### Ternary Operator:
```jsx
function StatusMessage({ isLoading, error, data }) {
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>Data loaded: {data}</div>
      )}
    </div>
  );
}
```

### Switch Case Pattern:
```jsx
function StatusIndicator({ status }) {
  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return <div className="spinner">Loading...</div>;
      case 'success':
        return <div className="success">✓ Success</div>;
      case 'error':
        return <div className="error">✗ Error</div>;
      default:
        return <div>Unknown status</div>;
    }
  };
  
  return <div>{renderStatus()}</div>;
}
```

---

## Lists and Keys

Rendering lists of data efficiently in React.

### Basic List Rendering:
```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```

### List with Objects and Unique Keys:
```jsx
function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Dynamic List Operations:
```jsx
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: true }
  ]);
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none' 
          }}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

---

## Component Lifecycle

Understanding when components mount, update, and unmount.

### useEffect Hook (Functional Components):
```jsx
import { useState, useEffect } from 'react';

function DataFetcher({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ComponentDidMount + ComponentDidUpdate
  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [userId]); // Dependency array
  
  // ComponentWillUnmount
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
    
    return () => clearInterval(timer); // Cleanup
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>User: {data.name}</div>;
}
```

### Class Component Lifecycle:
```jsx
class DataFetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true
    };
  }
  
  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchData();
    }
  }
  
  componentWillUnmount() {
    // Cleanup subscriptions, timers, etc.
  }
  
  fetchData = () => {
    this.setState({ loading: true });
    fetch(`/api/users/${this.props.userId}`)
      .then(response => response.json())
      .then(data => this.setState({ data, loading: false }));
  }
  
  render() {
    if (this.state.loading) return <div>Loading...</div>;
    return <div>User: {this.state.data.name}</div>;
  }
}
```

---

## React Hooks

Hooks let you use state and other React features in functional components.

### useState:
```jsx
function MultipleState() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [hobbies, setHobbies] = useState([]);
  
  const addHobby = (hobby) => {
    setHobbies([...hobbies, hobby]);
  };
  
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      <button onClick={() => addHobby('Reading')}>Add Reading</button>
      <ul>
        {hobbies.map((hobby, index) => <li key={index}>{hobby}</li>)}
      </ul>
    </div>
  );
}
```

### useEffect:
```jsx
function WindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <div>Window width: {windowWidth}px</div>;
}
```

### useReducer:
```jsx
import { useReducer } from 'react';

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
};

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

### useMemo and useCallback:
```jsx
import { useState, useMemo, useCallback } from 'react';

function ExpensiveComponent({ items }) {
  const [filter, setFilter] = useState('');
  
  // Memoize expensive calculation
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  // Memoize callback to prevent unnecessary re-renders
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);
  
  return (
    <div>
      <input onChange={handleFilterChange} placeholder="Filter items..." />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Context API

Share data between components without prop drilling.

### Creating and Using Context:
```jsx
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Using the context
function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header style={{ 
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff'
    }}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </header>
  );
}

// App component
function App() {
  return (
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  );
}
```

---

## Higher-Order Components (HOCs)

Functions that take a component and return a new component with additional functionality.

### Basic HOC:
```jsx
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// Usage
const UserProfile = ({ user }) => (
  <div>
    <h1>{user.name}</h1>
    <p>{user.email}</p>
  </div>
);

const UserProfileWithLoading = withLoading(UserProfile);

// Using the enhanced component
<UserProfileWithLoading user={user} isLoading={loading} />
```

### HOC with Authentication:
```jsx
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, isAuthenticated } = useAuth(); // Custom hook
    
    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }
    
    return <WrappedComponent {...props} user={user} />;
  };
}

const Dashboard = withAuth(({ user }) => (
  <div>
    <h1>Welcome to your dashboard, {user.name}!</h1>
  </div>
));
```

---

## Render Props

A pattern for sharing code between components using a prop whose value is a function.

### Basic Render Props:
```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Usage
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          <h1>Mouse position:</h1>
          <p>X: {x}, Y: {y}</p>
        </div>
      )}
    />
  );
}
```

### Data Fetcher with Render Props:
```jsx
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [url]);
  
  return render({ data, loading, error });
}

// Usage
<DataFetcher
  url="/api/users"
  render={({ data, loading, error }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
      <ul>
        {data.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    );
  }}
/>
```

---

## Error Boundaries

Components that catch JavaScript errors in their child component tree.

### Class-based Error Boundary:
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log error to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <div>
      <ErrorBoundary>
        <Header />
        <MainContent />
      </ErrorBoundary>
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
    </div>
  );
}
```

---

## Refs and DOM Manipulation

Direct access to DOM elements in React.

### useRef Hook:
```jsx
import { useRef, useEffect } from 'react';

function TextInputWithFocusButton() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  useEffect(() => {
    // Auto-focus on mount
    inputRef.current.focus();
  }, []);
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

### Forwarding Refs:
```jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="fancy-button" {...props}>
    {props.children}
  </button>
));

// Usage
function App() {
  const buttonRef = useRef();
  
  const handleClick = () => {
    buttonRef.current.focus();
  };
  
  return (
    <div>
      <FancyButton ref={buttonRef}>Click me!</FancyButton>
      <button onClick={handleClick}>Focus the fancy button</button>
    </div>
  );
}
```

---

## Memoization

Optimize performance by preventing unnecessary re-renders.

### React.memo:
```jsx
const ExpensiveComponent = React.memo(({ name, value }) => {
  console.log('ExpensiveComponent rendered');
  
  // Expensive calculation
  const result = Array.from({ length: 1000000 }, (_, i) => i * value).reduce((a, b) => a + b, 0);
  
  return (
    <div>
      <h3>{name}</h3>
      <p>Result: {result}</p>
    </div>
  );
});

// Custom comparison function
const UserCard = React.memo(({ user }) => (
  <div>
    <h3>{user.name}</h3>
    <p>{user.email}</p>
  </div>
), (prevProps, nextProps) => {
  return prevProps.user.id === nextProps.user.id;
});
```

---

## Custom Hooks

Extract component logic into reusable functions.

### Simple Custom Hook:
```jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}

// Usage
function Counter() {
  const { count, increment, decrement, reset } = useCounter(10);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Custom Hook with API:
```jsx
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, { 
          signal: abortController.signal 
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => abortController.abort();
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserList() {
  const { data: users, loading, error } = useApi('/api/users');
  
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Best Practices

### Component Organization:
```jsx
// Good: Single responsibility
function UserAvatar({ user, size = 'medium' }) {
  return (
    <img 
      src={user.avatar} 
      alt={user.name}
      className={`avatar avatar-${size}`}
    />
  );
}

function UserInfo({ user }) {
  return (
    <div className="user-info">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div className="user-card">
      <UserAvatar user={user} />
      <UserInfo user={user} />
    </div>
  );
}
```

### Performance Tips:
```jsx
// Use keys properly
{items.map(item => (
  <Item key={item.id} data={item} /> // Good: stable, unique key
))}

// Avoid inline objects and functions in render
function TodoItem({ todo, onToggle, onDelete }) {
  // Good: memoized handlers
  const handleToggle = useCallback(() => onToggle(todo.id), [onToggle, todo.id]);
  const handleDelete = useCallback(() => onDelete(todo.id), [onDelete, todo.id]);
  
  return (
    <div>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span>{todo.text}</span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

---

This guide covers all the essential React components and patterns you need to build modern React applications. Practice these concepts by building small projects and gradually incorporating more advanced patterns as you become comfortable with the basics.