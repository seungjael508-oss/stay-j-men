"use client";

import { useState } from "react";

type Tab = "my" | "today" | "ask";
type OnboardingStep = 1 | 2 | 3;

const followSteps = [
  { title: "왁스는 콩알만큼", body: "많이 덜면 머리가 무겁고 떡져 보입니다." },
  { title: "손바닥에 10초", body: "왁스가 투명해질 때까지 손바닥 전체에 펴주세요." },
  { title: "뒤에서 앞으로", body: "앞머리부터 바르지 말고 뒷머리부터 털듯이 발라주세요." },
  { title: "앞머리 세 가닥", body: "손가락 끝으로 앞머리를 세 가닥만 가볍게 잡아주세요." },
  { title: "끝. 오늘 머리 완성 ✓", body: "거울에서 정면만 확인하고 더 만지지 마세요." },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("my");
  const [onboarding, setOnboarding] = useState<OnboardingStep | null>(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [done, setDone] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [chat, setChat] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  const moveToToday = () => setTab("today");
  const openGuide = () => {
    setGuideStep(0);
    setGuideOpen(true);
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="phone" aria-label="Stay J 남성 스타일 어드바이저 프로토타입">
        <div className="status-strip"><span>9:41</span><span>STAY J</span><span>●●●</span></div>
        <div className="screen">
          {tab === "my" && <MyScreen onToday={moveToToday} onReport={() => setReportOpen(true)} />}
          {tab === "today" && <TodayScreen done={done} onDone={() => setDone(true)} onGuide={openGuide} />}
          {tab === "ask" && <AskScreen chat={chat} setChat={setChat} question={question} setQuestion={setQuestion} />}
        </div>

        <nav className="bottom-nav" aria-label="주요 메뉴">
          {(["my", "today", "ask"] as Tab[]).map((item) => (
            <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
              <span className="nav-dot" />{item.toUpperCase()}
            </button>
          ))}
        </nav>
      </section>

      {onboarding && (
        <div className="overlay onboarding-overlay" role="dialog" aria-modal="true" aria-label="온보딩">
          <div className="onboarding-card">
            <div className="brand-mark">STAY J <span>/ MEN</span></div>
            {onboarding === 1 && (
              <>
                <div className="photo-visual" aria-hidden="true"><div className="face-outline" /><div className="body-outline" /><span>02 PHOTOS</span></div>
                <p className="eyebrow">FIRST, LET US SEE YOU</p>
                <h1>사진 두 장이면<br />됩니다.</h1>
                <p className="lead">얼굴과 전신 사진만 올려주세요.<br />나머지는 저희가 알아냅니다.</p>
                <div className="button-row">
                  <button className="secondary-button" onClick={() => setOnboarding(2)}>카메라</button>
                  <button className="primary-button" onClick={() => setOnboarding(2)}>갤러리</button>
                </div>
              </>
            )}
            {onboarding === 2 && (
              <div className="analysis-state">
                <div className="scan-ring"><span>J</span></div>
                <p className="eyebrow">ANALYZING</p>
                <h2>민수님을 알아가는 중</h2>
                <p>퍼스널컬러 · 체형 · 피부 · 얼굴형</p>
                <button className="primary-button" onClick={() => setOnboarding(3)}>분석 결과 보기</button>
              </div>
            )}
            {onboarding === 3 && (
              <div className="result-state">
                <p className="eyebrow">YOUR STYLE STANDARD</p>
                <h1>이제 기준이<br />생겼습니다.</h1>
                <div className="mini-result">
                  <strong>SUMMER COOL</strong>
                  <span>여름 쿨톤 · 내추럴 골격</span>
                  <span>지성·수분 부족 · 이마가 넓은 편</span>
                </div>
                <p className="lead">사진 2장으로 완성한<br />나만의 스타일 기준</p>
                <button className="primary-button" onClick={() => setOnboarding(null)}>MY 시작하기</button>
              </div>
            )}
          </div>
        </div>
      )}

      {guideOpen && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="헤어 따라하기">
          <div className="guide-card">
            <button className="close" onClick={() => setGuideOpen(false)} aria-label="닫기">×</button>
            <div className="progress-label">STEP {guideStep + 1} / {followSteps.length}</div>
            <div className="guide-progress"><i style={{ width: `${((guideStep + 1) / followSteps.length) * 100}%` }} /></div>
            <div className="guide-number">0{guideStep + 1}</div>
            <h2>{followSteps[guideStep].title}</h2>
            <p>{followSteps[guideStep].body}</p>
            <div className="gesture-visual"><span>{guideStep === 0 ? "●" : guideStep === 1 ? "↻" : guideStep === 2 ? "←" : "⋮"}</span></div>
            {guideStep < followSteps.length - 1 ? (
              <button className="primary-button" onClick={() => setGuideStep((v) => v + 1)}>다음 단계</button>
            ) : (
              <button className="primary-button" onClick={() => setGuideOpen(false)}>했어요 · 오늘 머리 완성</button>
            )}
          </div>
        </div>
      )}

      {reportOpen && <ReportOverlay onClose={() => setReportOpen(false)} />}
    </main>
  );
}

