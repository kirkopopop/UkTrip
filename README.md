# Trip page

A single-page trip plan for a phone: a Now/Next card, a compact timeline per day with travel
legs, an offline street map, bookings, private tickets, shared expenses and an offline copy.
This repo holds the UK trip (19–22 Nov 2026) and doubles as the template for the next one.

Live: https://kirkopopop.github.io/UkTrip/

## Layout

| File | What it is | Changes per trip? |
|---|---|---|
| `src/trip-data.js` | The trip: days, stops, bookings, spare-time ideas, budget | Yes, all of it |
| `src/page.html` | Page shell plus the "Before you go" text (getting around, apps, prices, good to know, sources) | Title and the text sections |
| `src/map-base.js` | Street geometry for each city, drawn as an offline SVG map | Yes, one block per city |
| `src/style.css` | Look and layout | Colours only, if you want a new theme |
| `src/engine.js` | All behaviour | No |
| `sw.js`, `manifest.webmanifest`, `icon-*.png` | Offline copy and home-screen icon | Name and colours in the manifest |
| `build.py` | Stitches `src/` into `index.html` and bumps the offline cache | No |

After any edit run `python3 build.py`, then commit `index.html` together with `src/` and `sw.js`.
Never edit `index.html` by hand.

## The data format (`src/trip-data.js`)

`TRIP` — `key` (prefix for everything saved on the phone), `name`, `tz` (IANA zone of the
destination), `utcOffsetMin` (its offset from UTC on the trip dates), `people`.

`DAYS[]` — one object per day:

- `id`, `iso` (`YYYY-MM-DD`), `tab` ("Thu 19"), `place`, `date`, `title`, `intro`
- `city` (which map to draw) and `cities` (which spare-time ideas to offer)
- `rain`: 1–3 short sentences saying what to swap if it is wet
- `stops[]`, in time order:

| Field | Meaning |
|---|---|
| `t`, `n`, `p` | Time (`"19:30"`, `"~23:30"`), name, one paragraph. In compact view a stop is one row (time, name, status); the paragraph and everything else open in the detail sheet |
| `k` | `"fixed"` (a train, a booked slot: cannot move), `"opt"` (drop first if late), or leave out for a normal stop |
| `go` | How you get here from the previous stop: `{m:"walk"|"tube"|"train"|"bus"|"taxi", min:20, txt:"…", leave:"18:55", est:true}`. `leave` overrides the computed leave-by time; `est` marks a guess. Leave `go` out and a walking time is estimated when both stops have coordinates and are under 1.7 km apart |
| `tr` | `"train"`, `"bus"` or `"plane"` when the stop itself is a journey |
| `ll`, `q` | `[lat, lon]` for the map pin; the Google Maps search text |
| `off` | `true` keeps the stop off the map (journeys, hotel rests, another city) |
| `who` | A name, when only one person does this stop |
| `fee` | `["~£30","paid"]` or `["Free","free"]` |
| `chk` | Id of the matching `CHECK` entry; the stop shows "Booked ✓" once that entry is ticked |
| `subs` | Options or sub-places: `[name, description, maps query]` |
| `pick` | An id; turns `subs` into "pick one" and remembers the choice |
| `more` | Extra HTML shown under "More": plan B, phone numbers, entrance tips |

`CHECK[]` — things to book or do before leaving: `[id, title, detail, when, doneAlready]`.

`SPARE[]` — spare-time and rain ideas: `[name, city, where, what, indoors?, minutes, [lat,lon], maps query]`.

`BUDGET[]` — planned spend per person: `[label, [expense categories], low, high]`.

`CENTERS` — map centre per city.

## Rules that make the plan work on the day

1. Every stop gets a time. Mark the ones that cannot move as `fixed`; mark at least two per day as `opt`.
2. Every hop over 5 minutes gets a `go`, with the duration taken from a real journey planner.
3. Every booked thing has a `CHECK` entry and a `chk` link, so there is one place that says whether it is booked.
4. Every day has a `rain` plan, and each city has at least three indoor `SPARE` ideas.
5. Wherever a place could be full, put a plan B in `more`.
6. Bags are a stop: say where they are at every point of the day and check opening hours of left luggage.
7. Leave at least 15 minutes of slack before each fixed time, and say "leave by" in the plan.
8. Booking references never go in this repo: the page is public. They go in "Tickets and references", which stays on the phone.

## What is saved where

- Ticks, picks and tickets: shared live between phones through the trip code (Supabase table `uktrip_state`,
  functions `uktrip_state_get` / `uktrip_state_set`). Changes queue on the phone and go up when there is signal;
  the page checks for the other phone's changes every 20 s and whenever you switch day or tab.
  Without the trip code they stay on the phone, and "Send to the other phone" packs them into a link instead.
- Compact/full view and map open/closed: on each phone only.
- Expenses: the same Supabase backend behind the trip code (`uktrip_*` functions). The code is checked by
- Trip summary (Expenses tab): totals per category and per day, split by person, with a Spent/Paid switch
  (each person's share vs whose card paid). Built from the expense list in `drawSummary()` in `src/engine.js`; no extra backend.
  `uktrip.check_code`, which compares a SHA-256 hash, so the code itself is never stored. A new trip needs its own code.
- Add `?now=2026-11-20T13:10` to the address to preview the page at that moment of the trip.

## Starting a new trip

1. Copy this repo, rename it, and turn on GitHub Pages for the main branch.
2. Replace `src/trip-data.js` and the text sections of `src/page.html`.
3. Replace `src/map-base.js`: for each city, OpenStreetMap roads, water, parks and rail as SVG paths,
   in kilometres from the city centre in `CENTERS`, multiplied by 100, y pointing south.
4. Update names and colours in `manifest.webmanifest`, the `<title>` and the theme colour.
5. `python3 build.py`, open `index.html`, check each day at phone width, then push.
