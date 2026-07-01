import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  Layers3,
  Mail,
  Map,
  Plus,
  Radar,
  RefreshCw,
  Save,
  Route,
  ShieldCheck,
  Sparkles,
  UserRoundCog,
  Workflow,
  X,
} from "lucide-react";

const scenarios = [
  {
    id: "meeting",
    work: "회의록 정리",
    why: "반복적이고 형식이 일정하며, 사람이 최종 확인하면 바로 업무에 쓸 수 있습니다.",
    sourceMaterials: ["회의 녹취 또는 회의 메모", "기존 회의록 양식", "참석자 명단", "지난 회의 실행계획"],
    role: "너는 회의 내용을 실행계획 중심으로 정리하는 AI다.",
    outputFormat: ["회의 요약", "주요 결정사항", "논의된 쟁점", "실행계획", "담당자", "기한", "확인 필요사항"],
    practice: "지난 회의 메모를 붙여 넣고, 결정사항과 실행계획만 분리해보세요.",
  },
  {
    id: "report",
    work: "보고서 초안 작성",
    why: "초안 작성 시간이 길고, 기존 양식과 지표가 있으면 결과 품질을 안정화할 수 있습니다.",
    sourceMaterials: ["보고서 양식", "관련 지표 또는 수치", "이전 보고서 샘플", "부서별 코멘트"],
    role: "너는 월간 또는 주간 보고서 초안을 작성하는 업무 지원 AI다.",
    outputFormat: ["핵심 요약", "현황", "주요 지표", "문제점", "원인", "개선안", "보고 대상 확인사항"],
    practice: "이번 주 지표와 팀 코멘트를 기준으로 1페이지 보고서 초안을 만들어보세요.",
  },
  {
    id: "proposal",
    work: "제안서 작성",
    why: "제안서는 구조가 중요하므로, 샘플과 고객 요구사항을 기준 자료로 잡으면 재사용성이 높습니다.",
    sourceMaterials: ["고객 요구사항", "기존 제안서 샘플", "제품 또는 서비스 소개자료", "가격/조건 기준"],
    role: "너는 영업 제안서의 구조와 초안을 잡아주는 AI다.",
    outputFormat: ["제안 배경", "고객 요구 이해", "제안 내용", "기대 효과", "일정", "비용 또는 조건", "추가 확인사항"],
    practice: "고객 요구사항 3개를 입력하고, 제안서 목차와 핵심 문구를 뽑아보세요.",
  },
  {
    id: "support",
    work: "고객 문의 답변",
    why: "FAQ와 정책을 기준으로 답변 초안을 만들고, 민감 표현은 사람이 검토하기 좋습니다.",
    sourceMaterials: ["고객 문의 원문", "고객 FAQ", "응대 매뉴얼", "환불/교환/계약 관련 정책"],
    role: "너는 고객 문의에 대해 사내 기준에 맞는 답변 초안을 작성하는 AI다.",
    outputFormat: ["문의 요약", "답변 초안", "근거 기준", "확인 필요 정보", "민감 표현 점검"],
    practice: "고객 문의 한 건을 입력하고, 답변 초안과 확인 필요 정보를 분리해보세요.",
  },
  {
    id: "quality",
    work: "품질 이슈 원인 분석",
    why: "기준서, 검사 데이터, 현장 코멘트를 함께 보면 원인 후보와 개선안을 구조화할 수 있습니다.",
    sourceMaterials: ["품질 기준서", "불량 또는 이슈 기록", "검사 데이터", "현장 코멘트", "이전 개선 사례"],
    role: "너는 품질보증팀의 이슈 원인 분석을 돕는 AI다.",
    outputFormat: ["이슈 요약", "현재 현황", "가능 원인", "근거 자료", "개선안", "담당자", "기한", "리스크"],
    practice: "불량 기록과 현장 코멘트를 넣고, 확인된 원인과 가설을 나눠보세요.",
  },
  {
    id: "production",
    work: "생산 현황 요약",
    why: "수치와 기준이 명확해 AI가 계획 대비 차이, 병목, 납기 리스크를 정리하기 좋습니다.",
    sourceMaterials: ["생산 계획", "실적 데이터", "설비 가동률", "재고 또는 자재 현황", "납기 기준"],
    role: "너는 생산관리 현황을 요약하고 병목을 정리하는 AI다.",
    outputFormat: ["생산 현황", "계획 대비 차이", "병목 또는 지연 요인", "조치 필요사항", "담당 부서", "납기 리스크"],
    practice: "일일 생산량과 계획 수량을 넣고, 지연 요인과 조치 필요사항을 뽑아보세요.",
  },
  {
    id: "manual",
    work: "사내 매뉴얼 검색",
    why: "신뢰 가능한 최신 문서가 있으면 AI를 사내 지식 검색 보조자로 훈련하기 좋습니다.",
    sourceMaterials: ["업무 매뉴얼", "사내 규정", "승인된 가이드 문서", "자주 묻는 질문"],
    role: "너는 사내 매뉴얼과 규정을 기준으로 답변하는 업무 검색 AI다.",
    outputFormat: ["질문 요약", "답변", "참고 문서", "근거 위치", "예외 또는 확인 필요사항"],
    practice: "사내 규정 질문 하나를 넣고, 답변과 근거 문서를 함께 정리해보세요.",
  },
  {
    id: "training",
    work: "교육자료 제작",
    why: "업무 매뉴얼을 교육 흐름으로 바꾸는 작업은 반복성과 형식성이 높아 훈련에 적합합니다.",
    sourceMaterials: ["교육 대상 정보", "업무 매뉴얼", "기존 교육자료", "실습 사례", "평가 기준"],
    role: "너는 업무 내용을 교육 흐름으로 재구성하는 교육자료 제작 AI다.",
    outputFormat: ["교육 목표", "목차", "핵심 설명", "실습 활동", "퀴즈 또는 점검 질문", "강사용 메모"],
    practice: "업무 매뉴얼 일부를 넣고, 30분 교육 목차와 실습 활동을 만들어보세요.",
  },
];

