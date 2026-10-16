# Agent handoff — investments and navigation

Current branch: `feat/investment-prediction-alerts`, based on the navigation collision fix branch. It includes the swept-segment collision PR work plus an initial investment screen.

## Implemented in code
- `simulation/investment.js`: 10,000 fictional starting credits, six upgrades, costs, synthetic effects, deterministic 30-day forecast entries, localStorage persistence and duplicate/overspend protection.
- `index.html`, `play.css`: floating welcome alert and investment-card styling.
- `play.js`: Investments navigation, buying flow, toast/sound, budget persistence, initial alert and restore purchased upgrades after reload.
- `world3d.js`: sector tint, installation ring animation and limited actor routine/emoji feedback when upgrades are applied.
- `tests/investment-system.test.mjs`, included in `npm test`.
- `docs/INVESTMENT-FEATURE-NOTES.md` describes behavior and limits.

## Required next steps
1. Run `npm test`; fix syntax and regression failures before proceeding.
2. Open the Vercel preview generated for this branch and test desktop/mobile, welcome alert, navigation, each purchase, reload persistence, reset, sound, scene colors, ring animation and console.
3. Confirm starting budget behavior in a fresh browser profile and on corrupted localStorage. The feature is browser-local, not account-level; do not claim every authenticated user receives a cloud-synced balance.
4. Check that the 30-day forecast remains clearly labelled educational/synthetic. It is not an empirical prediction or clinical outcome.
5. Improve each purchased upgrade with a meaningful sector-specific 3D prop/condition change where compatible assets exist. Do not invent replacement avatars if no matching GLB exists.
6. Revisit waypoint/collision tests and run browser QA for characters stuck, floating, or crossing furniture/walls.
7. Do not merge or deploy to production without explicit user authorization.

## Known limitations
- The sector effect currently changes floor color and plays a temporary ring animation; upgrade-specific props are not complete.
- Some upgrades change the operator's synthetic emoji/state, but no fully modelled individual forecast system exists yet.
- No browser test or successful CI run has been confirmed by the authoring agent in this handoff. Report only evidence actually obtained.