function Header({ title }: { title: string }) {
  return <header className="topbar"><h1>{title}</h1><button aria-label="설정">⌁</button></header>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="section-label"><span>{children}</span><i /></div>;
}

function MyScreen({ onToday, onReport }: { onToday: () => void; onReport: () => void }) {
  return <div className="page my-page">
    <Header title="MY" />
    <section className="diagnosis-card">
      <p>민수님의 스타일 기준</p>
      <div className="diagnosis-divider" />
      <span className="result-code">SUMMER COOL</span>
      <h2>여름 쿨톤</h2>
      <p className="translation">네이비·그레이가 잘 맞아요</p>
      <div className="profile-lines">
        <p><strong>내추럴 골격</strong><span>세미오버핏이 자연스러워요</span></p>
        <p><strong>지성 · 수분 부족</strong><span>수분 관리가 먼저예요</span></p>
        <p><strong>이마가 넓은 편</strong><span>가벼운 앞머리가 잘 맞아요</span></p>
      </div>
      <button className="text-link" onClick={onReport}>전체 진단 리포트 →</button>
    </section>

    <section><SectionLabel>MY COLOR</SectionLabel>
      <div className="color-row"><span>잘 받는 색</span><div>{["#E9ECEC", "#AAB8C4", "#7A9BB8", "#526C83", "#26394B"].map(c => <i key={c} style={{background:c}} />)}</div></div>
      <div className="color-row muted"><span>피하면 좋은 색</span><div>{["#E3A15A", "#B76C42", "#9C7C35"].map(c => <i key={c} style={{background:c}} />)}</div></div>
    </section>

    <section><SectionLabel>MY CONDITION</SectionLabel>
      <div className="condition"><div><span>이발 주기</span><b>5주차 / 6주</b></div><div className="bar"><i /></div></div>
      <div className="condition skin"><div><span>피부 상태</span><b>수분 부족</b></div><p>지난주보다 개선 <em>↑</em></p></div>
    </section>

    <button className="today-preview" onClick={onToday}>
      <span>TODAY</span><strong>오늘은 네이비 셔츠로 가세요.</strong><p>얼굴이 가장 깔끔해 보여요.</p><i>오늘의 조언 전체 보기 →</i>
    </button>
  </div>;
}

