# Happnin Local Setup Guide

Happnin is a college-focused mobile event discovery app built with Expo React Native and Supabase.

This guide assumes you are starting from scratch and do not have any developer tools installed yet.

## 1. Install The Required Tools

### Install Node.js

1. Go to `https://nodejs.org/`
2. Download the **LTS** version.
3. Run the installer.
4. Keep the default options checked.
5. After installation, restart PowerShell.

Check that Node and npm work:

```powershell
node --version
npm --version
```

Both commands should print version numbers.

If `npm --version` fails with an error about `npm-cli.js`, reinstall Node.js from the official installer and make sure the installer adds Node to your PATH.

### Install Git

1. Go to `https://git-scm.com/downloads`
2. Download Git for Windows.
3. Run the installer.
4. Keep the default options.
5. Restart PowerShell.

Check it:

```powershell
git --version
```

### Install Expo Go On Your Phone

This project uses **Expo SDK 54**, so use an Expo Go version compatible with that SDK.

Install **Expo Go** from:

- iPhone: App Store
- Android: Google Play Store

This lets you run the app on your real phone without creating a development build yet.

### Optional: Install VS Code

VS Code is not required, but it is the easiest editor for this project.

Download it from:

```text
https://code.visualstudio.com/
```

## 2. Open The Project Folder

Open PowerShell and go to the Happnin folder:

```powershell
cd "path\to\Happnin"
```

Confirm you are in the right place:

```powershell
dir
```

You should see files like:

```text
package.json
App.tsx
src
supabase
README.md
```

## 3. Install App Dependencies

From inside the Happnin folder, run:

```powershell
npm install
```

This downloads Expo, React Native, Supabase, navigation, maps, icons, and other packages.

When it succeeds, you should see a new folder:

```text
node_modules
```

and usually a new file:

```text
package-lock.json
```

## 4. Create Your Local Environment File

Copy the example environment file:

```powershell
copy .env.example .env
```

For now, you can leave `.env` mostly empty. Without Supabase values, the app runs in demo mode.

The demo mode uses:

```text
student@example.edu
happnin123
```

## 5. Start The App Locally

Run:

```powershell
npm run start
```

Expo will start a local development server.

You should see a QR code in the terminal.

### Run On Your Phone

1. Open Expo Go on your phone.
2. Scan the QR code from the Expo terminal.
3. Wait for the app to load.

Your phone and computer need to be on the same Wi-Fi network.

### Run In A Browser

You can also press:

```text
w
```

in the Expo terminal to open the web version.

Some native mobile features, like push notifications and maps, may behave differently on web.

## 6. Log Into The Demo App

Use:

```text
Email: student@example.edu
Password: happnin123
```

Then complete onboarding:

1. Add your name.
2. Pick your school year.
3. Choose interests.
4. Choose club tags.
5. Enter Happnin.

You should be able to test:

- Event feed
- Event detail pages
- RSVP
- Visible RSVP social proof
- Discover screen
- Map screen
- Saved RSVP screen
- Profile screen
- Organizer verification request
- Create event screen
- Report event flow

## 7. If npm Is Broken On Your Machine

If this command fails:

```powershell
npm install
```

try this direct npm command:

```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
```

Then start the app with:

```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run start
```

If that still fails, reinstall Node.js LTS from:

```text
https://nodejs.org/
```

After reinstalling, close PowerShell, open a new PowerShell window, and try again:

```powershell
npm --version
npm install
npm run start
```

## 8. Optional: Connect Supabase

The app works in demo mode first. Supabase is the real backend for auth, database, organizer verification, events, RSVPs, reports, and notification preferences.

### Create A Supabase Project

1. Go to `https://supabase.com/`
2. Create an account.
3. Create a new project.
4. Save your project URL and anon public key.

### Run The Database SQL

In Supabase:

1. Open your project.
2. Go to **SQL Editor**.
3. Open this local file:

   ```text
   supabase/migrations/001_initial_schema.sql
   ```

4. Copy the SQL into Supabase SQL Editor.
5. Run it.
6. Open this local file:

   ```text
   supabase/migrations/002_umass_launch.sql
   ```

7. Copy the SQL into Supabase SQL Editor.
8. Run it.
9. Open this local file:

   ```text
   supabase/migrations/003_umass_org_imports_and_sample_events.sql
   ```

10. Copy the SQL into Supabase SQL Editor.
11. Run it.
12. Open this local file if organizers should upload event poster photos:

   ```text
   supabase/migrations/005_event_posters_storage.sql
   ```

13. Copy the SQL into Supabase SQL Editor.
14. Run it.
15. Open this local file to make the public event feed view use normal querying-user RLS:

   ```text
   supabase/migrations/006_event_feed_security_invoker.sql
   ```

16. Copy the SQL into Supabase SQL Editor.
17. Run it.
18. Optional local/demo seed only: open this local file:

   ```text
   supabase/seed.sql
   ```

