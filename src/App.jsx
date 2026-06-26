import React, { useMemo, useState } from "react";
import {
  Clipboard,
  Copy,
  Dices,
  Download,
  RotateCcw,
  Sparkles,
  Wand2,
} from "lucide-react";

const INITIAL_SELECTION = {
  preset: "editorial",
  gender: "female",
  age: "20s",
  region: "korean",
  build: "slim",
  hair: "sleek_long",
  makeup: "natural_glow",
  expression: "confident_gaze",
  pose: "three_quarter",
  setting: "studio_seamless",
  lighting: "studio_soft",
  camera: "mf_editorial",
  palette: "muted",
  mood: "elegant",
  season: "all_season",
  material: "mixed_fabric",
  outputUse: "editorial",
};

const PRESETS = [
  {
    id: "editorial",
    ko: "에디토리얼 / 하이패션",
    en: "High-fashion editorial",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "studio_seamless",
      lighting: "studio_soft",
      pose: "three_quarter",
      palette: "muted",
      mood: "elegant",
      camera: "mf_editorial",
      makeup: "sculpted",
    },
  },
  {
    id: "streetwear",
    ko: "스트리트웨어 / 어반",
    en: "Streetwear urban",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "urban_street",
      lighting: "daylight",
      pose: "walking",
      palette: "bold_sat",
      mood: "edgy",
      camera: "35mm",
      outputUse: "social",
    },
  },
  {
    id: "couture",
    ko: "오트쿠튀르 / 런웨이",
    en: "Haute couture runway",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "runway",
      lighting: "dramatic_side",
      pose: "runway",
      palette: "mono_bw",
      mood: "confident",
      camera: "85mm",
    },
  },
  {
    id: "minimal",
    ko: "미니멀 / 클린 스튜디오",
    en: "Minimalist studio",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "studio_seamless",
      lighting: "high_key",
      pose: "full_standing",
      palette: "neutral_earth",
      mood: "elegant",
      camera: "50mm",
    },
  },
  {
    id: "vintage",
    ko: "빈티지 / 레트로",
    en: "Vintage retro film",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "interior_min",
      lighting: "golden",
      pose: "seated",
      palette: "warm",
      mood: "dreamy",
      camera: "film35",
    },
  },
  {
    id: "kfashion",
    ko: "K-패션 / 모던 코리안",
    en: "Modern Korean K-fashion",
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "cafe",
      lighting: "daylight",
      pose: "three_quarter",
      palette: "pastel",
      mood: "relaxed",
      camera: "50mm",
      makeup: "natural_glow",
    },
  },
  {
    id: "athleisure",
    ko: "애슬레저 / 액티브웨어",
    en: "Athleisure activewear",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "rooftop",
      lighting: "daylight",
      pose: "dynamic",
      palette: "cool",
      mood: "dynamic",
      camera: "35mm",
      material: "technical",
    },
  },
  {
    id: "avantgarde",
    ko: "아방가르드 / 컨셉추얼",
    en: "Avant-garde conceptual",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "industrial",
      lighting: "neon",
      pose: "dynamic",
      palette: "bold_sat",
      mood: "edgy",
      camera: "85mm",
      makeup: "graphic",
    },
  },
  {
    id: "boho",
    ko: "보헤미안 / 내추럴",
    en: "Bohemian natural",
    image:
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "nature",
      lighting: "golden",
      pose: "walking",
      palette: "warm",
      mood: "dreamy",
      camera: "50mm",
      material: "linen",
    },
  },
  {
    id: "business",
    ko: "비즈니스 / 포멀",
    en: "Business formal",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "interior_min",
      lighting: "studio_soft",
      pose: "full_standing",
      palette: "neutral_earth",
      mood: "confident",
      camera: "85mm",
    },
  },
  {
    id: "old_money",
    ko: "올드머니 / 클래식 럭셔리",
    en: "Old money quiet luxury",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "heritage_hotel",
      lighting: "soft_window",
      pose: "seated",
      palette: "neutral_earth",
      mood: "elegant",
      camera: "85mm",
      material: "cashmere",
    },
  },
  {
    id: "y2k",
    ko: "Y2K / 2000년대",
    en: "Y2K pop fashion",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "urban_night",
      lighting: "flash",
      pose: "dynamic",
      palette: "candy",
      mood: "playful",
      camera: "35mm",
      makeup: "glossy",
    },
  },
  {
    id: "techwear",
    ko: "테크웨어 / 사이버 스트릿",
    en: "Technical cyber streetwear",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "industrial",
      lighting: "neon",
      pose: "walking",
      palette: "cool",
      mood: "edgy",
      camera: "35mm",
      material: "technical",
    },
  },
  {
    id: "balletcore",
    ko: "발레코어 / 로맨틱",
    en: "Romantic balletcore",
    image:
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "studio_seamless",
      lighting: "high_key",
      pose: "delicate_motion",
      palette: "pastel",
      mood: "dreamy",
      camera: "50mm",
      material: "tulle",
    },
  },
  {
    id: "gorpcore",
    ko: "고프코어 / 아웃도어",
    en: "Gorpcore outdoor utility",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "mountain",
      lighting: "overcast",
      pose: "walking",
      palette: "earth_green",
      mood: "dynamic",
      camera: "35mm",
      material: "technical",
    },
  },
  {
    id: "genderless",
    ko: "젠더리스 / 모던 실루엣",
    en: "Genderless modern silhouette",
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
    d: {
      gender: "androgynous",
      setting: "gallery",
      lighting: "studio_soft",
      pose: "full_standing",
      palette: "mono_bw",
      mood: "confident",
      camera: "50mm",
    },
  },
  {
    id: "goth",
    ko: "고스 / 다크 로맨틱",
    en: "Dark romantic gothic fashion",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "interior_min",
      lighting: "low_key",
      pose: "portrait",
      palette: "deep_jewel",
      mood: "mysterious",
      camera: "85mm",
      makeup: "smoky",
    },
  },
  {
    id: "resort",
    ko: "리조트룩 / 휴양지",
    en: "Resort wear summer escape",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "coastal",
      lighting: "golden",
      pose: "walking",
      palette: "sunwashed",
      mood: "relaxed",
      camera: "50mm",
      season: "summer",
      material: "linen",
    },
  },
  {
    id: "bridal",
    ko: "웨딩 / 브라이덜",
    en: "Bridal fashion campaign",
    image:
      "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "heritage_hotel",
      lighting: "soft_window",
      pose: "three_quarter",
      palette: "ivory",
      mood: "elegant",
      camera: "85mm",
      material: "silk",
    },
  },
  {
    id: "beauty",
    ko: "뷰티 캠페인 / 화장품",
    en: "Beauty campaign close-up",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "studio_seamless",
      lighting: "beauty_light",
      pose: "portrait",
      palette: "pastel",
      mood: "elegant",
      camera: "85mm",
      makeup: "glossy",
      outputUse: "ad_campaign",
    },
  },
  {
    id: "denim",
    ko: "데님 룩북",
    en: "Denim lookbook",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "urban_street",
      lighting: "daylight",
      pose: "full_standing",
      palette: "cool",
      mood: "relaxed",
      camera: "50mm",
      material: "denim",
      outputUse: "lookbook",
    },
  },
  {
    id: "street_luxury",
    ko: "스트리트 럭셔리",
    en: "Street luxury campaign",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    d: {
      setting: "urban_night",
      lighting: "flash",
      pose: "three_quarter",
      palette: "deep_jewel",
      mood: "confident",
      camera: "35mm",
      outputUse: "ad_campaign",
    },
  },
];

