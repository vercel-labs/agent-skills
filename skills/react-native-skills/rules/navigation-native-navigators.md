---
title: Use Native Navigators for Navigation
impact: HIGH
impactDescription: native performance, platform-appropriate UI
tags: navigation, react-navigation, expo-router, native-stack, tabs
---

## Use Native Navigators for Navigation

Always use native navigators instead of JS-based ones. Native navigators use
platform APIs (UINavigationController on iOS, Fragment on Android) for better
performance and native behavior.

**For stacks:** Use `@react-navigation/native-stack` or expo-router's default
stack (which uses native-stack). Avoid `@react-navigation/stack`.

**For tabs:** Use `react-native-bottom-tabs` (native) or expo-router's native
tabs. Avoid `@react-navigation/bottom-tabs` when native feel matters.

### Stack Navigation

**Incorrect (JS stack navigator):**

```tsx
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  )
}
```

**Correct (native stack with react-navigation):**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  )
}
```

**Correct (expo-router uses native stack by default):**

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'

export default function Layout() {
  return <Stack />
}
```

### Tab Navigation

**Incorrect (JS bottom tabs):**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}
```

**Correct (native bottom tabs with react-navigation):**

```tsx
import { createNativeBottomTabNavigator } from 'react-native-bottom-tabs/react-navigation'

const Tab = createNativeBottomTabNavigator()

function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'house' }),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'gear' }),
        }}
      />
    </Tab.Navigator>
  )
}
```

**Correct (expo-router native tabs):**

```tsx
// app/(tabs)/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs'

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ sfSymbol: 'house' }),
        }}
      />
      <NativeTabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ sfSymbol: 'gear' }),
        }}
      />
    </NativeTabs>
  )
}
```

### Prefer Native Header Options Over Custom Components

**Incorrect (custom header component):**

```tsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    header: () => <CustomHeader title="Profile" />,
  }}
/>
```

**Correct (native header options):**

```tsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    title: 'Profile',
    headerLargeTitle: true,
    headerSearchBarOptions: {
      placeholder: 'Search',
    },
  }}
/>
```

Native headers support iOS large titles, search bars, blur effects, and proper
safe area handling automatically.

### Why Native Navigators

- **Performance**: Native transitions and gestures run on the UI thread
- **Platform behavior**: Automatic iOS large titles, Android material design
- **System integration**: Scroll-to-top on tab tap, PiP avoidance, proper safe areas
- **Accessibility**: Platform accessibility features work automatically

Reference:
- [React Navigation Native Stack](https://reactnavigation.org/docs/native-stack-navigator)
- [React Navigation Native Bottom Tabs](https://reactnavigation.org/docs/native-bottom-tab-navigator)
- [Expo Router Native Tabs](https://docs.expo.dev/router/advanced/native-tabs)
