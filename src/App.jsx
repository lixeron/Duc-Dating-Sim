import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { DOWNLOAD_PC, DOWNLOAD_MAC, RELEASES_PAGE } from './config.js'

gsap.registerPlugin(ScrollTrigger)

const MARQUEE = [
  'six endings', 'the hand', 'rainbow road', 'a boat that seats three',
  'no scaries', 'hrmm.', 'unlimited breadsticks', 'the poster',
  'seven turns', 'the covenant', 'one (1) cryptid',
]

const CAST = [
  {
    img: 'duc_normal', name: 'Duc', tag: 'the rizzler',
    bio: 'Information Systems major, creative writing minor, fired from campus IT and still not over it. Loves Olive Garden with his whole chest. Owns a poster of his own face and has made peace with it.',
    fact: 'His hand will end up on your thigh. There are no thoughts behind it.',
  },
  {
    img: 'zeb_sprite', name: 'Zeb', tag: 'the camera guy',
    bio: 'Facilities at Covecrest, where the kids are convinced he lives in the walls. Brings a camera to every function nobody invited it to, and every shot comes out perfect.',
    fact: 'Has a type. Will not say the word out loud. Duc says it for him.',
  },
  {
    img: 'owen_sprite', name: 'Owen', tag: 'the quiet one',
    bio: 'Shoots free throws alone when he needs to think. One playlist, all Ye. Deflects every emotional conversation directly into a LeBron take.',
    fact: 'Half the lore is his fault and he knows it.',
  },
  {
    img: 'james_sprite', name: 'James', tag: 'the gym',
    bio: 'Business administration, competitive lifter, runs the aux like a wartime radio post. Has held one specific Uno grudge since 2019 and has merch about it.',
    fact: 'Benched 275 and nobody clapped. He mentions this.',
  },
  {
    img: 'jack_sprite', name: 'Jack', tag: 'the silent one',
    bio: 'Neuroscience into chiropractic. Speaks roughly four times a month. When he does, careers end.',
    fact: '...',
  },
  {
    img: 'needam_sprite', name: 'Needam', tag: 'the beret',
    bio: 'National Guard, then something he only calls "a different organization." Knows a concerning amount about 1943 and will tell you unprompted.',
    fact: 'Owns the boat. Zero regrets about the boat.',
  },
  {
    img: 'ethan_sprite', name: 'Ethan', tag: 'the developer',
    bio: 'Builds games, websites, APIs, whatever holds still long enough. Made this. Has a girlfriend and mentions it like a personality trait.',
    fact: 'Three stickers over the laptop camera. Says it is just good practice.',
  },
]

const GAL_L = ['g_cg_firstsight', 'g_duc_uno', 'g_duc_loves_meat', 'g_zeb_cute', 'g_cg_owenlegs', 'g_believes_he_king', 'g_cg_datemountain', 'g_cbb_united']
const GAL_R = ['g_duc_highschool_olive_garden_with_will', 'g_meme_gang_up_on_you', 'g_needam_devious', 'g_cg_fieldsmile', 'g_tyrone', 'g_cg_married', 'g_duc_chungus', 'g_wholesome_with_me']

