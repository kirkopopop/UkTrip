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
   title:"Barry's, Heard, markets, arcade, comedy",
   rain:["Every stop today is indoors, and the Covent Garden hops are about 5 minutes each.","Holborn station is right by the comedy club for the ride back."],
   intro:"The sleeper is cancelled (police incident at Edinburgh Waverley), so tonight is a hotel by King's Cross and the 06:30 LNER to Edinburgh tomorrow. Bags are at the Kings Cross Inn, lunch was fish and chips at North Sea Fish, and the arcade is dropped. Then the new Harry Potter shop, T-shirts into Uniqlo for embroidery, the best burgers of the trip at Heard, the Covent Garden and Leicester Square Christmas markets, T-shirts and coffee, retro arcade games, and stand-up at the Top Secret Comedy Club at 22:00. Alarm at 05:40.",
   off:"Sleeper cancelled. Night at the Kings Cross Inn Hotel, then the <b>06:30</b> LNER King's Cross → Edinburgh Waverley on Saturday.",
   stops:[
    {t:"08:00", n:"Barry's St Paul's, 33 Gutter Lane", k:"fixed", chk:"barrys", go:{m:"tube",min:20,leave:"07:35",txt:"From the DoubleTree: District or Circle line Tower Hill → Mansion House (2 stops), then 8 minutes on foot up to Gutter Lane, off Cheapside. Or walk it in ~25 minutes. Take just the gym kit and a change of clothes; the bag stays in the room (check-out is noon). First class at this studio, so arrive ~10 minutes early."}, p:"Booked for 08:00. Barry's City studio, 100 m from St Paul's station: treadmill and floor HIIT in the red room, about 50 minutes. Showers and towels on site.", who:"Kirill", fee:["~£30","paid"], ll:[51.5149,-0.0952], q:"Barry's London St Paul's, 33 Gutter Lane",
      more:"<p>Shower at the studio and leave by ~09:15.</p>"},
    {t:"09:45", n:"Back at the DoubleTree: rest", go:{m:"tube",min:20,txt:"8 minutes on foot to Mansion House, then the District or Circle line to Tower Hill (2 stops), then 3 minutes on foot"}, p:"Rest in the room while Dima finishes his calls. Check-out is at noon.", who:"Kirill", ll:[51.5106,-0.0780], q:"DoubleTree by Hilton London Tower of London, 7 Pepys Street"},
    {t:"12:45", n:"DoubleTree: check out, take the bags", chk:"doubletree", p:"Check out and take both bags: the sleeper is cancelled, so tonight is near King's Cross instead.", ll:[51.5106,-0.0780], q:"DoubleTree by Hilton London Tower of London, 7 Pepys Street"},
    {t:"13:45", n:"Kings Cross Inn: drop the bags", chk:"kxinn", go:{m:"tube",min:25,leave:"13:15",txt:"Circle or Hammersmith & City line Tower Hill → King's Cross St Pancras (~20 min), then 3 minutes to the hotel opposite the station"}, p:"9–11 Euston Road, opposite King's Cross station. Check-in is from 14:00, so check in if the room is ready or leave the bags at reception.", ll:[51.5303,-0.1232], q:"Kings Cross Inn Hotel, 9-11 Euston Road, London"},
    {t:"14:05", n:"Fish and chips at North Sea Fish, 7–8 Leigh St", go:{m:"walk",min:10,txt:"From the hotel, south via Judd Street"}, p:"Family-run Bloomsbury chippy since 1977, a cabbies' favourite.", ll:[51.5265,-0.1255], q:"North Sea Fish Restaurant, 7-8 Leigh Street, London"},
    {t:"15:50", n:"Harry Potter Shop, 134–140 Oxford St", k:"opt", go:{m:"walk",min:25,txt:"From North Sea Fish: down through Russell Square and Bloomsbury to Tottenham Court Road, then west along Oxford Street. Or Piccadilly line Russell Square → Holborn, Central line to Tottenham Court Road."}, p:"The UK's biggest official Harry Potter shop, opened 4 Nov 2026: two floors themed on Diagon Alley, a full-size Knight Bus inside, Oxford Street-only wands and Funko Pops, and the Leaky Cauldron bar for Butterbeer. Expect a queue at the door so soon after opening; skip it if the line is long.", ll:[51.5162,-0.1356], q:"Harry Potter Shop, 134-140 Oxford Street, London"},
    {t:"16:45", n:"Uniqlo Covent Garden: T-shirts in for embroidery", go:{m:"walk",min:12,txt:"Down Charing Cross Road and along Long Acre from the Harry Potter shop"}, p:"Left T-shirts at the embroidery counter, collected later in the evening.", ll:[51.5124,-0.1255], q:"Uniqlo Covent Garden, Long Acre, London"},
    {t:"17:15", n:"Dinner at Heard Covent Garden, 33–35 Wellington St", k:"fixed", chk:"heard", go:{m:"walk",min:5,txt:"from Uniqlo, down to Wellington Street"}, p:"Burgers from two-Michelin-starred chef Jordan Bailey. This is his biggest site, opened 5 Nov 2026. Order The Heard: a double smash patty with jalapeño hot honey and Ogleshield cheese. Each burger comes with a beer or wine pairing.", fee:["~£25–40","paid"], booked:true, ll:[51.5119,-0.1208], q:"Heard Covent Garden, 33-35 Wellington Street, London",
      more:"<p>Booked for 17:15. <b>Dessert in the Soda Room downstairs:</b> a speakeasy dessert and cocktail bar with hot apple pie, brûlée cheesecake and milk soft serve. It's for diners only, subject to space, so ask on arrival.</p>"},
    {t:"18:30", n:"Covent Garden Christmas market", go:{m:"walk",min:3}, p:"Market stalls and lights around the Piazza after dinner.", ll:[51.5117,-0.1229], q:"Covent Garden Piazza, London"},
    {t:"19:00", n:"Leicester Square Christmas market", go:{m:"walk",min:8}, ll:[51.5103,-0.1301], q:"Leicester Square Christmas Market, London"},
    {t:"19:30", n:"Uniqlo: collect the T-shirts, coffee", go:{m:"walk",min:8}, p:"Picked up the embroidered T-shirts and had a coffee until about 20:00.", ll:[51.5124,-0.1255], q:"Uniqlo Covent Garden, Long Acre, London"},
    {t:"20:05", n:"Retro arcade games", p:"About an hour and a half of retro arcade machines, until about 21:45: the arcade we dropped in the afternoon, after all."},
    {t:"22:00", n:"Top Secret Comedy Club: late show", k:"fixed", chk:"comedy", booked:true, go:{m:"walk",min:10,est:true,txt:"Up to Kingsway"}, p:"Stand-up at the UK's highest-rated comedy club. On Fridays the 22:00 show is at the 23 Kingsway venue and runs until about 23:30; check the ticket for the venue. Cheap bar, so drinks are fine there.", ll:[51.5153,-0.1192], q:"Top Secret Comedy Club, 23 Kingsway, London"},
    {t:"23:45", n:"Kings Cross Inn: bed", chk:"kxinn", go:{m:"tube",min:15,txt:"Holborn station is next to the club: Piccadilly line to King's Cross St Pancras (2 stops), then 3 minutes to the hotel"}, p:"Pack tonight and set an alarm for 05:40. Leave the room by 06:05; King's Cross is across the road.", ll:[51.5303,-0.1232], q:"Kings Cross Inn Hotel, 9-11 Euston Road, London"}
   ]},
 { id:"sat", iso:"2026-11-21", cities:["edinburgh","glasgow"], tab:"Sat 21", place:"London → Edinburgh → Glasgow", date:"Saturday 21 November", city:"edinburgh",
   title:"Early train, Harry Potter Old Town, Glasgow by night",
   rain:["The Harry Potter walk is all outdoors: jacket on. The app pauses wherever you stop, so duck into a café and resume.","Swap the rest of the walk for the National Museum of Scotland on Chambers Street: free, open 10:00–17:00, 2 minutes from Greyfriars Bobby's.","Johnnie Walker is indoors. If the market is a washout, take an earlier train back: they run every 15 minutes."],
   intro:"The 06:30 LNER from King's Cross on the cancelled sleeper ticket, breakfast on board, and Edinburgh by 10:40. Bags into left luggage at Waverley, brunch at Whiski on the Royal Mile, then a Harry Potter audio walk through the Old Town from Castlehill to Greyfriars, a pub lunch at Greyfriars Bobby's, and after dark Johnnie Walker and the Christmas market lights. Then the 19:15 train to Glasgow with the bags, the Clutha by the Clyde, a Voi bike to Blue Dog for a cocktail, and noodles from Chapstix on the way home.",
   off:"<b>06:30</b> LNER King's Cross → Edinburgh Waverley, arrive <b>~10:40</b>.<br><b>19:15</b> ScotRail Edinburgh Waverley → Glasgow Queen Street, ~50 min.",
   stops:[
    {t:"06:30", n:"LNER King's Cross → Edinburgh Waverley", k:"fixed", chk:"lner", tr:"train", go:{m:"walk",min:5,leave:"06:05",txt:"Kings Cross Inn across Euston Road to the King's Cross concourse"}, p:"Free on the cancelled Caledonian Sleeper ticket: show it and the cancellation email to the guard. No seat reservations, and other sleeper passengers will be on it, so be at the platform by 06:10 and look for unreserved seats. Breakfast from the café bar on board. Backups: 07:03 or 07:30.", fee:["£0 (sleeper refunded)","free"], off:true},
    {t:"10:40", n:"Waverley: bags into left luggage", go:{m:"train",min:250,txt:"~4 h 10 min"}, p:"Staffed left-luggage office on platform 2, by the Calton Road entrance. Open 07:00–23:00, ~£12.50 a bag for the day; walk-ins fine.", fee:["~£12.50 a bag","paid"], ll:[55.9520,-3.1880], q:"Left Luggage, Edinburgh Waverley station"},
    {t:"11:00", n:"Brunch at Whiski, Royal Mile", go:{m:"walk",min:7,txt:"up Cockburn Street from Waverley"}, p:"Whiski Bar & Restaurant, 119 High Street: Scottish food all day and 300+ malts. Replaced the castle.", ll:[55.9503,-3.1866], q:"Whiski Bar & Restaurant, 119 High Street, Edinburgh"},
    {t:"12:15", n:"Harry Potter audio walk, Castlehill → Greyfriars", go:{m:"walk",min:10,est:true,txt:"up the Royal Mile to Castlehill, outside the castle"}, p:"VoiceMap self-guided tour \"Harry Potter's Edinburgh\": 1.1 miles, ~90 min, 30 audio points with turn-by-turn directions. Starts on Castlehill and winds down the Royal Mile, past the Writers' Museum, Victoria Street (Diagon Alley) and the Grassmarket to Greyfriars Kirkyard (the Tom Riddle grave) and the Elephant House. Works offline once downloaded in the VoiceMap app.", fee:["~£9 in the app","paid"], ll:[55.9488,-3.1963], q:"Castlehill, Edinburgh",
      more:"<p>Pause any time: it resumes where you stopped. Running late for lunch? Skip ahead to Greyfriars Kirkyard; the pub is at its gate.</p>"},
    {t:"13:45", n:"Lunch at Greyfriars Bobby's Bar", go:{m:"walk",min:2,est:true,txt:"from the Kirkyard gate to Candlemaker Row"}, p:"30–34 Candlemaker Row, by the Bobby statue. Nicholson's pub: pies, fish and chips, cask ales; food from 12:00. Popular with tourists, so expect a short wait at peak.", fee:["~£15–20","paid"], ll:[55.9469,-3.1918], q:"Greyfriars Bobby's Bar, 30-34 Candlemaker Row, Edinburgh",
      more:"<p>Full? The Grassmarket pubs are 3 min downhill along Candlemaker Row.</p>"},
    {t:"15:20", n:"Johnnie Walker Princes Street: Journey of Flavour", k:"fixed", chk:"jw", go:{m:"walk",min:20,leave:"14:50",txt:"George IV Bridge, The Mound, then west along Princes Street"}, p:"90 minutes, three cocktails made to match a flavour quiz, then the rooftop bar with the castle lit up after dark.", fee:["£30","paid"], booked:true, ll:[55.9502,-3.2068], q:"Johnnie Walker Princes Street, 145 Princes Street, Edinburgh",
      more:"<p>Use the entrance on Hope Street and show the ticket in the lobby. 20 min walk from Greyfriars Bobby's.</p>"},
     {t:"17:30", n:"Christmas market, East Princes Street Gardens", p:"Mulled wine among the lit-up stalls under the Scott Monument, until about 18:40.", ll:[55.9519,-3.1925], q:"Edinburgh Christmas Market, East Princes Street Gardens"},
     {t:"19:00", n:"Waverley: collect the bags", go:{m:"walk",min:5,txt:"down the steps from the gardens"}, ll:[55.9520,-3.1880], q:"Left Luggage, Edinburgh Waverley station"},
     {t:"19:15", n:"Train to Glasgow Queen Street", tr:"train", p:"~50 min. The Maldron is ~8 min walk from Queen Street.", off:true},
     {t:"20:15", n:"Maldron Hotel Glasgow City: check in", chk:"hotel", go:{m:"walk",min:8,txt:"from Queen Street"}, ll:[55.8660,-4.2560], q:"Maldron Hotel Glasgow City, 50 Renfrew Street"},
     {t:"22:00", n:"The Clutha, Stockwell St", go:{m:"walk",min:20,est:true}, p:"Old riverside pub by the Clyde with live music.", ll:[55.8545,-4.2490], q:"The Clutha, 167 Stockwell Street, Glasgow"},
     {t:"22:50", n:"One cocktail at Blue Dog, West George St", go:{m:"bike",min:10,est:true,txt:"Voi e-bike from the Clutha"}, p:"New York-style piano and cocktail bar, open until about 3 am: the stand-in for Daddy Marmalades, which was closed.", ll:[55.8630,-4.2590], q:"Blue Dog, 151 West George Street, Glasgow"},
     {t:"23:20", n:"Noodles at Chapstix on the way back", p:"Late noodles to take back to the hotel."},
     {t:"23:40", n:"Maldron: bed", chk:"hotel", ll:[55.8660,-4.2560], q:"Maldron Hotel Glasgow City, 50 Renfrew Street"}
   ]},
 { id:"sun", iso:"2026-11-22", cities:["glasgow"], tab:"Sun 22", place:"Glasgow → home", date:"Sunday 22 November", city:"glasgow",
    title:"Glasgow: Tennent's, Drygate, cathedral walk, home",
   rain:["Wet morning: linger over breakfast, skip the Necropolis hill (slippery when wet) and take a taxi straight to Tennent's for 11:00.","The brewery tour, lunch at Drygate and the cathedral are all indoors."],
    intro:"A slow start at the Maldron, a Voi bike out to the Tennent's brewery, a pint at Drygate next door, then a VoiceMap walk from the cathedral down to Glasgow Green before the coach to Edinburgh Airport.",
    off:"<b>16:00</b> Citylink Air, Buchanan Bus Station → Edinburgh Airport, arrive <b>~17:00</b>. Flight <b>19:00</b>.",
   stops:[
     {t:"09:40", n:"Maldron: check out, bags at the desk", chk:"hotel", ll:[55.8660,-4.2560], q:"Maldron Hotel Glasgow City, 50 Renfrew Street"},
     {t:"09:50", n:"Black Sheep Coffee: a bite on the go", p:"Quick coffee and breakfast to take away."},
     {t:"10:30", n:"Tennent's Wellpark Brewery tour, 161 Duke St", chk:"tennents", go:{m:"bike",min:15,est:true,txt:"Voi e-bike across the city centre"}, p:"Brewery tour ending with a pint of unpasteurised lager from the tanks.", ll:[55.8590,-4.2330], q:"Tennent's Wellpark Brewery, 161 Duke Street, Glasgow"},
     {t:"12:30", n:"Drygate bar, next door", go:{m:"walk",min:3}, p:"Craft brewery bar beside Wellpark.", ll:[55.8616,-4.2335], q:"Drygate Brewing Co, 85 Drygate, Glasgow"},
     {t:"14:30", n:"VoiceMap walk: Glasgow Cathedral → Glasgow Green", go:{m:"walk",min:5,txt:"from Drygate"}, p:"Audio walk from the cathedral down through the old town to Glasgow Green, until about 15:40.", ll:[55.8628,-4.2342], q:"Glasgow Cathedral"},
     {t:"15:40", n:"Taxi to the Maldron, collect the bags", go:{m:"taxi",min:12,est:true,txt:"from Glasgow Green"}, ll:[55.8660,-4.2560], q:"Maldron Hotel Glasgow City, 50 Renfrew Street"},
     {t:"16:00", n:"Citylink Air to Edinburgh Airport", chk:"citylink", tr:"bus", go:{m:"walk",min:5,txt:"Maldron to Buchanan Bus Station"}, p:"Direct coach, about an hour.", off:true},
     {t:"17:00", n:"At Edinburgh Airport", p:"Two hours before the 19:00 flight home.", off:true}
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
  ["National Museum of Scotland","edinburgh","Chambers Street","Free, open daily 10:00–17:00. 2 min from Greyfriars Bobby's.",true,75,[55.9470,-3.1892],"National Museum of Scotland, Chambers Street, Edinburgh"],
  ["Edinburgh Castle","edinburgh","Castlehill","Skipped on Saturday. Timed entry online, ~£23.50, allow 1.5 h.",false,90,[55.9486,-3.1999],"Edinburgh Castle"],
  ["Calton Hill","edinburgh","east end of Princes Street","Monuments and the best view of the Old Town; go before sunset ~15:50. Free.",false,30,[55.9553,-3.1827],"Calton Hill, Edinburgh"],
  ["Holyrood Distillery","edinburgh","foot of Arthur's Seat","~90 min tour, £20–25.",true,90,[55.9432,-3.1773],"Holyrood Distillery, Edinburgh"],
  ["Arthur's Seat","edinburgh","Holyrood Park","~1.5 h return from Holyrood.",false,90,[55.9441,-3.1618],"Arthur's Seat, Edinburgh"],
  ["Port of Leith Distillery","edinburgh","Leith","Nine-storey vertical distillery with a bar on top.",true,90,[55.9790,-3.1690],"Port of Leith Distillery, Edinburgh"],
  ["Barnton nuclear bunker tours","edinburgh","Barnton","Saturdays and Sundays.",true,90,[55.9590,-3.2890],"Barnton Quarry nuclear bunker, Edinburgh"],
  ["Kelvingrove Art Gallery and the West End","glasgow","West End","Kelvingrove opens 11:00 on Sundays if you swap it for Tennent's.",true,90,[55.8686,-4.2906],"Kelvingrove Art Gallery and Museum, Glasgow"],
  ["Clydeside Distillery","glasgow","near Finnieston","On the river; the tour ends with three drams.",true,75,[55.8617,-4.2990],"The Clydeside Distillery, Glasgow"]
];

/* Planned spend per person in GBP, mapped to the expense categories: [label, [expense categories], low, high] */
var BUDGET = [
  ["Transport",["transport"],60,90],
  ["Activities",["tickets"],85,140],
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
  ["comedy","Top Secret Comedy Club, Fri 22:00","Booked; check the ticket for the venue (Kingsway or Drury Lane)","Done",true],
  ["jw","Johnnie Walker Journey of Flavour, Sat 15:20 for 2","Booked; Hope Street entrance","Done",true],
  ["tennents","Tennent's brewery tour, Sun 11:00 for 2","Booked","Done",true],
  ["citylink","Citylink Air, Sun 16:00 Glasgow → Edinburgh Airport","Taken","Done",true],
  ["mail","Postal Museum + Mail Rail, Thu 15:00–15:30","Done on Thursday","Done",true],
  ["barrys","Barry's St Paul's, Fri 08:00","Booked; Kirill only","Done",true]
];

var CENTERS = {london:[51.512,-0.105], glasgow:[55.864,-4.26], edinburgh:[55.951,-3.19]};
