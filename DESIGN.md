# Happnin - Design Reference

Source inspiration: Refero Styles, Partiful style reference
https://styles.refero.design/style/6db1057d-3457-4173-9184-df160415f060

This branch adapts the playful event-invitation language from the source into Happnin's own
dark purple, electric pink, lime, amber, and moon-white palette. The goal is not to clone
Partiful. It is to make Happnin feel more tactile, editorial, and party-native while keeping
the app recognizably Happnin.

## Design Intent

Happnin should feel like a campus-night poster feed: dark, energetic, easy to scan, and full
of event photography. The canvas stays deep ink. Important event surfaces are charcoal/plum
poster cards, not white paper cards. Purple and pink are used as atmospheric accents and
selected states, while primary actions use near-black filled buttons with moon-white text.

## Color Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Ink canvas | `colors.background` | `#05030a` | App background and black primary actions |
| Raised ink | `colors.backgroundRaised` | `#090511` | Bottom navigation and dark panels |
| Night surface | `colors.surface` | `#12091f` | Secondary dark panels and maps |
| Strong night surface | `colors.surfaceStrong` | `#1d1030` | Form panels and overlays |
| Poster card | `colors.paper` | `#12091f` | Event cards, sheet cards, dark content panels |
| Poster soft | `colors.paperSoft` | `#1d1030` | Inputs, chip containers, raised dark panels |
| Poster border | `colors.paperBorder` | `rgba(192,132,252,0.24)` | Dark card purple hairlines |
| Poster text | `colors.ink` | `#fbf7ff` | Text on dark poster surfaces |
| Secondary poster text | `colors.inkMuted` | `#c9bbdc` | Supporting text on dark poster surfaces |
| App text | `colors.text` | `#fbf7ff` | Text on dark backgrounds |
| Muted dark text | `colors.muted` | `#c9bbdc` | Supporting text on dark backgrounds |
| Purple accent | `colors.accent` | `#a855f7` | Selected states and key icons |
| Deep purple | `colors.accentStrong` | `#7c3aed` | Active controls and gradients |
| Pink energy | `colors.pink` | `#ff4ecd` | Event energy accents only |
| Lime signal | `colors.lime` | `#b6ff5c` | Live dots and high-positive activity |
| Amber maybe | `colors.amber` | `#ffd166` | Warnings, maybe states, demo notes |
| Green going | `colors.green` | `#45f5a7` | Verified and going states |
| Danger | `colors.danger` | `#ff6b8a` | Reports and destructive actions |

## Typography

- Use the system sans stack, but treat it like an editorial event brand.
- Screen titles: 32-42px, weight 900, tight line height.
- Card titles: 22-28px, weight 900, tight line height.
- UI labels and chips: 11-14px, weight 800-900.
- Body copy: 15-16px, line height around 1.45.
- Avoid more than two type sizes inside one compact card.

## Shape, Spacing, and Elevation

- Buttons use 8-12px radius, not giant glowing capsules unless the control is a chip.
- Chips, filter tabs, RSVP tags, and category labels use full pill radius.
- Event cards use 18-22px radius with dark poster content areas and a strong photo region.
- Dark poster cards use soft ink shadows and purple hairline borders instead of neon glow.
- Full-screen dark surfaces can use subtle purple gradients, but controls should not use gradients.
- Keep the mobile layout comfortable: 16px screen padding, 10-16px internal gaps, and generous bottom spacing above tabs.

## Component Rules

### Primary Button

Background is deep ink (`colors.background`) with moon-white text. Radius is 12px. Use for
publishing, creating, retrying, and primary RSVP actions. Purple and pink should not replace
the primary fill.

### Secondary Button

Use dark plum surfaces with moon-white text and purple hairline borders. Secondary buttons
should still feel quiet, but never become white blocks.

### Chips and Tabs

Default chips are translucent dark plum. Selected chips use deep ink or a saturated purple
wash with strong contrast. Keep category and date filters pill-shaped.

### Event Cards

Event cards should feel like an Instagram-style poster feed:

- Organizer header first: avatar initial, organizer name, venue, verification, and category pill.
- Tall 4:5 poster image with no title overlay, so event photography feels like the main feed object.
- Dark caption-style body below the poster with date/time, RSVP state, title, and stacked meta rows.
- Use compact mono-weight icons in the meta rows.
- Keep shadows soft and physical, not neon.

### Feed Header

The feed header can keep a purple-to-night gradient, but it should feel like a party poster
surface. Use a live campus pill, big title, and small stat cards. Avoid a dense dashboard feel.

### Navigation

The bottom tab bar should feel like a floating invitation strip: rounded, compact, legible, and
high contrast. Active icons can use purple/pink washes. Inactive labels should stay muted.

## Screen Notes

- Feed: strongest expression of the new system. Use the poster-like header, dark poster event cards,
  pill filters, and compact search.
- Discover: category tiles should look like small invitation tiles, not dark dashboard cards.
- Event details: use a large photo hero, dark metadata card, poster RSVP panel, and clear
  black primary RSVP button.
- Create event: forms should feel calmer and more editorial with dark inputs and clear section
  headings.
- Profile and Organizer: use clean dark panels over the dark app canvas.

## Do

- Use Happnin's existing purple, pink, lime, amber, and dark ink palette.
- Let event photography carry the energy.
- Keep primary actions black/ink filled.
- Use full-pill filters and tags.
- Use charcoal/plum poster cards to create contrast against the dark app canvas.
- Keep icons simple, mono-weight, and high contrast.

## Don't

- Do not copy Partiful's exact colors as the app palette.
- Do not turn purple/pink gradients into button fills.
- Do not keep the old neon-glow treatment on every card.
- Do not create nested cards inside cards.
- Do not add marketing-page sections or explanatory UI copy.
- Do not reintroduce white card blocks; the feed should stay dark.
