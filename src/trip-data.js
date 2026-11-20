function gq(s){ return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s); }
var DAYS = [
 { id:"thu", iso:"2026-11-19", cities:["london"], tab:"Thu 19", place:"London", date:"Thursday 19 November", city:"london",
   title:"Borough Market, Soho, a Ukrainian feast",
   rain:["Borough Market is under cover, so lunch works in any weather.","Wet afternoon: the London Mithraeum (free, indoors) is a short walk from the hotel. Skip Horizon 22 unless the cloud is high.","The evening is all indoors; Soho to Shoreditch is by Elizabeth line."],
   intro:"Kirill grabs the key at Dima's office, drops the bags, grazes Borough Market and rides the old Post Office railway at the Postal Museum on his own. We meet in Soho at 17:30 for £4 Guinness and a quick proper cocktail, then dinner at Tatar Bunar at 19:30 and a nightcap at one of the best bars in the world.",
   off:"<b>08:00</b> Kirill lands at Gatwick → Thameslink to London Bridge, ~35 min.<br><b>Hotel:</b> DoubleTree by Hilton Tower of London, 7 Pepys St (Tower Hill). Check-in from 15:00, check-out by 12:00.",
   stops:[
    {t:"08:00", n:"Land at Gatwick, Thameslink to London Bridge", k:"fixed", tr:"train", p:"Tap in with contactless; ~30–40 min.", who:"Kirill", off:true},
    {t:"09:15", n:"Pick up the key at Deliveroo HQ", go:{m:"walk",min:10,txt:"across London Bridge"}, p:"The River Building, 1 Cousin Lane, by Cannon Street station: a 10-min walk across London Bridge.", who:"Kirill", ll:[51.5101,-0.0917], q:"Deliveroo The River Building 1 Cousin Lane London"},
    {t:"10:00", n:"DoubleTree by Hilton Tower of London: drop the bags", chk:"doubletree", go:{m:"walk",min:15,txt:"east along the river"}, p:"7 Pepys St, 3 min from Tower Hill station; a 15-min walk east along the river from Deliveroo HQ. Check-in is from 15:00, so ask about early check-in and freshen up after the early flight.", who:"Kirill", booked:true, ll:[51.5106,-0.0780], q:"DoubleTree by Hilton London Tower of London, 7 Pepys Street"},
    {t:"13:30", n:"Lunch at Borough Market", go:{m:"walk",min:20,txt:"over London Bridge"}, p:"Full market day (10:00–17:00). Graze these four, all within a couple of minutes of each other:", who:"Kirill", ll:[51.5055,-0.0910], q:"Borough Market, London",
      subs:[
        ["Ginger Pig","The butcher's cult hot sausage roll; Scotch eggs too. Three Crown Square.","Ginger Pig Borough Market"],
        ["The Black Pig","Honey, truffle and parmesan pork ciabatta, finished over coals.","The Black Pig Borough Market"],
        ["Turnips","The viral cup of strawberries under warm chocolate, ~£8.50.","Turnips Borough Market"],
        ["Bread Ahead","Filled doughnuts from the original bakery stall on Cathedral Street.","Bread Ahead Borough Market Cathedral Street"]
      ]},
    {t:"15:00", n:"Postal Museum + Mail Rail, Clerkenwell", chk:"mail", go:{m:"train",min:25,leave:"14:30",txt:"Thameslink London Bridge → Farringdon (~7 min, every few minutes), then a 12-minute walk up Farringdon Road"}, p:"A 15-minute ride through the tunnels of the Post Office's driverless underground railway (1927–2003), then the museum. Book a ride slot online for 15:00–15:30 and arrive 15 minutes before it; the last ride leaves at 16:00 and the museum closes at 17:00.", who:"Kirill", fee:["~£20","paid"], book:true, ll:[51.5246,-0.1134], q:"The Postal Museum, Phoenix Place, London"},
    {t:"17:30", n:"£4 Guinness at Simmons Greek Street", go:{m:"tube",min:25,leave:"16:50",txt:"10-minute walk back to Farringdon, then the Elizabeth line to Tottenham Court Road (4 min) and 5 minutes on foot into Soho"}, p:"We meet here. Retro Soho bar with hidden karaoke rooms; happy hour 15:00–20:00, so Soho comes before dinner.", fee:["£4 a pint","paid"], ll:[51.5140,-0.1314], q:"Simmons Greek Street, Soho, London"},
    {t:"18:20", n:"Swift Soho, 12 Old Compton St", k:"opt", p:"One of London's best cocktail bars: one quick drink. The Irish coffee upstairs is famous; the downstairs whisky room does a great Old Fashioned. Leave by 18:55 for dinner.", fee:["~£14 a cocktail","paid"], ll:[51.5131,-0.1302], q:"Swift Soho, 12 Old Compton Street, London",
      more:"<p>Close by if Swift is full: <b>Three Sheets Soho</b> (13 Manette St), No. 11 in the UK's Top 50 Cocktail Bars 2026. <b>Bar Termini</b> (7 Old Compton St) is No. 8, but it's a Negroni specialist.</p>"},
    {t:"19:30", n:"Dinner at Tatar Bunar, 152 Curtain Rd", k:"fixed", chk:"tatar", go:{m:"tube",min:20,leave:"18:55",txt:"Elizabeth line Tottenham Court Road → Liverpool Street (4 min), then a 12-min walk up to Curtain Road"}, p:"Southern Ukrainian (Bessarabian) cooking from an Odesa team; in the Michelin Guide since March 2026. Order a grill centrepiece and the onion bread with lardo.", fee:["~£60–80","paid"], booked:true, ll:[51.5262,-0.0808], q:"Tatar Bunar, 152 Curtain Road, London",
      more:"<p>Booked for 19:30. Phone if running late: 07771 013190.</p><p>Mriya in Earl's Court, long London's best-known Ukrainian place, closed in June 2026, so this is the pick.</p>"},
    {t:"21:45", n:"Nightcap at Waltz, 28 Scrutton St", k:"opt", go:{m:"walk",min:5}, p:"Japanese cocktail bar five minutes' walk from dinner: No. 32 in the World's 50 Best Bars 2026 and Time Out's best cocktail bar in London. Sit at the bar and watch them work.", fee:["~£15–18 a cocktail","paid"], ll:[51.5235,-0.0820], q:"Waltz bar, 28 Scrutton Street, London",
      more:"<p>Bar seats are walk-in; a few tables can be booked at waltzbar.uk.</p><p>Plan B, also 5 minutes away: <b>Happiness Forgets</b> (8–9 Hoxton Square), a candlelit basement that's a favourite of London bartenders, open till late.</p>"},
    {t:"~23:30", n:"Back to the DoubleTree", go:{m:"walk",min:25,txt:"or an Uber, ~£10–15"}, p:"25 min on foot from Shoreditch, or an Uber (~£10–15). Early start tomorrow for Barry's.", off:true}
   ]},
 { id:"fri", iso:"2026-11-20", cities:["london"], mark:"LONDON · KING'S CROSS", tab:"Fri 20", place:"London", date:"Friday 20 November", city:"london",
   title:"Barry's, games, Heard, early night",
   rain:["Every stop today is indoors, and the Covent Garden hops are about 5 minutes each.","The walk from the hotel to the Fryer's Delight is the longest stretch outside (15 min); take the Piccadilly line one stop to Russell Square if it pours."],
   intro:"The sleeper is cancelled (police incident at Edinburgh Waverley), so tonight is a hotel by King's Cross and the 06:30 LNER to Edinburgh tomorrow. Kirill did Barry's; both check out of the DoubleTree and drop the bags at the Kings Cross Inn. Then fish and chips at the Fryer's Delight, the Escape Room Arcade, the new Harry Potter shop and the Covent Garden evening: Heard at 17:15, Uniqlo, an old pub, cocktails above London's oldest restaurant. Bed by 23:00: alarm at 05:40.",
   off:"Sleeper cancelled. Night at the Kings Cross Inn Hotel, then the <b>06:30</b> LNER King's Cross → Edinburgh Waverley on Saturday.",
   stops:[
    {t:"08:00", n:"Barry's St Paul's, 33 Gutter Lane", k:"fixed", chk:"barrys", go:{m:"tube",min:20,leave:"07:35",txt:"From the DoubleTree: District or Circle line Tower Hill → Mansion House (2 stops), then 8 minutes on foot up to Gutter Lane, off Cheapside. Or walk it in ~25 minutes. Take just the gym kit and a change of clothes; the bag stays in the room (check-out is noon). First class at this studio, so arrive ~10 minutes early."}, p:"Booked for 08:00. Barry's City studio, 100 m from St Paul's station: treadmill and floor HIIT in the red room, about 50 minutes. Showers and towels on site.", who:"Kirill", fee:["~£30","paid"], ll:[51.5149,-0.0952], q:"Barry's London St Paul's, 33 Gutter Lane",
      more:"<p>Shower at the studio and leave by ~09:15.</p>"},
    {t:"09:45", n:"Back at the DoubleTree: rest", go:{m:"tube",min:20,txt:"8 minutes on foot to Mansion House, then the District or Circle line to Tower Hill (2 stops), then 3 minutes on foot"}, p:"Rest in the room while Dima finishes his calls. Check-out is at noon.", who:"Kirill", ll:[51.5106,-0.0780], q:"DoubleTree by Hilton London Tower of London, 7 Pepys Street"},
    {t:"12:45", n:"DoubleTree: check out, take the bags", chk:"doubletree", p:"Check out and take both bags: the sleeper is cancelled, so tonight is near King's Cross instead.", ll:[51.5106,-0.0780], q:"DoubleTree by Hilton London Tower of London, 7 Pepys Street"},
    {t:"13:45", n:"Kings Cross Inn: drop the bags", chk:"kxinn", go:{m:"tube",min:25,leave:"13:15",txt:"Circle or Hammersmith & City line Tower Hill → King's Cross St Pancras (~20 min), then 3 minutes to the hotel opposite the station"}, p:"9–11 Euston Road, opposite King's Cross station. Check-in is from 14:00, so check in if the room is ready or leave the bags at reception.", ll:[51.5303,-0.1232], q:"Kings Cross Inn Hotel, 9-11 Euston Road, London"},
    {t:"14:05", n:"Fish and chips at the Fryer's Delight, 19 Theobalds Rd", go:{m:"walk",min:15,txt:"From the hotel: straight down Gray's Inn Road, then left onto Theobalds Road"}, p:"Old-school Holborn chippy since 1958: Formica tables, shared booths, thick batter, cabbies at the counter, cheap. Time Out's best fish and chips in central London. Try the rockfish instead of cod, and keep it to one portion each: dinner at Heard is at 17:15.", fee:["~£12–16","paid"], ll:[51.5207,-0.1156], q:"The Fryer's Delight, 19 Theobalds Road, London",
      more:"<p>Eat in or take away. 10 minutes' walk to the Escape Room Arcade. If it's shut or rammed: <b>Golden Union</b>, Poland St, Soho (a tube hop away) or a pub lunch on Fetter Lane.</p>"},
    {t:"15:00", n:"Escape Room Arcade, Enigma Quests, 86 Fetter Lane", chk:"karts", book:true, go:{m:"walk",min:10,txt:"Down Gray's Inn Road and along High Holborn to Fetter Lane"}, p:"30 mini-game rooms in an underground lab: play and replay as many as you can in an hour for leaderboard scores. Teams of 2–4. Book the 15:00 slot (or the nearest one); arrive about 10 minutes early for the briefing.", fee:["~£25","paid"], ll:[51.5163,-0.1093], q:"Enigma Quests, 86 Fetter Lane, London"},
    {t:"16:30", n:"Harry Potter Shop, 134–140 Oxford St", k:"opt", go:{m:"tube",min:20,txt:"5 minutes to Chancery Lane, Central line to Tottenham Court Road (2 stops), then 5 minutes west along Oxford Street"}, p:"The UK's biggest official Harry Potter shop, opened 4 Nov 2026: two floors themed on Diagon Alley, a full-size Knight Bus inside, Oxford Street-only wands and Funko Pops, and the Leaky Cauldron bar for Butterbeer. Expect a queue at the door so soon after opening; skip it if the line is long or the game ran late: Heard is at 17:15.", ll:[51.5162,-0.1356], q:"Harry Potter Shop, 134-140 Oxford Street, London"},
    {t:"17:15", n:"Dinner at Heard Covent Garden, 33–35 Wellington St", k:"fixed", chk:"heard", go:{m:"tube",min:20,est:true,txt:"From the Harry Potter shop: walk to Tottenham Court Road, Northern line to Leicester Square (1 stop), then 7 minutes on foot; or walk it in ~15 minutes"}, p:"Burgers from two-Michelin-starred chef Jordan Bailey. This is his biggest site, opened 5 Nov 2026. Order The Heard: a double smash patty with jalapeño hot honey and Ogleshield cheese. Each burger comes with a beer or wine pairing.", fee:["~£25–40","paid"], booked:true, ll:[51.5119,-0.1208], q:"Heard Covent Garden, 33-35 Wellington Street, London",
      more:"<p>Booked for 17:15. <b>Dessert in the Soda Room downstairs:</b> a speakeasy dessert and cocktail bar with hot apple pie, brûlée cheesecake and milk soft serve. It's for diners only, subject to space, so ask on arrival.</p>"},
    {t:"18:35", n:"Uniqlo Covent Garden, Long Acre / Floral St", k:"opt", go:{m:"walk",min:5,txt:"from Heard, up to Long Acre"}, p:"Three floors in a listed Victorian carriage hall, with London-only UTme! prints you can customise in store. Straight after dinner: open until 20:00 on Fridays, so about 25 minutes before the pub.", ll:[51.5124,-0.1255], q:"Uniqlo Covent Garden, Long Acre, London"},
    {t:"19:15", n:"Pint at the Lamb & Flag, 33 Rose St", k:"opt", go:{m:"walk",min:5,txt:"from Uniqlo, via Garrick Street"}, p:"A tiny, creaky 18th-century pub down an alley off Garrick Street, with low ceilings and wood panelling. On a Friday the crowd spills out into the lane.", fee:["~£7 a pint","paid"], ll:[51.5116,-0.1265], q:"Lamb and Flag, 33 Rose Street, London",
      more:"<p>If it's rammed: <b>The Harp</b> (47 Chandos Place), a narrow, award-winning real-ale pub 5 minutes away.</p>"},
    {t:"20:15", n:"Cocktails upstairs at Rules, 35 Maiden Lane", k:"opt", go:{m:"walk",min:5}, p:"The bar above London's oldest restaurant (1798): game trophies, red velvet and serious classic cocktails. 5 minutes' walk from the Lamb & Flag.", fee:["~£16–19 a cocktail","paid"], ll:[51.5106,-0.1232], q:"Upstairs at Rules, 35 Maiden Lane, London",
      more:"<p>Time for a second round elsewhere? <b>Eve Bar</b> (34 Southampton St), Adam Handling's basement cocktail bar under his restaurant Frog, is 2 minutes away.</p>"},
    {t:"21:45", n:"One for the road at the Euston Tap", k:"opt", go:{m:"tube",min:20,txt:"Walk to Leicester Square, Northern line (Charing Cross branch) to Euston, ~6 min"}, p:"Craft beer in the two stone lodges at the Euston station gates, 10 minutes' walk from the hotel. One round only: the alarm is at 05:40.", fee:["~£6–8","paid"], ll:[51.5268,-0.1329], q:"Euston Tap, 190 Euston Road, London"},
    {t:"22:45", n:"Kings Cross Inn: bed", chk:"kxinn", go:{m:"walk",min:10,txt:"East along Euston Road"}, p:"Pack tonight and set an alarm for 05:40. Leave the room by 06:05; King's Cross is across the road.", ll:[51.5303,-0.1232], q:"Kings Cross Inn Hotel, 9-11 Euston Road, London"}
   ]},
 { id:"sat", iso:"2026-11-21", cities:["edinburgh","glasgow"], tab:"Sat 21", place:"London → Edinburgh → Glasgow", date:"Saturday 21 November", city:"edinburgh",
   title:"Early train, Edinburgh by day, Glasgow by night",
   rain:["The castle is mostly outdoors between buildings and runs rain or shine: jacket on.","Swap Calton Hill for the National Museum of Scotland on Chambers Street: free, open daily 10:00–17:00, about 5 minutes from the Grassmarket.","Johnnie Walker is indoors. If the market is a washout, take an earlier train back: they run every 15 minutes."],
   intro:"The 06:30 LNER from King's Cross on the cancelled sleeper ticket, breakfast on board, and Edinburgh by 10:40. Bags into left luggage at Waverley; daylight goes to the castle, the Old Town and Calton Hill; after dark, Johnnie Walker and the Christmas market lights. Then the train to Glasgow with the bags, a casual local dinner and the city's best cocktail bar. We sleep in Glasgow.",
   off:"<b>06:30</b> LNER King's Cross → Edinburgh Waverley, arrive <b>~10:40</b>.<br><b>~18:00</b> ScotRail Edinburgh Waverley → Glasgow Queen Street, ~50 min; dinner and drinks below, not on this map.",
   stops:[
    {t:"06:30", n:"LNER King's Cross → Edinburgh Waverley", k:"fixed", chk:"lner", tr:"train", go:{m:"walk",min:5,leave:"06:05",txt:"Kings Cross Inn across Euston Road to the King's Cross concourse"}, p:"Free on the cancelled Caledonian Sleeper ticket: show it and the cancellation email to the guard. No seat reservations, and other sleeper passengers will be on it, so be at the platform by 06:10 and look for unreserved seats. Breakfast from the café bar on board. Backups: 07:03 or 07:30.", fee:["£0 (sleeper refunded)","free"], off:true},
    {t:"10:40", n:"Waverley: bags into left luggage", go:{m:"train",min:250,txt:"~4 h 10 min"}, p:"Staffed left-luggage office on platform 2, by the Calton Road entrance. Open 07:00–23:00, ~£12.50 a bag for the day; walk-ins fine.", fee:["~£12.50 a bag","paid"], ll:[55.9520,-3.1880], q:"Left Luggage, Edinburgh Waverley station"},
    {t:"11:15", n:"Edinburgh Castle", k:"fixed", chk:"castle", go:{m:"walk",min:15,txt:"Up Cockburn Street and the Royal Mile from Waverley"}, p:"Book a timed slot for 11:15 or later. Crown Jewels, the One O'Clock Gun battery, views over the New Town. Allow 1.5 h.", fee:["~£23.50","paid"], book:true, ll:[55.9486,-3.1999], q:"Edinburgh Castle"},
    {t:"12:45", n:"Royal Mile → Victoria Street", k:"opt", p:"Downhill along the curved, colourful street to the Grassmarket.", fee:["Free","free"], ll:[55.9488,-3.1935], q:"Victoria Street, Edinburgh"},
    {t:"13:15", n:"Pub lunch in the Grassmarket", p:"Old market square under the castle rock, lined with pubs. No rush: Johnnie Walker isn't until 15:20.", ll:[55.9474,-3.1962], q:"Grassmarket, Edinburgh"},
    {t:"14:30", n:"Calton Hill while it's light", k:"opt", go:{m:"walk",min:20,leave:"14:10",txt:"from the Grassmarket"}, p:"The castle, Old Town and Arthur's Seat from the monuments; the light goes golden ahead of sunset ~15:50. 20 min walk from the Grassmarket. Leave by 14:55.", fee:["Free","free"], ll:[55.9553,-3.1827], q:"Calton Hill, Edinburgh"},
    {t:"15:20", n:"Johnnie Walker Princes Street: Journey of Flavour", k:"fixed", chk:"jw", go:{m:"walk",min:20,leave:"14:55",txt:"along Princes Street"}, p:"90 minutes, three cocktails made to match a flavour quiz, then the rooftop bar with the castle lit up after dark.", fee:["£30","paid"], booked:true, ll:[55.9502,-3.2068], q:"Johnnie Walker Princes Street, 145 Princes Street, Edinburgh",
      more:"<p>Use the entrance on Hope Street and show the ticket in the lobby. 20 min walk along Princes Street from Calton Hill.</p>"},
    {t:"17:10", n:"Christmas market, East Princes Street Gardens", k:"opt", p:"Mulled wine among the lit-up stalls under the Scott Monument; open 10:00–22:00. Waverley is right below.", fee:["Free","free"], ll:[55.9519,-3.1925], q:"Edinburgh Christmas Market, East Princes Street Gardens"},
    {t:"17:40", n:"Waverley: collect the bags", go:{m:"walk",min:5,txt:"down the steps from the gardens"}, p:"Left luggage closes at 23:00, so there's slack if the market is fun.", ll:[55.9520,-3.1880], q:"Left Luggage, Edinburgh Waverley station"},
    {t:"18:00", n:"Train back to Glasgow Queen Street", tr:"train", p:"~50 min; trains every 15 min, take whichever comes after the bags. The Maldron is ~8 min walk from Queen Street.", off:true},
    {t:"19:00", n:"Maldron Hotel Glasgow City: check in, shower", chk:"hotel", go:{m:"walk",min:8,txt:"from Queen Street"}, p:"Check in with the bags. Rooms have power showers.", booked:true, off:true, q:"Maldron Hotel Glasgow City, 50 Renfrew Street, Glasgow"},
    {t:"19:45", n:"Casual dinner in Glasgow: pick one", pick:"satdinner", p:"Local and unfussy rather than posh. All walk-in or easy to book.", off:true,
      subs:[
        ["El Perro Negro","Argyle St, Finnieston. Started as a pop-up and now on the World's 101 Best Burgers 2026 (No. 56); walk-ins welcome. Get the Top Dog. Taxi to the bar after, ~10 min.","El Perro Negro, Argyle Street, Glasgow"],
        ["Mother India's Cafe","Argyle St, Finnieston. Glasgow is a curry city, and this is the tapas-style sibling of its best-loved curry house: lots of small plates, cheap.","Mother India's Cafe, Argyle Street, Glasgow"],
        ["Paesano Pizza","94 Miller St, Merchant City. Wood-fired Neapolitan pizza, cheap and excellent; walk-ins only, so expect a queue. 5 min from the bar.","Paesano Pizza, 94 Miller Street, Glasgow"],
        ["Café Gandolfi","64 Albion St, Merchant City. A local institution since 1979: Cullen skink, Stornoway black pudding, wooden booths. 5 min from the bar.","Cafe Gandolfi, 64 Albion Street, Glasgow"]
      ]},
    {t:"22:00", n:"Daddy Marmalades, 25 Parnie St, Glasgow", k:"opt", p:"Hidden cocktail bar in the Merchant City: No. 22 in the UK's Top 50 Cocktail Bars 2026 and Glasgow's only entry. Casual and walk-in friendly.", fee:["~£10–14 a cocktail","paid"], off:true, q:"Daddy Marmalades, 25 Parnie Street, Glasgow",
      more:"<p>Then, if there's energy: <b>The Gate</b> (Gallowgate), a whisky pub that's been on the Top 50 list too, or just follow Glasgow's Saturday night.</p>"}
   ]},
 { id:"sun", iso:"2026-11-22", cities:["glasgow"], tab:"Sun 22", place:"Glasgow → home", date:"Sunday 22 November", city:"glasgow",
   title:"Glasgow: necropolis, brewery, home",
   rain:["Wet morning: linger over breakfast, skip the Necropolis hill (slippery when wet) and take a taxi straight to Tennent's for 12:00.","The brewery tour and lunch at Drygate are both indoors."],
   intro:"A slow Glasgow morning in the East End: the Necropolis and the cathedral, a pint from the Tennent's tanks, lunch next door at Drygate, then the coach straight to Edinburgh Airport.",
   off:"<b>15:30</b> Citylink Air, Buchanan Bus Station → Edinburgh Airport, ~1 h. Flight <b>19:00</b>.",
   stops:[
    {t:"09:30", n:"Breakfast and check-out at the Maldron", chk:"hotel", p:"Buffet breakfast at the hotel; check-out by 11:00. Leave the bags at the desk until ~15:00.", booked:true, ll:[55.8661,-4.2553], q:"Maldron Hotel Glasgow City, 50 Renfrew Street, Glasgow"},
    {t:"10:30", n:"The Necropolis", k:"opt", p:"Victorian hilltop cemetery with the best view over the city. Always open.", fee:["Free","free"], ll:[55.8622,-4.2312], q:"Glasgow Necropolis"},
    {t:"11:15", n:"Glasgow Cathedral", k:"opt", p:"Medieval cathedral that survived the Reformation almost intact. Sunday hours are short and may be afternoon only, so this may be from outside.", fee:["Free","free"], ll:[55.8630,-4.2346], q:"Glasgow Cathedral"},
    {t:"12:00", n:"Tennent's Wellpark Brewery tour, 161 Duke St", k:"fixed", chk:"tennents", p:"Behind the scenes at Scotland's oldest brewery, ~1.5 h, ending with a pint of unpasteurised tank lager straight from the copper tanks.", fee:["£17–21","paid"], book:true, ll:[55.8598,-4.2298], q:"Tennent's Wellpark Brewery, 161 Duke Street, Glasgow",
      more:"<p>Sunday tours appear to start at noon; confirm the slot when booking. Ages 18+. Enter at the Tennent's Visitor Centre.</p>"},
    {t:"13:45", n:"Lunch at Drygate, next door", p:"Craft brewery with a bar and restaurant beside Wellpark: the easiest lunch after the tour.", ll:[55.8616,-4.2318], q:"Drygate Brewing Co, 85 Drygate, Glasgow"},
    {t:"15:00", n:"Collect bags, walk to Buchanan Bus Station", k:"fixed", go:{m:"taxi",min:8,txt:"Drygate to the Maldron; the bus station is then a 5-min walk"}, p:"Taxi from Drygate to the Maldron ~8 min; the bus station is ~5 min walk from the hotel.", ll:[55.8660,-4.2508], q:"Buchanan Bus Station, Glasgow"},
    {t:"15:30", n:"Citylink Air to Edinburgh Airport", k:"fixed", chk:"citylink", tr:"bus", p:"Direct, non-stop, about an hour; bags go in the hold. Book on citylink.co.uk. Backup: train to Edinburgh Gateway, then the tram.", fee:["~£15","paid"], book:true, off:true},
    {t:"16:30", n:"At the airport", k:"fixed", p:"Two and a half hours before the 19:00 flight; there's room for a later coach if lunch runs long.", off:true}
   ]}
];

