import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  Download,
  FileText,
  Film,
  Megaphone,
  MonitorPlay,
  Play,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";

const STORAGE_KEY = "shortform-ad-classroom-simulator-v1";

const sessions = [
  {
    id: "topic",
    time: "0:00-1:00",
    title: "광고 주제 정하기",
    goal: "제품, 타깃, 광고 목적을 정하고 프로젝트 방향을 한 문장으로 만든다.",
    tool: "Google Pomelli, Chat 보조 설명",
    output: "광고 기획 문장, 타깃 정의, 광고 목적",
    teacherCue: "좋은 광고는 멋진 영상보다 먼저 정확한 타깃과 목적에서 시작한다는 점을 짚어주세요.",
  },
  {
    id: "message",
    time: "1:00-2:00",
    title: "콘셉트 및 메시지 만들기",
    goal: "훅, 핵심 베네핏, CTA를 조합해 숏폼 광고 메시지를 만든다.",
    tool: "Google Pomelli",
    output: "광고 콘셉트 1개, 핵심 카피 3안",
    teacherCue: "학생들이 기능을 많이 쓰기보다 하나의 베네핏으로 압축하도록 유도하세요.",
  },
  {
    id: "storyboard",
    time: "2:00-3:00",
    title: "스토리보드 설계",
    goal: "15-30초 광고를 3-5개 장면으로 나누고 장면별 역할을 정한다.",
    tool: "Google Vids",
    output: "3-5컷 스토리보드",
    teacherCue: "각 장면이 훅, 문제, 제품, 증거, 행동유도 중 어떤 역할인지 말하게 해보세요.",
  },
  {
    id: "prompt",
    time: "3:00-4:00",
    title: "AI 생성용 프롬프트 만들기",
    goal: "제품, 모델, 배경, 조명, 무드, 카메라 구도를 구조화한다.",
    tool: "Google Flow",
    output: "씬별 프롬프트 세트",
    teacherCue: "프롬프트는 문장이 아니라 촬영 지시서라는 관점으로 작성하게 해주세요.",
  },
  {
    id: "shot",
    time: "4:00-5:00",
    title: "핵심 컷 생성하기",
    goal: "대표 장면 후보를 비교하고 숏폼에 맞는 핵심 컷을 선정한다.",
    tool: "Google Flow",
    output: "핵심 장면 이미지/영상 컷",
    teacherCue: "예쁜 컷이 아니라 타깃, 브랜드 톤, 세로형 화면에 가장 맞는 컷을 고르게 하세요.",
  },
  {
    id: "edit",
    time: "5:00-6:00",
    title: "숏폼 영상 편집",
    goal: "장면 순서, 자막, 리듬, CTA를 점검해 1차 광고 영상을 만든다.",
    tool: "CapCut",
    output: "1차 숏폼 광고 영상",
    teacherCue: "전환 효과보다 첫 3초, 자막 가독성, CTA 명확성을 우선 점검하게 해주세요.",
  },
  {
    id: "portfolio",
    time: "6:00-7:00",
    title: "포트폴리오 정리 및 피드백",
    goal: "기획 의도, 타깃, AI 활용 방식, 결과물을 취업용 포트폴리오 문장으로 정리한다.",
    tool: "Google Vids, CapCut",
    output: "최종 숏폼 광고 영상, 포트폴리오 설명문",
    teacherCue: "결과물만 보여주지 말고 판단 과정과 수정 이유를 함께 발표하게 해주세요.",
  },
];

const objectives = ["인지도 상승", "구매 유도", "앱 설치", "방문 예약", "회원가입", "브랜드 이미지 강화"];
const tones = ["프리미엄", "유쾌함", "전문적", "감성적", "트렌디", "친환경", "실용적"];
const hookBank = [
  "아직도 이 문제를 혼자 해결하고 있나요?",
  "딱 3초만 보면 왜 필요한지 알 수 있어요.",
  "매일 반복되는 불편함, 이제 바꿀 시간입니다.",
  "이런 경험, 한 번쯤 있지 않았나요?",
  "작은 선택 하나가 하루의 흐름을 바꿉니다.",
];
const benefitBank = [
  "시간을 줄여준다",
  "처음 쓰는 사람도 쉽게 시작할 수 있다",
  "결과물을 더 전문적으로 보이게 한다",
  "반복 작업을 줄이고 중요한 일에 집중하게 한다",
  "일상 속 불편함을 자연스럽게 해결한다",
];
const ctaBank = ["지금 바로 시작해보세요", "무료로 체험해보세요", "오늘부터 바꿔보세요", "자세히 확인해보세요", "내 프로젝트에 적용해보세요"];
const sceneRoles = ["훅", "문제 제시", "제품 등장", "베네핏 증명", "CTA"];
const visualMoods = ["밝고 깨끗한", "도시적이고 세련된", "따뜻하고 감성적인", "빠르고 역동적인", "프리미엄하고 절제된"];
const cameraAngles = ["클로즈업", "미디엄 샷", "오버숄더", "탑뷰", "핸드헬드", "제품 매크로"];
const editChecks = ["첫 3초 훅이 명확하다", "자막이 모바일 화면에서 잘 읽힌다", "제품/브랜드가 중간 전에 등장한다", "CTA가 마지막에 보인다", "전환 효과가 과하지 않다", "음악 리듬과 컷 길이가 맞다"];