const GROUPS = {
  gender: {
    label: "성별 표현",
    opts: [
      { id: "female", ko: "여성", en: "female" },
      { id: "male", ko: "남성", en: "male" },
      { id: "androgynous", ko: "앤드로지너스", en: "androgynous" },
      { id: "unspecified", ko: "미지정", en: "" },
    ],
  },
  age: {
    label: "연령대",
    opts: [
      { id: "20s", ko: "20대", en: "in their 20s" },
      { id: "30s", ko: "30대", en: "in their 30s" },
      { id: "40s", ko: "40대", en: "in their 40s" },
      { id: "50s", ko: "50대", en: "in their 50s" },
      { id: "60s", ko: "60대+", en: "in their 60s" },
    ],
  },
  region: {
    label: "외형 / 지역",
    opts: [
      { id: "korean", ko: "한국", en: "Korean" },
      { id: "east_asian", ko: "동아시아", en: "East Asian" },
      { id: "southeast", ko: "동남아시아", en: "Southeast Asian" },
      { id: "south_asian", ko: "남아시아", en: "South Asian" },
      { id: "european", ko: "유럽", en: "European" },
      { id: "african", ko: "아프리카", en: "African" },
      { id: "latin", ko: "라틴", en: "Latin American" },
      { id: "middle_east", ko: "중동", en: "Middle Eastern" },
      { id: "mixed", ko: "혼합/미지정", en: "" },
    ],
  },
  build: {
    label: "체형",
    opts: [
      { id: "slim", ko: "슬림", en: "slim" },
      { id: "athletic", ko: "애슬레틱", en: "athletic" },
      { id: "average", ko: "평균", en: "" },
      { id: "plus", ko: "플러스사이즈", en: "plus-size" },
      { id: "tall", ko: "톨/에디토리얼", en: "tall editorial-proportioned" },
    ],
  },
  hair: {
    label: "헤어",
    opts: [
      { id: "sleek_long", ko: "긴 생머리", en: "sleek long hair" },
      { id: "soft_wave", ko: "웨이브", en: "soft wavy hair" },
      { id: "bob", ko: "단발", en: "modern bob haircut" },
      { id: "short", ko: "숏컷", en: "short cropped hair" },
      { id: "slicked_back", ko: "올백", en: "slicked-back hair" },
      { id: "curly", ko: "컬리", en: "voluminous curly hair" },
    ],
  },
  makeup: {
    label: "메이크업",
    opts: [
      { id: "natural_glow", ko: "내추럴 글로우", en: "natural glowing makeup" },
      { id: "glossy", ko: "글로시", en: "glossy beauty makeup" },
      { id: "smoky", ko: "스모키", en: "smoky eye makeup" },
      { id: "red_lip", ko: "레드립", en: "classic red lip makeup" },
      { id: "graphic", ko: "그래픽", en: "graphic editorial makeup" },
      { id: "sculpted", ko: "조각 같은 컨투어", en: "sculpted contour makeup" },
    ],
  },
  expression: {
    label: "표정",
    opts: [
      { id: "confident_gaze", ko: "강렬한 시선", en: "with a confident direct gaze" },
      { id: "soft_smile", ko: "부드러운 미소", en: "with a soft subtle smile" },
      { id: "neutral", ko: "무표정", en: "with a calm neutral expression" },
      { id: "dreamy", ko: "몽환적", en: "with a dreamy distant expression" },
      { id: "playful", ko: "장난스러운", en: "with a playful expressive look" },
    ],
  },
  pose: {
    label: "포즈 / 프레이밍",
    opts: [
      { id: "full_standing", ko: "전신 스탠딩", en: "full-body standing pose" },
      { id: "three_quarter", ko: "3/4 샷", en: "three-quarter body shot" },
      { id: "portrait", ko: "클로즈업", en: "close-up beauty portrait" },
      { id: "walking", ko: "워킹 캔디드", en: "walking candidly" },
      { id: "runway", ko: "런웨이 워크", en: "walking the runway" },
      { id: "seated", ko: "착석", en: "seated pose" },
      { id: "dynamic", ko: "다이내믹 모션", en: "dynamic motion pose" },
      { id: "delicate_motion", ko: "섬세한 움직임", en: "delicate graceful motion" },
    ],
  },
  setting: {
    label: "배경 / 장소",
    opts: [
      { id: "studio_seamless", ko: "심리스 스튜디오", en: "seamless studio backdrop" },
      { id: "urban_street", ko: "어반 스트리트", en: "urban street setting" },
      { id: "runway", ko: "런웨이", en: "fashion runway" },
      { id: "nature", ko: "자연 풍경", en: "natural outdoor landscape" },
      { id: "interior_min", ko: "미니멀 실내", en: "minimal interior" },
      { id: "rooftop", ko: "루프탑", en: "city rooftop with skyline" },
      { id: "cafe", ko: "카페", en: "stylish indoor cafe" },
      { id: "industrial", ko: "인더스트리얼", en: "industrial warehouse setting" },
      { id: "heritage_hotel", ko: "클래식 호텔", en: "heritage hotel interior" },
      { id: "gallery", ko: "갤러리", en: "contemporary art gallery" },
      { id: "urban_night", ko: "도심 야간", en: "night city street" },
      { id: "mountain", ko: "산악 아웃도어", en: "mountain outdoor trail" },
      { id: "coastal", ko: "해변 리조트", en: "coastal resort setting" },
    ],
  },
  lighting: {
    label: "조명",
    opts: [
      { id: "studio_soft", ko: "소프트 스튜디오", en: "soft studio lighting" },
      { id: "daylight", ko: "자연광", en: "natural daylight" },
      { id: "golden", ko: "골든아워", en: "warm golden-hour light" },
      { id: "dramatic_side", ko: "드라마틱 사이드", en: "dramatic side lighting" },
      { id: "high_key", ko: "하이키", en: "bright high-key lighting" },
      { id: "low_key", ko: "로우키", en: "moody low-key lighting" },
      { id: "overcast", ko: "흐린날 확산광", en: "soft overcast light" },
      { id: "neon", ko: "네온/컬러", en: "colored neon lighting" },
      { id: "soft_window", ko: "창가 확산광", en: "soft window light" },
      { id: "flash", ko: "패션 플래시", en: "direct on-camera fashion flash" },
      { id: "beauty_light", ko: "뷰티 라이트", en: "flattering beauty dish lighting" },
    ],
  },
  camera: {
    label: "카메라 / 렌즈",
    opts: [
      { id: "85mm", ko: "85mm", en: "shot on 85mm lens" },
      { id: "50mm", ko: "50mm", en: "shot on 50mm lens" },
      { id: "35mm", ko: "35mm", en: "shot on 35mm lens" },
      { id: "mf_editorial", ko: "중형 포맷", en: "shot on medium-format camera" },
      { id: "film35", ko: "35mm 필름", en: "shot on 35mm film with subtle grain" },
    ],
  },
  palette: {
    label: "색감 / 팔레트",
    opts: [
      { id: "neutral_earth", ko: "뉴트럴/어스톤", en: "neutral earth-tone" },
      { id: "mono_bw", ko: "흑백 모노크롬", en: "black-and-white monochrome" },
      { id: "bold_sat", ko: "볼드 채도", en: "bold saturated" },
      { id: "pastel", ko: "파스텔", en: "soft pastel" },
      { id: "warm", ko: "웜톤", en: "warm-toned" },
      { id: "cool", ko: "쿨톤", en: "cool-toned" },
      { id: "muted", ko: "뮤트", en: "muted desaturated" },
      { id: "candy", ko: "캔디 컬러", en: "candy-colored" },
      { id: "earth_green", ko: "어스 그린", en: "earthy green and stone" },
      { id: "deep_jewel", ko: "딥 주얼톤", en: "deep jewel-tone" },
      { id: "sunwashed", ko: "선워시드", en: "sun-washed" },
      { id: "ivory", ko: "아이보리", en: "ivory and soft white" },
    ],
  },
  mood: {
    label: "무드",
    opts: [
      { id: "confident", ko: "당당함", en: "confident, powerful" },
      { id: "relaxed", ko: "편안함", en: "relaxed, candid" },
      { id: "elegant", ko: "우아함", en: "elegant, refined" },
      { id: "edgy", ko: "엣지", en: "edgy, bold" },
      { id: "dreamy", ko: "몽환적", en: "dreamy, soft" },
      { id: "dynamic", ko: "역동적", en: "dynamic, energetic" },
      { id: "playful", ko: "키치/재미", en: "playful, expressive" },
      { id: "mysterious", ko: "미스터리", en: "mysterious, cinematic" },
    ],
  },
  season: {
    label: "계절",
    opts: [
      { id: "all_season", ko: "시즌리스", en: "" },
      { id: "spring", ko: "봄", en: "spring season styling" },
      { id: "summer", ko: "여름", en: "summer season styling" },
      { id: "autumn", ko: "가을", en: "autumn season styling" },
      { id: "winter", ko: "겨울", en: "winter season styling" },
    ],
  },
  material: {
    label: "소재감",
    opts: [
      { id: "mixed_fabric", ko: "믹스 패브릭", en: "mixed premium fabrics" },
      { id: "silk", ko: "실크", en: "silk and satin textures" },
      { id: "leather", ko: "레더", en: "smooth leather textures" },
      { id: "denim", ko: "데님", en: "structured denim textures" },
      { id: "cashmere", ko: "캐시미어", en: "soft cashmere textures" },
      { id: "linen", ko: "린넨", en: "breathable linen textures" },
      { id: "technical", ko: "테크니컬", en: "technical nylon and utility fabric" },
      { id: "tulle", ko: "튤/쉬폰", en: "airy tulle and chiffon layers" },
    ],
  },
  outputUse: {
    label: "결과 용도",
    opts: [
      { id: "editorial", ko: "잡지 화보", en: "magazine editorial spread" },
      { id: "lookbook", ko: "룩북", en: "clean fashion lookbook" },
      { id: "ad_campaign", ko: "광고 캠페인", en: "premium fashion advertising campaign" },
      { id: "social", ko: "SNS 콘텐츠", en: "fashion social media campaign image" },
      { id: "ecommerce", ko: "상품 페이지", en: "e-commerce fashion product image" },
    ],
  },
};

