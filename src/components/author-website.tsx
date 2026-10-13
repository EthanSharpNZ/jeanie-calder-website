import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, Copy, Mail, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProgrammeInterestSelect } from "@/components/programme-interest-select";
import { ButterflyFeeSymbol } from "@/components/photo-butterfly";
import { DeferredButterfly as HeroButterfly } from "@/components/deferred-butterfly";
import { composeEnquiry, programmes, publicEmail, type Interest } from "@/lib/author-content";
import coverUrl from "@/assets/optimized/book-640.webp";
import coverSmall from "@/assets/optimized/book-320.webp";
import coverMedium from "@/assets/optimized/book-400.webp";
import coverLarge from "@/assets/optimized/book-960.webp";
const cover = { url: coverUrl };

const navItems = [{ href: "#book", label: "Book" }, { href: "#programmes", label: "Programmes" }, { href: "#about", label: "About" }];

function ImageCredit() {
  return <Dialog>
    <DialogTrigger asChild><Button variant="ghost" className="credit-trigger">Image credit</Button></DialogTrigger>
    <DialogContent>
      <DialogTitle className="font-display text-3xl font-normal">Butterfly image credits</DialogTitle>
      <DialogDescription>The book-corner animation uses transparent frames from a client-supplied video. The programme fee symbols use a separate photograph.</DialogDescription>
      <div className="image-credit-copy">
        <p>Static fee symbols: <a href="https://commons.wikimedia.org/wiki/File:Morpho_menelaus.png" target="_blank" rel="noreferrer">Morpho menelaus</a> — photograph by Gregory Phillips; transparent version by Lycaon.</p>
        <p>Fee photograph licensed under <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">Creative Commons Attribution-ShareAlike 3.0</a>. Changes: transparent WebP optimisation and resized display. This adaptation is shared under the same licence.</p>
        <p>This licence does not apply to the hero video, website or book cover. No endorsement by the photographers is implied.</p>
      </div>
    </DialogContent>
  </Dialog>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuDestination = useRef<string | null>(null);
  function closeToAnchor(href: string) {
    menuDestination.current = href;
    setMenuOpen(false);
  }
  return <header className="site-header">
    <div className="site-wrap header-inner">
      <a className="wordmark" href="#top" aria-label="Jeanie Calder home">Jeanie Calder</a>
      <nav aria-label="Main navigation" className="desktop-nav">
        {navItems.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}
        <Button asChild variant="author"><a href="#contact">Enquire<ArrowRight /></a></Button>
      </nav>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogTrigger asChild><Button variant="ghost" size="icon" className="mobile-trigger" aria-label="Open navigation menu"><Menu /></Button></DialogTrigger>
        <DialogContent onCloseAutoFocus={event => {
          const destination = menuDestination.current;
          if (!destination) return;
          event.preventDefault();
          menuDestination.current = null;
          const target = document.querySelector<HTMLElement>(destination);
          if (!target) return;
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.scrollIntoView({ block: "start" });
        }}>
          <DialogTitle className="font-display text-3xl font-normal">Jeanie Calder</DialogTitle>
          <DialogDescription>Explore the book and programmes.</DialogDescription>
          <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(item => <a key={item.href} href={item.href} onClick={() => closeToAnchor(item.href)}>{item.label}</a>)}</nav>
          <Button asChild variant="author"><a href="#contact" onClick={() => closeToAnchor("#contact")}>Enquire<ArrowRight /></a></Button>
        </DialogContent>
      </Dialog>
    </div>
  </header>;
}

function Contact({ interest, setInterest }: { interest: Interest; setInterest: (interest: Interest) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  useEffect(() => {
    setStatus("");
    setFallback("");
  }, [interest]);
  function readDraft() {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;
    const data = new FormData(form);
    return composeEnquiry({ name: String(data.get("name") ?? ""), email: String(data.get("email") ?? ""), interest, message: String(data.get("message") ?? "") });
  }
  function openDraft(event: FormEvent) {
    event.preventDefault();
    const draft = readDraft();
    if (!draft) return;
    window.location.href = draft.url;
    setStatus("Your email app is opening. Review and send your message there. If nothing opens, copy your message below.");
  }
  async function copyMessage() {
    const draft = readDraft();
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.text);
      setFallback("");
      setStatus("Message copied. Paste it into your email app, review it and send it to Jeanie.");
    } catch {
      setFallback(draft.text);
      setStatus("Automatic copying isn’t available. Select and copy the message below, then paste it into your email app.");
    }
  }
  return <section id="contact" className="site-wrap contact" aria-labelledby="contact-heading">
    <div className="contact-copy">
      <h2 id="contact-heading">Contact Jeanie</h2>
      <p>For book and programme enquiries.</p>
      <a className="contact-email" href={`mailto:${publicEmail}`}>{publicEmail}</a>
      <noscript><p className="form-helper">To enquire without JavaScript, use the email link above to contact Jeanie directly.</p></noscript>
    </div>
    <form ref={formRef} onSubmit={openDraft} className="contact-form">
      <div className="form-row">
        <div className="form-field"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required maxLength={120} placeholder="Your name" pattern=".*\S.*" /></div>
        <div className="form-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Your email address" /></div>
      </div>
      <div className="form-field"><label id="interest-label" htmlFor="interest">Programme interest</label><ProgrammeInterestSelect value={interest} onValueChange={setInterest} /></div>
      <div className="form-field"><label htmlFor="message">Message</label><textarea id="message" name="message" required maxLength={4000} placeholder="What would you like to ask Jeanie?" onChange={event => event.target.setCustomValidity(event.target.value.trim() ? "" : "Please enter a message.")} /></div>
      <div className="form-actions"><Button type="submit" variant="author">Open email draft<Mail /></Button><Button type="button" variant="editorial" onClick={copyMessage}><Copy />Copy message</Button></div>
      <p className="form-helper">Opens your email app. Review and send your message there.<br />Please don’t include sensitive health information. This website does not store or send your message.</p>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
      {fallback && <div className="form-field"><label htmlFor="copy-fallback">Your message — select and copy</label><textarea className="copy-fallback" id="copy-fallback" readOnly value={fallback} onFocus={event => event.target.select()} /></div>}
    </form>
  </section>;
}

