import { useState } from 'react'
import { ChevronLeft, ChevronRight, Mail, ShieldCheck, Wrench, Users } from 'lucide-react'
import brandLogo from '../assets/square img0.png'
import williamPhoto from '../assets/square img3.png'
import williamPhoto1 from '../assets/square img5.png'
import williamPhoto2 from '../assets/square img6.png'
import './AboutPage.css'

const TEAM_MEMBERS = [
  {
    name: 'Jeng Heng (William) Lin',
    role: 'CEO',
    bio: 'Biomedical Engineer and Biomechanist',
    story:
      '期待以研究背景與產品思維，讓學術合作者能在平台上用更少的溝通成本找到彼此。',
    initials: 'WL',
    photo: williamPhoto,
    featured: true,
  },
  {
    name: 'Fang (Willy) Lin',
    role: 'CTO',
    bio: 'Data Scientist',
    story: '不敢社交的小小社畜，期待透過數據分析找到自己的價值。',
    initials: 'M2',
    photo: williamPhoto1,
    featured: true,
  },
  {
    name: 'Jui (Wasabi) Lin',
    role: 'CFO',
    bio: 'Researcher and Athlete',
    story: '熱愛運動與研究，其希望能透過平台幫助更多人找到自己的需求。',
    initials: 'M3',
    photo: williamPhoto2,
    featured: true,
  },
]

const VALUES = [
  {
    title: '透明流程',
    desc: '任務刊登、報價、承接與狀態更新皆可追蹤，降低溝通成本。',
    icon: Wrench,
  },
  {
    title: '學術信任',
    desc: '支援學術信箱驗證與 ORCID 連結，提升合作對象識別度。',
    icon: ShieldCheck,
  },
  {
    title: '長期共創',
    desc: '透過需求端與接案端持續回饋，逐步打造更可靠的研究媒合體驗。',
    icon: Users,
  },
]

export default function AboutPage() {
  const [activeMemberIdx, setActiveMemberIdx] = useState(0)
  const activeMember = TEAM_MEMBERS[activeMemberIdx]

  const handlePrevMember = () => {
    setActiveMemberIdx((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length)
  }

  const handleNextMember = () => {
    setActiveMemberIdx((prev) => (prev + 1) % TEAM_MEMBERS.length)
  }

  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>關於 AcadeBee</h1>
        <p>
          AcadeBee 致力於連結研究需求方與專業接案者，提供更透明、可追蹤且可信任的學術任務媒合流程。
        </p>
      </section>

      <section className="about-section">
        <h2>我們在做什麼</h2>
        <div className="about-values-grid">
          {VALUES.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="about-value-card">
                <Icon size={20} className="about-value-icon" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="about-section">
        <h2>開發團隊</h2>
        <p className="about-section-note">以下為暫定資料，後續可替換為正式成員資訊與照片。</p>
        <div className="about-team-carousel">
          <button type="button" className="about-team-nav-btn" onClick={handlePrevMember} aria-label="上一位成員">
            <ChevronLeft size={18} />
          </button>

          <article className="about-team-card about-team-card-featured">
            <div className="about-team-media">
              <div className="about-team-bg-decor" aria-hidden="true" />
              <div className="about-team-left">
                <div className="about-team-intro">
                  <p className="about-team-intro-eyebrow">個人願景</p>
                  <p className="about-team-intro-story">
                    {activeMember.story || activeMember.bio}
                  </p>
                </div>
                <div className="about-team-media-overlay">
                  <div className="about-team-media-heading">
                    <span className="about-team-role">{activeMember.role}</span>
                    <span className="about-team-heading-sep" aria-hidden="true">
                      |
                    </span>
                    <span className="about-team-name-inline">{activeMember.name}</span>
                  </div>
                  <p>{activeMember.bio}</p>
                </div>
              </div>
              <div
                className={`about-team-photo-frame${activeMember.photo ? '' : ' about-team-photo-frame-placeholder'}`}
              >
                <div className="about-team-photo-brand" aria-hidden="true">
                  <img src={brandLogo} alt="" className="about-team-photo-brand-mark" />
                  <span className="about-team-photo-brand-text">
                    <span className="about-team-photo-brand-acade">Acade</span>
                    <span className="about-team-photo-brand-bee">Bee</span>
                  </span>
                </div>
                {activeMember.photo ? (
                  <img
                    src={activeMember.photo}
                    alt={`${activeMember.name} photo`}
                    className="about-team-photo-featured"
                  />
                ) : (
                  <div className="about-team-avatar about-team-avatar-featured" aria-hidden="true">
                    {activeMember.initials}
                  </div>
                )}
              </div>
            </div>
          </article>

          <button type="button" className="about-team-nav-btn" onClick={handleNextMember} aria-label="下一位成員">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="about-team-carousel-indicators" aria-hidden="true">
          {TEAM_MEMBERS.map((member, idx) => (
            <span
              key={member.name}
              className={`about-team-dot ${idx === activeMemberIdx ? 'active' : ''}`}
            />
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>聯絡我們</h2>
        <div className="about-contact-card">
          <Mail size={18} />
          <div>
            <p className="about-contact-label">合作、建議與問題回報</p>
            <p className="about-contact-value">acadebeeresearchhub@gmail.com</p>
          </div>
        </div>
      </section>

      <section className="about-disclaimer">
        <p>聲明：AcadeBee 為獨立技術平台，非任何學校或研究機構之官方代表單位。</p>
      </section>
    </div>
  )
}
