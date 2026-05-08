# IMPACT_26

## Local Google auth

- `npm run dev` opens the app on `localhost` by default, even when it has to move off port `3000`.
- Firebase Auth treats `localhost` and `127.0.0.1` as different authorized domains.
- If you want Google popup sign-in to work on both hosts, add both under Firebase Console -> Authentication -> Settings -> Authorized domains.
- Local network IP addresses are not covered by the default setup and must be authorized separately if you intentionally test that way.
