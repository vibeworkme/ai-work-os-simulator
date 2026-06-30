import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  Layers3,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRoundCog,
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
  { id: 1, label: "업무 선정" },
  { id: 2, label: "기준 자료 구성" },
  { id: 3, label: "AI 역할 설정" },
  { id: 4, label: "출력 형식 표준화" },
  { id: 5, label: "검토 루프" },
];

const benchmarkPrinciples = [
  { title: "업무 단위", text: "AI 도입은 도구가 아니라 반복 업무 하나를 고르는 것에서 시작합니다." },
  { title: "조직 자료", text: "기본 추천 자료에 우리 조직의 최신 자료를 추가해야 결과가 안정됩니다." },
  { title: "역할형 AI", text: "일반 챗봇이 아니라 특정 업무를 맡는 보조자로 역할을 고정합니다." },
  { title: "표준 출력", text: "결과물 형식을 맞춰야 팀원이 같은 기준으로 검토할 수 있습니다." },
  { title: "사람 검토", text: "AI 결과물은 초안이며 사실, 수치, 보안, 실행 가능성을 확인해야 합니다." },
];

const reviewChecklist = ["사실이 맞는가?", "수치와 날짜가 맞는가?", "사내 기준과 충돌하지 않는가?", "민감정보가 포함되어 있지 않은가?", "담당자와 기한이 명확한가?", "실행 가능한 내용인가?"];

function App() {
  const [selectedId, setSelectedId] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [customMaterialInput, setCustomMaterialInput] = useState("");
  const [customOutputInput, setCustomOutputInput] = useState("");
  const [customMaterialsByWork, setCustomMaterialsByWork] = useState({});
  const [customOutputsByWork, setCustomOutputsByWork] = useState({});
  const [roleByWork, setRoleByWork] = useState({});
  const [checkedReviews, setCheckedReviews] = useState([]);

  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedId),
    [selectedId],
  );

  const customMaterials = selectedId ? customMaterialsByWork[selectedId] ?? [] : [];
  const customOutputs = selectedId ? customOutputsByWork[selectedId] ?? [] : [];
  const sourceMaterials = selectedScenario ? [...selectedScenario.sourceMaterials, ...customMaterials] : [];
  const outputFormat = selectedScenario ? [...selectedScenario.outputFormat, ...customOutputs] : [];
  const roleText = selectedScenario ? roleByWork[selectedId] ?? selectedScenario.role : "";

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

  function chooseWork(id) {
    setSelectedId(id);
    setActiveStep(2);
    setCustomMaterialInput("");
    setCustomOutputInput("");
    setCheckedReviews([]);
  }

  function reset() {
    setSelectedId("");
    setActiveStep(1);
    setCustomMaterialInput("");
    setCustomOutputInput("");
    setCheckedReviews([]);
  }

  function addCustomMaterial() {
    const material = customMaterialInput.trim();
    if (!selectedId || !material) return;

    setCustomMaterialsByWork((current) => appendUnique(current, selectedId, material));
    setCustomMaterialInput("");
  }

  function removeCustomMaterial(material) {
    setCustomMaterialsByWork((current) => removeItem(current, selectedId, material));
  }

  function addCustomOutput() {
    const output = customOutputInput.trim();
    if (!selectedId || !output) return;

    setCustomOutputsByWork((current) => appendUnique(current, selectedId, output));
    setCustomOutputInput("");
  }

  function removeCustomOutput(output) {
    setCustomOutputsByWork((current) => removeItem(current, selectedId, output));
  }

  function updateRole(value) {
    if (!selectedId) return;
    setRoleByWork((current) => ({ ...current, [selectedId]: value }));
  }

  function toggleReview(item) {
    setCheckedReviews((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
    );
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(promptTemplate);
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">일반 직장인을 위한 AI 업무 운영 훈련</p>
          <h1>업무 하나를 골라 AI에게 맡기는 기준을 직접 만들어봅니다.</h1>
        </div>
        <button className="reset-button" onClick={reset}>
          <RefreshCw size={18} />
          처음부터
        </button>
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

          {activeStep === 2 && selectedScenario && (
            <StepCard
              icon={BookOpenCheck}
              title="2. 기준 자료 구성"
              text="추천 자료를 확인하고, 우리 조직에서 실제로 쓰는 최신 자료를 추가합니다."
            >
              <SuggestionList
                customItems={customMaterials}
                items={sourceMaterials}
                onRemoveCustom={removeCustomMaterial}
              />
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
                onRemoveCustom={removeCustomOutput}
                ordered
              />
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
              text="AI 결과물은 최종 답이 아니라 초안입니다. 아래 항목을 확인한 뒤 업무에 반영합니다."
            >
              <div className="review-grid">
                {reviewChecklist.map((item) => (
                  <button className={checkedReviews.includes(item) ? "is-checked" : ""} key={item} onClick={() => toggleReview(item)}>
                    <CheckCircle2 size={18} />
                    {item}
                  </button>
                ))}
              </div>
              <div className="completion-note">
                <CheckCircle2 size={20} />
                <p>{selectedScenario.work} 업무용 훈련 요청문이 완성되었습니다. 복사해서 실제 자료와 함께 사용해보세요.</p>
              </div>
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

          <div className="prompt-card">
            <div className="prompt-head">
              <h2>{activeStep >= 5 ? "훈련 요청문 완성" : "요청문 조립 중"}</h2>
              <button onClick={copyPrompt}>
                <Copy size={16} />
                복사
              </button>
            </div>
            <pre>{promptTemplate}</pre>
          </div>
        </aside>
      </section>
    </main>
  );
}

function appendUnique(current, key, item) {
  const currentItems = current[key] ?? [];
  if (currentItems.includes(item)) return current;
  return { ...current, [key]: [...currentItems, item] };
}

function removeItem(current, key, item) {
  return { ...current, [key]: (current[key] ?? []).filter((entry) => entry !== item) };
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

function SuggestionList({ customItems = [], items, onRemoveCustom, ordered = false }) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag className="suggestion-list">
      {items.map((item) => (
        <li className={customItems.includes(item) ? "is-custom" : ""} key={item}>
          <CheckCircle2 size={18} />
          <span>{item}</span>
          {customItems.includes(item) && (
            <button aria-label={`${item} 삭제`} onClick={() => onRemoveCustom(item)}>
              <X size={16} />
            </button>
          )}
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

function NextButton({ children, onClick }) {
  return (
    <button className="next-button" onClick={onClick}>
      {children}
      <ArrowRight size={18} />
    </button>
  );
}

export default App;