const steps = [
  { id: 0, label: "AI Ready Check" },
  { id: 1, label: "업무 선정" },
  { id: 2, label: "기준 자료 구성" },
  { id: 3, label: "AI 역할 설정" },
  { id: 4, label: "출력 형식 표준화" },
  { id: 5, label: "검토 루프" },
];

const aiReadyChecklist = [
  "반복적으로 발생하는 업무이다.",
  "업무를 수행하기 위한 기준자료가 있다.",
  "결과물을 사람이 최종 검토할 수 있다.",
  "출력 형식이 어느 정도 정해져 있다.",
  "개인정보 또는 기밀정보가 과도하게 포함되지 않는다.",
  "매번 처음부터 창의적으로 만들어야 하는 업무가 아니다.",
];

const benchmarkPrinciples = [
  { title: "업무 단위", text: "AI 도입은 도구가 아니라 반복 업무 하나를 고르는 것에서 시작합니다." },
  { title: "조직 자료", text: "기본 추천 자료에 우리 조직의 최신 자료를 추가해야 결과가 안정됩니다." },
  { title: "역할형 AI", text: "일반 챗봇이 아니라 특정 업무를 맡는 보조자로 역할을 고정합니다." },
  { title: "표준 출력", text: "결과물 형식을 맞춰야 팀원이 같은 기준으로 검토할 수 있습니다." },
  { title: "사람 검토", text: "AI 결과물은 초안이며 사실, 수치, 보안, 실행 가능성을 확인해야 합니다." },
];

const reviewChecklist = ["사실이 맞는가?", "수치와 날짜가 맞는가?", "사내 기준과 충돌하지 않는가?", "민감정보가 포함되어 있지 않은가?", "담당자와 기한이 명확한가?", "실행 가능한 내용인가?"];

const guideReasons = [
  {
    title: "AI를 모든 업무에 쓰려고 하면 실패하기 쉽습니다.",
    text: "먼저 반복되고, 자료가 있고, 사람이 최종 검토할 수 있는 업무 하나를 골라야 합니다.",
  },
  {
    title: "좋은 답변은 좋은 기준 자료에서 나옵니다.",
    text: "AI에게 많이 넣는 것보다, 우리 조직에서 승인된 최신 자료를 넣는 것이 더 중요합니다.",
  },
  {
    title: "역할이 모호하면 결과도 흔들립니다.",
    text: "AI를 일반 도우미가 아니라 회의록 정리자, 보고서 작성 보조자, 품질 이슈 분석자처럼 업무 역할로 고정합니다.",
  },
  {
    title: "출력 형식이 표준화되어야 팀에서 쓸 수 있습니다.",
    text: "요약, 현황, 문제점, 원인, 실행계획, 담당자, 기한처럼 결과물의 구조를 미리 정해야 검토가 빨라집니다.",
  },
];

const trainerModes = [
  {
    title: "30분 체험형",
    text: "업무 하나를 고르고, 전/후 프롬프트를 비교해 AI 결과가 왜 달라지는지 체감합니다.",
  },
  {
    title: "90분 워크숍형",
    text: "실제 업무자료를 넣고 출력 형식을 조정한 뒤, AI 결과를 사람이 검토하는 루프까지 진행합니다.",
  },
  {
    title: "부서 적용형",
    text: "팀 공통 업무를 선정하고 기준 자료와 출력 형식을 합의해 부서용 프롬프트 템플릿으로 축적합니다.",
  },
];

const effectSignals = [
  "막연한 요청과 구조화된 요청의 차이를 비교한다.",
  "실제 업무자료를 넣어 결과 품질을 점검한다.",
  "검토 메모를 남겨 다음 업무의 기준 자료로 재사용한다.",
];

const trainingRecordStorageKey = "ai-work-os-training-records";

const weaveCapabilities = [
  { icon: Sparkles, title: "바이브코딩 워크숍" },
  { icon: Radar, title: "AI기반 문제해결 워크숍" },
  { icon: Workflow, title: "업무자동화 & AI 에이전트 교육 및 컨설팅" },
  { icon: Route, title: "창업교육 및 진로설계" },
];