const learningGuides = {
  topic: {
    title: "광고 기획 문장의 구조",
    summary: "좋은 광고 주제는 제품, 타깃, 목적, 톤이 한 문장 안에서 분명하게 보입니다.",
    concepts: ["타깃은 넓게 잡을수록 메시지가 약해진다.", "광고 목적은 인지도, 구매, 가입, 방문처럼 행동 기준으로 정한다.", "브랜드 톤은 이후 카피, 화면, 음악 선택의 기준이 된다."],
    badExample: "학생들을 위한 AI 광고를 만든다.",
    goodExample: "취업 포트폴리오를 준비하는 대학생에게 AI 광고 제작 워크숍의 실습 가치를 알리기 위해 전문적인 톤의 숏폼 광고를 만든다.",
    checklist: ["누구에게 말하는 광고인지 보이는가?", "광고 목적이 하나로 좁혀졌는가?", "브랜드 톤이 구체적인가?"],
  },
  message: {
    title: "훅-베네핏-CTA 구조",
    summary: "숏폼 광고 메시지는 첫 3초의 훅, 하나의 핵심 베네핏, 명확한 행동유도로 압축합니다.",
    concepts: ["훅은 타깃의 문제나 욕망을 바로 건드린다.", "베네핏은 기능 목록이 아니라 사용자가 얻는 변화다.", "CTA는 학생이 영상 마지막에 무엇을 해야 하는지 알려준다."],
    badExample: "좋은 기능이 많고 편리한 서비스입니다.",
    goodExample: "15초 안에 광고 기획부터 프롬프트까지 완성하고, 바로 포트폴리오에 넣어보세요.",
    checklist: ["첫 문장이 3초 안에 이해되는가?", "베네핏이 하나로 압축됐는가?", "CTA가 구체적인 행동인가?"],
  },
  storyboard: {
    title: "3-5컷 스토리보드 원칙",
    summary: "스토리보드는 예쁜 장면 목록이 아니라 설득 순서를 장면으로 나눈 설계도입니다.",
    concepts: ["각 장면에는 훅, 문제, 제품, 증거, CTA 중 하나의 역할이 있어야 한다.", "15-30초 영상에서는 한 장면에 메시지를 하나만 담는다.", "자막은 화면 설명이 아니라 핵심 판단을 도와야 한다."],
    badExample: "멋진 장면을 여러 개 보여준다.",
    goodExample: "문제 상황을 3초 안에 보여주고, 제품 등장 뒤 사용 전후 차이를 비교한 다음 CTA로 닫는다.",
    checklist: ["장면별 역할이 겹치지 않는가?", "전체 길이가 15-30초 안에 들어오는가?", "자막만 읽어도 흐름이 이해되는가?"],
  },
  prompt: {
    title: "AI 생성 프롬프트의 구성 요소",
    summary: "프롬프트는 감으로 쓰는 문장이 아니라 모델, 제품, 배경, 조명, 무드, 카메라를 정리한 촬영 지시서입니다.",
    concepts: ["장면마다 변하지 않을 요소와 변해야 할 요소를 나눠 쓴다.", "세로형 숏폼은 vertical 9:16, close-up, readable composition처럼 화면 조건을 명시한다.", "텍스트 생성 오류를 줄이려면 no distorted text, no watermark 같은 제한을 붙인다."],
    badExample: "광고 느낌으로 예쁘게 만들어줘.",
    goodExample: "Vertical 9:16 short-form ad scene, young student creator using a laptop in a bright classroom, soft daylight, clean professional mood, medium shot, commercial style, no watermark.",
    checklist: ["제품/인물/배경이 모두 들어갔는가?", "조명과 무드가 브랜드 톤과 맞는가?", "세로형 화면 조건을 썼는가?"],
  },
  shot: {
    title: "핵심 컷 평가 기준",
    summary: "핵심 컷은 가장 예쁜 이미지가 아니라 광고 목적을 가장 잘 수행하는 장면입니다.",
    concepts: ["시선 집중도는 첫 화면에서 멈춰 보게 만드는 힘이다.", "브랜드 톤 적합도는 색, 표정, 배경, 조명이 메시지와 맞는지 보는 기준이다.", "세로형 적합도는 모바일 화면에서 제품과 자막이 잘 살아나는지 확인한다."],
    badExample: "색감이 예뻐서 A안을 고른다.",
    goodExample: "A안은 첫 3초 훅이 강하고 타깃 상황이 바로 보이므로 대표 컷으로 선택한다.",
    checklist: ["타깃이 장면을 보고 자기 상황으로 느끼는가?", "브랜드 톤이 흔들리지 않는가?", "모바일 세로 화면에서 핵심 대상이 잘 보이는가?"],
  },
  edit: {
    title: "숏폼 편집 체크 포인트",
    summary: "편집에서는 효과보다 리듬, 자막 가독성, CTA의 명확성이 우선입니다.",
    concepts: ["첫 3초 안에 문제나 혜택이 보여야 이탈을 줄일 수 있다.", "전환 효과가 많으면 메시지보다 효과가 먼저 보인다.", "자막은 모바일 밝기와 작은 화면에서도 읽혀야 한다."],
    badExample: "전환 효과를 많이 넣어 역동적으로 만든다.",
    goodExample: "첫 장면은 짧게, 제품 설명은 2-3컷으로 압축하고 마지막 2초에 CTA를 고정한다.",
    checklist: ["첫 3초가 충분히 강한가?", "자막이 배경과 겹치지 않는가?", "마지막 행동유도가 분명한가?"],
  },
  portfolio: {
    title: "포트폴리오 설명문의 역할",
    summary: "취업용 포트폴리오는 결과물만이 아니라 문제 정의, 판단 기준, AI 활용 과정을 함께 보여줘야 합니다.",
    concepts: ["기획 의도는 타깃과 광고 목적에서 출발해야 한다.", "AI 활용 방식은 어떤 도구를 왜 썼는지 설명한다.", "피드백과 수정 이유를 쓰면 결과물의 완성도가 더 설득력 있게 보인다."],
    badExample: "AI로 숏폼 광고를 만들었습니다.",
    goodExample: "타깃을 취업 포트폴리오 준비생으로 설정하고, Pomelli로 메시지 후보를 정리한 뒤 Flow와 CapCut으로 세로형 광고를 완성했습니다.",
    checklist: ["내 역할이 분명히 보이는가?", "AI 도구 사용 이유가 설명됐는가?", "수정 과정이나 배운 점이 들어갔는가?"],
  },
};