export default function App() {
  const heroTitle = useRef(null)
  const heroFrame = useRef(null)
  const colL = useRef(null)
  const colR = useRef(null)
  const galleryRef = useRef(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({ lerp: 0.1 })
    let velocity = 0
    lenis.on('scroll', (e) => { velocity = e.velocity })
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)

    if (!reduced) {
      const letters = heroTitle.current.querySelectorAll('span')
      gsap.from(letters, {
        y: 130, opacity: 0, rotate: () => gsap.utils.random(-16, 16),
        stagger: 0.04, duration: 1.05, ease: 'back.out(1.7)', delay: 0.15,
      })
      gsap.from(heroFrame.current, { y: 90, opacity: 0, rotate: 4, duration: 1.2, ease: 'power3.out', delay: 0.55 })
      gsap.to(heroFrame.current, { y: -14, rotate: -1.2, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 })

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 56, opacity: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
      gsap.from('.cast-card', {
        y: 70, opacity: 0, scale: 0.94, stagger: 0.07, duration: 0.7, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.cast-row', start: 'top 82%' },
      })
      gsap.utils.toArray('.drift').forEach((el, i) => {
        gsap.to(el, {
          y: -26, x: i % 2 ? 12 : -12, rotate: i % 2 ? 8 : -8,
          duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1,
        })
      })
    }

    // ---- gallery only responds while the cursor is over it ----
    let y1 = 0, y2 = 0, rafId
    let hovering = false
    const el = galleryRef.current
    const onEnter = () => { hovering = true }
    const onLeave = () => { hovering = false }
    if (el) {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    }
    const half = () => (colL.current ? colL.current.scrollHeight / 2 : 1)
    const tick = () => {
      const boost = hovering ? Math.min(Math.abs(velocity) * 5, 34) : 0
      const base = reduced ? 0 : 0.45
      y1 = (y1 + base + boost) % half()
      y2 = (y2 + base + boost) % half()
      if (colL.current) colL.current.style.transform = `translateY(${-y1}px)`
      if (colR.current) colR.current.style.transform = `translateY(${y2 - half()}px)`
      velocity *= 0.9
      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
      if (el) {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      }
      ScrollTrigger.killAll()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const title = 'Duc Dating Sim'

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="hero">
        <span className="drift heart h1">♥</span>
        <span className="drift heart h2">♥</span>
        <span className="drift heart h3">♥</span>

        <p className="eyebrow" data-reveal>a birthday gift that got out of hand</p>
        <h1 ref={heroTitle} aria-label={title}>
          {title.split('').map((ch, i) => (
            <span key={i}>{ch === ' ' ? '\u00A0' : ch}</span>
          ))}
        </h1>
        <p className="hero-sub">
          A dating sim about our friend Duc. Yes, really.<br />
          Six endings, one cryptid, and a Minecraft villager who objects to your wedding.
        </p>
        <div className="hero-frame" ref={heroFrame}>
          <div className="frame-bar"><i /><i /><i /></div>
          <video src="/assets/menu.webm" autoPlay muted loop playsInline />
        </div>
        <a className="scroll-cue" href="#play">get it ↓</a>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (<span key={i}>{t}<em>♥</em></span>))}
        </div>
      </div>

      {/* ============ ABOUT ============ */}
      <section className="about">
        <div className="about-grid">
          <div data-reveal>
            <h2>What is this</h2>
            <p>
              A full visual novel where you spend a week with Duc Vu and his friends, make
              an increasing number of questionable choices, and find out which of six
              endings you deserve.
            </p>
            <p>
              Every photo in it is real. Every piece of lore actually happened, mostly. The
              friends play themselves.
            </p>
          </div>
          <ul className="specs" data-reveal>
            <li><strong>Six endings</strong><span>two of them you have to work for</span></li>
            <li><strong>A couple hours</strong><span>longer if you read everything</span></li>
            <li><strong>Real minigames</strong><span>timed, loseable, unfair</span></li>
            <li><strong>Full soundtrack</strong><span>and a karaoke title screen</span></li>
            <li><strong>PC and Mac</strong><span>free, obviously</span></li>
          </ul>
        </div>
      </section>

      {/* ============ CAST ============ */}
      <section className="cast">
        <h2 data-reveal>The homies</h2>
        <p className="section-sub" data-reveal>click anybody for details. no real spoilers.</p>
        <div className="cast-row">
          {CAST.map((c) => (
            <button className="cast-card" key={c.name} onClick={() => setActive(c)}>
              <div className="cast-img"><img src={`/assets/${c.img}.png`} alt={c.name} loading="lazy" /></div>
              <span className="cast-name">{c.name}</span>
              <span className="cast-tag">{c.tag}</span>
            </button>
          ))}
        </div>
      </section>

      {active && (
        <div className="modal-wrap" onClick={() => setActive(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setActive(null)} aria-label="Close">✕</button>
            <img src={`/assets/${active.img}.png`} alt={active.name} />
            <div className="modal-body">
              <h3>{active.name}</h3>
              <p className="modal-tag">{active.tag}</p>
              <p>{active.bio}</p>
              <p className="modal-fact">{active.fact}</p>
            </div>
          </div>
        </div>
      )}

      {/* ============ GALLERY ============ */}
      <section className="gallery">
        <div className="gallery-copy" data-reveal>
          <h2>The evidence</h2>
          <p>
            Photos submitted by the group chat, used without anybody reading the terms.
            Hover the columns and scroll — they speed up with you.
          </p>
        </div>
        <div className="gallery-cols" ref={galleryRef}>
          <div className="gcol"><div className="gcol-inner" ref={colL}>
            {[...GAL_L, ...GAL_L].map((g, i) => <img key={i} src={`/assets/${g}.jpg`} alt="" loading="lazy" />)}
          </div></div>
          <div className="gcol"><div className="gcol-inner" ref={colR}>
            {[...GAL_R, ...GAL_R].map((g, i) => <img key={i} src={`/assets/${g}.jpg`} alt="" loading="lazy" />)}
          </div></div>
        </div>
      </section>

      {/* ============ DOWNLOAD ============ */}
      <section className="download" id="play">
        <h2 data-reveal>Duc Dating Sim</h2>
        <p className="section-sub" data-reveal>free download · PC and Mac</p>

        <div className="dl-row" data-reveal>
          <a className="dl-btn" href={DOWNLOAD_PC}>
            <span className="dl-os">Download for PC</span>
            <small>Windows · .zip</small>
          </a>
          <a className="dl-btn alt" href={DOWNLOAD_MAC}>
            <span className="dl-os">Download for Mac</span>
            <small>macOS · .zip</small>
          </a>
        </div>

        <div className="dl-notes" data-reveal>
          <p><strong>Windows</strong> will warn you about an unknown app. More info → Run anyway.</p>
          <p><strong>Mac</strong> may say it can't verify the developer. Right-click the app → Open → Open.</p>
          <p><strong>To play:</strong> unzip anywhere and run it. Save often — the Tyrone fight can be lost and Duc's life is on the line.</p>
          <p className="dl-alt"><a href={RELEASES_PAGE}>all releases on GitHub →</a></p>
        </div>
      </section>

      <footer>
        <p>made by Ethan Tran for Duc's 21st</p>
        <p className="foot-small">no rizzlers were harmed · one was briefly touched · he got better</p>
      </footer>
    </main>
  )
}