19. Copy the seed SQL into Supabase SQL Editor.
20. Run it only if you still want the old demo seed rows.

### Add Supabase Values To `.env`

Open `.env` and add:

```text
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_ALLOWED_EMAIL_DOMAINS=umass.edu
EXPO_PUBLIC_ENABLE_DEV_ADMIN_FLOW=false
```

`student@example.edu` still works as a local-only demo login even though real UMass access uses `umass.edu`.

After changing `.env`, restart Expo:

```powershell
npm run start
```

### Optional: Enable Local/Dev Organizer Approval

Use this only for a local/dev Supabase project or a private staging project.

1. Run this migration once in Supabase SQL Editor:

   ```text
   supabase/migrations/004_dev_admin_organizer_approval.sql
   ```

2. Add your test account email to the dev admin allowlist once:

   ```sql
   insert into public.dev_admin_users (email, note)
   values ('your.name@umass.edu', 'Local Happnin organizer testing')
   on conflict (email) do nothing;
   ```

3. In `.env`, enable the in-app dev control:

   ```text
   EXPO_PUBLIC_ENABLE_DEV_ADMIN_FLOW=true
   ```

4. Restart Expo. In the Organizer tab, submit an organizer request, tap **Approve in dev**, then create and publish an event.

The app-side flag only shows the button. The Supabase RPC still checks that you are signed in, your email is allowlisted in `dev_admin_users`, and the organizer request belongs to your own user account.

## 9. UMass And Five College Launch Data

The real launch migration seeds:

```text
University of Massachusetts Amherst: live
Amherst College: coming_soon
Smith College: coming_soon
Mount Holyoke College: coming_soon
Hampshire College: coming_soon
```

For UMass launch, update:

- real UMass clubs in Supabase
- real UMass events in Supabase
- organizer approvals in Supabase

You will need:

- club names, logos, descriptions, and Instagram links
- event title, description, category, poster URL, start time, venue, address, and coordinates
- City and state
- Allowed student email domain
- Campus latitude and longitude
- Initial clubs
- Initial real events

## 10. Useful Commands

Start the app:

```powershell
npm run start
```

Run the app on Android:

```powershell
npm run android
```

Run the app on iOS, only available on macOS:

```powershell
npm run ios
```

Run the web version:

```powershell
npm run web
```

Check TypeScript:

```powershell
npm run typecheck
```

Check Expo project health:

```powershell
npx expo-doctor
```

## 11. Current MVP Features

Already scaffolded:

- Strict `.edu` email-domain validation
- Demo-mode auth
- Onboarding
- Student profile
- Club tags
- Event feed
- Event detail pages
- RSVP counts
- Optional visible RSVP social proof
- Discover categories
- Simple map pins
- Saved RSVP screen
- Organizer verification request
- Local/dev self-approval for your own pending organizer request when explicitly enabled
- Verified-organizer event creation gate
- End-to-end event publishing into Supabase `events`
- Calendar and clock controls for event start date/time
- UMass place suggestions with map-based location preview on event creation
- Organizer poster photo selection from the device gallery
- Supabase Storage bucket and policies for event poster uploads
- `event_feed` view configured with `security_invoker` so RLS runs as the querying user
- Basic report flow
- Push reminder hook
- Supabase schema and seed data

Not included yet:

- Friend requests
- Friend groups
- Comments
- DMs
- Payments
- Ticketing
- Heatmaps
- AI recommendations
- Full admin dashboard

## 12. First Real Product Tasks

Before launching to students:

1. Run the UMass launch migration.
2. Replace starter UMass clubs with real clubs.
3. Replace starter UMass events with real campus events.
4. Recruit 10 clubs or trusted student organizers.
5. Test with 5-10 real `@umass.edu` students.
6. Approve organizer requests manually in Supabase, or use the local/dev approval flow only in private testing.
7. Fix onboarding and event discovery friction before wider launch.

## 13. Troubleshooting

### Expo QR Code Does Not Load On Phone

Try:

```powershell
npm run start -- --tunnel
```

This uses Expo's tunnel mode and is often easier on school or apartment Wi-Fi.

### PowerShell Says Scripts Are Disabled

Use this command in PowerShell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then close and reopen PowerShell.

### Port Is Already In Use

Stop the old Expo server with:

```text
Ctrl + C
```

Then restart:

```powershell
npm run start
```

### App Still Shows Old Code

Restart Expo with cache clearing:

```powershell
npm run start -- --clear
```

### Supabase Login Fails

Check:

- `.env` has the right Supabase URL.
- `.env` has the right anon key.
- `EXPO_PUBLIC_ALLOWED_EMAIL_DOMAINS` matches the email domain.
- The Supabase SQL migration has been run.
- The campus row exists in Supabase.

## 14. Recommended First Run Path

Do this first:

```powershell
cd "path\to\Happnin"
npm install
copy .env.example .env
npm run start
```

Then open Expo Go and log in with:

```text
student@example.edu
happnin123
```
