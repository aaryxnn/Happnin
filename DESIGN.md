# Happnin - Design Reference

Source inspiration: Refero Styles, Partiful style reference
https://styles.refero.design/style/6db1057d-3457-4173-9184-df160415f060

This branch adapts the playful event-invitation language from the source into Happnin's own
dark purple, electric pink, lime, amber, and moon-white palette. The goal is not to clone
Partiful. It is to make Happnin feel more tactile, editorial, and party-native while keeping
the app recognizably Happnin.

## Design Intent

Happnin should feel like a campus-night invitation board: dark, energetic, easy to scan, and
full of event photography. The canvas stays deep ink. Important event surfaces become bright
paper cards, like digital flyers pinned against a night background. Purple and pink are used
as atmospheric washes and selected states, while primary actions use near-black filled buttons
with moon-white text.

## Color Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Ink canvas | `colors.background` | `#05030a` | App background and black primary actions |
| Raised ink | `colors.backgroundRaised` | `#090511` | Bottom navigation and dark panels |
| Night surface | `colors.surface` | `#12091f` | Secondary dark panels and maps |
| Strong night surface | `colors.surfaceStrong` | `#1d1030` | Form panels and overlays |
| Moon paper | `colors.paper` | `#fbf7ff` | Event cards, sheet cards, light content panels |
| Paper soft | `colors.paperSoft` | `#f2ecff` | Inputs, chip containers, muted light panels |
| Paper border | `colors.paperBorder` | `#ded2ef` | Light card hairlines |
| Ink text | `colors.ink` | `#160a24` | Text on moon paper |
| Secondary ink | `colors.inkMuted` | `#5b4b6f` | Supporting text on moon paper |
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
- Event cards use 18-22px radius with bright paper content areas and a strong photo region.
- Light cards use small ink shadows and paper borders instead of neon glow.
- Full-screen dark surfaces can use subtle purple gradients, but controls should not use gradients.
- Keep the mobile layout comfortable: 16px screen padding, 10-16px internal gaps, and generous bottom spacing above tabs.

## Component Rules

### Primary Button

Background is deep ink (`colors.background`) with moon-white text. Radius is 12px. Use for
publishing, creating, retrying, and primary RSVP actions. Purple and pink should not replace
the primary fill.

### Secondary Button

Use moon paper with ink text and paper borders on dark backgrounds. On light panels, use a
soft paper tint or transparent ink outline.

### Chips and Tabs

Default chips are light paper or translucent paper. Selected chips use deep ink text treatment
or a purple wash with strong contrast. Keep category and date filters pill-shaped.

### Event Cards

Event cards should feel like an Instagram-style poster feed:

- Organizer header first: avatar initial, organizer name, venue, verification, and category pill.
- Tall 4:5 poster image with no title overlay, so event photography feels like the main feed object.
- Caption-style body below the poster with date/time, RSVP state, title, and stacked meta rows.
- Use compact mono-weight icons in the meta rows.
- Keep shadows soft and physical, not neon.

### Feed Header

The feed header can keep a purple-to-night gradient, but it should feel like a party poster
surface. Use a live campus pill, big title, and small stat cards. Avoid a dense dashboard feel.

### Navigation

The bottom tab bar should feel like a floating invitation strip: rounded, compact, legible, and
high contrast. Active icons can use purple/pink washes. Inactive labels should stay muted.

## Screen Notes

- Feed: strongest expression of the new system. Use the poster-like header, paper event cards,
  pill filters, and compact search.
- Discover: category tiles should look like small invitation tiles, not dark dashboard cards.
- Event details: use a large photo hero, light metadata card, paper RSVP panel, and clear
  black primary RSVP button.
- Create event: forms should feel calmer and more editorial with paper inputs and clear section
  headings.
- Profile and Organizer: use clean paper panels over the dark app canvas.

## Do

- Use Happnin's existing purple, pink, lime, amber, and dark ink palette.
- Let event photography carry the energy.
- Keep primary actions black/ink filled.
- Use full-pill filters and tags.
- Use moon-white cards to create contrast against the dark app canvas.
- Keep icons simple, mono-weight, and high contrast.

## Don't

- Do not copy Partiful's exact colors as the app palette.
- Do not turn purple/pink gradients into button fills.
- Do not keep the old neon-glow treatment on every card.
- Do not create nested cards inside cards.
- Do not add marketing-page sections or explanatory UI copy.
- Do not let text become low contrast on paper surfaces.