const defaultScenes = [
  {
    role: "훅",
    duration: 3,
    description: "타깃이 겪는 불편함을 빠르게 보여준다.",
    caption: "아직도 매번 처음부터 만들고 있나요?",
    narration: "반복되는 작업, 이제 줄여보세요.",
  },
  {
    role: "문제 제시",
    duration: 5,
    description: "문제가 커지는 상황을 모바일 화면에 맞게 보여준다.",
    caption: "시간은 부족하고 결과물은 아쉽다면",
    narration: "짧은 시간 안에 설득력 있는 결과물이 필요합니다.",
  },
  {
    role: "제품 등장",
    duration: 6,
    description: "제품 또는 서비스가 문제 해결 방식으로 등장한다.",
    caption: "핵심만 빠르게 정리",
    narration: "이 도구는 아이디어를 광고 구조로 바꿔줍니다.",
  },
  {
    role: "베네핏 증명",
    duration: 6,
    description: "사용 전후 차이를 비교하거나 결과물을 보여준다.",
    caption: "기획부터 프롬프트까지 한 번에",
    narration: "장면별 프롬프트와 포트폴리오 설명까지 이어집니다.",
  },
  {
    role: "CTA",
    duration: 4,
    description: "행동을 유도하는 문장과 브랜드를 명확히 보여준다.",
    caption: "지금 바로 시작해보세요",
    narration: "오늘 만든 광고를 포트폴리오로 완성하세요.",
  },
];