function TodayScreen({ done, onDone, onGuide }: { done: boolean; onDone: () => void; onGuide: () => void }) {
  const [dressOpen, setDressOpen] = useState(false);
  const [pointOpen, setPointOpen] = useState(false);
  return <div className="page today-page">
    <Header title="TODAY" />
    <section className={`hero-task ${done ? "done" : ""}`}>
      {!done ? <><p>오늘 할 일</p><h2>선크림 바르기</h2><span>지성 피부도 수분이 부족하면<br />피부가 더 번들거릴 수 있어요.</span><button className="primary-button" onClick={onDone}>했어요</button></> : <><div className="done-check">✓</div><h2>좋아요. 오늘은 이걸로 끝.</h2><span>다음 이발까지 8일 남았어요.<br />필요할 때 알려드릴게요.</span></>}
    </section>
    <div className="weather"><b>JUL 10 · THU</b><span>29°</span><em>UV 강함</em></div>
    <section><SectionLabel>O U T F I T</SectionLabel>
      <div className="outfit-grid"><article><div className="cloth white-shirt"><span /></div><small>TOP</small><h3>화이트 반팔 셔츠</h3><p>쿨톤에 흰색이 가장 깨끗해요</p></article><article><div className="cloth trousers"><span /><span /></div><small>BOTTOM</small><h3>그레이 와이드 슬랙스</h3><p>내추럴 골격엔 세미와이드</p></article></div>
      <button className="text-link wide" onClick={() => setDressOpen(v => !v)}>이대로 입는 법 {dressOpen ? "닫기 ↑" : "→"}</button>
      {dressOpen && <div className="inline-steps"><p><b>1</b> 셔츠 단추는 위에서 하나만</p><p><b>2</b> 소매는 손목이 보이게 한 번</p><p><b>3</b> 셔츠 앞부분만 살짝 넣기</p><p><b>4</b> 바지 밑단은 신발 위에 쌓이지 않게</p></div>}
    </section>
    <section className="hair-card"><SectionLabel>H A I R</SectionLabel><h2>시스루 댄디</h2><p>이마가 넓은 편이라 앞머리를 살짝 내리는 게 유리해요.</p><strong>왁스 콩알만큼 · 아침 3분</strong><button className="text-link" onClick={onGuide}>3분 따라 하기 →</button></section>
    <button className="haircut-alert"><span>✂</span><div><b>이발 5주차</b><small>슬슬 다듬을 때</small></div><i>예약 →</i></button>
    <section><SectionLabel>G R O O M I N G</SectionLabel><div className="groom-list"><p><span>☀</span><b>선크림</b><em>무기자차 · 지성용 산뜻한 타입</em></p><p><span>◌</span><b>수분 세럼</b><em>수분 부족하면 유분이 더 올라와요</em></p><p><span>⌁</span><b>눈썹 정리</b><em>이것만 해도 인상이 달라져요</em></p></div></section>
    <section><SectionLabel>P O I N T</SectionLabel><button className="point-card" onClick={() => setPointOpen(v=>!v)}><small>TODAY&apos;S ONE</small><h3>실버 메탈 시계</h3><p>쿨톤엔 골드보다 실버.<br />이거 하나면 충분해요.</p><i>{pointOpen ? "왼쪽 손목 · 소매에서 살짝만" : "착용 위치 보기 →"}</i></button></section>
  </div>;
}

function AskScreen({ chat, setChat, question, setQuestion }: { chat: string | null; setChat: (v:string|null)=>void; question:string; setQuestion:(v:string)=>void }) {
  const sos = ["머리 망가짐", "옷 얼룩", "피부 뒤집어짐", "비 맞음"];
  const submit = () => { if(question.trim()) { setChat(question); setQuestion(""); } };
  return <div className="page ask-page"><Header title="ASK" />
    <p className="eyebrow">YOUR PERSONAL ADVISOR</p><h2>무엇이든<br />물어보세요.</h2><p className="ask-lead">급한 순간에도 고민하지 마세요.<br />지금 할 것 하나만 알려드릴게요.</p>
    <SectionLabel>QUICK SOS</SectionLabel><div className="sos-grid">{sos.map((s,i)=><button key={s} onClick={()=>setChat(s)}><span>{["〰","◫","◌","☂"][i]}</span>{s}<i>→</i></button>)}</div>
    {chat && <div className="advisor-answer"><small>STAY J ADVISOR</small><h3>{chat === "머리 망가짐" ? "물로 다시 적시지 마세요." : chat === "옷 얼룩" ? "문지르지 마세요." : chat === "피부 뒤집어짐" ? "오늘은 진정만 하세요." : chat === "비 맞음" ? "마른 수건부터 찾으세요." : "오늘 기준으로 바로 정리해드릴게요."}</h3><p>지금은 하나만 하면 됩니다.</p><ol><li>휴지나 마른 수건으로 가볍게 눌러주세요.</li><li>손으로 비비거나 새 제품을 바르지 마세요.</li><li>상태가 계속 불편하면 전문가에게 확인하세요.</li></ol><button className="primary-button" onClick={()=>setChat(null)}>했어요</button></div>}
    <div className="ask-input"><input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="소개팅인데 뭐 입지?" aria-label="질문 입력"/><button onClick={submit} aria-label="질문 보내기">↑</button></div>
  </div>;
}

function ReportOverlay({ onClose }: { onClose: () => void }) {
  return <div className="overlay" role="dialog" aria-modal="true"><div className="report-card"><button className="close" onClick={onClose}>×</button><p className="eyebrow">FULL DIAGNOSIS</p><h2>민수님의<br />스타일 기준</h2>{[["COLOR","여름 쿨톤","네이비·그레이·화이트"],["BODY","내추럴 골격","세미오버·곧은 실루엣"],["SKIN","지성·수분 부족","가볍게 수분부터"],["HAIR","이마가 넓은 편","가벼운 앞머리"]].map(x=><div className="report-row" key={x[0]}><small>{x[0]}</small><b>{x[1]}</b><span>{x[2]}</span></div>)}<button className="primary-button" onClick={onClose}>확인했어요</button></div></div>;
}
