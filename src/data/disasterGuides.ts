import { DisasterGuide } from '../types/disaster';

export const DISASTER_GUIDES: Record<string, DisasterGuide> = {
  FLOOD: {
    type: 'FLOOD',
    title: 'Flood Emergency Action Protocol',
    emoji: '🌊',
    brief: 'Flash flooding, waterlogging, or river overflow creating life risk and road cut-offs.',
    immediateActions: [
      'Immediately move to higher ground or upper floor. DO NOT wait for water to rise.',
      'Turn off main electricity breaker and gas valve ONLY if dry and safe to touch.',
      'Gather emergency go-bag: medicines, ID cards, power bank, dry food, and water.',
      'Check the nearest verified shelter on your offline map.',
      'Never drive or walk through moving floodwater (just 15cm of rushing water can knock you down).'
    ],
    whatToAvoid: [
      'DO NOT enter moving water under any circumstances.',
      'DO NOT touch submerged electrical outlets, appliances, or downed wires.',
      'DO NOT drink unboiled tap or flood water (severe contamination hazard).',
      'DO NOT walk across flooded bridges or causeways.'
    ],
    evacuationTips: [
      'Follow verified high-elevation routes shown in green on your map.',
      'Carry a whistle or flashlight to signal rescue teams.',
      'Wear sturdy closed shoes to prevent puncture wounds from underwater debris.'
    ],
    emergencyContacts: [
      { label: 'National Disaster Response Force (NDRF)', number: '1078' },
      { label: 'State Disaster Management Control', number: '1070' },
      { label: 'Emergency Ambulance / Medical', number: '108' },
      { label: 'Police Emergency', number: '112' }
    ]
  },
  FIRE: {
    type: 'FIRE',
    title: 'Fire & Wildfire Emergency Protocol',
    emoji: '🔥',
    brief: 'Structure fire, residential blaze, or approaching wildfire with smoke toxicity.',
    immediateActions: [
      'Evacuate immediately. Crawl low under smoke where the air is cleanest and cooler.',
      'Test door handles with the back of your hand before opening. If hot, use an alternate escape route.',
      'Cover your nose and mouth with a damp cloth to filter smoke and toxic gases.',
      'Once outside, stay outside! Never re-enter a burning building for belongings.',
      'Alert neighbors and call Fire Response (101 / 112) immediately from safety.'
    ],
    whatToAvoid: [
      'DO NOT use elevators during a fire; always take the stairs.',
      'DO NOT stop to collect valuable items.',
      'DO NOT open doors that feel warm to the touch.',
      'DO NOT hide in closets or under beds where rescue teams cannot locate you.'
    ],
    evacuationTips: [
      'Move upwind and downhill from wildfire smoke plumes.',
      'Close doors behind you as you exit to slow the fire spread.',
      'Head towards open fields, designated assembly areas, or public squares.'
    ],
    emergencyContacts: [
      { label: 'Fire & Rescue Services', number: '101' },
      { label: 'National Emergency Helpline', number: '112' },
      { label: 'Burn Care & Trauma Unit', number: '108' }
    ]
  },
  EARTHQUAKE: {
    type: 'EARTHQUAKE',
    title: 'Earthquake Action Protocol',
    emoji: '🌎',
    brief: 'Tectonic shaking, tremors, structural cracking, and aftershocks.',
    immediateActions: [
      'DROP to your hands and knees immediately.',
      'COVER your head and neck under a sturdy table, desk, or against an interior wall.',
      'HOLD ON to your shelter until the shaking completely stops.',
      'If outdoors, move away from buildings, streetlights, overhead power cables, and flyovers.',
      'Prepare for strong aftershocks that follow within minutes to hours.'
    ],
    whatToAvoid: [
      'DO NOT run outside during active shaking (falling glass and parapets cause 80% of injuries).',
      'DO NOT stand in doorways (modern doorways are no stronger than standard walls).',
      'DO NOT use matches, lighters, or open flames (gas pipelines may have ruptured).',
      'DO NOT use elevators.'
    ],
    evacuationTips: [
      'Check yourself and family for injuries before moving.',
      'Inspect structural walls for heavy shear cracking before exiting.',
      'Proceed carefully down stairwells, watching for displaced steps.'
    ],
    emergencyContacts: [
      { label: 'Disaster Relief Hotline', number: '1078' },
      { label: 'Police / Emergency Response', number: '112' },
      { label: 'Ambulance & Paramedics', number: '108' }
    ]
  },
  CYCLONE: {
    type: 'CYCLONE',
    title: 'Cyclone & Severe Storm Protocol',
    emoji: '🌪️',
    brief: 'Destructive gale-force winds, storm surges, flying debris, and torrential downpours.',
    immediateActions: [
      'Stay indoors in the strongest, central room of the building (away from windows).',
      'Secure loose outdoor objects (tin sheets, flower pots, solar panels, satellite dishes).',
      'Stock 72-hour supply of drinking water, ready-to-eat rations, emergency medications, and batteries.',
      'Unplug non-essential electronic appliances to protect against extreme power surges.',
      'Keep battery-powered or transistor radio tuned to official meteorological alerts.'
    ],
    whatToAvoid: [
      'DO NOT venture out when the eye of the storm passes (winds calm briefly, then reverse with extreme ferocity).',
      'DO NOT seek shelter under giant trees, billboards, or old weak structures.',
      'DO NOT drive on coastal highways or sea fronts during active storm surge warnings.'
    ],
    evacuationTips: [
      'If living in a low-lying, thatch, or tin-roof house, evacuate to a cyclone shelter well before wind speeds pick up.',
      'Lock doors and anchor storm shutters if available.'
    ],
    emergencyContacts: [
      { label: 'Cyclone Alert & Control Room', number: '1070' },
      { label: 'Coast Guard Emergency', number: '1554' },
      { label: 'Disaster Control Line', number: '1078' }
    ]
  },
  LANDSLIDE: {
    type: 'LANDSLIDE',
    title: 'Landslide & Mudflow Protocol',
    emoji: '⛰️',
    brief: 'Slope destabilization, boulder fall, debris flows, and sudden earth collapse in hilly terrain.',
    immediateActions: [
      'Listen for unusual sounds: cracking trees, rushing boulders, or sudden stream muddiness.',
      'Move quickly AWAY from the path of the landslide or mudflow toward stable, flat ridge lines.',
      'If escape is not possible, curl into a tight ball and protect your head with arms.',
      'Stay alert when driving in mountain sectors — look for collapsed pavement, mud on roads, or falling stones.'
    ],
    whatToAvoid: [
      'DO NOT stay in valley bottoms or natural drainage channels during heavy rains.',
      'DO NOT cross recently occurred landslide debris (slopes remain unstable for days).',
      'DO NOT assume a quiet slope is safe if water drainage is suddenly cut off upstream.'
    ],
    evacuationTips: [
      'Evacuate perpendicular to the direction of the slide slope, not downhill in its path.',
      'Report any newly formed ground fissures or tilting trees to local authorities immediately.'
    ],
    emergencyContacts: [
      { label: 'Hill Highway Patrol & Rescue', number: '1077' },
      { label: 'Disaster Rapid Team', number: '1078' },
      { label: 'Emergency Medical Service', number: '108' }
    ]
  },
  CHEMICAL: {
    type: 'CHEMICAL',
    title: 'Chemical & Hazmat Leak Protocol',
    emoji: '⚠️',
    brief: 'Industrial gas release, chemical spill, hazardous fume dispersion, or pipeline rupture.',
    immediateActions: [
      'Move immediately UPWIND and UP-HILL from the source of the chemical plume.',
      'Seek indoor shelter: close all windows, doors, air conditioning vents, and chimney dampers.',
      'Cover face and nose with a thick wet cloth or N95 mask.',
      'Strip contaminated clothing and wash exposed skin thoroughly with abundant clean water.',
      'Seal room perimeter using duct tape or wet towels (Shelter-in-Place).'
    ],
    whatToAvoid: [
      'DO NOT walk through spilled liquids or vapor clouds.',
      'DO NOT touch or attempt to contain hazardous cylinders or containers.',
      'DO NOT use open flames or create sparks near gas leaks.'
    ],
    evacuationTips: [
      'Check wind direction using smoke or tree leaves and travel at a 90-degree angle across the wind direction.',
      'Follow official decontamination instructions before entering relief camps.'
    ],
    emergencyContacts: [
      { label: 'Hazmat Incident Helpline', number: '1078' },
      { label: 'National Poison Information Centre', number: '1800-116-117' },
      { label: 'Fire & Hazmat Team', number: '101' }
    ]
  },
  OTHER: {
    type: 'OTHER',
    title: 'General Emergency Protocol',
    emoji: '⚠️',
    brief: 'Unforeseen structural collapse, severe flash event, or localized crisis.',
    immediateActions: [
      'Assess immediate danger and locate the safest accessible assembly area.',
      'Check for personal injuries and perform primary first aid if trained.',
      'Activate your phone location beacon or transmit your incident report via this app.',
      'Keep phone lines clear for life-critical calls; use text/app messaging for status check-ins.'
    ],
    whatToAvoid: [
      'DO NOT spread unverified rumors on social media.',
      'DO NOT obstruct arriving emergency vehicles and responders.'
    ],
    evacuationTips: [
      'Stay in groups and assist elderly, children, and persons with disabilities.',
      'Follow updates from verified command center channels.'
    ],
    emergencyContacts: [
      { label: 'Integrated Emergency Services', number: '112' },
      { label: 'Disaster Helpline', number: '1078' }
    ]
  }
};