/* Trip-wide settings. utcOffsetMin is the destination's offset from UTC on the trip dates (UK in November = 0). */
var TRIP = { key:"uktrip", name:"London, Glasgow & Edinburgh", tz:"Europe/London", utcOffsetMin:0, people:["Kirill","Dima"] };

/* Spare-time and rain ideas: [name, city, where, what, indoor?, minutes, [lat,lon], maps query] */
var SPARE = [
  ["London Mithraeum","london","the City","Roman temple under the Bloomberg building. Free.",true,45,[51.5126,-0.0907],"London Mithraeum Bloomberg SPACE"],
  ["St Dunstan in the East","london","the City","Bombed church turned garden. Free.",false,30,[51.5097,-0.0826],"St Dunstan in the East, London"],
  ["Horizon 22","london","Bishopsgate","Free 58th-floor viewing deck, timed booking.",true,45,[51.5155,-0.0826],"Horizon 22, 22 Bishopsgate, London"],
  ["Sir John Soane's Museum","london","Lincoln's Inn Fields","Free, crammed and strange.",true,60,[51.5170,-0.1175],"Sir John Soane's Museum, London"],
  ["Wellcome Collection","london","Euston","Free: medicine and the human body.",true,60,[51.5258,-0.1339],"Wellcome Collection, 183 Euston Road, London"],
  ["The Bayeux Tapestry","london","British Museum","This autumn's big one-off loan.",true,90,[51.5194,-0.1270],"British Museum, London"],
  ["Somerset House ice rink","london","Strand","Timed skating sessions.",false,60,[51.5110,-0.1171],"Somerset House, Strand, London"],
  ["Leake Street Tunnel","london","Waterloo","Legal graffiti tunnel by Waterloo station.",true,30,[51.5016,-0.1150],"Leake Street Arches, London"],
  ["Constantinople to Istanbul","london","V&A South Kensington","Exhibition, from 7 Nov, £25–27.",true,90,[51.4966,-0.1722],"Victoria and Albert Museum, London"],
  ["Beyond the Streets","london","Saatchi Gallery","Graffiti and street art, from 11 Nov, £25.",true,75,[51.4907,-0.1589],"Saatchi Gallery, London"],
  ["Other workouts","london","various","Kobox (boxing HIIT), 1Rebel (Reshape, Ride), Psycle or SoulCycle (cycling).",true,60,null,"1Rebel London"],
  ["National Museum of Scotland","edinburgh","Chambers Street","Free, open daily 10:00–17:00. The rain plan for Calton Hill.",true,75,[55.9470,-3.1892],"National Museum of Scotland, Chambers Street, Edinburgh"],
  ["Holyrood Distillery","edinburgh","foot of Arthur's Seat","~90 min tour, £20–25.",true,90,[55.9432,-3.1773],"Holyrood Distillery, Edinburgh"],
  ["Arthur's Seat","edinburgh","Holyrood Park","The hike up from Holyrood is ~1.5 h return; swap it for the Grassmarket lunch and Victoria Street if you'd rather climb.",false,90,[55.9441,-3.1618],"Arthur's Seat, Edinburgh"],
  ["Port of Leith Distillery","edinburgh","Leith","Nine-storey vertical distillery with a bar on top.",true,90,[55.9790,-3.1690],"Port of Leith Distillery, Edinburgh"],
  ["Barnton nuclear bunker tours","edinburgh","Barnton","Saturdays and Sundays.",true,90,[55.9590,-3.2890],"Barnton Quarry nuclear bunker, Edinburgh"],
  ["Kelvingrove Art Gallery and the West End","glasgow","West End","Kelvingrove opens 11:00 on Sundays if you swap it for Tennent's.",true,90,[55.8686,-4.2906],"Kelvingrove Art Gallery and Museum, Glasgow"],
  ["Clydeside Distillery","glasgow","near Finnieston","On the river; the tour ends with three drams.",true,75,[55.8617,-4.2990],"The Clydeside Distillery, Glasgow"]
];