function App() {
  const [page, setPage] = useState(() => (window.location.hash === "#guide" ? "guide" : "training"));
  const [selectedId, setSelectedId] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [aiReadyChecks, setAiReadyChecks] = useState([]);
  const [customMaterialInput, setCustomMaterialInput] = useState("");
  const [customOutputInput, setCustomOutputInput] = useState("");
  const [customMaterialsByWork, setCustomMaterialsByWork] = useState({});
  const [customOutputsByWork, setCustomOutputsByWork] = useState({});
  const [removedDefaultMaterialsByWork, setRemovedDefaultMaterialsByWork] = useState({});
  const [removedDefaultOutputsByWork, setRemovedDefaultOutputsByWork] = useState({});
  const [outputOrderByWork, setOutputOrderByWork] = useState({});
  const [roleByWork, setRoleByWork] = useState({});
  const [practiceDataByWork, setPracticeDataByWork] = useState({});
  const [aiDraftByWork, setAiDraftByWork] = useState({});
  const [reviewMemoByWork, setReviewMemoByWork] = useState({});
  const [trainingRecords, setTrainingRecords] = useState(() => loadTrainingRecords());
  const [saveMessage, setSaveMessage] = useState("");
  const [checkedReviews, setCheckedReviews] = useState([]);

  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedId),
    [selectedId],
  );

  const customMaterials = selectedId ? customMaterialsByWork[selectedId] ?? [] : [];
  const customOutputs = selectedId ? customOutputsByWork[selectedId] ?? [] : [];
  const removedDefaultMaterials = selectedId ? removedDefaultMaterialsByWork[selectedId] ?? [] : [];
  const removedDefaultOutputs = selectedId ? removedDefaultOutputsByWork[selectedId] ?? [] : [];
  const defaultMaterials = selectedScenario
    ? selectedScenario.sourceMaterials.filter((item) => !removedDefaultMaterials.includes(item))
    : [];
  const defaultOutputs = selectedScenario
    ? selectedScenario.outputFormat.filter((item) => !removedDefaultOutputs.includes(item))
    : [];
  const sourceMaterials = selectedScenario ? [...defaultMaterials, ...customMaterials] : [];
  const outputFormat = selectedScenario
    ? reconcileOrder(outputOrderByWork[selectedId] ?? [], [...defaultOutputs, ...customOutputs])
    : [];
  const roleText = selectedScenario ? roleByWork[selectedId] ?? selectedScenario.role : "";
  const practiceData = selectedId ? practiceDataByWork[selectedId] ?? "" : "";
  const aiDraft = selectedId ? aiDraftByWork[selectedId] ?? "" : "";
  const reviewMemo = selectedId ? reviewMemoByWork[selectedId] ?? "" : "";

  useEffect(() => {
    function syncPageWithHash() {
      setPage(window.location.hash === "#guide" ? "guide" : "training");
    }

    window.addEventListener("hashchange", syncPageWithHash);
    return () => window.removeEventListener("hashchange", syncPageWithHash);
  }, []);

  const promptTemplate = useMemo(() => {
    if (!selectedScenario) {
      return "먼저 업무를 선택하면 훈련용 요청문이 단계별로 조립됩니다.";
    }

    const sections = [`업무: ${selectedScenario.work}`];

    if (activeStep >= 2) {
      sections.push(`기준 자료:
${sourceMaterials.map((item) => `- ${item}`).join("\n")}`);
    } else {
      sections.push("기준 자료: 다음 단계에서 구성");
    }

    if (activeStep >= 3) {
      sections.unshift(roleText);
    } else {
      sections.push("AI 역할: 다음 단계에서 설정");
    }

    if (activeStep >= 4) {
      sections.push(`출력 형식:
${outputFormat.map((item, index) => `${index + 1}. ${item}`).join("\n")}`);
    } else {
      sections.push("출력 형식: 다음 단계에서 표준화");
    }

    if (activeStep >= 5) {
      sections.push(`검토 기준:
${reviewChecklist.map((item) => `- ${item}`).join("\n")}`);
    } else {
      sections.push("검토 기준: 마지막 단계에서 확인");
    }

    sections.push(`작성 원칙:
- 기준 자료에 없는 내용은 임의로 확정하지 않는다.
- 사람이 최종 검토할 수 있도록 초안 형태로 작성한다.
- 불확실한 내용은 확인 필요사항으로 분리한다.`);

    return sections.join("\n\n");
  }, [activeStep, outputFormat, roleText, selectedScenario, sourceMaterials]);

  const beforePrompt = useMemo(() => {
    if (!selectedScenario) return "업무를 선택하면 훈련 전 요청 예시가 표시됩니다.";

    return `${selectedScenario.work} 해줘.

자료:
${practiceData || "[실제 업무자료를 붙여 넣으세요]"}`;
  }, [practiceData, selectedScenario]);

  const practicePrompt = useMemo(() => {
    if (!selectedScenario) return "업무를 선택하면 실제 자료용 훈련 프롬프트가 표시됩니다.";

    return `${roleText}

업무: ${selectedScenario.work}

실제 업무자료:
${practiceData || "[실제 업무자료를 붙여 넣으세요]"}

기준 자료:
${sourceMaterials.map((item) => `- ${item}`).join("\n")}

출력 형식:
${outputFormat.map((item, index) => `${index + 1}. ${item}`).join("\n")}

검토 기준:
${reviewChecklist.map((item) => `- ${item}`).join("\n")}

작성 원칙:
- 기준 자료와 실제 업무자료에 없는 내용은 임의로 확정하지 않는다.
- 사람이 최종 검토할 수 있도록 초안 형태로 작성한다.
- 불확실한 내용은 확인 필요사항으로 분리한다.`;
  }, [outputFormat, practiceData, roleText, selectedScenario, sourceMaterials]);

  function chooseWork(id) {
    setSelectedId(id);
    setActiveStep(2);
    setCustomMaterialInput("");
    setCustomOutputInput("");
    setCheckedReviews([]);
  }

  function reset() {
    setSelectedId("");
    setActiveStep(0);
    setAiReadyChecks([]);
    setCustomMaterialInput("");
    setCustomOutputInput("");
    setCheckedReviews([]);
    goToTraining();
  }

  function goToGuide() {
    window.location.hash = "guide";
    setPage("guide");
  }

  function goToTraining() {
    if (window.location.hash) {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    setPage("training");
  }

  function addCustomMaterial() {
    const material = customMaterialInput.trim();
    if (!selectedId || !material) return;
    if (sourceMaterials.includes(material)) {
      setCustomMaterialInput("");
      return;
    }

    setCustomMaterialsByWork((current) => appendUnique(current, selectedId, material));
    setCustomMaterialInput("");
  }

  function removeCustomMaterial(material) {
    setCustomMaterialsByWork((current) => removeItem(current, selectedId, material));
  }

  function removeSourceMaterial(material) {
    if (!selectedScenario || !selectedId) return;

    if (customMaterials.includes(material)) {
      removeCustomMaterial(material);
      return;
    }

    setRemovedDefaultMaterialsByWork((current) => appendUnique(current, selectedId, material));
  }

  function restoreDefaultMaterials() {
    if (!selectedId) return;
    setRemovedDefaultMaterialsByWork((current) => ({ ...current, [selectedId]: [] }));
  }

  function addCustomOutput() {
    const output = customOutputInput.trim();
    if (!selectedId || !output) return;
    if (outputFormat.includes(output)) {
      setCustomOutputInput("");
      return;
    }
    if (removedDefaultOutputs.includes(output)) {
      setRemovedDefaultOutputsByWork((current) => removeItem(current, selectedId, output));
      setOutputOrderByWork((current) => ({
        ...current,
        [selectedId]: [...(current[selectedId] ?? outputFormat), output],
      }));
      setCustomOutputInput("");
      return;
    }

    setCustomOutputsByWork((current) => appendUnique(current, selectedId, output));
    setCustomOutputInput("");
  }

  function removeOutput(output) {
    if (!selectedScenario || !selectedId) return;

    if (customOutputs.includes(output)) {
      setCustomOutputsByWork((current) => removeItem(current, selectedId, output));
    } else {
      setRemovedDefaultOutputsByWork((current) => appendUnique(current, selectedId, output));
    }

    setOutputOrderByWork((current) => ({
      ...current,
      [selectedId]: (current[selectedId] ?? outputFormat).filter((item) => item !== output),
    }));
  }

  function restoreDefaultOutputs() {
    if (!selectedId || !selectedScenario) return;
    setRemovedDefaultOutputsByWork((current) => ({ ...current, [selectedId]: [] }));
    setOutputOrderByWork((current) => ({
      ...current,
      [selectedId]: [...selectedScenario.outputFormat, ...customOutputs],
    }));
  }

  function moveOutput(output, direction) {
    if (!selectedId) return;

    setOutputOrderByWork((current) => {
      const currentOrder = reconcileOrder(current[selectedId] ?? outputFormat, outputFormat);
      return {
        ...current,
        [selectedId]: moveItem(currentOrder, output, direction),
      };
    });
  }

  function updateRole(value) {
    if (!selectedId) return;
    setRoleByWork((current) => ({ ...current, [selectedId]: value }));
  }

  function updatePracticeData(value) {
    if (!selectedId) return;
    setPracticeDataByWork((current) => ({ ...current, [selectedId]: value }));
  }

  function updateAiDraft(value) {
    if (!selectedId) return;
    setAiDraftByWork((current) => ({ ...current, [selectedId]: value }));
  }

  function updateReviewMemo(value) {
    if (!selectedId) return;
    setReviewMemoByWork((current) => ({ ...current, [selectedId]: value }));
  }

  function saveTrainingRecord() {
    if (!selectedScenario) return;

    const now = new Date();
    const record = {
      id: `${selectedScenario.id}-${now.getTime()}`,
      savedAt: now.toISOString(),
      work: selectedScenario.work,
      role: roleText,
      sourceMaterials,
      outputFormat,
      practiceData,
      practicePrompt,
      aiDraft,
      reviewMemo,
      checkedReviews,
    };

    const nextRecords = [record, ...trainingRecords].slice(0, 12);
    setTrainingRecords(nextRecords);
    window.localStorage.setItem(trainingRecordStorageKey, JSON.stringify(nextRecords));
    downloadMarkdownRecord(record);
    setSaveMessage("훈련 기록을 저장하고 Markdown 파일로 내려받았습니다.");
    window.setTimeout(() => setSaveMessage(""), 3200);
  }

  function toggleReview(item) {
    setCheckedReviews((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
    );
  }

  function toggleAiReadyCheck(item) {
    setAiReadyChecks((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
    );
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(promptTemplate);
  }

  async function copyPracticePrompt() {
    await navigator.clipboard.writeText(practicePrompt);
  }

  if (page === "guide") {
    return <GuidePage onBack={goToTraining} />;
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">AI Learning OS for Knowledge Workers</p>
          <h1>AI에게 일을 맡기기 전, 업무의 기준부터 설계합니다.</h1>
        </div>
        <div className="hero-actions">
          <a className="ghost-button" href="/llms-full.txt">
            <FileText size={18} />
            AI용 문서
          </a>
          <button className="ghost-button" onClick={goToGuide}>
            <Map size={18} />
            가이드 문서
          </button>
          <button className="reset-button" onClick={reset}>
            <RefreshCw size={18} />
            처음부터
          </button>
        </div>
      </header>

      <nav className="stepper" aria-label="진행 단계">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              className={activeStep === step.id ? "is-current" : activeStep > step.id ? "is-done" : ""}
              disabled={!selectedScenario && step.id > 1}
              onClick={() => setActiveStep(step.id)}
            >
              <span>{step.id}</span>
              {step.label}
            </button>
            {index < steps.length - 1 && <ArrowRight size={18} />}
          </React.Fragment>
        ))}
      </nav>

      <section className="workspace">
        <section className="main-panel">
          {activeStep === 1 && (
            <StepCard
              icon={ClipboardList}
              title="1. 업무 선정"
              text="반복되고, 자료가 있고, 사람이 최종 검토하면 되는 업무부터 고릅니다."
            >
              <div className="work-list">
                {scenarios.map((scenario) => (
                  <button
                    className={selectedId === scenario.id ? "is-selected" : ""}
                    key={scenario.id}
                    onClick={() => chooseWork(scenario.id)}
                  >
                    <FileText size={18} />
                    <span>
                      <b>{scenario.work}</b>
                      <small>{scenario.why}</small>
                    </span>
                  </button>
                ))}
              </div>
            </StepCard>
          )}

          {activeStep === 0 && (
            <StepCard
              icon={CheckCircle2}
              title="업무 적합성 먼저 확인"
              text="프롬프트를 만들기 전에, 이 업무가 AI에게 맡길 수 있는 형태인지 먼저 판단합니다."
            >
              <AiReadyCheck
                checkedItems={aiReadyChecks}
                onNext={() => setActiveStep(1)}
                onToggle={toggleAiReadyCheck}
              />
            </StepCard>
          )}

          {activeStep === 2 && selectedScenario && (
            <StepCard
              icon={BookOpenCheck}
              title="2. 기준 자료 구성"
              text="추천 자료를 확인하고, 우리 조직에서 실제로 쓰는 최신 자료를 추가합니다."
            >
              <SuggestionList
                customItems={customMaterials}
                items={sourceMaterials}
                onRemoveItem={removeSourceMaterial}
                removableItems={sourceMaterials}
              />
              {removedDefaultMaterials.length > 0 && (
                <button className="restore-button" onClick={restoreDefaultMaterials}>
                  기본 자료 복원
                </button>
              )}
              <Adder
                buttonLabel="자료 추가"
                label="우리 조직 자료 추가"
                onAdd={addCustomMaterial}
                onChange={setCustomMaterialInput}
                placeholder="예: 2026년 2분기 품질 개선 회의록"
                value={customMaterialInput}
              />
              <TrainingNote text={selectedScenario.practice} />
              <NextButton onClick={() => setActiveStep(3)}>이 자료 기준으로 역할 설정</NextButton>
            </StepCard>
          )}

          {activeStep === 3 && selectedScenario && (
            <StepCard
              icon={UserRoundCog}
              title="3. AI 역할 설정"
              text="일반 도우미가 아니라, 선택한 업무를 맡는 전담 보조자로 역할을 고정합니다."
            >
              <label className="role-editor">
                <span>역할 문장</span>
                <textarea value={roleText} onChange={(event) => updateRole(event.target.value)} />
              </label>
              <NextButton onClick={() => setActiveStep(4)}>이 역할로 출력 형식 정하기</NextButton>
            </StepCard>
          )}

          {activeStep === 4 && selectedScenario && (
            <StepCard
              icon={Layers3}
              title="4. 출력 형식 표준화"
              text="결과물이 바로 검토될 수 있도록 항목과 순서를 고정합니다."
            >
              <SuggestionList
                customItems={customOutputs}
                items={outputFormat}
                movable
                onMoveItem={moveOutput}
                onRemoveItem={removeOutput}
                removableItems={outputFormat}
                ordered
              />
              {removedDefaultOutputs.length > 0 && (
                <button className="restore-button" onClick={restoreDefaultOutputs}>
                  기본 출력 항목 복원
                </button>
              )}
              <Adder
                buttonLabel="항목 추가"
                label="우리 팀 출력 항목 추가"
                onAdd={addCustomOutput}
                onChange={setCustomOutputInput}
                placeholder="예: 승인권자 코멘트"
                value={customOutputInput}
              />
              <NextButton onClick={() => setActiveStep(5)}>검토 루프 확인</NextButton>
            </StepCard>
          )}

          {activeStep === 5 && selectedScenario && (
            <StepCard
              icon={ShieldCheck}
              title="5. 사람 검토 루프"
              text="실제 자료를 넣고, AI 답변을 붙여넣은 뒤, 사람이 검토한 기록까지 남깁니다."
            >
              <div className="completion-note">
                <CheckCircle2 size={20} />
                <p>{selectedScenario.work} 실습 프롬프트가 준비되었습니다. 아래 워크시트를 순서대로 진행해보세요.</p>
              </div>
              <PracticeLab
                aiDraft={aiDraft}
                beforePrompt={beforePrompt}
                checkedReviews={checkedReviews}
                onChangeAiDraft={updateAiDraft}
                onChangePracticeData={updatePracticeData}
                onChangeReviewMemo={updateReviewMemo}
                onCopyPracticePrompt={copyPracticePrompt}
                onSaveTrainingRecord={saveTrainingRecord}
                onToggleReview={toggleReview}
                practiceData={practiceData}
                practicePrompt={practicePrompt}
                recentRecords={trainingRecords}
                reviewMemo={reviewMemo}
                saveMessage={saveMessage}
                scenario={selectedScenario}
              />
            </StepCard>
          )}
        </section>

        <aside className="side-panel">
          <div className="selected-work">
            <span>현재 훈련 업무</span>
            <strong>{selectedScenario?.work ?? "아직 선택 전"}</strong>
          </div>

          <div className="principle-card">
            <h2>벤치마킹 원칙</h2>
            <div>
              {benchmarkPrinciples.map((principle) => (
                <article key={principle.title}>
                  <span>{principle.title}</span>
                  <p>{principle.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="principle-card">
            <h2>훈련 효과 확인</h2>
            <div>
              {effectSignals.map((signal) => (
                <article key={signal}>
                  <span>체크포인트</span>
                  <p>{signal}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="prompt-card">
            <div className="prompt-head">
              <h2>{activeStep >= 5 ? "실습 프롬프트" : "프롬프트 조립 중"}</h2>
              <button onClick={copyPrompt}>
                <Copy size={16} />
                복사
              </button>
            </div>
            <pre>{promptTemplate}</pre>
          </div>
        </aside>
      </section>

      <section className="weave-section">
        <div className="weave-wordmark" aria-hidden="true">WEAVE&</div>
        <div className="weave-story">
          <p className="eyebrow">위브앤 소개</p>
          <h2>좋은 AI 결과는 좋은 프롬프트에서 시작되지 않습니다.</h2>
          <div className="weave-copy">
            <p>잘 설계된 업무에서 시작됩니다.</p>
            <p>
              AI 업무 운영 훈련실은 직장인이 자신의 업무를 AI가 실행 가능한 형태로 구조화하고, 실제 업무에
              적용할 수 있도록 돕는 실습형 학습 도구입니다.
            </p>
          </div>
          <div className="weave-powered">Powered by WEAVE& | AI Learning OS</div>
        </div>
        <div className="weave-card">
          <blockquote>
            <span>기술보다</span>
            <span>중요한 것은</span>
            <span>사람의 가능성입니다.</span>
          </blockquote>
          <div className="weave-capabilities">
            {weaveCapabilities.map(({ icon: Icon, title }) => (
              <article key={title}>
                <Icon size={20} />
                <span>{title}</span>
              </article>
            ))}
          </div>
          <a href="mailto:ceo@wilab.co.kr">
            <Mail size={16} />
            ceo@wilab.co.kr
          </a>
        </div>
      </section>
    </main>
  );
}

function GuidePage({ onBack }) {
  return (
    <main className="app-shell">
      <header className="hero hero-guide">
        <div className="hero-content">
          <p className="eyebrow">Training Guide</p>
          <h1>왜 이런 훈련이 필요한가</h1>
        </div>
        <button className="reset-button" onClick={onBack}>
          <ArrowRight className="turn-back" size={18} />
          훈련실로 돌아가기
        </button>
      </header>

      <section className="guide-page">
        <section className="guide-document" aria-labelledby="guide-title">
          <div className="guide-lead">
            <p className="eyebrow">Why It Matters</p>
            <h2 id="guide-title">AI를 잘 쓰는 훈련은 업무를 다시 설계하는 훈련입니다.</h2>
            <p>
              이 훈련은 프롬프트 문장을 멋지게 쓰는 연습이 아닙니다. 내 업무를 AI가 처리 가능한 형태로
              구조화하고, 사람이 검토할 수 있는 결과물로 만드는 연습입니다.
            </p>
          </div>
          <div className="guide-grid">
            {guideReasons.map((reason, index) => (
              <article key={reason.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            ))}
          </div>
          <div className="guide-rule">
            <strong>훈련 원칙</strong>
            <p>AI Ready Check → 업무 선정 → 기준 자료 구성 → AI 역할 설정 → 출력 형식 표준화 → 사람 검토 순서로 진행합니다.</p>
          </div>
        </section>

        <section className="guide-flow" aria-label="훈련 흐름">
          {steps.map((step, index) => (
            <article key={step.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{step.label}</h2>
              <p>{guideFlowText[step.id]}</p>
            </article>
          ))}
        </section>

        <section className="trainer-guide" aria-labelledby="trainer-guide-title">
          <div>
            <p className="eyebrow">Facilitator Guide</p>
            <h2 id="trainer-guide-title">교육자는 훈련 시간을 이렇게 설계할 수 있습니다.</h2>
          </div>
          <div className="trainer-grid">
            {trainerModes.map((mode) => (
              <article key={mode.title}>
                <h3>{mode.title}</h3>
                <p>{mode.text}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

const guideFlowText = {
  0: "AI에게 맡기기 전에 반복성, 기준 자료, 사람 검토 가능성, 보안 조건을 먼저 점검합니다.",
  1: "모든 업무가 아니라 반복되고, 자료가 있고, 사람이 최종 검토할 수 있는 업무 하나를 고릅니다.",
  2: "AI가 참고해야 할 최신 기준 자료를 정리하고, 우리 조직 자료를 추가하거나 불필요한 기본 자료를 삭제합니다.",
  3: "AI를 일반 도우미가 아니라 선택한 업무를 맡는 전담 보조자로 고정합니다.",
  4: "결과물이 팀에서 바로 검토될 수 있도록 항목과 순서를 표준화합니다.",
  5: "AI 결과물을 최종 답이 아닌 초안으로 보고, 사실·수치·보안·실행 가능성을 사람이 확인합니다.",
};

function appendUnique(current, key, item) {
  const currentItems = current[key] ?? [];
  if (currentItems.includes(item)) return current;
  return { ...current, [key]: [...currentItems, item] };
}

function removeItem(current, key, item) {
  return { ...current, [key]: (current[key] ?? []).filter((entry) => entry !== item) };
}

function reconcileOrder(order, items) {
  const orderedItems = order.filter((item) => items.includes(item));
  const newItems = items.filter((item) => !orderedItems.includes(item));
  return [...orderedItems, ...newItems];
}

function moveItem(items, item, direction) {
  const index = items.indexOf(item);
  const nextIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
  return nextItems;
}

function getAiReadyResult(count) {
  if (count <= 2) {
    return {
      tone: "low",
      title: "아직 AI 적용이 어렵습니다.",
      text: "기준 자료, 반복성, 검토 가능성을 먼저 정리한 뒤 다시 점검해보세요.",
    };
  }

  if (count <= 4) {
    return {
      tone: "mid",
      title: "일부 업무부터 AI를 적용해보세요.",
      text: "전체 업무를 맡기기보다 초안 작성, 요약, 분류처럼 작은 단위부터 시작하는 것이 좋습니다.",
    };
  }

  return {
    tone: "high",
    title: "AI 적용에 매우 적합한 업무입니다.",
    text: "반복성, 기준 자료, 사람 검토 조건이 갖춰져 있어 다음 단계에서 업무를 선택해도 좋습니다.",
  };
}

function loadTrainingRecords() {
  try {
    const savedRecords = window.localStorage.getItem(trainingRecordStorageKey);
    if (!savedRecords) return [];
    const parsedRecords = JSON.parse(savedRecords);
    return Array.isArray(parsedRecords) ? parsedRecords : [];
  } catch {
    return [];
  }
}

function downloadMarkdownRecord(record) {
  const savedDate = formatRecordDate(record.savedAt);
  const markdown = `# AI Learning OS for Knowledge Workers 훈련 기록

- 저장 일시: ${savedDate}
- 훈련 업무: ${record.work}

## 1. 실제 업무자료

${record.practiceData || "작성된 실제 업무자료가 없습니다."}

## 2. 실습 프롬프트

\`\`\`text
${record.practicePrompt}
\`\`\`

## 3. AI 결과 초안

${record.aiDraft || "붙여넣은 AI 결과 초안이 없습니다."}

## 4. 사람 검토 및 개선 메모

${record.reviewMemo || "작성된 검토 메모가 없습니다."}

## 기준 자료

${record.sourceMaterials.map((item) => `- ${item}`).join("\n") || "- 없음"}

## 출력 형식

${record.outputFormat.map((item, index) => `${index + 1}. ${item}`).join("\n") || "없음"}

## 확인한 검토 기준

${record.checkedReviews.map((item) => `- ${item}`).join("\n") || "- 체크한 검토 기준이 없습니다."}
`;

  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ai-work-training-${record.work}-${record.savedAt.slice(0, 10)}.md`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function formatRecordDate(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StepCard({ icon: Icon, title, text, children }) {
  return (
    <article className="step-card">
      <div className="step-card-head">
        <Icon size={24} />
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      </div>
      {children}
    </article>
  );
}

function AiReadyCheck({ checkedItems, onNext, onToggle }) {
  const result = getAiReadyResult(checkedItems.length);

  return (
    <section className="ai-ready-check" aria-label="AI 적용 적합도 진단">
      <div className="ai-ready-intro">
        <p className="eyebrow">0번 단계</p>
        <h2>이 업무는 AI가 잘할 수 있는 업무일까요?</h2>
        <p>
          AI는 모든 업무를 잘하는 것이 아니라 <strong>기준이 있는 반복 업무</strong>를 가장 잘합니다.
        </p>
      </div>

      <div className="ai-ready-why">
        <span>왜 0번인가요?</span>
        <p>
          업무가 반복성, 기준자료, 검토 가능성을 갖추지 못하면 좋은 프롬프트를 써도 결과가 흔들립니다. 먼저
          맡길 수 있는 업무인지 확인한 뒤 다음 단계로 넘어갑니다.
        </p>
      </div>

      <div className="ai-ready-action-hint">
        <span className="check-box is-demo" aria-hidden="true">
          <CheckCircle2 size={16} />
        </span>
        <p>
          <strong>해당되는 박스를 클릭해 체크하세요.</strong>
          <small>다시 클릭하면 체크가 해제됩니다. 5개 이상이면 AI 적용에 적합한 업무입니다.</small>
        </p>
      </div>

      <div className="ai-ready-list">
        {aiReadyChecklist.map((item) => {
          const isChecked = checkedItems.includes(item);

          return (
          <button
            aria-pressed={isChecked}
            className={isChecked ? "is-checked" : ""}
            key={item}
            onClick={() => onToggle(item)}
            type="button"
          >
            <span className="check-box" aria-hidden="true">
              {isChecked && <CheckCircle2 size={18} />}
            </span>
            <span>
              {item}
              {item === "업무를 수행하기 위한 기준자료가 있다." && (
                <small>매뉴얼, 보고서, 회의록, 규정, FAQ 등</small>
              )}
            </span>
          </button>
          );
        })}
      </div>

      <div className={`ai-ready-result is-${result.tone}`}>
        <div>
          <span>{checkedItems.length}/6 체크</span>
          <strong>{result.title}</strong>
          <p>{result.text}</p>
        </div>
      </div>

      <div className="ai-ready-next">
        <p>좋습니다. 이제 AI에게 맡길 업무를 하나 선택해보겠습니다.</p>
        <NextButton onClick={onNext}>다음 단계</NextButton>
      </div>
    </section>
  );
}

function SuggestionList({
  customItems = [],
  items,
  movable = false,
  onMoveItem,
  onRemoveItem,
  ordered = false,
  removableItems = [],
}) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag className="suggestion-list">
      {items.map((item, index) => (
        <li className={customItems.includes(item) ? "is-custom" : ""} key={item}>
          <CheckCircle2 size={18} />
          <span>{item}</span>
          <div className="suggestion-actions">
            {movable && (
              <>
                <button
                  aria-label={`${item} 위로 이동`}
                  disabled={index === 0}
                  onClick={() => onMoveItem(item, "up")}
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  aria-label={`${item} 아래로 이동`}
                  disabled={index === items.length - 1}
                  onClick={() => onMoveItem(item, "down")}
                >
                  <ArrowDown size={15} />
                </button>
              </>
            )}
            {removableItems.includes(item) && (
              <button aria-label={`${item} 삭제`} onClick={() => onRemoveItem(item)}>
                <X size={16} />
              </button>
            )}
          </div>
        </li>
      ))}
    </Tag>
  );
}

function Adder({ buttonLabel, label, onAdd, onChange, placeholder, value }) {
  return (
    <div className="material-adder">
      <label>{label}</label>
      <div>
        <input
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onAdd();
          }}
          placeholder={placeholder}
          value={value}
        />
        <button onClick={onAdd}>
          <Plus size={18} />
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

function TrainingNote({ text }) {
  return (
    <div className="training-note">
      <Sparkles size={18} />
      <p>{text}</p>
    </div>
  );
}

function PracticeLab({
  aiDraft,
  beforePrompt,
  checkedReviews,
  onChangeAiDraft,
  onChangePracticeData,
  onChangeReviewMemo,
  onCopyPracticePrompt,
  onSaveTrainingRecord,
  onToggleReview,
  practiceData,
  practicePrompt,
  recentRecords,
  reviewMemo,
  saveMessage,
  scenario,
}) {
  const canSaveRecord = Boolean(practiceData.trim() || aiDraft.trim() || reviewMemo.trim());
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [hasCopiedPracticePrompt, setHasCopiedPracticePrompt] = useState(false);
  const [hasSavedCurrentRecord, setHasSavedCurrentRecord] = useState(false);

  useEffect(() => {
    setHasCopiedPracticePrompt(false);
    setHasSavedCurrentRecord(false);
  }, [scenario.id]);

  useEffect(() => {
    setHasSavedCurrentRecord(false);
  }, [practiceData, aiDraft, reviewMemo, checkedReviews.length]);

  const statusItems = [
    { label: "자료 입력", done: Boolean(practiceData.trim()) },
    { label: "프롬프트 복사", done: hasCopiedPracticePrompt },
    { label: "AI 답변", done: Boolean(aiDraft.trim()) },
    { label: "사람 검토", done: checkedReviews.length > 0 || Boolean(reviewMemo.trim()) },
    { label: "기록 저장", done: hasSavedCurrentRecord },
  ];
  const doneStatusCount = statusItems.filter((item) => item.done).length;

  async function handleCopyPracticePrompt() {
    try {
      await onCopyPracticePrompt();
    } finally {
      setHasCopiedPracticePrompt(true);
    }
  }

  function handleSaveTrainingRecord() {
    onSaveTrainingRecord();
    setHasSavedCurrentRecord(true);
  }

  return (
    <section className="practice-lab" aria-label="실제 업무자료 실습">
      <div className="practice-head">
        <div>
          <p className="eyebrow">Practice Lab</p>
          <h2>실제 자료로 프롬프트를 검증합니다.</h2>
          <p>자료를 넣고, 실습 프롬프트를 ChatGPT 등 사용하는 AI에 넣은 뒤, 나온 결과와 검토 기록을 남깁니다.</p>
        </div>
        <button className="restore-button" onClick={handleCopyPracticePrompt}>
          <Copy size={16} />
          실습 프롬프트 복사
        </button>
      </div>

      <div className="practice-steps" aria-label="실습 순서">
        <article>
          <span>1</span>
          <p>실제 업무자료를 붙여넣습니다.</p>
        </article>
        <article>
          <span>2</span>
          <p>실습 프롬프트를 복사해 AI에 넣습니다.</p>
        </article>
        <article>
          <span>3</span>
          <p>AI 답변을 붙이고 사람이 검토합니다.</p>
        </article>
      </div>

      <section className="training-status-panel" aria-label="현재 훈련 현황">
        <div className="training-status-head">
          <div>
            <span>현재 훈련 현황</span>
            <p>{doneStatusCount}/5 완료 · 다음 빈 항목을 채우면 기록 품질이 좋아집니다.</p>
          </div>
          <strong>{Math.round((doneStatusCount / statusItems.length) * 100)}%</strong>
        </div>
        <div className="status-meter" aria-hidden="true">
          <span style={{ width: `${(doneStatusCount / statusItems.length) * 100}%` }} />
        </div>
        <div className="status-chip-grid">
          {statusItems.map((item) => (
            <span className={item.done ? "is-done" : ""} key={item.label}>
              <CheckCircle2 size={15} />
              {item.label}
            </span>
          ))}
        </div>
      </section>

      <label className="practice-field">
        <span>1. 실제 업무자료 붙여넣기</span>
        <textarea
          onChange={(event) => onChangePracticeData(event.target.value)}
          placeholder={scenario.practice}
          value={practiceData}
        />
      </label>

      <article className="practice-prompt-card">
        <div className="practice-prompt-head">
          <div>
            <span>2. 실습 프롬프트</span>
            <p>복사해서 ChatGPT, Claude, Copilot 등 사용하는 AI에 붙여넣습니다.</p>
          </div>
          <button onClick={handleCopyPracticePrompt}>
            <Copy size={16} />
            복사
          </button>
        </div>
        <pre className={isPromptExpanded ? "is-expanded" : ""}>{practicePrompt}</pre>
        <div className="practice-prompt-actions">
          <button onClick={() => setIsPromptExpanded((current) => !current)}>
            {isPromptExpanded ? "접기" : "전체 보기"}
          </button>
        </div>
      </article>

      <details className="before-prompt-details">
        <summary>비교용 막연한 요청 보기</summary>
        <pre>{beforePrompt}</pre>
      </details>

      <label className="practice-field">
        <span>3. AI 답변 결과 붙여넣기</span>
        <AutoGrowTextarea
          onChange={(event) => onChangeAiDraft(event.target.value)}
          placeholder="2번 실습 프롬프트를 AI에 넣은 뒤, AI가 작성한 답변 결과를 여기에 붙여넣습니다."
          value={aiDraft}
        />
      </label>

      <section className="human-review-panel" aria-label="사람 검토 및 개선 메모">
        <div className="human-review-head">
          <span>4. 사람 검토 및 개선 메모</span>
          <p>AI 답변을 그대로 쓰지 않고, 아래 기준으로 확인한 뒤 보완할 점을 남깁니다.</p>
        </div>
        <div className="review-grid">
          {reviewChecklist.map((item) => (
            <button className={checkedReviews.includes(item) ? "is-checked" : ""} key={item} onClick={() => onToggleReview(item)}>
              <CheckCircle2 size={18} />
              {item}
            </button>
          ))}
        </div>
        <label className="practice-field">
          <span>개선 메모</span>
          <AutoGrowTextarea
            onChange={(event) => onChangeReviewMemo(event.target.value)}
            placeholder="예: 수치 출처 확인 필요, 사내 기준 문서 추가 필요, 다음에는 생산일보 양식을 기준 자료로 넣기."
            value={reviewMemo}
          />
        </label>
      </section>

      <div className="record-save-panel">
        <div>
          <span>5. 훈련 기록 저장</span>
          <p>실제 자료, 실습 프롬프트, AI 결과, 사람 검토 메모를 하나의 기록으로 남깁니다.</p>
        </div>
        <button disabled={!canSaveRecord} onClick={handleSaveTrainingRecord}>
          <Save size={17} />
          기록 저장하고 파일 받기
        </button>
      </div>

      {saveMessage && <p className="save-message">{saveMessage}</p>}

      {recentRecords.length > 0 && (
        <div className="record-history" aria-label="최근 저장 기록">
          <div className="record-history-head">
            <span>최근 저장 기록</span>
            <small>총 {recentRecords.length}개</small>
          </div>
          <ul>
            {recentRecords.slice(0, 3).map((record) => (
              <li key={record.id}>
                <div>
                  <b>{record.work}</b>
                  <small>{formatRecordDate(record.savedAt)}</small>
                </div>
                <RecordCompletion record={record} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function RecordCompletion({ record }) {
  const checks = [
    { label: "자료", done: Boolean(record.practiceData?.trim()) },
    { label: "AI 답변", done: Boolean(record.aiDraft?.trim()) },
    { label: "검토", done: (record.checkedReviews ?? []).length > 0 },
    { label: "메모", done: Boolean(record.reviewMemo?.trim()) },
  ];
  const completed = checks.filter((check) => check.done).length;

  return (
    <div className="record-completion">
      <strong>완성도 {completed}/{checks.length}</strong>
      <div>
        {checks.map((check) => (
          <span className={check.done ? "is-done" : ""} key={check.label}>
            {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AutoGrowTextarea({ onChange, placeholder, value }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      className="auto-grow-textarea"
      onChange={onChange}
      placeholder={placeholder}
      ref={textareaRef}
      value={value}
    />
  );
}

function NextButton({ children, onClick }) {
  return (
    <button className="next-button" onClick={onClick}>
      {children}
      <ArrowRight size={18} />
    </button>
  );
}

export default App;
