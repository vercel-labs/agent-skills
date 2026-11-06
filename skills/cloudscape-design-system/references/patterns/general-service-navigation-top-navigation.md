---
scraped_at: '2026-04-20T08:53:01+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/service-navigation/top-navigation/index.html.md
title: Top navigation
---

# Top navigation

Top navigation provides global controls that help users use the product or service. It's comprised of a collection of global functionalities that are separate from the product's structural navigation.

 [View demo](/examples/react/non-console.html)
## Key UX concepts

The top navigation should be organized to support the user's global navigation requirements. It can be used on its own or paired with the [side navigation](/components/side-navigation/index.html.md) component.

It provides three distinct locations to house your global functionality:

1. The service identity
2. An area for global search
3. On the far right of the top navigation, an area to house utility navigation (for example, *notifications*   )

## Building blocks

A B C D E F G H
#### A. Service identity

The service identity is always the first item in the navigation.

#### B. Global search - optional

Use a [search input](/components/input/index.html.md) or [autosuggest](/components/autosuggest/index.html.md) component to provide the global search for the service. Use the autosuggest component when you can provide search suggestions for quick access to relevant result.

For example: Searching for *service resources*.

#### C. Utility navigation - optional

Utility navigation is a collection of controls that are separate to the services structural navigation. These are positioned in the right of the top navigation, ensuring they are always visible and easily accessed.

For example: Notifications, service settings, user profile management, and sign out.

#### D. Service specific controls - optional

Include controls that need to be always visible to your users first in the list.

For example: Link to [aws.amazon.com](https://aws.amazon.com/).

#### E. Notifications - optional

Provides access to global notifications. Add a badge to indicate a state change that a user should read or acknowledge within the service.

For example: Indicating that a new commit has been made to a project.

#### F. Service Settings - optional

Use an icon button with a [settings icon](/foundation/visual-foundation/iconography/index.html.md) to access global service settings.

For example: Settings where users can configure global properties for how the service functions.

#### G. User profile management - optional

Use a link button with the [user profile icon](/foundation/visual-foundation/iconography/index.html.md) supported with the user name or id to link to the user and or account management options.

Use the following order for nested links. *Profile* , *User profile Preferences* and *Sign out* as the last item in the list.

Add other links the service may require in order of usage after *Preferences* and before *Sign out*.

#### H. Support - optional

Group your support links together. These can be placed either as the first item in the utility navigation, or grouped as a category under profile. Base your grouping on your user data.

For example: Service documentation and feedback.

## Responsive behavior

The top navigation component comes with integrated responsive behavior. To see a real-life example, view the [demo](/examples/react/non-console.html) and resize the screen to see the responsive behavior.

More information on the responsive behavior can be found in the [top navigation usage guidelines](/components/top-navigation/index.html.md).

## General guidelines

### Do

- The order of items in the utility navigation should follow a consistent order: *Notifications*   , *Settings*   , *User management*   . When you add product or service specific links, place them first in the list.
- Use the customers name, email, or id, as title for the user profile menu.

### Don't

- Don't persist all of your services controls on smaller screen sizes. Don't prevent too many controls from being moved into the overflow menu.
- Don't add structural navigation links in the top navigation. Instead, use the side navigation.
- Don't move notifications into the overflow menu. Ensure the notification icon persists on all screen sizes.

## Related patterns

### Top navigation

A global navigation element for applications that is consistent and persists across all application pages.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/non-console)

[View Documentation](/patterns/general/service-navigation/top-navigation/index.html.md)

### Button

Allows users to initiate actions in the user interface.

[View Documentation](/components/button/index.html.md)

### Autosuggest

Autosuggest enables users to choose from a list of suggestions.

[View Documentation](/components/autosuggest/index.html.md)

### Side navigation

A list of navigational links that point to the pages within an application.---

[View Documentation](/patterns/general/service-navigation/side-navigation/index.html.md)
