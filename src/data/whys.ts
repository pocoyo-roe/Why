export type Category = 'Nature' | 'Body' | 'Space' | 'Everyday' | 'Culture';

export const CATEGORIES: Category[] = ['Nature', 'Body', 'Space', 'Everyday', 'Culture'];

export type Why = {
  id: string;
  category: Category;
  question: string;
  /** One or two sentences: the answer at a glance. */
  short: string;
  /** Paragraphs separated by blank lines. */
  explanation: string;
  /** Science hasn't fully settled this one. */
  unsettled?: boolean;
  related?: string[];
};

export const WHYS: Why[] = [
  // Nature
  {
    id: 'sky-blue',
    category: 'Nature',
    question: 'Why is the sky blue?',
    short:
      'Air molecules scatter short, blue wavelengths of sunlight much more strongly than long, red ones, so blue light reaches your eyes from every direction.',
    explanation:
      'Sunlight contains every colour. As it passes through the atmosphere, it bumps into nitrogen and oxygen molecules that are far smaller than the wavelength of light. This is called Rayleigh scattering, and its strength rises steeply as wavelength falls: blue light is scattered several times more than red.\n\nThat scattered blue light bounces around the sky and comes at you from all directions, so the whole sky glows blue.\n\nWhy not violet, which has an even shorter wavelength? Sunlight contains less violet to begin with, some is absorbed high in the atmosphere, and our eyes are much less sensitive to it.',
    related: ['sunset-red', 'stars-twinkle'],
  },
  {
    id: 'sunset-red',
    category: 'Nature',
    question: 'Why are sunsets red and orange?',
    short:
      'At sunset, light crosses far more atmosphere to reach you. Most of the blue is scattered away en route, leaving reds and oranges.',
    explanation:
      'When the Sun is low, its light skims through the atmosphere at a shallow angle and travels through many times more air than it does at noon.\n\nAlong that long path, the short blue wavelengths are scattered out sideways (the same Rayleigh scattering that makes the daytime sky blue). What survives the journey straight to your eyes is mostly the longer wavelengths: yellow, orange and red.\n\nDust, smoke and other particles in the air can make sunsets even more vivid.',
    related: ['sky-blue'],
  },
  {
    id: 'leaves-change',
    category: 'Nature',
    question: 'Why do leaves change colour in autumn?',
    short:
      'As days shorten, trees stop making green chlorophyll. That reveals yellow and orange pigments that were there all along, and some trees make new red ones.',
    explanation:
      'All summer, leaves are packed with chlorophyll, the green pigment that captures sunlight. It breaks down constantly and the tree keeps replacing it.\n\nAs nights lengthen and temperatures fall, deciduous trees prepare to drop their leaves and stop making chlorophyll. The green fades, unmasking carotenoids, yellow and orange pigments that were present all along.\n\nReds and purples are different: they come from anthocyanins, which many trees actively produce in autumn. Sunny days and cool nights tend to make them brighter.',
  },
  {
    id: 'ocean-salty',
    category: 'Nature',
    question: 'Why is the ocean salty?',
    short:
      'Rivers carry dissolved minerals from rocks into the sea. When seawater evaporates, the water leaves but the salt stays behind.',
    explanation:
      "Rain is slightly acidic because it dissolves a little carbon dioxide from the air. Over time it weathers rocks on land, freeing ions such as sodium, calcium and magnesium, which rivers carry to the ocean.\n\nHydrothermal vents on the seafloor add more dissolved minerals, including chloride.\n\nThe Sun evaporates water from the ocean surface, but the salts can't evaporate with it. Over hundreds of millions of years they have built up to about 3.5% of seawater by weight. River water tastes fresh because it is constantly being replaced and never gets the chance to concentrate.",
  },
  {
    id: 'thunder',
    category: 'Nature',
    question: 'Why do we see lightning before we hear thunder?',
    short:
      'Light travels about a million times faster than sound. Every 3 seconds between the flash and the boom is roughly 1 km of distance.',
    explanation:
      'Thunder is the sound of lightning itself. A bolt heats the air around it to roughly 30,000 °C in a split second. That air expands explosively, sending out a shock wave that we hear as thunder.\n\nThe flash and the bang happen at the same moment, but light travels at about 300,000 km per second while sound only covers about 343 metres per second.\n\nCount the seconds between flash and thunder: divide by 3 for kilometres, or by 5 for miles.',
  },

  // Body
  {
    id: 'yawn',
    category: 'Body',
    question: 'Why do we yawn?',
    short:
      'Nobody knows for sure. Leading ideas are that yawning helps cool the brain or helps the brain switch between states, like sleepy and alert.',
    explanation:
      "The popular idea that we yawn to get more oxygen hasn't held up: breathing extra oxygen doesn't reduce yawning.\n\nOne hypothesis is brain cooling. A deep yawn draws in air and increases blood flow, which may help regulate brain temperature. Another is that yawning marks transitions between states, such as waking up, getting drowsy or getting bored.\n\nYawns are also contagious, especially among people who are close to each other. That suggests a social role, though exactly what it is remains open.",
    unsettled: true,
    related: ['sleep'],
  },
  {
    id: 'hiccups',
    category: 'Body',
    question: 'Why do we hiccup?',
    short:
      'Your diaphragm suddenly spasms, pulling in air, and your vocal cords snap shut a split second later, making the "hic". Why we evolved to do this is unclear.',
    explanation:
      'A hiccup is an involuntary contraction of the diaphragm, the muscle under your lungs. Air rushes in, and the glottis (the opening between your vocal cords) slams shut, producing the sound.\n\nCommon triggers include eating quickly, fizzy drinks, alcohol and sudden excitement, all of which can irritate the nerves that control the diaphragm.\n\nWhy hiccups exist at all is debated. One idea is that they are a leftover reflex from our evolutionary past. Another is that they help infants clear air from the stomach while nursing.',
    unsettled: true,
  },
  {
    id: 'goosebumps',
    category: 'Body',
    question: 'Why do we get goosebumps?',
    short:
      "Tiny muscles at the base of each hair contract when you're cold or emotional. In furrier ancestors, this fluffed up fur for warmth or to look bigger.",
    explanation:
      'Each hair follicle has a small muscle called the arrector pili. Your sympathetic nervous system, which also runs the fight-or-flight response, makes these muscles contract and the hairs stand up, pulling the skin into bumps.\n\nIn animals with thick fur, raised hair traps a layer of warm air, and it makes them look larger to a threat (think of a startled cat).\n\nHumans have too little body hair for either to help much, but the reflex remains. It can be triggered by cold, fear, or even a moving piece of music.',
  },
  {
    id: 'wrinkly-fingers',
    category: 'Body',
    question: 'Why do fingers wrinkle in the bath?',
    short:
      "It isn't just skin soaking up water: your nervous system actively shrinks blood vessels in your fingertips. One idea is that it improves grip on wet things.",
    explanation:
      "For a long time, people assumed wrinkly fingers were skin swelling as it absorbed water. But fingers whose nerves have been damaged don't wrinkle, which shows it's an active response controlled by the nervous system.\n\nWhen your hands soak, blood vessels under the fingertips constrict. The loss of volume pulls the skin into wrinkles.\n\nWhy? A popular hypothesis is that the wrinkles work like tyre treads, channelling water away for better grip on wet objects. Some experiments support this and others don't, so the question isn't settled.",
    unsettled: true,
  },
  {
    id: 'sleep',
    category: 'Body',
    question: 'Why do we need sleep?',
    short:
      'Sleep lets the brain store memories and clear out waste, and lets the body repair itself. Scientists are still working out the full picture.',
    explanation:
      "Every animal studied so far sleeps in some form, which suggests it does something essential.\n\nDuring sleep, the brain replays and strengthens new memories, moving them into longer-term storage. Fluid also flows more freely through brain tissue, helping to flush out metabolic waste that builds up while you're awake.\n\nThe body uses sleep for growth and repair, and to regulate hormones that control appetite and immunity. Even so, why sleep requires us to become unconscious, rather than simply resting, is still an open question.",
    unsettled: true,
    related: ['yawn'],
  },
  {
    id: 'brain-freeze',
    category: 'Body',
    question: 'Why does ice cream give you brain freeze?',
    short:
      'Cold on the roof of your mouth makes nearby blood vessels rapidly constrict and then widen. Nerves there report the pain as if it came from your forehead.',
    explanation:
      'The roof of your mouth is rich in blood vessels and nerve endings. When something very cold touches it, the vessels quickly narrow and then widen again to warm the area.\n\nThat sudden change is picked up by the trigeminal nerve, which also serves your forehead. Your brain misreads where the signal came from, so you feel the pain behind your eyes. This is called referred pain.\n\nTo stop it faster, press your tongue against the roof of your mouth to warm it up.',
  },

  // Space
  {
    id: 'moon-face',
    category: 'Space',
    question: 'Why do we always see the same side of the Moon?',
    short:
      'The Moon is tidally locked: it spins exactly once for every trip around Earth, so the same face always points at us.',
    explanation:
      "Long ago, the Moon spun faster. Earth's gravity stretched it slightly, raising bulges in its rock. As the Moon rotated, Earth kept tugging on those bulges, and the friction gradually slowed its spin.\n\nEventually, the Moon's rotation slowed until it matched its orbit: both take about 27.3 days. From then on, the same hemisphere has always faced Earth.\n\nTidal locking is common. Most large moons in the solar system are locked to their planets.",
    related: ['planets-round'],
  },
  {
    id: 'planets-round',
    category: 'Space',
    question: 'Why are planets round?',
    short:
      'When an object is big enough, its own gravity pulls everything toward its centre equally from all sides, squeezing it into a sphere.',
    explanation:
      "Gravity pulls every bit of matter toward the centre of mass. A sphere is the shape where every point on the surface is as close to the centre as possible, the lowest-energy arrangement.\n\nSmall asteroids don't have enough gravity to overcome the strength of their rock, so they stay lumpy. Above a few hundred kilometres across (depending on what it's made of), gravity wins and the object rounds itself out.\n\nPlanets aren't perfect spheres, though. Their spin makes them bulge slightly at the equator.",
    related: ['moon-face'],
  },
  {
    id: 'stars-twinkle',
    category: 'Space',
    question: 'Why do stars twinkle?',
    short:
      'Turbulent air bends starlight back and forth. Stars are so far away that they look like single points, so the wobble is obvious. Planets twinkle much less.',
    explanation:
      "The atmosphere is made of moving pockets of air at different temperatures, and each bends light slightly differently. As starlight passes through, its path keeps shifting, making the star appear to flicker in brightness and colour.\n\nStars are so distant that, even through a telescope, they are effectively points of light, so the whole image jumps around.\n\nPlanets are much closer and appear as tiny discs. Light from different parts of the disc wobbles in different ways and averages out, so planets usually shine steadily. That's a handy way to spot them.",
    related: ['sky-blue', 'dark-night'],
  },
  {
    id: 'dark-night',
    category: 'Space',
    question: 'Why is the night sky dark if there are so many stars?',
    short:
      "The universe has a finite age, so light from most distant stars hasn't reached us yet, and the expansion of space stretches older light out of the visible range.",
    explanation:
      "If the universe were infinite, unchanging and eternal, every line of sight would eventually end on a star, and the night sky would blaze as bright as the Sun. This puzzle is known as Olbers' paradox.\n\nThe resolution is that the universe is about 13.8 billion years old. We can only see light that has had time to reach us, so there's a limit to how many stars fill the sky.\n\nOn top of that, as space expands, light from distant galaxies is stretched to longer wavelengths (redshifted), pushing much of it out of the range our eyes can see.",
    related: ['stars-twinkle'],
  },
  {
    id: 'seasons',
    category: 'Space',
    question: 'Why do we have seasons?',
    short:
      "Earth's axis is tilted by about 23.4°. As we orbit the Sun, each hemisphere takes turns leaning toward it, getting more direct sunlight and longer days.",
    explanation:
      "A common myth is that summer comes when Earth is closer to the Sun. In fact, Earth is closest to the Sun in early January, during winter in the Northern Hemisphere.\n\nThe real cause is the tilt. When your hemisphere leans toward the Sun, sunlight arrives more steeply, concentrating its energy on a smaller area, and days are longer. Six months later, it leans away: sunlight is lower and more spread out, and nights are longer.\n\nThat's also why the seasons are reversed between the Northern and Southern hemispheres.",
  },

  // Everyday
  {
    id: 'onions',
    category: 'Everyday',
    question: 'Why do onions make you cry?',
    short:
      'Cutting an onion triggers a chemical reaction that releases an irritating gas. When it reaches your eyes, they make tears to wash it away.',
    explanation:
      'Onion cells store sulfur compounds and enzymes in separate compartments. Slicing breaks the cells open and mixes them.\n\nThe reaction produces a volatile chemical called syn-propanethial-S-oxide. It drifts up, reaches your eyes and stimulates nerves that trigger tear production.\n\nTips: chill the onion first (cold slows the reaction), use a sharp knife (which crushes fewer cells), and cut near a fan or vent.',
  },
  {
    id: 'ice-floats',
    category: 'Everyday',
    question: 'Why does ice float?',
    short:
      "Water expands by about 9% when it freezes, making ice less dense than liquid water. That's unusual: most substances shrink when they solidify.",
    explanation:
      'Water molecules attract each other through hydrogen bonds. In liquid water these bonds constantly break and re-form, letting molecules pack closely together.\n\nWhen water freezes, the bonds lock the molecules into an open, hexagonal crystal with lots of empty space. The same mass takes up more room, so ice is less dense and floats.\n\nThis matters for life: lakes freeze from the top down, and the ice layer insulates the water below, so fish can survive winter.',
  },
  {
    id: 'popcorn',
    category: 'Everyday',
    question: 'Why does popcorn pop?',
    short:
      'Each kernel holds a little water. When heated, the water turns to steam, and pressure builds inside the tough hull until it bursts.',
    explanation:
      'A popcorn kernel is a small store of starch with about 14% water, sealed inside a hard, nearly waterproof hull.\n\nAs the kernel heats up, the water turns to steam and the starch softens into a hot gel. Pressure climbs until, at about 180 °C, the hull ruptures.\n\nThe sudden drop in pressure makes the steam expand rapidly, puffing the starch into the fluffy foam you eat. It sets almost instantly as it cools.',
  },
  {
    id: 'mirrors',
    category: 'Everyday',
    question: 'Why do mirrors flip left and right, but not up and down?',
    short:
      "They don't actually flip left and right. A mirror reverses front and back; we just describe it as a left-right swap.",
    explanation:
      'Raise your right hand in front of a mirror. The hand in the reflection is directly opposite your right hand, on the same side. Your head is still at the top, and your feet are still at the bottom.\n\nWhat the mirror reverses is depth: your reflection faces back toward you, as if you had been turned inside out along the front-to-back axis.\n\nWe call it a left-right flip because we imagine walking around to stand where the reflection is. To face us, we would turn around a vertical axis, which would swap our left and right.',
    related: ['bent-straw'],
  },
  {
    id: 'bent-straw',
    category: 'Everyday',
    question: 'Why does a straw look bent in a glass of water?',
    short:
      'Light changes speed when it passes from water into air, and that bends its path. Your brain assumes light travels in straight lines, so the straw looks broken.',
    explanation:
      'Light travels about 25% slower in water than in air. When it crosses the boundary at an angle, that change in speed bends it. This is called refraction.\n\nLight from the underwater part of the straw bends as it leaves the water on its way to your eyes. Your brain traces the light straight back and places the straw somewhere slightly different from where it really is.\n\nThe same effect makes pools look shallower than they are.',
    related: ['mirrors'],
  },
  {
    id: 'coffee-ring',
    category: 'Everyday',
    question: 'Why does spilled coffee dry in a ring?',
    short:
      'The edge of a drop evaporates fastest. Liquid flows outward to replace it, carrying coffee particles to the rim, where they pile up.',
    explanation:
      'When a drop of coffee lands, its edge sticks to the surface and stays put. Evaporation is fastest at that thin edge.\n\nTo replace the lost liquid, the drop sets up a gentle flow from the centre to the edge. That flow sweeps tiny coffee particles outward, depositing them in a dark ring.\n\nThis "coffee ring effect" matters beyond kitchen tables: engineers working on inkjet printing and medical tests have to design around it.',
  },

  // Culture
  {
    id: 'seven-days',
    category: 'Culture',
    question: 'Why are there seven days in a week?',
    short:
      'It traces back to ancient Babylon, and possibly to the seven "wandering stars" visible to the naked eye and the Moon\'s roughly week-long phases.',
    explanation:
      'The Moon goes from new to full and back in about 29.5 days, and each phase lasts roughly seven days. The ancient Babylonians observed seven bright moving objects in the sky: the Sun, the Moon, Mercury, Venus, Mars, Jupiter and Saturn. Both may have made seven a natural number to organise time around.\n\nThe seven-day week spread through Jewish tradition and was later adopted across the Roman world.\n\nEnglish day names keep the trail: Sunday (Sun), Monday (Moon) and Saturday (Saturn), plus Norse gods for the rest: Tiw, Woden, Thor and Frigg.',
  },
  {
    id: 'qwerty',
    category: 'Culture',
    question: 'Why are keyboards laid out QWERTY?',
    short:
      'The layout comes from 1870s typewriters. It was arranged partly to keep the mechanism from jamming, and it stuck because everyone learned it.',
    explanation:
      "Christopher Latham Sholes and his collaborators developed the layout for their typewriter in the 1870s. A popular explanation is that it separated frequently paired letters so that the metal type bars wouldn't collide and jam. Historians note other influences too, such as feedback from telegraph operators.\n\nWhen the Remington company mass-produced the machine, QWERTY spread with it. Typists trained on it, so new machines kept it.\n\nAlternatives like Dvorak exist, but switching costs are high. QWERTY is a classic example of a standard that persists because everyone already uses it.",
  },
  {
    id: 'clockwise',
    category: 'Culture',
    question: 'Why do clocks go clockwise?',
    short:
      "Clocks copied sundials. In the Northern Hemisphere, a sundial's shadow sweeps around in the direction we now call clockwise.",
    explanation:
      'In the Northern Hemisphere, the Sun rises in the east, moves across the southern sky and sets in the west. The shadow cast by a sundial\'s pointer moves around the dial from left to right across the top.\n\nThe first mechanical clocks were invented in Europe, in the Northern Hemisphere, and their makers copied the motion people already knew from sundials.\n\nHad clocks been invented south of the equator, "clockwise" might well have meant the other direction.',
  },
];

