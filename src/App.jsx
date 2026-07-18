import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { DOWNLOAD_URL_WINDOWS, DOWNLOAD_URL_MAC, GAME_VERSION, GAME_SIZE } from './config.js'

gsap.registerPlugin(ScrollTrigger)

const MARQUEE = [
  'six endings', 'the hand', 'rainbow road', 'the boat', 'no scaries',
  'hrmm.', 'the aura clash', 'unlimited breadsticks', 'the poster',
  'zesty things', 'seven turns', 'the covenant',
]

const CAST = [
  { img: 'duc_normal',    name: 'Duc',    line: 'the rizzler himself. it is his passion.' },
  { img: 'zeb_sprite',    name: 'Zeb',    line: 'certified napper. will officiate your wedding.' },
  { img: 'owen_sprite',   name: 'Owen',   line: 'rebounds every one like it\u2019s an honor.' },
  { img: 'james_sprite',  name: 'James',  line: 'benched 275 and nobody clapped.' },
  { img: 'jack_sprite',   name: 'Jack',   line: '\u2026' },
  { img: 'needam_sprite', name: 'Needam', line: 'the boat was the venue. zero regrets.' },
  { img: 'ethan_sprite',  name: 'Ethan',  line: 'keeps the records. not a writer.' },
]

const GALLERY_L = ['g_cg_firstsight', 'g_duc_uno', 'g_duc_loves_meat', 'g_zeb_cute', 'g_cg_owenlegs', 'g_believes_he_king', 'g_cg_datemountain', 'g_cbb_united']
const GALLERY_R = ['g_duc_highschool_olive_garden_with_will', 'g_meme_gang_up_on_you', 'g_needam_devious', 'g_cg_fieldsmile', 'g_tyrone', 'g_cg_married', 'g_duc_chungus', 'g_wholesome_with_me']

export default function App() {
  const heroTitle = useRef(null)
  const heroFrame = useRef(null)
  const colL = useRef(null)
  const colR = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // smooth scroll
    const lenis = new Lenis({ lerp: 0.1 })
    let velocity = 0
    lenis.on('scroll', (e) => { velocity = e.velocity })
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)

    if (!reduced) {
      // hero title: letters tumble in
      const letters = heroTitle.current.querySelectorAll('span')
      gsap.from(letters, {
        y: 120, opacity: 0, rotate: () => gsap.utils.random(-14, 14),
        stagger: 0.045, duration: 1.1, ease: 'back.out(1.6)', delay: 0.2,
      })
      // game window: settle in, then bob forever
      gsap.from(heroFrame.current, { y: 80, opacity: 0, rotate: 4, duration: 1.2, ease: 'power3.out', delay: 0.6 })
      gsap.to(heroFrame.current, { y: -14, rotate: -1.2, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 })

      // section reveals
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
      // cast cards stagger
      gsap.from('.cast-card', {
        y: 80, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.cast-row', start: 'top 80%' },
      })
    }

    // velocity gallery: two columns, opposite directions, scroll speeds them up
    let y1 = 0, y2 = 0, rafId
    const half = () => colL.current ? colL.current.scrollHeight / 2 : 1
    function tick() {
      const boost = Math.min(Math.abs(velocity) * 4, 30)
      const base = reduced ? 0 : 0.6
      y1 = (y1 + base + boost) % half()
      y2 = (y2 + base + boost) % half()
      if (colL.current) colL.current.style.transform = `translateY(${-y1}px)`
      if (colR.current) colR.current.style.transform = `translateY(${y2 - half()}px)`
      velocity *= 0.9
      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => { lenis.destroy(); cancelAnimationFrame(rafId); ScrollTrigger.killAll() }
  }, [])

  const title = "Duc's Passion"

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="hero">
        <p className="eyebrow" data-reveal>a gift for duc vu &bull; turning 21</p>
        <h1 ref={heroTitle} aria-label="Duc's Passion">
          {title.split('').map((ch, i) => (
            <span key={i} className={ch === ' ' ? 'sp' : ''}>{ch === ' ' ? '\u00A0' : ch}</span>
          ))}
        </h1>
        <p className="hero-sub">
          a dating sim about our friend. yes, really.<br />
          six endings. one villager. zero apologies.
        </p>
        <div className="hero-frame" ref={heroFrame}>
          <div className="frame-bar"><i /><i /><i /></div>
          <video src="/assets/menu.webm" autoPlay muted loop playsInline />
        </div>
        <a className="scroll-cue" href="#play">scroll &darr;</a>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>{t}<em>&hearts;</em></span>
          ))}
        </div>
      </div>

      {/* ============ CAST ============ */}
      <section className="cast">
        <h2 data-reveal>the homies</h2>
        <p className="section-sub" data-reveal>every one of them is real. that&rsquo;s the problem.</p>
        <div className="cast-row">
          {CAST.map((c) => (
            <figure className="cast-card" key={c.name}>
              <div className="cast-img"><img src={`/assets/${c.img}.png`} alt={c.name} loading="lazy" /></div>
              <figcaption>
                <strong>{c.name}</strong>
                <span>{c.line}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ EVIDENCE GALLERY ============ */}
      <section className="gallery">
        <div className="gallery-copy" data-reveal>
          <h2>the evidence</h2>
          <p>
            every photo in the game is real and was submitted by the group chat.
            scroll faster. they move faster. that&rsquo;s the whole feature.
          </p>
        </div>
        <div className="gallery-cols">
          <div className="gcol"><div className="gcol-inner" ref={colL}>
            {[...GALLERY_L, ...GALLERY_L].map((g, i) => <img key={i} src={`/assets/${g}.jpg`} alt="" loading="lazy" />)}
          </div></div>
          <div className="gcol"><div className="gcol-inner" ref={colR}>
            {[...GALLERY_R, ...GALLERY_R].map((g, i) => <img key={i} src={`/assets/${g}.jpg`} alt="" loading="lazy" />)}
          </div></div>
        </div>
      </section>

      {/* ============ DOWNLOAD ============ */}
      <section className="download" id="play">
        <h2 data-reveal>play it</h2>
        <p className="section-sub" data-reveal>now available for both platforms.</p>
        
        <div className="dl-platforms" data-reveal>
          <a className="dl-btn" href={DOWNLOAD_URL_WINDOWS}>
            <span>Download for Windows</span>
            <small>{GAME_VERSION} &bull; {GAME_SIZE}</small>
          </a>
          <a className="dl-btn" href={DOWNLOAD_URL_MAC}>
            <span>Download for macOS</span>
            <small>{GAME_VERSION} &bull; {GAME_SIZE}</small>
          </a>
        </div>

        <div className="dl-notes" data-reveal>
          <p><strong>windows will warn you</strong> about an unknown app. click &ldquo;more info&rdquo; &rarr; &ldquo;run anyway.&rdquo; i&rsquo;m an IT guy, trust me.</p>
          <p><strong>mac users:</strong> if it says the app is damaged or from an unidentified developer, right-click the app and choose &ldquo;Open&rdquo; or check System Settings &rarr; Privacy & Security.</p>
          <p><strong>how to play:</strong> unzip anywhere, launch the executable, and save often. the tyrone fight is loseable and duc&rsquo;s life is in your hands.</p>
          <p><strong>linux:</strong> ask ethan nicely.</p>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer>
        <p>made by ethan tran for duc&rsquo;s 21st</p>
        <p className="foot-small">no rizzlers were harmed &bull; one was briefly touched &bull; he got better</p>
      </footer>
    </main>
  )
}