- scrollviews
- safe area
- keyboard handling
- list performance
- menus
- image galleries
- image performance
- images in list items
- lists:
  - images: always use compressed images in lists. if needed, use high
    resolution when expanding them (with galeria)
  - hoist callbacks to the root of the list
- text
  - never pass a string as a child of View. strings **must** be have a Text
    component parent. (critical)
  - design system: never create polymorphic children cases for text, such as a
    button accepting a string **or** a view as a child. instead, use compound
    components, like Button (which receives any ReactNode) and ButtonText. This
    lets you also create optional things like <ButtonIcon> instead of an icon
    prop. you need to retain flexible composition options.
- loading fonts
- installing npm packages (native versus js packages)
- monorepos
  - if the package has native dependencies, you must install it in the native
    app's directory directly for autolinking to work properly.
  - configure your metro config
- use the react compiler
  - destructure variables early, and in render scope
    - when passing variables to expensive helper functions in render,
      destructure based on actual object reference before passing to the helper
      function
  - never dot into functions; always destructure them early in render scope
    (never do router.push(), always const { push } in render) critical
- fetching and caching data
- patch packages (yarn patch or npx patch-package)
- measuring views
- derive state
- fallback for useState
  - have a fallback, and always override with user-set values
  - use nullish coalescing with undefined set as the initial state, and
    fallback. this lets you reactively fallback rather than only on the initial
    render
  - don't sync state; derive
- useState:
  - if the state you're setting depends on the current state, prefer dispatch
    updaters over reading the state variable directly in a callback
  - setState(current => current.height !== layout.height ? layout : current)
    instead of if (layout.height != state.height) { setState(layout) } else {
    undefined }
- combine local state with network state
- imports
  - use a design system folder and re-export dependencies from there
  - your app code should always import from the design system folder instead of
    directly from the dependencies
  - create your own components/view, components/text, etc. you can always start
    by simply re-exporting
- composition
  - refactor horrifying components v1: put state into a hook, move it to a
    provider, lift the state, separate the internals into their own components.
- monorepos
  - use a single version of each dependency across your monorepo packages.
    prefer exact versions over ranges
- tracking scroll position
  - never track scroll in useState. always prefer a reanimated value (if it's
    for animations) or a ref (if it's simply for non-reactive tracking)