export function AuthorWebsite() {
  const [interest, setInterest] = useState<Interest>("General enquiry");
  const [motionPaused, setMotionPaused] = useState(false);
  function enquire(value: Interest) { setInterest(value); }
  return <div id="top">
    <a href="#main" className="skip-link">Skip to content</a>
    <Header />
    <main id="main" tabIndex={-1}>
      <section id="book" className="site-wrap hero" aria-labelledby="hero-heading">
        <div className="hero-composition">
          <div className="book-stage"><div className="book-object"><img className="book-cover" src={cover.url} srcSet={`${coverSmall} 320w, ${coverMedium} 400w, ${cover.url} 640w, ${coverLarge} 960w`} sizes="(max-width: 350px) 174px, (max-width: 760px) 185px, (max-width: 1050px) 245px, 285px" alt="Front cover of How to Lose Weight and Keep It Off by Jeanie Calder, with a canyon beneath a blue sky and white lettering" width="1214" height="1795" loading="eager" fetchPriority="high" /><HeroButterfly paused={motionPaused} /></div></div>
          <div className="hero-copy"><h1 id="hero-heading">How to Lose Weight and Keep It Off</h1><p className="book-byline">Jeanie Calder · Olympia Publishers</p><p className="hero-intro">Explore Jeanie Calder’s book and programmes focused on food, self-acceptance and personal change.</p><div className="hero-actions"><Button asChild variant="author"><a href="#contact" onClick={() => enquire("Book enquiry")}>Ask about the book<ArrowRight /></a></Button><Button asChild variant="editorial"><a href="#programmes">View programmes<ArrowDown /></a></Button></div></div>
        </div>
      </section>
      <section id="programmes" aria-labelledby="programmes-heading">
        <div className="site-wrap programmes-intro"><h2 id="programmes-heading">Programmes</h2></div>
        {programmes.map(programme => <section key={programme.slug} className={`programme-band programme-${programme.theme}`} aria-labelledby={programme.slug}>
          <div className="site-wrap programme-inner"><div className="programme-content"><h3 id={programme.slug}>{programme.name}</h3><p>{programme.body}</p>{programme.slug === "teacher-of-teachers" && <div className="resume-note">Résumés may be emailed to <a href={`mailto:${publicEmail}`}>{publicEmail}</a>.</div>}</div><div className="programme-side"><p className="programme-fee"><ButterflyFeeSymbol /><span>{programme.fee}</span></p><Button asChild variant="editorial"><a href="#contact" onClick={() => enquire(programme.interest)}>{programme.cta}<ArrowRight /></a></Button></div></div>
        </section>)}
        <p className="site-wrap fee-note">Currency, tax and programme inclusions are to be confirmed.</p>
      </section>
      <section id="about" className="site-wrap about" aria-labelledby="about-heading">
        <h2 id="about-heading">About Jeanie Calder</h2><p>Jeanie Calder is the author of <cite>How to Lose Weight and Keep It Off</cite>. Her work explores our relationship with food, self-acceptance and nourishing life beyond food.</p>
      </section>
      <Contact interest={interest} setInterest={setInterest} />
    </main>
    <footer className="site-footer"><div className="site-wrap footer-inner"><a className="footer-name" href="#top">Jeanie Calder</a><div className="footer-controls"><ImageCredit /><Button type="button" variant="ghost" className="motion-toggle" aria-pressed={motionPaused} onClick={() => setMotionPaused(value => !value)}>{motionPaused ? "Resume animation" : "Pause animation"}</Button></div></div></footer>
  </div>;
}