export const WHYS_BY_ID: Record<string, Why> = Object.fromEntries(WHYS.map((w) => [w.id, w]));

/** Same pick for everyone on a given calendar day. */
export function whyOfTheDay(date = new Date()): Why {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return WHYS[dayNumber % WHYS.length];
}

const STOP_WORDS = new Set(
  'why do does did is are was were the a an of in on to and or for we you i it my our your that this with when what how so be can at by from as their they them just'.split(
    ' ',
  ),
);

function keywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

export function searchWhys(query: string): Why[] {
  const q = query.trim().toLowerCase();
  if (!q) return WHYS;
  return WHYS.filter((w) =>
    [w.question, w.short, w.explanation, w.category].some((field) => field.toLowerCase().includes(q)),
  );
}

/** Library entries that share keywords with a free-text question, best matches first. */
export function findRelated(question: string, limit = 3): Why[] {
  const words = keywords(question);
  if (words.length === 0) return [];
  return WHYS.map((w) => {
    const haystack = `${w.question} ${w.short}`.toLowerCase();
    // Trim word endings so plurals and verb forms still match ("stars" → "star", "oceans" → "ocean").
    const score = words.filter((word) => haystack.includes(word.slice(0, Math.max(4, word.length - 2)))).length;
    return { w, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ w }) => w);
}