const OUTFITS = {
  top: [
    { ko: "화이트 셔츠", en: "a crisp white shirt" },
    { ko: "실크 블라우스", en: "a silk blouse" },
    { ko: "크롭탑", en: "a fitted crop top" },
    { ko: "그래픽 티셔츠", en: "a graphic oversized t-shirt" },
    { ko: "니트 탑", en: "a textured knit top" },
  ],
  bottom: [
    { ko: "와이드 팬츠", en: "wide-leg trousers" },
    { ko: "데님 팬츠", en: "straight-leg denim jeans" },
    { ko: "슬랙스", en: "tailored wool trousers" },
    { ko: "미디 스커트", en: "a flowing midi skirt" },
    { ko: "카고 팬츠", en: "technical cargo pants" },
  ],
  outer: [
    { ko: "블레이저", en: "an oversized tailored blazer" },
    { ko: "트렌치코트", en: "a structured trench coat" },
    { ko: "레더 재킷", en: "a black leather jacket" },
    { ko: "롱코트", en: "a long wool coat" },
    { ko: "봄버 재킷", en: "a cropped bomber jacket" },
  ],
  shoes: [
    { ko: "로퍼", en: "polished loafers" },
    { ko: "스니커즈", en: "minimal sneakers" },
    { ko: "앵클부츠", en: "ankle boots" },
    { ko: "스트랩 힐", en: "strappy heels" },
    { ko: "테크 슈즈", en: "technical trail shoes" },
  ],
  accessory: [
    { ko: "선글라스", en: "slim sunglasses" },
    { ko: "미니백", en: "a sculptural mini bag" },
    { ko: "주얼리", en: "minimal silver jewelry" },
    { ko: "스카프", en: "a silk scarf" },
    { ko: "없음", en: "" },
  ],
};

