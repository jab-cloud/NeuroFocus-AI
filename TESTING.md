# Testing Guide for FocusMind

Follow this checklist to ensure your FocusMind app is working perfectly on both desktop and mobile.

## 1. PWA & Installation Testing
- [ ] **HTTPS Verification**: Ensure the app is served over HTTPS (required for PWA).
- [ ] **Install Prompt**: Open the URL on your mobile. Does the browser suggest "Install" or "Add to Home Screen"?
- [ ] **Valid Icons**: Verify `icon-192.png` and `icon-512.png` exist and are valid PNG files. If not, install prompt won't appear.
- [ ] **Offline Mode**: Turn on Airplane mode. Open the app. It should still load (cached by Service Worker).
- [ ] **Service Worker**: Open DevTools (F12) > Application > Service Workers. Should show "activated and running".

## 2. Productivity Tools
- [ ] **Pomodoro Timer**: Enter Focus Mode. Does the timer count down from 25:00? Does it show 24:59, 24:58, etc.?
- [ ] **Break Cycle**: Let timer reach 00:00. Does it switch to 5-minute break automatically?
- [ ] **Multiple Cycles**: Complete at least 2 focus sessions. Score should increase by 1 per focus + 5 per completed cycle.
- [ ] **Focus Goals**: Add up to 3 goals. Check one off. Does your score increase by 2? Refresh the page; are the goals still there?
- [ ] **AI Coach**: Start the local AI server and send a message. Does the coach return a response from OpenAI, or fallback gracefully if unavailable?
- [ ] **Goal Limit**: Try to add a 4th goal. Should not be allowed (max 3).
- [ ] **Dark Mode**: Toggle the 🌙/☀️ icon. Does the theme change instantly and persist after refresh?
- [ ] **Sound Control**: Toggle the bell icon. Does it switch between enabled and muted states?
- [ ] **Pause/Resume**: Start Focus Mode, pause the timer, then resume it. Does the timer stop and restart correctly?
- [ ] **Streak Tracking**: Check if streak updates (compares consecutive days with `lastActiveDate`).

## 3. Security & Accountability
- [ ] **AI Coach Filter**: Type "porn" or "sex" into the coach chat. Does the coach refuse and provide a Bible verse (e.g., Job 31:1)?
- [ ] **Restricted Keywords**: Test other keywords like "adult", "nude". Coach should filter these.
- [ ] **Safe-Search Guard**: Enable the toggle. Does the coach confirm it's active? Status should persist on refresh.
- [ ] **Uninstall Protection**: Try to click "Exit Focus Mode". Does the math challenge appear?
- [ ] **Challenge Difficulty**: Verify challenges include:
  - [ ] Addition problems (e.g., "7 + 5 = ?")
  - [ ] Subtraction problems (e.g., "15 − 8 = ?")
  - [ ] Multiplication problems (e.g., "6 × 4 = ?")
- [ ] **Wrong Answer**: Provide wrong answer. Does a new challenge appear? (Should retry, not let you exit)
- [ ] **Correct Answer**: Solve the challenge. Does Focus Mode exit? Is background color reset?

## 4. User Stats & Persistence
- [ ] **Score Tracking**: Check if your productivity score increases as expected for:
  - [ ] Entering Focus Mode: +1
  - [ ] Completing Pomodoro cycle: +5
  - [ ] Completing a goal: +2
- [ ] **Streak Persistence**: 
  - [ ] Use app today. Streak should be 1 or higher.
  - [ ] Wait 24 hours and use app again. Streak should increment.
  - [ ] Skip a day and use app. Streak should reset to 1.
- [ ] **Data Survives Refresh**: Refresh page (Ctrl+F5). Check that all user stats, goals, and settings persist.

## 5. App Blocker (Feature Limitation)
- [ ] **Add Blocked Apps**: Add "twitter.com", "instagram.com" to blocklist. Appears in list?
- [ ] **Remove Blocked Apps**: Click the × button. Apps removed from list? Persist on refresh?
- [ ] **⚠️ Note**: The app blocker is UI-only. It does NOT actually block websites. Use browser extensions or DNS filtering for real blocking.

## 6. Coach AI & Messaging
- [ ] **Coach Response Time**: Send a message. Coach should respond within 1 second with "Thinking..." indicator.
- [ ] **Contextual Verses**: 
  - [ ] Say "tired" → should get strength verse
  - [ ] Say "distracted" → should get focus verse
  - [ ] Say "lazy" → should get diligence verse
  - [ ] Say "stress" → should get peace verse
- [ ] **Generic Responses**: Say something random (e.g., "hello"). Should get generic motivational response.
- [ ] **Enter Key**: Send messages using Enter key (not just click button).

## 7. Performance & Accessibility
- [ ] **Responsive Design**: 
  - [ ] Desktop (1920x1080): All cards display in multi-column grid
  - [ ] Tablet (768px): Cards stack in 2 columns
  - [ ] Mobile (320px): Single-column layout with readable text
- [ ] **Keyboard Navigation**: Use Tab key to navigate all buttons and inputs. Verify focus is clearly visible.
- [ ] **Screen Reader**: Test with screen reader (NVDA, JAWS, or built-in). Headers, buttons, and ARIA labels should be read correctly.
- [ ] **Touch Targets**: On mobile, all buttons should be at least 44×44 pixels for easy tapping.
- [ ] **Load Time**: App should load in < 3 seconds on 4G network (use DevTools throttling).

## 8. Browser Compatibility
- [ ] **Chrome/Edge**: Test on latest version (PWA features fully supported)
- [ ] **Safari iOS**: Test on iPhone (PWA installation via "Add to Home Screen")
- [ ] **Firefox**: Test on latest version
- [ ] **Samsung Internet**: Test on Android devices (PWA support varies)

## 9. Bible Verses & Content
- [ ] **Verse Delivery**: Verses should appear in:
  - [ ] Focus Mode activation message
  - [ ] Coach chat responses (contextual)
  - [ ] Uninstall protection challenge (none, just math)
- [ ] **Verse Variety**: Run multiple cycles. Verses should vary (random selection from filtered list).
- [ ] **Tag System**: Each verse has correct tags. Filter should work:
  - [ ] "focus" tag for focus-related verses
  - [ ] "purity" tag for purity/protection verses
  - [ ] "strength" tag for motivation verses

## 10. Error Handling & Edge Cases
- [ ] **No Goals**: Start with 0 goals. List should be empty but functional.
- [ ] **No Blocked Apps**: Start with empty blocker. Can add apps normally.
- [ ] **Spam Messages**: Send 10+ messages rapidly. No crash, responses queue properly.
- [ ] **Browser Storage Limit**: Unclear how large goals/blocked list can get, but should handle 100+ items.
- [ ] **Dark Mode Toggle**: Rapidly toggle theme 10x. Should not crash or flicker excessively.