const initialProject = {
  product: "AI 광고 제작 워크숍",
  brand: "Shortform Lab",
  target: "취업 포트폴리오를 준비하는 대학생",
  objective: "인지도 상승",
  tone: "전문적",
  concept: "AI 도구를 활용해 기획부터 숏폼 광고 제작까지 빠르게 경험하게 하는 실습형 교육",
  selectedHook: hookBank[0],
  benefit: benefitBank[2],
  cta: ctaBank[0],
  copyOptions: [
    "15초 안에 광고 기획부터 프롬프트까지 완성하세요.",
    "AI로 만든 첫 번째 숏폼 광고, 포트폴리오가 됩니다.",
    "아이디어를 장면으로, 장면을 결과물로 바꿔보세요.",
  ],
  scenes: defaultScenes,
  promptBase: {
    model: "20대 대학생 크리에이터",
    background: "밝은 강의실과 노트북 작업 장면",
    lighting: "soft natural daylight",
    mood: "밝고 깨끗한",
    camera: "미디엄 샷",
  },
  shotScores: [
    { name: "A안", focus: "타깃 공감", brand: 4, attention: 5, vertical: 4, note: "첫 장면 훅이 강함" },
    { name: "B안", focus: "제품 이해", brand: 5, attention: 3, vertical: 5, note: "브랜드 톤이 가장 안정적" },
    { name: "C안", focus: "비주얼 임팩트", brand: 3, attention: 5, vertical: 4, note: "눈길은 가지만 설명 보완 필요" },
  ],
  editChecks: ["첫 3초 훅이 명확하다", "자막이 모바일 화면에서 잘 읽힌다", "CTA가 마지막에 보인다"],
  portfolio: {
    role: "기획, 프롬프트 작성, 영상 편집",
    aiUse: "Pomelli로 콘셉트 후보를 정리하고 Flow로 핵심 장면을 생성한 뒤 CapCut에서 숏폼 리듬에 맞게 편집",
    reflection: "타깃과 목적을 먼저 정하니 장면 선택과 자막 작성 기준이 명확해졌다.",
  },
  completed: ["topic"],
};