/* Planned spend per person in GBP, mapped to the expense categories: [label, [expense categories], low, high] */
var BUDGET = [
  ["Transport",["transport"],60,90],
  ["Activities",["tickets"],100,155],
  ["Food & drink",["food","drinks"],260,315],
  ["Stay",["stay"],85,85]
];

var CHECK = [
  ["doubletree","DoubleTree by Hilton Tower of London, Thu night","7 Pepys St; check-in from 15:00, check-out by 12:00","Done",true],
  ["lner","LNER 06:30 King's Cross → Edinburgh, Sat","Sleeper cancelled and refunded; free on the cancelled ticket, no reservations","Done",true],
  ["kxinn","Kings Cross Inn Hotel, Fri night","9–11 Euston Rd; check-in from 14:00, check-out by 11:00","Done",true],
  ["hotel","Maldron Hotel Glasgow City, Sat night","50 Renfrew St; check-in from 15:00","Done",true],
  ["heard","Heard Covent Garden, Fri 17:15 for 2","Booked; ask for the Soda Room on arrival","Done",true],
  ["tatar","Tatar Bunar, Thu 19:30 for 2","Booked; 07771 013190 if running late","Done",true],
  ["karts","Escape Room Arcade (Enigma Quests), Fri 15:00 for 2","Book a slot online","Now"],
  ["castle","Edinburgh Castle, Sat 11:15 or later","Timed entry, online","Now"],
  ["jw","Johnnie Walker Journey of Flavour, Sat 15:20 for 2","Booked; Hope Street entrance","Done",true],
  ["tennents","Tennent's brewery tour, Sun 12:00 for 2","tennents.com; check Sunday slots","Now"],
  ["citylink","Citylink Air, Sun 15:30 Glasgow → Edinburgh Airport","citylink.co.uk","This week"],
  ["mail","Postal Museum + Mail Rail, Thu 15:00–15:30","Done on Thursday","Done",true],
  ["barrys","Barry's St Paul's, Fri 08:00","Booked; Kirill only","Done",true]
];

var CENTERS = {london:[51.512,-0.105], glasgow:[55.864,-4.26], edinburgh:[55.951,-3.19]};
