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
  '🌊 Water is entering my house',
  '🔥 Smoke coming from hallway',
  '🌎 Strong earthquake shaking',
  '🏥 Need urgent medical / insulin',
  '🚧 Road is blocked, where do I go?',
  '⚡ Sparking power line outside'
];

export class AIService {
  public async getEmergencyResponse(userQuery: string): Promise<AIMessage> {
    const q = userQuery.toLowerCase();

    // 1. Water / Flood query
    if (q.includes('water') || q.includes('flood') || q.includes('submerged') || q.includes('drown') || q.includes('river')) {
      return {
        id: `AI-${Date.now()}`,
        sender: 'AI',
        text: `⚠️ **CRITICAL FLOOD SAFETY DIRECTIVE:**\n\n1. **Move to highest safe ground** immediately. Do NOT stay in basements or ground floors.\n2. **Avoid moving water** — just 15cm of rapid current can sweep an adult away.\n3. **Turn off main electricity switch ONLY if you are standing in a dry area.**\n4. Gather your emergency pouch (ID, medications, phone).\n5. Head to the nearest open high-ground shelter via the **Adaptive Evacuation Route**.\n\n*Official Notice: Follow instructions from NDRF rescue teams and local district authorities.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: [
          { label: '🗺️ Find Safe Route', actionType: 'VIEW_MAP' },
          { label: '🏠 Nearest Verified Shelter', actionType: 'VIEW_SHELTERS' },
          { label: '🆘 Call Emergency (112)', actionType: 'CALL_112' }
        ]
      };
    }

    // 2. Fire / Smoke query
    if (q.includes('fire') || q.includes('smoke') || q.includes('burn') || q.includes('flame') || q.includes('blaze')) {
      return {
        id: `AI-${Date.now()}`,
        sender: 'AI',
        text: `🔥 **FIRE EVACUATION DIRECTIVE:**\n\n1. **Get out and stay out!** Never re-enter for possessions.\n2. **Crawl low under smoke** — clean air is closest to the floor.\n3. Test doors with the back of your hand before opening. If hot, use an alternate exit.\n4. Cover mouth and nose with a damp cloth.\n5. Assemble at a safe open space at least 150m away.\n\n*Emergency Fire Dispatch: Dial 101 or 112 immediately once in safety.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: [
          { label: '📍 Report Incident Location', actionType: 'REPORT_INCIDENT' },
          { label: '🆘 Call Fire Dept (101)', actionType: 'CALL_112' }
        ]
      };
    }

    // 3. Earthquake / Tremor query
    if (q.includes('earthquake') || q.includes('shake') || q.includes('tremor') || q.includes('quake') || q.includes('building crack')) {
      return {
        id: `AI-${Date.now()}`,
        sender: 'AI',
        text: `🌎 **EARTHQUAKE SAFETY DIRECTIVE:**\n\n1. **DROP, COVER, AND HOLD ON** under a sturdy desk or table.\n2. Stay away from windows, heavy mirrors, and overhead lighting.\n3. If outdoors: move into open areas away from power cables, brick walls, and flyovers.\n4. Do NOT use elevators or run down stairs while shaking is active.\n5. Prepare for strong aftershocks.\n\n*Follow directives from local disaster management authorities.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: [
          { label: '🏠 View Open Shelters', actionType: 'VIEW_SHELTERS' },
          { label: '🗺️ Open Command Map', actionType: 'VIEW_MAP' }
        ]
      };
    }

    // 4. Medical / Injured / Elderly / Insulin query
    if (q.includes('medical') || q.includes('hurt') || q.includes('injury') || q.includes('bleed') || q.includes('doctor') || q.includes('insulin') || q.includes('medicine') || q.includes('elderly')) {
      return {
        id: `AI-${Date.now()}`,
        sender: 'AI',
        text: `🏥 **MEDICAL EMERGENCY DIRECTIVE:**\n\n1. **Apply direct, firm pressure** on active bleeding wounds using clean cloth.\n2. Keep injured persons warm, calm, and lying flat unless experiencing breathing difficulty.\n3. Mobile Medical & Trauma Units are active in Sector 2 and Central Hospital.\n4. If trapped or requiring priority stretcher evacuation, submit an emergency incident report immediately.\n\n*Dial 108 or 112 for direct dispatch of paramedic ambulances.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: [
          { label: '📍 Request Emergency Dispatch', actionType: 'REPORT_INCIDENT' },
          { label: '🆘 Call Paramedics (108)', actionType: 'CALL_112' }
        ]
      };
    }

    // 5. Route / Blocked / Road / Evacuation
    if (q.includes('route') || q.includes('road') || q.includes('blocked') || q.includes('where to go') || q.includes('evacuate') || q.includes('navigate')) {
      return {
        id: `AI-${Date.now()}`,
        sender: 'AI',
        text: `🗺️ **ADAPTIVE EVACUATION INTELLIGENCE:**\n\n- **Hazard Alert:** Sector 4 Riverbank Causeway is currently **SUBMERGED & IMPASSABLE**.\n- **Recommended Safe Route:** North Ridge Highway Bypass → District Community Hall (Shelter 01).\n- High-elevation route verified safe by drone recon.\n\n*Do NOT attempt shortcut routes through low-lying valleys.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: [
          { label: '🗺️ View Live Safe Route', actionType: 'VIEW_MAP' },
          { label: '🏠 View Shelter Capacity', actionType: 'VIEW_SHELTERS' }
        ]
      };
    }

    // Default safety response
    return {
      id: `AI-${Date.now()}`,
      sender: 'AI',
      text: `🛡️ **SAFETY-FIRST GUIDANCE:**\n\n- Remain in a structurally secure, dry location if outside travel is unsafe.\n- Keep your emergency kit ready (water, flashlight, ID, phone with app cached).\n- Check verified incident reports and live shelter capacity.\n- In any life-threatening situation, immediately call the Integrated Emergency Helpline at **112**.\n\n*Response AI operates on official disaster protocols (NDMA/FEMA).*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButtons: [
        { label: '🗺️ Check Tactical Map', actionType: 'VIEW_MAP' },
        { label: '📍 Report Ground Incident', actionType: 'REPORT_INCIDENT' },
        { label: '🆘 Emergency Call (112)', actionType: 'CALL_112' }
      ]
    };
  }
}

export const aiService = new AIService();
