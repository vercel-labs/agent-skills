---
scraped_at: '2026-04-20T08:50:57+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/dev-guides/state-management/index.html.md
title: State management
---

# State management

How to manage the state of Cloudscape components.

## Managing the state of a component

Our components expose properties and events that allow you to configure their appearance and behavior. Some properties represent the main information that your end users see and can interact with, such as the `value` of an [input](/components/input/index.html.md) component or the `selectedOption` in a [select](/components/select/index.html.md) component. These properties represent the state of a component. This article explains how to control those properties by introducing the concept of controllability, which is widely used in the React ecosystem.

In general, a React component can be [controlled](/get-started/dev-guides/state-management/index.html.md) , [uncontrolled](/get-started/dev-guides/state-management/index.html.md) , or [controllable](/get-started/dev-guides/state-management/index.html.md) . The rest of the article explains these concepts. Our components are always either controlled (for example: input, select) or controllable (for example: [tabs](/components/tabs/index.html.md) ). For more information about a component's controllability, read the development guidelines for the component.

## Controlled component

A component is considered *controlled* if its state is dictated by the value of the properties that you set for it. Consider, for example, the input component. If you set a hard-coded value:

```
<Input value="frozen value" />
```

the end user won't be able to change it. Anything the user enters into the input field will be disregarded.
For end users to interact with the input component, you must store its value in your application state, and register an event listener to update it.

```
<Input value={this.state.value} onChange={evt => this.setState({value: evt.detail.value})}/>
```

Note that the input examples above use React syntax and the input component.
For more information, see [Controlled Components](https://reactjs.org/docs/forms.html#controlled-components) in the React documentation.

## Uncontrolled component

No components in the system are uncontrolled. A component is considered *uncontrolled* if its state can diverge from the value of the properties that you set for it. Suppose, for example, that you have a generic input element where the value is uncontrolled. If you set a value:

```
<input value="frozen value" />
```

the end user can modify it by typing a new value. Uncontrolled components keep an internal state that diverges from the values of the properties that are set for them.
Note that the previous input example uses a generic input element and not the Cloudscape input component.

We don't recommend using uncontrolled components. For more information, see [Uncontrolled Components](https://reactjs.org/docs/uncontrolled-components.html) in the React* * documentation.

## Controllable component

A component is considered *controllable* if it can be used either as a controlled or as an uncontrolled component.  This means that if the value isn't specified, the state of the component can change upon user interaction. However, if the value is specified, the state of the component is fully controlled by it.

An example of a controllable component in Cloudscape is the tabs component. If you don't set the `activeTabId` property, the component reacts to end user tab selection by changing the tab.

```
<Tabs tabs={...} /> // the component changes its state upon user interaction
```

However, if you explicitly set an `activeTabId` property, the active tab reflects the value that you provide.

```
<Tabs tabs={...} activeTabId="tab1" /> // the component does not change its state upon user interaction
```

You have to both explicitly store its value in your application state and register an event listener in order to update it.

```
<Tabs tabs={...} activeTabId={this.state.activeTabId} onChange={evt => this.setState({activeTabId: getValueFromEvent(evt)})} />
```