function App() {
  const [activeSession, setActiveSession] = useState("topic");
  const [guideOpen, setGuideOpen] = useState(false);
  const [project, setProject] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialProject;
    } catch {
      return initialProject;
    }
  });
  const [copied, setCopied] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  const currentSession = sessions.find((session) => session.id === activeSession);
  const activeSessionIndex = sessions.findIndex((session) => session.id === activeSession);
  const previousSession = sessions[activeSessionIndex - 1];
  const nextSession = sessions[activeSessionIndex + 1];
  const currentGuide = learningGuides[activeSession];
  const completedCount = project.completed.length;
  const progress = Math.round((completedCount / sessions.length) * 100);
  const totalSeconds = project.scenes.reduce((sum, scene) => sum + Number(scene.duration || 0), 0);

  const planningSentence = useMemo(() => {
    return `${project.brand}는 ${project.target}에게 ${project.product}의 가치를 알리기 위해, ${project.tone} 톤으로 ${project.objective}을 목표로 하는 15-30초 숏폼 광고를 제작한다.`;
  }, [project]);

  const scriptPreview = useMemo(() => {
    return [
      `0-3초 훅: ${project.selectedHook}`,
      `제품/서비스: ${project.product}`,
      `핵심 베네핏: ${project.benefit}`,
      `행동유도: ${project.cta}`,
    ].join("\n");
  }, [project]);

  const scenePrompts = useMemo(() => {
    return project.scenes.map((scene, index) => {
      return [
        `Scene ${index + 1}, ${scene.role}, vertical 9:16 short-form ad.`,
        `Product or brand: ${project.product} by ${project.brand}.`,
        `Main subject: ${project.promptBase.model}.`,
        `Action: ${scene.description}`,
        `Background: ${project.promptBase.background}.`,
        `Mood: ${project.promptBase.mood}, lighting: ${project.promptBase.lighting}.`,
        `Camera: ${project.promptBase.camera}.`,
        "Commercial style, clear composition, no watermark, no distorted text.",
      ].join(" ");
    });
  }, [project]);

  const bestShot = useMemo(() => {
    return [...project.shotScores].sort((a, b) => scoreShot(b) - scoreShot(a))[0];
  }, [project.shotScores]);

  const portfolioText = useMemo(() => {
    return `${project.brand} 프로젝트는 ${project.target}을 대상으로 ${project.objective}을 목표로 제작한 숏폼 광고입니다. ${project.concept}라는 콘셉트를 바탕으로, "${project.selectedHook}"라는 훅과 "${project.benefit}"라는 핵심 베네핏을 중심에 두었습니다. 저는 ${project.portfolio.role}을 담당했으며, ${project.portfolio.aiUse}했습니다. 제작 과정에서 ${project.portfolio.reflection}`;
  }, [project]);

  function updateProject(key, value) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  function updatePromptBase(key, value) {
    setProject((current) => ({ ...current, promptBase: { ...current.promptBase, [key]: value } }));
  }

  function updatePortfolio(key, value) {
    setProject((current) => ({ ...current, portfolio: { ...current.portfolio, [key]: value } }));
  }

  function updateScene(index, key, value) {
    setProject((current) => {
      const scenes = current.scenes.map((scene, sceneIndex) => (
        sceneIndex === index ? { ...scene, [key]: value } : scene
      ));
      return { ...current, scenes };
    });
  }

  function updateCopyOption(index, value) {
    setProject((current) => {
      const copyOptions = current.copyOptions.map((option, optionIndex) => (
        optionIndex === index ? value : option
      ));
      return { ...current, copyOptions };
    });
  }

  function updateShot(index, key, value) {
    setProject((current) => {
      const shotScores = current.shotScores.map((shot, shotIndex) => (
        shotIndex === index ? { ...shot, [key]: value } : shot
      ));
      return { ...current, shotScores };
    });
  }

  function toggleComplete(id) {
    setProject((current) => {
      const completed = current.completed.includes(id)
        ? current.completed.filter((item) => item !== id)
        : [...current.completed, id];
      return { ...current, completed };
    });
  }

  function toggleEditCheck(check) {
    setProject((current) => {
      const editChecks = current.editChecks.includes(check)
        ? current.editChecks.filter((item) => item !== check)
        : [...current.editChecks, check];
      return { ...current, editChecks };
    });
  }

  async function copyText(label, value) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1300);
  }

  function resetProject() {
    setProject(initialProject);
    setActiveSession("topic");
  }

  function downloadSummary() {
    const body = [
      "# 숏폼 광고 제작 수업 산출물",
      "",
      `프로젝트: ${project.brand}`,
      `제품/서비스: ${project.product}`,
      `타깃: ${project.target}`,
      `목표: ${project.objective}`,
      `톤: ${project.tone}`,
      "",
      "## 광고 기획 문장",
      planningSentence,
      "",
      "## 광고 구조",
      scriptPreview,
      "",
      "## 스토리보드",
      ...project.scenes.map((scene, index) => `${index + 1}. ${scene.role} / ${scene.duration}초 / ${scene.caption} / ${scene.description}`),
      "",
      "## 씬별 프롬프트",
      ...scenePrompts.map((prompt, index) => `${index + 1}. ${prompt}`),
      "",
      "## 포트폴리오 설명문",
      portfolioText,
    ].join("\n");
    const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.brand.replace(/\s+/g, "-")}-shortform-ad.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function renderActiveSession() {
    if (activeSession === "topic") {
      return (
        <section className="panel session-panel">
          <div className="panel-head large">
            <Target size={22} />
            <div>
              <p className="eyebrow">0:00-1:00</p>
              <h2>광고 주제 정하기</h2>
            </div>
          </div>
          <div className="field-grid">
            <label>
              제품/서비스
              <input value={project.product} onChange={(event) => updateProject("product", event.target.value)} />
            </label>
            <label>
              브랜드/프로젝트명
              <input value={project.brand} onChange={(event) => updateProject("brand", event.target.value)} />
            </label>
            <label className="wide">
              타깃 고객
              <input value={project.target} onChange={(event) => updateProject("target", event.target.value)} />
            </label>
            <label>
              광고 목적
              <select value={project.objective} onChange={(event) => updateProject("objective", event.target.value)}>
                {objectives.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              브랜드 톤
              <select value={project.tone} onChange={(event) => updateProject("tone", event.target.value)}>
                {tones.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="wide">
              콘셉트 설명
              <textarea value={project.concept} onChange={(event) => updateProject("concept", event.target.value)} />
            </label>
          </div>
          <ResultBox
            title="광고 기획 문장"
            value={planningSentence}
            copied={copied === "plan"}
            onCopy={() => copyText("plan", planningSentence)}
          />
        </section>
      );
    }

    if (activeSession === "message") {
      return (
        <section className="panel session-panel">
          <div className="panel-head large">
            <Megaphone size={22} />
            <div>
              <p className="eyebrow">1:00-2:00</p>
              <h2>콘셉트 및 메시지 만들기</h2>
            </div>
          </div>
          <div className="selector-group">
            <h3>훅 문장 선택</h3>
            <div>
              {hookBank.map((hook) => (
                <button className={project.selectedHook === hook ? "chip active" : "chip"} key={hook} onClick={() => updateProject("selectedHook", hook)} type="button">
                  {hook}
                </button>
              ))}
            </div>
          </div>
          <div className="field-grid compact">
            <label>
              핵심 베네핏
              <select value={project.benefit} onChange={(event) => updateProject("benefit", event.target.value)}>
                {benefitBank.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              CTA
              <select value={project.cta} onChange={(event) => updateProject("cta", event.target.value)}>
                {ctaBank.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="copy-options">
            {project.copyOptions.map((copy, index) => (
              <label key={index}>
                핵심 카피 {index + 1}
                <input value={copy} onChange={(event) => updateCopyOption(index, event.target.value)} />
              </label>
            ))}
          </div>
          <ResultBox
            title="훅-제품-행동유도 구조"
            value={scriptPreview}
            copied={copied === "script"}
            onCopy={() => copyText("script", scriptPreview)}
          />
        </section>
      );
    }

    if (activeSession === "storyboard") {
      return (
        <section className="panel session-panel wide-session">
          <div className="panel-head large">
            <Film size={22} />
            <div>
              <p className="eyebrow">2:00-3:00</p>
              <h2>스토리보드 설계</h2>
            </div>
          </div>
          <div className="storyboard-grid">
            {project.scenes.map((scene, index) => (
              <article className="scene-card" key={index}>
                <div className="scene-top">
                  <span>{index + 1}</span>
                  <select value={scene.role} onChange={(event) => updateScene(index, "role", event.target.value)}>
                    {sceneRoles.map((role) => <option key={role}>{role}</option>)}
                  </select>
                </div>
                <label>
                  길이(초)
                  <input min="1" type="number" value={scene.duration} onChange={(event) => updateScene(index, "duration", event.target.value)} />
                </label>
                <label>
                  장면 설명
                  <textarea value={scene.description} onChange={(event) => updateScene(index, "description", event.target.value)} />
                </label>
                <label>
                  화면 자막
                  <input value={scene.caption} onChange={(event) => updateScene(index, "caption", event.target.value)} />
                </label>
                <label>
                  내레이션
                  <input value={scene.narration} onChange={(event) => updateScene(index, "narration", event.target.value)} />
                </label>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeSession === "prompt") {
      return (
        <section className="panel session-panel wide-session">
          <div className="panel-head large">
            <Wand2 size={22} />
            <div>
              <p className="eyebrow">3:00-4:00</p>
              <h2>AI 생성용 프롬프트 만들기</h2>
            </div>
          </div>
          <div className="field-grid compact">
            <label>
              모델/인물
              <input value={project.promptBase.model} onChange={(event) => updatePromptBase("model", event.target.value)} />
            </label>
            <label>
              배경
              <input value={project.promptBase.background} onChange={(event) => updatePromptBase("background", event.target.value)} />
            </label>
            <label>
              무드
              <select value={project.promptBase.mood} onChange={(event) => updatePromptBase("mood", event.target.value)}>
                {visualMoods.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              카메라 구도
              <select value={project.promptBase.camera} onChange={(event) => updatePromptBase("camera", event.target.value)}>
                {cameraAngles.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="wide">
              조명
              <input value={project.promptBase.lighting} onChange={(event) => updatePromptBase("lighting", event.target.value)} />
            </label>
          </div>
          <div className="prompt-list">
            {scenePrompts.map((prompt, index) => (
              <ResultBox
                key={index}
                title={`씬 ${index + 1} 프롬프트`}
                value={prompt}
                copied={copied === `prompt-${index}`}
                onCopy={() => copyText(`prompt-${index}`, prompt)}
              />
            ))}
          </div>
        </section>
      );
    }

    if (activeSession === "shot") {
      return (
        <section className="panel session-panel">
          <div className="panel-head large">
            <Sparkles size={22} />
            <div>
              <p className="eyebrow">4:00-5:00</p>
              <h2>핵심 컷 생성 및 평가</h2>
            </div>
          </div>
          <div className="shot-grid">
            {project.shotScores.map((shot, index) => (
              <article className="shot-card" key={shot.name}>
                <div>
                  <strong>{shot.name}</strong>
                  <span>{scoreShot(shot)}점</span>
                </div>
                <label>
                  중점
                  <input value={shot.focus} onChange={(event) => updateShot(index, "focus", event.target.value)} />
                </label>
                <ScoreInput label="브랜드 톤" value={shot.brand} onChange={(value) => updateShot(index, "brand", value)} />
                <ScoreInput label="시선 집중" value={shot.attention} onChange={(value) => updateShot(index, "attention", value)} />
                <ScoreInput label="세로형 적합" value={shot.vertical} onChange={(value) => updateShot(index, "vertical", value)} />
                <label>
                  메모
                  <input value={shot.note} onChange={(event) => updateShot(index, "note", event.target.value)} />
                </label>
              </article>
            ))}
          </div>
          <div className="guide-box">
            <strong>추천 핵심 컷</strong>
            <p>{bestShot.name} · {bestShot.focus} · {bestShot.note}</p>
          </div>
        </section>
      );
    }

    if (activeSession === "edit") {
      return (
        <section className="panel session-panel split-session">
          <div>
            <div className="panel-head large">
              <Clipboard size={22} />
              <div>
                <p className="eyebrow">5:00-6:00</p>
                <h2>숏폼 영상 편집</h2>
              </div>
            </div>
            <div className="checklist">
              {editChecks.map((check) => (
                <button className={project.editChecks.includes(check) ? "checked" : ""} key={check} onClick={() => toggleEditCheck(check)} type="button">
                  <Check size={17} />
                  {check}
                </button>
              ))}
            </div>
          </div>
          <div className="phone-preview" aria-label="숏폼 광고 흐름 미리보기">
            <div>
              <span>{project.brand}</span>
              <strong>{project.selectedHook}</strong>
              <p>{project.copyOptions[0]}</p>
              <em>{project.cta}</em>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="panel session-panel">
        <div className="panel-head large">
          <FileText size={22} />
          <div>
            <p className="eyebrow">6:00-7:00</p>
            <h2>포트폴리오 정리 및 피드백</h2>
          </div>
        </div>
        <div className="field-grid compact">
          <label>
            담당 역할
            <input value={project.portfolio.role} onChange={(event) => updatePortfolio("role", event.target.value)} />
          </label>
          <label className="wide">
            AI 활용 방식
            <textarea value={project.portfolio.aiUse} onChange={(event) => updatePortfolio("aiUse", event.target.value)} />
          </label>
          <label className="wide">
            배운 점/수정 이유
            <textarea value={project.portfolio.reflection} onChange={(event) => updatePortfolio("reflection", event.target.value)} />
          </label>
        </div>
        <ResultBox
          title="취업 포트폴리오 설명문"
          value={portfolioText}
          copied={copied === "portfolio"}
          onCopy={() => copyText("portfolio", portfolioText)}
        />
        <div className="save-actions">
          <button onClick={downloadSummary} type="button">
            <Save size={18} />
            전체 산출물 다운로드
          </button>
        </div>
      </section>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">7시간 수업용 웹 시뮬레이터</p>
          <h1>숏폼 광고 제작을 한 시간씩 따라가는 실습 보드</h1>
          <p>한 시간에 하나의 작업만 열어 학생들이 지금 해야 할 산출물에 집중하도록 구성했습니다.</p>
          <div className="hero-actions">
            <button onClick={() => setActiveSession("topic")} type="button">
              <Play size={18} />
              0교시부터 시작
            </button>
            <button onClick={downloadSummary} type="button">
              <Download size={18} />
              산출물 저장
            </button>
          </div>
        </div>
        <div className="class-status" aria-label="수업 진행 상태">
          <strong>{progress}%</strong>
          <span>완료한 세션 {completedCount} / {sessions.length}</span>
          <div className="progress-track">
            <i style={{ width: `${progress}%` }} />
          </div>
          <p>현재 장면 길이 합계 {totalSeconds}초</p>
        </div>
      </section>

      <section className="timeline" aria-label="7시간 수업 타임라인">
        {sessions.map((session) => (
          <button
            className={activeSession === session.id ? "timeline-item active" : "timeline-item"}
            key={session.id}
            onClick={() => setActiveSession(session.id)}
            type="button"
          >
            <span>{session.time}</span>
            <strong>{session.title}</strong>
            {project.completed.includes(session.id) && <Check size={17} />}
          </button>
        ))}
      </section>

      <section className="session-brief">
        <div>
          <p className="eyebrow">{currentSession.time} · {currentSession.tool}</p>
          <h2>{currentSession.title}</h2>
          <p>{currentSession.goal}</p>
        </div>
        <button className="complete-button" onClick={() => toggleComplete(currentSession.id)} type="button">
          <Check size={18} />
          {project.completed.includes(currentSession.id) ? "완료됨" : "이 시간 완료"}
        </button>
      </section>

      <section className="workspace">
        <aside className="panel guide-panel">
          <div className="panel-head">
            <MonitorPlay size={20} />
            <h2>시간별 이동</h2>
          </div>
          <div className="mini-list">
            {sessions.map((session, index) => (
              <button className={activeSession === session.id ? "active" : ""} key={session.id} onClick={() => setActiveSession(session.id)} type="button">
                <span>{session.time}</span>
                <strong>{index + 1}. {session.title}</strong>
                {project.completed.includes(session.id) ? <Check size={16} /> : <ChevronRight size={16} />}
              </button>
            ))}
          </div>
          <button className="reset-button" onClick={resetProject} type="button">
            <RefreshCw size={17} />
            예시 데이터로 초기화
          </button>
        </aside>

        <div className="stage-column">
          {renderActiveSession()}
          <div className="step-actions">
            <button disabled={!previousSession} onClick={() => previousSession && setActiveSession(previousSession.id)} type="button">
              이전 시간
            </button>
            <button disabled={!nextSession} onClick={() => nextSession && setActiveSession(nextSession.id)} type="button">
              다음 시간
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <aside className="panel summary-panel">
          <div className="panel-head">
            <Clipboard size={20} />
            <h2>현재 산출물</h2>
          </div>
          <div className="guide-box">
            <strong>이번 시간 제출물</strong>
            <p>{currentSession.output}</p>
          </div>
          <div className="guide-box dark">
            <strong>강사용 진행 포인트</strong>
            <p>{currentSession.teacherCue}</p>
          </div>
          <div className="summary-list">
            <article>
              <span>프로젝트</span>
              <strong>{project.brand}</strong>
              <p>{project.product}</p>
            </article>
            <article>
              <span>타깃</span>
              <p>{project.target}</p>
            </article>
            <article>
              <span>장면 길이</span>
              <strong>{totalSeconds}초</strong>
            </article>
          </div>
          <button className="download-button" onClick={downloadSummary} type="button">
            <Download size={17} />
            산출물 다운로드
          </button>
        </aside>
      </section>

      <section className="learning-guide-wrap" aria-label="시간별 개념 가이드">
        <div className="learning-guide">
          <button className="guide-toggle" aria-expanded={guideOpen} onClick={() => setGuideOpen((open) => !open)} type="button">
            <div>
              <p className="eyebrow">{currentSession.time} 개념 가이드</p>
              <h2>{currentGuide.title}</h2>
              <p>{currentGuide.summary}</p>
            </div>
            <span>{guideOpen ? "접기" : "가이드 보기"}</span>
          </button>

          {guideOpen && (
            <div className="guide-content">
              <article>
                <h3>핵심 개념</h3>
                <ul>
                  {currentGuide.concepts.map((concept) => (
                    <li key={concept}>{concept}</li>
                  ))}
                </ul>
              </article>
              <article className="example-card">
                <h3>예시 비교</h3>
                <div>
                  <span>약한 예시</span>
                  <p>{currentGuide.badExample}</p>
                </div>
                <div>
                  <span>좋은 예시</span>
                  <p>{currentGuide.goodExample}</p>
                </div>
              </article>
              <article>
                <h3>학생 체크리스트</h3>
                <ul>
                  {currentGuide.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ResultBox({ title, value, copied, onCopy }) {
  return (
    <div className="result-box">
      <div>
        <strong>{title}</strong>
        <button onClick={onCopy} type="button">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <p>{value}</p>
    </div>
  );
}

function ScoreInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input min="1" max="5" type="range" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function scoreShot(shot) {
  return Number(shot.brand) + Number(shot.attention) + Number(shot.vertical);
}

export default App;
