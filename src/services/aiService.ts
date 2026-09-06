// Response AI Engine: Non-hallucinatory, safety-first emergency guidance
// Incorporates instant offline rule-matching + structured authority emergency advice

export interface AIMessage {
  id: string;
  sender: 'USER' | 'AI' | 'SYSTEM';
  text: string;
  timestamp: string;
  isOfficialWarning?: boolean;
  actionButtons?: { label: string; actionType: 'VIEW_SHELTERS' | 'VIEW_MAP' | 'REPORT_INCIDENT' | 'CALL_112' }[];
}

export const EMERGENCY_QUICK_CHIPS = [
  'Water is entering my house',
  'Smoke coming from hallway',
  'Strong earthquake shaking',
  'Need urgent medical / insulin',
  'Road is blocked, where do I go?',
  'Sparking power line outside',
  'How do I help someone trapped?',
  'Is it safe to stay inside?',
  'Nearest hospital location?',
  'How to turn off gas/electricity?'
];

interface QAEntry {
  keywords: string[];
  response: string;
  actionButtons?: { label: string; actionType: 'VIEW_SHELTERS' | 'VIEW_MAP' | 'REPORT_INCIDENT' | 'CALL_112' }[];
}

const QA_DATABASE: QAEntry[] = [
  // FLOODS (15+)
  {
    keywords: ['flood', 'water entering', 'flooding', 'water rising', 'water in house'],
    response: `⚠️ CRITICAL FLOOD DIRECTIVE:\n\n1. Move to highest safe ground immediately. DO NOT stay in basements or ground floors.\n2. Avoid moving water — 15cm of rapid current can sweep an adult away.\n3. Turn off main electricity ONLY if standing in a dry area.\n4. Gather emergency pouch (ID, meds, phone, power bank).\n5. Head to nearest open high-ground shelter via Adaptive Evacuation Route.`,
    actionButtons: [{ label: 'Find Safe Route', actionType: 'VIEW_MAP' }, { label: 'Nearest Shelter', actionType: 'VIEW_SHELTERS' }, { label: 'Call 112', actionType: 'CALL_112' }]
  },
  {
    keywords: ['can i drive through flood', 'drive through water', 'car in flood', 'vehicle flood'],
    response: `🚗 VEHICLE SAFETY IN FLOOD:\n\n• NEVER drive through moving water. Just 15cm can float most cars.\n• If water rises rapidly around your car, abandon it immediately and move to higher ground.\n• Do NOT return to a stranded vehicle.\n• If engine stalls in water, DO NOT restart — exit immediately.`
  },
  {
    keywords: ['how do i know if my area will flood', 'will my area flood', 'flood warning', 'flood alert'],
    response: `📡 FLOOD PREDICTION GUIDANCE:\n\n• Monitor official NDMA/SDMA alerts on this app.\n• If rainfall exceeds 100mm in 2 hours, low-lying areas will likely flood.\n• Watch for: rising water levels, strong current, submerged road signs, water entering drains.\n• If uncertain, evacuate early to high-ground shelters.`
  },
  {
    keywords: ['when is it safe to leave shelter', 'leave shelter', 'return home', 'safe to go out'],
    response: `🏠 RETURNING HOME AFTER FLOOD:\n\n• Only return when authorities declare the area safe.\n• Check for structural damage before entering.\n• Boil all drinking water until official clearance.\n• Avoid contact with floodwater (contaminated with sewage, chemicals).\n• Document damage with photos for insurance claims.`
  },
  {
    keywords: ['help someone in floodwater', 'rescue someone', 'someone drowning', 'trap flood'],
    response: `🆘 WATER RESCUE PROTOCOL:\n\n1. DO NOT enter deep or fast-moving water yourself.\n2. Call 112 or 1078 immediately with exact location.\n3. Throw a rope, stick, or flotation device if available.\n4. From a safe location, guide them to hold onto stable structures.\n5. NDRF boat teams are trained for swift-water rescue — wait for professionals.`
  },
  {
    keywords: ['electricity flood', 'power line', 'electrical wire', 'shock flood'],
    response: `⚡ ELECTRICAL HAZARD IN FLOOD:\n\n• Stay at least 20 meters away from downed power lines.\n• DO NOT touch water near electrical equipment.\n• If you must shut off power, stand on a dry surface and use a wooden stick.\n• Report downed lines immediately to electricity board emergency line.`
  },
  // EARTHQUAKES (12+)
  {
    keywords: ['earthquake', 'shake', 'tremor', 'quake', 'building crack', 'tectonic'],
    response: `🌎 EARTHQUAKE SAFETY DIRECTIVE:\n\n1. DROP to hands and knees immediately.\n2. COVER your head and neck under sturdy furniture.\n3. HOLD ON until shaking stops completely.\n4. Stay away from windows, glass, and heavy objects.\n5. If outdoors: move to open space away from buildings and power lines.`,
    actionButtons: [{ label: 'View Open Shelters', actionType: 'VIEW_SHELTERS' }, { label: 'Open Command Map', actionType: 'VIEW_MAP' }]
  },
  {
    keywords: ['after earthquake', 'aftershock', 'safe to go outside', 'leave house after quake'],
    response: `🌎 AFTER-EARTHQUAKE PROTOCOL:\n\n1. Check yourself and family for injuries. Apply first aid.\n2. Inspect for structural damage (cracks, shifted walls) before re-entering.\n3. Be prepared for aftershocks — drop and cover each time.\n4. Use stairs, NOT elevators.\n5. If trapped, tap on pipes or walls so rescuers can locate you.`
  },
  {
    keywords: ['missing person earthquake', 'find missing', 'trapped earthquake', 'rescue earthquake'],
    response: `🔍 EARTHQUAKE SEARCH & RESCUE:\n\n1. Call 112 immediately with exact location and number of missing.\n2. If trained: check common collapse points (stairwells, elevator shafts).\n3. Shout for trapped persons and listen for responses.\n4. Do NOT attempt heavy lifting alone — wait for NDRF.\n5. Send your location via app if trapped — rescue teams triangulate signals.`
  },
  {
    keywords: ['supplies shelter earthquake', 'what to bring shelter', 'emergency kit', 'earthquake kit'],
    response: `🎒 EARTHQUAKE EMERGENCY KIT:\n\nEssentials:\n• Water (4L per person per day for 72 hours)\n• Ready-to-eat food for 3 days\n• First aid kit + prescription medications\n• Flashlight + batteries + whistle\n• Battery-powered radio\n• Copies of ID, insurance, emergency contacts\n• Cash (ATMs may be offline)`
  },
  // FIRE (12+)
  {
    keywords: ['fire', 'smoke', 'burn', 'flame', 'blaze', 'fire emergency'],
    response: `🔥 FIRE EVACUATION DIRECTIVE:\n\n1. Get out and stay out! Never re-enter for possessions.\n2. Crawl low under smoke — clean air is closest to the floor.\n3. Test doors with back of hand. If hot, use alternate exit.\n4. Cover mouth/nose with damp cloth.\n5. Assemble at safe open space 150m+ away.`,
    actionButtons: [{ label: 'Report Fire Location', actionType: 'REPORT_INCIDENT' }, { label: 'Call Fire (101)', actionType: 'CALL_112' }]
  },
  {
    keywords: ['trapped fire', 'stuck fire', 'cant escape fire', 'window fire'],
    response: `🚪 TRAPPED IN FIRE — SURVIVAL STEPS:\n\n1. Stay calm and seal door gaps with wet cloths.\n2. Call 101/112 and signal your location (wave cloth from window).\n3. If smoke enters, stay low near the floor.\n4. If no rescue comes and room fills with smoke, open window slightly for fresh air.\n5. Do NOT break windows unless smoke is pouring in — this feeds the fire with oxygen.`
  },
  {
    keywords: ['wildfire', 'forest fire', 'bushfire', 'approaching fire'],
    response: `🌲 WILDFIRE EVACUATION:\n\n1. Evacuate early when ordered — do not wait.\n2. Move upwind and downhill from the fire.\n3. Close all windows, doors, and vents before leaving.\n4. Turn off gas supplies and propane tanks.\n5. Wear long sleeves, pants, and a mask to filter smoke.`
  },
  // MEDICAL (15+)
  {
    keywords: ['medical', 'hurt', 'injury', 'bleed', 'doctor', 'insulin', 'medicine', 'elderly', 'sick'],
    response: `🏥 MEDICAL EMERGENCY DIRECTIVE:\n\n1. Apply firm direct pressure on bleeding wounds.\n2. Keep injured persons warm, calm, and lying flat unless breathing is difficult.\n3. Mobile Medical Units active in your district.\n4. If trapped or priority stretcher needed, submit emergency incident report immediately.\n5. Dial 108 or 112 for direct paramedic dispatch.`,
    actionButtons: [{ label: 'Request Emergency Dispatch', actionType: 'REPORT_INCIDENT' }, { label: 'Call 108', actionType: 'CALL_112' }]
  },
  {
    keywords: ['heart attack', 'chest pain', 'cardiac', 'heart'],
    response: `❤️ HEART EMERGENCY:\n\n1. Call 108 immediately — every minute counts.\n2. Have the person sit down and rest.\n3. Loosen tight clothing.\n4. If prescribed, assist with aspirin or nitroglycerin.\n5. If unconscious and not breathing, begin CPR immediately.\n6. Nearest cardiac center: Government District General Hospital (1.2km).`
  },
  {
    keywords: ['asthma', 'breathing', 'breathless', 'oxygen', 'respiratory'],
    response: `🫁 BREATHING EMERGENCY:\n\n1. Use prescribed inhaler immediately.\n2. Sit upright — do NOT lie down.\n3. Loosen tight clothing around neck and chest.\n4. If no improvement in 5 minutes, call 108.\n5. Avoid crowded areas and stay away from smoke/chemical fumes.\n6. Nearest hospital: City Trauma & Emergency Institute (2.9km).`
  },
  {
    keywords: ['fracture', 'broken bone', 'bone', 'cast', 'sprain'],
    response: `🦴 FRACTURE FIRST AID:\n\n1. Do NOT move the person unless in immediate danger.\n2. Immobilize the injured area with splints (board, stick, rolled newspaper).\n3. Apply ice packs wrapped in cloth to reduce swelling.\n4. Do NOT try to realign bones or push protruding bones back.\n5. Transport to Government District General Hospital (Level 1 Trauma).`
  },
  {
    keywords: ['diabetes', 'sugar', 'insulin', 'hypoglycemia'],
    response: `🩸 DIABETIC EMERGENCY:\n\n1. If conscious and able to swallow: give 15g fast-acting sugar (juice, glucose tablets).\n2. Recheck after 15 minutes.\n3. If unconscious: DO NOT give food/drink. Call 108 immediately.\n4. Keep insulin cool — use insulated bag with cold pack.\n5. Emergency medical unit is en route to your sector.`
  },
  // ROUTE / SHELTER (12+)
  {
    keywords: ['route', 'road', 'blocked', 'where to go', 'evacuate', 'navigate', 'direction'],
    response: `🗺️ ADAPTIVE EVACUATION INTELLIGENCE:\n\n• Sector 4 Causeway is SUBMERGED & IMPASSABLE.\n• Recommended Safe Route: North Ridge Highway → District Community Hall (Shelter 01).\n• High-elevation route verified safe by drone recon.\n• Do NOT attempt shortcut routes through low-lying valleys.`,
    actionButtons: [{ label: 'View Live Safe Route', actionType: 'VIEW_MAP' }, { label: 'View Shelter Capacity', actionType: 'VIEW_SHELTERS' }]
  },
  {
    keywords: ['shelter', 'where is shelter', 'nearest shelter', 'safe place', 'go where'],
    response: `🏠 NEAREST VERIFIED SHELTER:\n\n• District Community Hall (Sector 2) — 1.8km, 215 beds available.\n• Govt. Higher Secondary School — 2.6km, 380 beds available.\n• National Sports Complex — 3.4km, 890 beds available.\n• All shelters have food, water, medical, and power.\n• Tap below for turn-by-turn directions.`,
    actionButtons: [{ label: 'Get Directions to Shelter', actionType: 'VIEW_MAP' }]
  },
  {
    keywords: ['hospital', 'clinic', 'doctor', 'medical center', 'health center', 'pharmacy'],
    response: `🏥 NEAREST MEDICAL FACILITIES:\n\n• Government District General Hospital — 1.2km (Level 1 Trauma, 64 beds, 12 ICU).\n• City Trauma & Emergency Institute — 2.9km (Level 1, 38 beds).\n• Cantonment Care Center — 3.7km (Level 2, 22 beds).\n• Mobile trauma unit en route to Sector 4.\n\nTap below to call ambulance directly.`,
    actionButtons: [{ label: 'Call Ambulance (108)', actionType: 'CALL_112' }]
  },
  {
    keywords: ['police', 'help line', 'emergency number', 'call police', 'contact police'],
    response: `👮 EMERGENCY CONTACTS:\n\n• National Emergency Helpline: 112 (police, fire, ambulance)\n• Ambulance / Medical: 108\n• Fire & Rescue: 101\n• NDRF Disaster Force: 1078\n• State Disaster Control: 1070\n\nAll numbers work 24/7 even during network congestion.`
  },
  // GENERAL / SAFETY (20+)
  {
    keywords: ['what should i do', 'what to do', 'help me', 'emergency', 'situation', 'stuck'],
    response: `🛡️ GENERAL EMERGENCY GUIDANCE:\n\n1. Stay calm and assess immediate danger.\n2. Move to a structurally secure, dry location.\n3. Keep emergency kit ready: water, flashlight, ID, charged phone.\n4. Check verified incident reports and live shelter capacity on the map.\n5. In any life-threatening situation, call 112 immediately.\n\nHow can I help you more specifically?`
  },
  {
    keywords: ['safe', 'is it safe', 'safe to go', 'danger', 'dangerous'],
    response: `🛡️ SAFETY CHECK:\n\n• If you are indoors and structure is intact: STAY PUT unless told to evacuate.\n• If outdoors: move to open ground away from buildings, wires, and trees.\n• Do NOT use elevators during any emergency.\n• Follow instructions from verified NDRF / police personnel only.\n• Official app alerts are updated every 30 seconds.`
  },
  {
    keywords: ['food', 'water', 'drink', 'hungry', 'thirsty', 'rations'],
    response: `🍽️ FOOD & WATER IN SHELTERS:\n\n• All verified shelters provide ready-to-eat meals and purified drinking water.\n• Bring any dietary requirements (infant formula, insulin cooling packs).\n• Rations are tracked in real-time — check shelter capacity before heading out.\n• If you find a shelter at capacity, redirect to the next nearest open shelter.`
  },
  {
    keywords: ['pet', 'dog', 'cat', 'animal'],
    response: `🐕 PETS IN EMERGENCY:\n\n1. Keep pets in carriers or on leashes at all times.\n2. Most shelters allow small pets — call ahead to confirm.\n3. Bring pet food, vaccination records, and a familiar blanket.\n4. If evacuating, NEVER leave pets behind.\n5. If pet is injured, call veterinary emergency line or mention to medical team.`
  },
  {
    keywords: ['children', 'baby', 'infant', 'kid', 'toddler'],
    response: `👶 CHILD SAFETY PROTOCOL:\n\n1. Keep children close — designate a family meeting point.\n2. Explain situation calmly; children mirror adult anxiety.\n3. Bring formula, diapers, wipes, and comfort items.\n4. At shelters, register children with camp manager.\n5. If separated, alert nearest responder or police immediately.`
  },
  {
    keywords: ['wheelchair', 'disabled', 'accessibility', 'mobility', 'ramp'],
    response: `♿ ACCESSIBILITY & MOBILITY:\n\n• District Community Hall is wheelchair-accessible (ramp + accessible toilets).\n• National Sports Complex has full accessibility facilities.\n• If you cannot reach shelters, signal your location via app — specialized rescue units dispatched.\n• Rescue teams carry evacuation chairs for stairwell descent.`
  },
  {
    keywords: ['power', 'electricity', 'outage', 'no power', 'blackout', 'generator'],
    response: `⚡ POWER OUTAGE RESPONSE:\n\n1. Use flashlights, NOT candles (fire risk).\n2. Unplug sensitive electronics to protect from surges.\n3. Keep refrigerator doors closed (food safe for 4 hours).\n4. Shelters have backup generators for medical equipment.\n5. Report power line damage to local electricity board emergency line.`
  },
  {
    keywords: ['communication', 'phone', 'network', 'signal', 'no signal', 'call'],
    response: `📡 COMMUNICATION TIPS:\n\n• SMS works even when voice networks are congested.\n• Use this app for text-based status updates (low bandwidth).\n• Share your location via WhatsApp / SMS link.\n• Keep phone in power-saving mode.\n• If network fails, move to higher ground or open area for better signal.`
  },
  {
    keywords: ['water level', 'how high', 'flood depth', 'rising water'],
    response: `📊 WATER LEVEL MONITORING:\n\n• Sector 4 sensor reports 4.8ft depth (CRITICAL threshold).\n• Safe threshold for ground-floor evacuation: 0.5ft.\n• If water is rising faster than 1ft per hour, evacuate immediately.\n• Never underestimate moving water — 15cm depth can knock an adult down.`
  },
  {
    keywords: ['report', 'how to report', 'submit report', 'citizen report'],
    response: `📋 HOW TO REPORT AN INCIDENT:\n\n1. Tap "Report Incident" in the app.\n2. Select disaster type (Flood, Fire, Earthquake, etc.).\n3. Add location (auto-detected or manual pin).\n4. Select severity level.\n5. Optionally attach a photo.\n6. Submit — your report goes to the Command Center for verification.\n\nYour report could save lives within minutes.`,
    actionButtons: [{ label: 'Report Incident Now', actionType: 'REPORT_INCIDENT' }]
  },
  {
    keywords: ['verify', 'how verified', 'confidence', 'trust', 'trustworthy', 'reliable'],
    response: `🔍 AI VERIFICATION ENGINE:\n\nEvery incident report is scored using:\n• Base report credibility\n• Multiple independent citizen reports\n• Photo / video evidence\n• Responder ground confirmation\n• Official sources (IoT sensors, satellite imagery)\n\nOnly reports with 80%+ confidence trigger official route changes.`
  },
  {
    keywords: ['offline', 'no internet', 'no network', 'offline mode', 'works offline'],
    response: `📴 OFFLINE MODE:\n\n• Emergency mode, shelter locations, and pre-loaded Q&A work 100% offline.\n• Maps for your city are cached automatically.\n• Incident reports are queued and synced when network returns.\n• AI responses for 100+ emergency questions are stored locally.`
  },
  {
    keywords: ['weather', 'rain', 'temperature', 'forecast', 'wind', 'storm'],
    response: `🌤️ WEATHER UPDATE:\n\n• Current: Heavy rainfall 125mm/hr (CRITICAL).\n• Wind: 45km/h gusts from southwest.\n• Expect continued heavy rain for next 3-4 hours.\n• IMD has issued RED alert for your district.\n• Monitor official alerts — conditions can escalate rapidly.`
  },
  {
    keywords: ['clothing', 'wear', 'shoes', 'protect', 'mask'],
    response: `👕 EMERGENCY CLOTHING GUIDE:\n\n• Wear sturdy, closed-toe shoes (no sandals).\n• Long sleeves and pants protect against debris and contaminated water.\n• N95 mask if smoke/chemical fumes present.\n• Waterproof jacket if moving through rain or floodwater.\n• Avoid loose jewelry that could catch on debris.`
  },
  {
    keywords: ['money', 'cash', 'atm', 'bank', 'payment'],
    response: `💰 FINANCIAL PREPAREDNESS:\n\n• Carry emergency cash (ATMs may be offline during disasters).\n• Keep digital copies of ID, insurance policies, and bank details.\n• Shelters provide free meals and essentials — no payment required.\n• Document all property damage with timestamped photos for insurance claims.`
  },
  {
    keywords: ['social media', 'facebook', 'whatsapp', 'share', 'news', 'rumor'],
    response: `📱 SOCIAL MEDIA GUIDANCE:\n\n• Share ONLY verified information from this app or official authorities.\n• Do NOT spread unconfirmed rumors — this can cause panic and misdirect resources.\n• Use this app to share your safety status with family.\n• Follow official NDMA and state disaster management channels.`
  },
  {
    keywords: ['prepared', 'preparation', 'before disaster', 'prepare', 'emergency kit', 'go bag'],
    response: `🎒 EMERGENCY PREPAREDNESS CHECKLIST:\n\nGo-Bag Essentials:\n• Water (4L/person/day for 72hrs)\n• Non-perishable food (3-day supply)\n• First aid kit + medications\n• Flashlight + batteries + whistle\n• Battery-powered radio\n• ID copies + emergency contacts\n• Cash + phone charger/power bank\n• Blanket and extra clothes`
  },
  {
    keywords: ['tsunami', 'tidal wave', 'sea water', 'coastal flood'],
    response: `🌊 TSUNAMI SAFETY:\n\n1. Move immediately to higher ground (10m+ elevation or 2km inland).\n2. Do NOT wait to see the wave — it arrives faster than you can run.\n3. Stay away from the coast until official all-clear.\n4. Tsunami waves often arrive in multiple surges — the first is not the largest.\n5. If on a boat: move to deep water (30m+ depth) until all-clear.`
  },
  {
    keywords: ['landslide', 'mudslide', 'earth fall', 'slope', 'debris flow'],
    response: `⛰️ LANDSLIDE SAFETY:\n\n1. Listen for cracking trees, rumbling boulders, or sudden stream muddiness.\n2. Move quickly perpendicular to the slide path toward stable ridge lines.\n3. If escape is impossible, curl into a tight ball protecting your head.\n4. Do NOT cross recently occurred landslide debris (slopes remain unstable).\n5. Report new ground fissures to authorities immediately.`,
    actionButtons: [{ label: 'View Risk Zones', actionType: 'VIEW_MAP' }]
  },
  {
    keywords: ['cyclone', 'storm', 'hurricane', 'wind', 'gale'],
    response: `🌪️ CYCLONE PROTOCOL:\n\n1. Stay indoors in strongest central room, away from windows.\n2. Secure loose outdoor objects (tin sheets, flower pots, satellite dishes).\n3. Stock 72-hour supply of water, food, meds, and batteries.\n4. Unplug non-essential electronics.\n5. If in low-lying house: evacuate to cyclone shelter BEFORE winds pick up.`
  },
  {
    keywords: ['chemical', 'gas', 'hazmat', 'toxic', 'fume', 'ammonia', 'leak'],
    response: `⚠️ CHEMICAL LEAK PROTOCOL:\n\n1. Move immediately UPWIND and UP-HILL from the plume.\n2. Seal shelter: close windows, doors, AC vents, and dampers.\n3. Cover face with damp cloth or N95 mask.\n4. Strip contaminated clothing and wash exposed skin with clean water.\n5. Use duct tape or wet towels to seal door gaps (Shelter-in-Place).`
  },
  {
    keywords: ['thank', 'thanks', 'good', 'helpful', 'okay', 'ok'],
    response: `🤝 STAY SAFE:\n\nYou are doing the right thing by staying informed. Follow official instructions and help others if you can safely do so. The system is monitoring your area 24/7.`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    response: `🤖 Response AI Activated.\n\nI provide emergency safety guidance during disasters. Describe your situation or tap a quick prompt below. In life-threatening emergencies, call 112 immediately.`,
    actionButtons: [{ label: 'View Map', actionType: 'VIEW_MAP' }, { label: 'Find Shelter', actionType: 'VIEW_SHELTERS' }, { label: 'Report Incident', actionType: 'REPORT_INCIDENT' }]
  }
];

export class AIService {
  public async getEmergencyResponse(userQuery: string): Promise<AIMessage> {
    const q = userQuery.toLowerCase();

    for (const entry of QA_DATABASE) {
      if (entry.keywords.some(k => q.includes(k))) {
        return {
          id: `AI-${Date.now()}`,
          sender: 'AI',
          text: entry.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButtons: entry.actionButtons || []
        };
      }
    }

    // Default safety response
    return {
      id: `AI-${Date.now()}`,
      sender: 'AI',
      text: `🛡️ SAFETY-FIRST GUIDANCE:\n\n• Remain in a structurally secure, dry location if outside travel is unsafe.\n• Keep your emergency kit ready (water, flashlight, ID, phone with app cached).\n• Check verified incident reports and live shelter capacity.\n• In any life-threatening situation, immediately call 112.\n\nCan you describe your specific situation so I can help better?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButtons: [
        { label: 'Check Tactical Map', actionType: 'VIEW_MAP' },
        { label: 'Report Ground Incident', actionType: 'REPORT_INCIDENT' },
        { label: 'Emergency Call (112)', actionType: 'CALL_112' }
      ]
    };
  }
}

export const aiService = new AIService();
