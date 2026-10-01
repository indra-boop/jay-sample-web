import type { Artist } from "@/types/content";

/**
 * Artist profile.
 * DATA FINAL: name (from supplied logo).
 * ASSUMPTION: role "DJ / Artist" (from project brief).
 * DATA FINAL: tagline, genres, basedIn, bio — new copy written 2026-10-01 from the sources below,
 *   confirmed correct by the project coordinator on 2026-10-01.
 *
 * Sources:
 *   [T] https://tropicsentertainment.com/djs/dj-jay-sample/  (booking agency profile, fetched 2026-10-01)
 *   [M] https://www.mixcloud.com/jay-sample/                  (Mixcloud profile, fetched 2026-10-01)
 * Genres: [T] list confirmed (Mixcloud lists Disco, Latin, Funk, Soul as well — not used).
 */
const TROPICS = "tropicsentertainment.com/djs/dj-jay-sample (2026-10-01), rewritten copy; confirmed by project coordinator 2026-10-01";

export const artist: Artist = {
  name: "Jay Sample",
  role: "DJ / Artist",
  tagline: {
    value: "Open-format DJ. South Beach roots, international bookings.",
    status: "DATA FINAL",
    source: TROPICS,
  },
  genres: {
    value: ["Top 40", "House", "Pop", "Old School", "R&B"],
    status: "DATA FINAL",
    source: TROPICS,
  },
  basedIn: {
    value: "Miami, United States",
    status: "DATA FINAL",
    source: "mixcloud.com/jay-sample profile location (2026-10-01); confirmed by project coordinator 2026-10-01",
  },
  bio: {
    value: [
      "Jay Sample has been behind the decks since 2005. He built his name in the South Beach scene, and his sets have since taken him from New York to Indonesia.",
      "He plays open format: Top 40, house, pop, old school and R&B, chosen in the moment for the room in front of him. The aim is simple. Keep the floor full from the first track to the last.",
      "For events that want more than a DJ, Jay Sample performs as a hybrid DJ and live act. The trio adds a percussionist on congas, bongos, timbales and cymbals, and a keyboard player who also plays saxophone. The line-up can grow into a larger band when the stage calls for it.",
      "Along the way he has shared the stage with names including John Travolta, Jamie Foxx, Eminem, Justin Timberlake, Lady Gaga and Britney Spears.",
    ],
    status: "DATA FINAL",
    source: TROPICS,
  },
  // portrait:  { src: "/images/about/jay-sample-portrait-1600w.jpg", width: 1600, height: 2000,
  //              alt: "Jay Sample performing …", credit: "Photo: …", status: "DATA FINAL" },
};