const ASPECTS = ["4:5", "3:4", "2:3", "1:1", "9:16", "16:9"];
const NEGATIVE_PROMPT =
  "lowres, bad anatomy, deformed hands, extra fingers, extra limbs, blurry, watermark, text, logo, jpeg artifacts, distorted face, mutated";

const GROUP_ORDER = [
  "gender",
  "age",
  "region",
  "build",
  "hair",
  "makeup",
  "expression",
  "pose",
  "setting",
  "lighting",
  "camera",
  "palette",
  "mood",
  "season",
  "material",
  "outputUse",
];

function labelFor(group, id, key = "en") {
  return GROUPS[group].opts.find((option) => option.id === id)?.[key] || "";
}

function randomOf(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function cleanJoin(parts, separator = ", ") {
  return parts.filter(Boolean).join(separator).replace(/\s+/g, " ").trim();
}

function buildOutfitText(outfit) {
  return cleanJoin(
    [outfit.outer, outfit.top, outfit.bottom, outfit.shoes, outfit.accessory],
    ", "
  );
}

export default function App() {
  const [selection, setSelection] = useState(INITIAL_SELECTION);
  const [outfit, setOutfit] = useState({
    top: "a crisp white shirt",
    bottom: "wide-leg trousers",
    outer: "an oversized tailored blazer",
    shoes: "polished loafers",
    accessory: "minimal silver jewelry",
  });
  const [generator, setGenerator] = useState("midjourney");
  const [aspect, setAspect] = useState("4:5");
  const [stylize, setStylize] = useState(150);
  const [chaos, setChaos] = useState(8);
  const [copied, setCopied] = useState(false);

  const activePreset =
    PRESETS.find((preset) => preset.id === selection.preset) || PRESETS[0];

  const prompt = useMemo(() => {
    const subject = cleanJoin(
      [
        "a",
        labelFor("build", selection.build),
        labelFor("region", selection.region),
        labelFor("gender", selection.gender),
        "fashion model",
        labelFor("age", selection.age),
      ],
      " "
    );
    const outfitText = buildOutfitText(outfit);
    const core = cleanJoin([
      `${activePreset.en} fashion photograph for a ${labelFor(
        "outputUse",
        selection.outputUse
      )}`,
      subject,
      outfitText ? `wearing ${outfitText}` : "",
      labelFor("hair", selection.hair),
      labelFor("makeup", selection.makeup),
      labelFor("expression", selection.expression),
      labelFor("pose", selection.pose),
      labelFor("setting", selection.setting),
      labelFor("lighting", selection.lighting),
      labelFor("camera", selection.camera),
      `${labelFor("palette", selection.palette)} color palette`,
      labelFor("material", selection.material),
      labelFor("season", selection.season),
      `${labelFor("mood", selection.mood)} mood`,
      "sharp focus, refined styling, high detail, professional fashion photography",
    ]);

    if (generator === "midjourney") {
      return `${core} --ar ${aspect} --style raw --stylize ${stylize} --chaos ${chaos} --v 6`;
    }

    if (generator === "sd") {
      return cleanJoin([
        `${activePreset.en.toLowerCase()} fashion editorial`,
        subject.replace(/^a /, ""),
        outfitText.replace(/^(a |an )/, ""),
        labelFor("hair", selection.hair),
        labelFor("makeup", selection.makeup),
        labelFor("expression", selection.expression),
        labelFor("pose", selection.pose),
        labelFor("setting", selection.setting),
        labelFor("lighting", selection.lighting),
        labelFor("camera", selection.camera),
        `${labelFor("palette", selection.palette)} palette`,
        labelFor("material", selection.material),
        labelFor("mood", selection.mood),
        "highly detailed, sharp focus, 8k, professional photography",
      ]);
    }

    if (generator === "flux") {
      return `${core}. Keep the model realistic, the garment construction clear, and the composition suitable for premium fashion production.`;
    }

    return `${core}.`;
  }, [activePreset, aspect, chaos, generator, outfit, selection, stylize]);

  const koreanSummary = useMemo(() => {
    return cleanJoin(
      [
        activePreset.ko,
        labelFor("gender", selection.gender, "ko"),
        labelFor("age", selection.age, "ko"),
        labelFor("hair", selection.hair, "ko"),
        labelFor("makeup", selection.makeup, "ko"),
        labelFor("setting", selection.setting, "ko"),
        labelFor("mood", selection.mood, "ko"),
      ],
      " · "
    );
  }, [activePreset, selection]);

  const setOption = (group, id) => {
    setSelection((current) => ({ ...current, [group]: id }));
  };

  const applyPreset = (preset) => {
    setSelection((current) => ({ ...current, preset: preset.id, ...preset.d }));
  };

  const randomize = () => {
    const preset = randomOf(PRESETS);
    const randomized = GROUP_ORDER.reduce(
      (next, group) => ({
        ...next,
        [group]: randomOf(GROUPS[group].opts).id,
      }),
      { ...INITIAL_SELECTION, preset: preset.id, ...preset.d }
    );
    setSelection(randomized);
    setOutfit(
      Object.keys(OUTFITS).reduce(
        (next, category) => ({
          ...next,
          [category]: randomOf(OUTFITS[category]).en,
        }),
        {}
      )
    );
    setAspect(randomOf(ASPECTS));
    setStylize(Math.floor(Math.random() * 451) + 50);
    setChaos(Math.floor(Math.random() * 31));
  };

  const reset = () => {
    setSelection(INITIAL_SELECTION);
    setOutfit({
      top: "a crisp white shirt",
      bottom: "wide-leg trousers",
      outer: "an oversized tailored blazer",
      shoes: "polished loafers",
      accessory: "minimal silver jewelry",
    });
    setGenerator("midjourney");
    setAspect("4:5");
    setStylize(150);
    setChaos(8);
  };

  const copyPrompt = async () => {
    const text =
      generator === "sd"
        ? `${prompt}\n\nNegative prompt: ${NEGATIVE_PROMPT}`
        : prompt;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const downloadPrompt = () => {
    const content = [
      "Fashion Prompt Studio",
      "",
      koreanSummary,
      "",
      prompt,
      generator === "sd" ? `\nNegative prompt: ${NEGATIVE_PROMPT}` : "",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fashion-prompt.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI image prompt builder</p>
          <h1>Fashion Prompt Studio</h1>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" type="button" onClick={randomize} title="랜덤 조합">
            <Dices size={18} />
            <span>랜덤</span>
          </button>
          <button className="icon-button subtle" type="button" onClick={reset} title="초기화">
            <RotateCcw size={18} />
            <span>초기화</span>
          </button>
        </div>
      </header>

      <main className="workspace">
        <section className="control-panel" aria-label="패션 스타일 설정">
          <PanelHeader
            number="01"
            title="스타일 유형"
            caption="초보자는 여기만 골라도 기본 구성이 완성됩니다."
          />
          <div className="preset-grid">
            {PRESETS.map((preset, index) => (
              <button
                className={`preset-card ${
                  selection.preset === preset.id ? "is-active" : ""
                }`}
                key={preset.id}
                onClick={() => applyPreset(preset)}
                type="button"
              >
                <span
                  className="preset-image"
                  style={{ backgroundImage: `url(${preset.image})` }}
                />
                <span className="preset-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{preset.ko}</strong>
                </span>
              </button>
            ))}
          </div>

          <PanelHeader
            number="02"
            title="의상 조합"
            caption="각 부위를 선택하면 자연스러운 착장 문장으로 합쳐집니다."
          />
          <div className="outfit-grid">
            {Object.entries(OUTFITS).map(([category, options]) => (
              <OutfitPicker
                key={category}
                category={category}
                options={options}
                value={outfit[category]}
                onPick={(value) =>
                  setOutfit((current) => ({ ...current, [category]: value }))
                }
              />
            ))}
          </div>

          <PanelHeader
            number="03"
            title="모델 & 촬영 설정"
            caption="전문 용어 대신 결과에 영향을 주는 선택지만 모았습니다."
          />
          <div className="option-stack">
            {GROUP_ORDER.map((group) => (
              <OptionGroup
                key={group}
                label={GROUPS[group].label}
                options={GROUPS[group].opts}
                value={selection[group]}
                onPick={(id) => setOption(group, id)}
              />
            ))}
          </div>
        </section>

        <aside className="result-panel" aria-label="프롬프트 결과">
          <div className="result-sticky">
            <section className="preview-card">
              <div
                className="preview-visual"
                style={{ backgroundImage: `url(${activePreset.image})` }}
              >
                <span>{activePreset.ko}</span>
              </div>
              <div className="preview-copy">
                <p className="eyebrow">현재 선택</p>
                <h2>{koreanSummary}</h2>
              </div>
            </section>

            <section className="prompt-card">
              <div className="prompt-head">
                <div>
                  <p className="eyebrow">Output prompt</p>
                  <h2>{generatorLabel(generator)}</h2>
                </div>
                <Sparkles size={20} />
              </div>

              <div className="segmented">
                {[
                  ["midjourney", "Midjourney"],
                  ["natural", "DALL-E"],
                  ["sd", "Stable Diff."],
                  ["flux", "Flux"],
                ].map(([id, label]) => (
                  <button
                    className={generator === id ? "is-selected" : ""}
                    key={id}
                    onClick={() => setGenerator(id)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {generator === "midjourney" && (
                <div className="advanced-controls">
                  <ControlRow label="비율">
                    <div className="aspect-list">
                      {ASPECTS.map((item) => (
                        <button
                          className={aspect === item ? "is-selected" : ""}
                          key={item}
                          onClick={() => setAspect(item)}
                          type="button"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </ControlRow>
                  <ControlRow label={`스타일 강도 ${stylize}`}>
                    <input
                      max="500"
                      min="0"
                      onChange={(event) => setStylize(Number(event.target.value))}
                      type="range"
                      value={stylize}
                    />
                  </ControlRow>
                  <ControlRow label={`변주 ${chaos}`}>
                    <input
                      max="40"
                      min="0"
                      onChange={(event) => setChaos(Number(event.target.value))}
                      type="range"
                      value={chaos}
                    />
                  </ControlRow>
                </div>
              )}

              <textarea readOnly value={prompt} />

              {generator === "sd" && (
                <div className="negative-box">
                  <strong>Negative prompt</strong>
                  <p>{NEGATIVE_PROMPT}</p>
                </div>
              )}

              <div className="prompt-actions">
                <button className="primary-action" onClick={copyPrompt} type="button">
                  {copied ? <Clipboard size={18} /> : <Copy size={18} />}
                  <span>{copied ? "복사됨" : "프롬프트 복사"}</span>
                </button>
                <button className="secondary-action" onClick={downloadPrompt} type="button">
                  <Download size={18} />
                  <span>TXT</span>
                </button>
              </div>
            </section>

            <section className="quick-note">
              <Wand2 size={18} />
              <p>
                패션을 잘 몰라도 프리셋과 랜덤 버튼으로 시작한 뒤, 마음에 드는
                분위기만 조금씩 바꾸면 됩니다.
              </p>
            </section>
          </div>
        </aside>
      </main>
    </div>
  );
}

function generatorLabel(generator) {
  if (generator === "midjourney") return "Midjourney 형식";
  if (generator === "sd") return "Stable Diffusion 태그";
  if (generator === "flux") return "Flux 자연어";
  return "DALL-E 자연어";
}

function PanelHeader({ number, title, caption }) {
  return (
    <div className="panel-header">
      <span>{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{caption}</p>
      </div>
    </div>
  );
}

function OutfitPicker({ category, options, value, onPick }) {
  const labels = {
    top: "상의",
    bottom: "하의",
    outer: "아우터",
    shoes: "신발",
    accessory: "액세서리",
  };

  return (
    <div className="outfit-picker">
      <span>{labels[category]}</span>
      <div>
        {options.map((option) => (
          <button
            className={value === option.en ? "is-selected" : ""}
            key={option.ko}
            onClick={() => onPick(option.en)}
            type="button"
          >
            {option.ko}
          </button>
        ))}
      </div>
    </div>
  );
}

function OptionGroup({ label, options, value, onPick }) {
  return (
    <div className="option-group">
      <span>{label}</span>
      <div>
        {options.map((option) => (
          <button
            className={value === option.id ? "is-selected" : ""}
            key={option.id}
            onClick={() => onPick(option.id)}
            type="button"
          >
            {option.ko}
          </button>
        ))}
      </div>
    </div>
  );
}

function ControlRow({ label, children }) {
  return (
    <div className="control-row">
      <span>{label}</span>
      {children}
    </div>
  );
}
