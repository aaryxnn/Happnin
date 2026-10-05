# Happnin

Campus events, in one place.

Happnin is a mobile event discovery app for college students. It brings together an event feed, campus maps, RSVPs, and organizer publishing so students can find what's happening around them. The MVP is configured around UMass Amherst, with campus data for the Five College area.

Built with **TypeScript, React Native, Expo, and Supabase**.

## Features

- **Discover events:** browse the feed, explore categories, and view event details.
- **Explore campus:** find events on a map and preview locations when creating an event.
- **Plan your week:** RSVP to events, view saved RSVPs, and choose whether your attendance is visible.
- **Publish events:** request organizer verification, create events, and upload poster images.
- **Student onboarding:** set up a profile, interests, and club tags with campus email-domain checks.
- **Try it locally:** explore a demo mode before connecting your own Supabase project.

## Stack

| Layer | Technology |
| --- | --- |
| Mobile app | React Native, Expo SDK 54, TypeScript |
| Navigation | React Navigation |
| Backend | Supabase Auth, PostgreSQL, Storage |
| Maps | react-native-maps |
| Device features | Expo Image Picker, Expo Notifications |
| Session storage | AsyncStorage |

## Quick start

Install Node.js, Git, and an Expo Go version compatible with the project's Expo SDK.

```bash
git clone https://github.com/aaryxnn/Happnin.git
cd Happnin
npm install
```

Copy `.env.example` to `.env`:

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Leave the Supabase values empty to try demo mode, then run:

```bash
npm run start
```

Open the project in Expo Go and use the bundled demo account:

```text
Email: student@example.edu
Password: happnin123
```

Complete onboarding to explore the event feed, maps, and RSVP flow. These credentials are for the local demo only.

## Connect Supabase

Create your own Supabase project and set these values in `.env`:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
EXPO_PUBLIC_ALLOWED_EMAIL_DOMAINS=umass.edu
EXPO_PUBLIC_ENABLE_DEV_ADMIN_FLOW=false
```

`EXPO_PUBLIC_SUPABASE_ANON_KEY` is also supported when a publishable key is not supplied. Use a client publishable/anon key; keep server credentials out of the mobile app.

Run the SQL migrations in the Supabase SQL Editor in this order:

1. `001_initial_schema.sql`
2. `002_umass_launch.sql`
3. `003_umass_org_imports_and_sample_events.sql`
4. `005_event_posters_storage.sql`
5. `006_event_feed_security_invoker.sql`

Migration `004_dev_admin_organizer_approval.sql` is optional for private development/testing. The [local setup guide](docs/LOCAL_SETUP.md) explains its allowlist and the optional seed data. Restart Expo after changing environment variables.

## Project structure

```text
App.tsx                 App entry point
src/
  components/           Shared UI components
  context/              App state, authentication, and data operations
  data/                 Demo data
  lib/                  Supabase, domain checks, and notifications
  navigation/           Navigation and route types
  screens/              Student and organizer screens
supabase/
  migrations/           Database schema, policies, and storage setup
  seed.sql              Optional demo seed data
```

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run start` | Start the Expo development server |
| `npm run android` | Open the Android target |
| `npm run ios` | Open the iOS target; requires macOS |
| `npm run web` | Open the web target |
| `npm run typecheck` | Check TypeScript |
| `npx expo-doctor` | Check Expo project configuration |

## Status

This repository contains an MVP. A live deployment and production usage are not documented here. Supabase-backed flows require your own backend setup; demo mode uses bundled sample data. Maps and notifications have platform-specific behavior, and the notification helpers skip Expo Go and web.

Friend groups, messaging, payments, ticketing, and AI recommendations are outside the current `main` branch MVP.

For detailed setup and troubleshooting, see the [local setup guide](docs/LOCAL_SETUP.md).
