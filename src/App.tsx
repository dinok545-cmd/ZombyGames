import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  Crosshair,
  Heart,
  LockKeyhole,
  Map,
  Music,
  RotateCcw,
  Shield,
  Skull,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { clothes, past, pronouns, type Q } from "./data";
import { raceMusic } from "./raceMusic";
type Screen = "home" | "map" | "game" | "result" | "victory";
type Game = "past" | "pronouns" | "clothes";
const meta = {
  past: {
    place: "SCHOOL DISTRICT",
    title: "Defense Line",
    topic: "PAST SIMPLE",
    goal: 7,
  },
  pronouns: {
    place: "DOWNTOWN",
    title: "Zombie Memory",
    topic: "PRONOUNS",
    goal: 6,
  },
  clothes: {
    place: "SHOPPING MALL",
    title: "Word Cage",
    topic: "CLOTHES",
    goal: 8,
  },
} as const;
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
export function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [game, setGame] = useState<Game>("past");
  const [cleared, setCleared] = useState<Game[]>([]);
  const [score, setScore] = useState(0);
  const [muted, setMuted] = useState(
    () => localStorage.getItem("ze-muted") === "1",
  );
  const [musicMuted, setMusicMuted] = useState(
    () => localStorage.getItem("ze-music-muted") === "1",
  );
  const [result, setResult] = useState({
    correct: 0,
    total: 10,
    won: false,
    score: 0,
  });
  useEffect(() => {
    localStorage.removeItem("ze-cleared");
  }, []);
  const audio = useRef<AudioContext | null>(null);
  const sfx = useCallback(
    (ok = true) => {
      if (muted) return;
      const C = window.AudioContext || window.webkitAudioContext;
      audio.current ??= new C();
      const ctx = audio.current,
        o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = ok ? "square" : "sawtooth";
      o.frequency.setValueAtTime(ok ? 280 : 120, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(
        ok ? 620 : 70,
        ctx.currentTime + 0.14,
      );
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.17);
    },
    [muted],
  );
  const toggle = () => {
    setMuted((v) => {
      const next = !v;
      localStorage.setItem("ze-muted", next ? "1" : "0");
      return next;
    });
  };
  const toggleMusic = () => {
    setMusicMuted((value) => {
      const next = !value;
      localStorage.setItem("ze-music-muted", next ? "1" : "0");
      raceMusic.setMuted(next);
      return next;
    });
  };
  const openMap = () => {
    raceMusic.start(musicMuted, "menu");
    setScreen("map");
  };
  const start = (g: Game) => {
    raceMusic.start(musicMuted, g);
    setGame(g);
    setScreen("game");
  };
  const leaveGame = () => {
    raceMusic.start(musicMuted, "menu");
    setScreen("map");
  };
  const finish = (correct: number, total: number, points: number) => {
    raceMusic.start(musicMuted, "menu");
    const won = correct >= meta[game].goal;
    setScore((s) => s + points);
    setResult({ correct, total, won, score: points });
    if (won && !cleared.includes(game)) setCleared([...cleared, game]);
    setScreen(won && cleared.length === 2 ? "victory" : "result");
  };
  return (
    <main className={`app screen-${screen}`}>
      <AudioControls
        musicMuted={musicMuted}
        soundMuted={muted}
        toggleMusic={toggleMusic}
        toggleSound={toggle}
      />
      {screen === "home" && (
        <Home onStart={openMap} muted={muted} toggle={toggle} />
      )}
      {screen === "map" && (
        <CityMap
          cleared={cleared}
          score={score}
          start={start}
          home={() => setScreen("home")}
          muted={muted}
          toggle={toggle}
        />
      )}
      {screen === "game" && (
        <GameScreen
          key={game + Date.now()}
          game={game}
          finish={finish}
          back={leaveGame}
          sfx={sfx}
          muted={muted}
          toggle={toggle}
        />
      )}
      {screen === "result" && (
        <Result
          result={result}
          game={game}
          replay={() => start(game)}
          map={() => setScreen("map")}
        />
      )}
      {screen === "victory" && (
        <Victory
          score={score + result.score}
          reset={() => {
            localStorage.removeItem("ze-cleared");
            setCleared([]);
            setScore(0);
            setScreen("home");
          }}
        />
      )}
    </main>
  );
}
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
function Sound({ muted, toggle }: { muted: boolean; toggle: () => void }) {
  void muted;
  void toggle;
  return null;
}
function AudioControls({
  musicMuted,
  soundMuted,
  toggleMusic,
  toggleSound,
}: {
  musicMuted: boolean;
  soundMuted: boolean;
  toggleMusic: () => void;
  toggleSound: () => void;
}) {
  return (
    <div className="audio-controls" aria-label="Audio settings">
      <button
        className={musicMuted ? "is-muted" : ""}
        onClick={toggleMusic}
        aria-pressed={musicMuted}
        aria-label={musicMuted ? "Turn music on" : "Turn music off"}
      >
        {musicMuted ? <VolumeX /> : <Music />}
        <span>MUSIC</span>
      </button>
      <button
        className={soundMuted ? "is-muted" : ""}
        onClick={toggleSound}
        aria-pressed={soundMuted}
        aria-label={soundMuted ? "Turn sound on" : "Turn sound off"}
      >
        {soundMuted ? <VolumeX /> : <Volume2 />}
        <span>SOUND</span>
      </button>
    </div>
  );
}
function Home({
  onStart,
  muted,
  toggle,
}: {
  onStart: () => void;
  muted: boolean;
  toggle: () => void;
}) {
  return (
    <section className="hero">
      <header className="top">
        <div className="brand">
          <Skull /> ZE // OUTBREAK
        </div>
        <Sound muted={muted} toggle={toggle} />
      </header>
      <div className="hero-copy">
        <p className="eyebrow">
          <span /> ENGLISH SURVIVAL PROGRAM // A1–A2
        </p>
        <h1>
          ZOMBIE
          <br />
          <em>ENGLISH</em>
        </h1>
        <p className="lead">
          Learn English. Beat the infected.
          <br />
          Save the city one area at a time.
        </p>
        <button className="primary huge" onClick={onStart}>
          SAVE THE CITY <ChevronRight />
        </button>
        <div className="mission">
          <span>03</span>
          <p>
            <b>INFECTED AREAS</b>
            <br />
            Your English can stop the outbreak.
          </p>
        </div>
      </div>
      <footer className="hero-foot">
        SIGNAL FOUND <i />
        <span>PROGRESS RESETS WHEN YOU REFRESH</span>
      </footer>
    </section>
  );
}
function CityMap({
  cleared,
  score,
  start,
  home,
  muted,
  toggle,
}: {
  cleared: Game[];
  score: number;
  start: (g: Game) => void;
  home: () => void;
  muted: boolean;
  toggle: () => void;
}) {
  return (
    <section className="map-page">
      <header className="top">
        <button className="back" onClick={home}>
          <ArrowLeft /> HOME
        </button>
        <div className="brand">
          <Skull /> ZOMBIE ENGLISH
        </div>
        <div className="top-actions">
          <span>
            SCORE <b>{score.toString().padStart(4, "0")}</b>
          </span>
          <Sound muted={muted} toggle={toggle} />
        </div>
      </header>
      <div className="map-head">
        <div>
          <p className="eyebrow">
            <span /> OPERATION: CLEAN CITY
          </p>
          <h2>
            INFECTION <em>MAP</em>
          </h2>
        </div>
        <p>
          Choose an area and start a learning mission.
          <br />
          Clear all three areas to save the city.
        </p>
      </div>
      <div className="districts">
        {(["past", "pronouns", "clothes"] as Game[]).map((g, i) => (
          <article
            key={g}
            className={`district d${i + 1} ${cleared.includes(g) ? "clean" : ""}`}
          >
            <div className="district-art">
              <span className="number">0{i + 1}</span>
              <span className="status">
                {cleared.includes(g) ? (
                  <>
                    <Check /> CLEAR
                  </>
                ) : (
                  <>INFECTED</>
                )}
              </span>
              <div className="pin">
                {i === 0 ? <Shield /> : i === 1 ? <Zap /> : <Crosshair />}
              </div>
            </div>
            <div className="district-info">
              <small>{meta[g].place}</small>
              <h3>{meta[g].title}</h3>
              <div className="topic">
                <span>{meta[g].topic}</span>
                <span>{g === "pronouns" ? "12 TASKS" : "10 TASKS"}</span>
              </div>
              <p>
                {g === "past"
                  ? "Choose the correct verb form in the Past Simple."
                  : g === "pronouns"
                    ? "Catch the infected while recalling English pronouns."
                    : "Type the clothing word and catch the zombie."}
              </p>
              <button onClick={() => start(g)}>
                {cleared.includes(g) ? "PLAY AGAIN" : "START MISSION"}{" "}
                <ChevronRight />
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="campaign">
        <b>MISSION PROGRESS</b>
        <div className="bar">
          <i style={{ width: `${(cleared.length / 3) * 100}%` }} />
        </div>
        <strong>{cleared.length} / 3 AREAS CLEAR</strong>
      </div>
    </section>
  );
}
function GameScreen({
  game,
  finish,
  back,
  sfx,
  muted,
  toggle,
}: {
  game: Game;
  finish: (c: number, t: number, p: number) => void;
  back: () => void;
  sfx: (ok?: boolean) => void;
  muted: boolean;
  toggle: () => void;
}) {
  if (game === "pronouns")
    return (
      <PronounMemory
        finish={finish}
        back={back}
        sfx={sfx}
        muted={muted}
        toggle={toggle}
      />
    );
  if (game === "clothes")
    return (
      <ClothesHangman
        finish={finish}
        back={back}
        sfx={sfx}
        muted={muted}
        toggle={toggle}
      />
    );
  const total = 10;
  const qs = useMemo(() => shuffle(past).slice(0, total), []);
  const items = useMemo(() => shuffle(clothes).slice(0, 10), []);
  const [idx, setIdx] = useState(0),
    [correct, setCorrect] = useState(0),
    [streak, setStreak] = useState(0),
    [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
      null,
    ),
    [lives, setLives] = useState(3),
    [energy, setEnergy] = useState(3),
    [time, setTime] = useState(60),
    [typed, setTyped] = useState(""),
    [hard, setHard] = useState(false);
  const current = qs[idx];
  const cloth = items[idx];
  const done = () =>
    finish(correct, total, correct * 100 + Math.max(0, streak - 2) * 25);
  const displayedOptions = useMemo(
    () =>
      game === "past"
        ? shuffle([
            current.answer,
            ...shuffle(
              current.options.filter((option) => option !== current.answer),
            ).slice(0, 2),
          ])
        : current.options,
    [game, current],
  );
  useEffect(() => {
    if (game !== "pronouns" || feedback) return;
    const t = setInterval(
      () =>
        setTime((v) => {
          if (v <= 1) {
            clearInterval(t);
            setTimeout(done, 0);
            return 0;
          }
          return v - 1;
        }),
      1000,
    );
    return () => clearInterval(t);
  }, [game, feedback]);
  const answer = (value: string) => {
    if (feedback) return;
    const expected = game === "clothes" ? cloth.word : current.answer;
    const ok = value.trim().toLowerCase() === expected.toLowerCase();
    const nextCorrect = correct + (ok ? 1 : 0),
      nextEnergy = energy - (ok ? 0 : 1);
    sfx(ok);
    if (ok) {
      setCorrect((v) => v + 1);
      setStreak((v) => v + 1);
      setFeedback({
        ok: true,
        text: game === "pronouns" ? "ZOMBIE CAUGHT!" : "GOOD SHOT!",
      });
    } else {
      setStreak(0);
      if (game === "past") setLives((v) => Math.max(0, v - 1));
      if (game === "pronouns") setEnergy((v) => Math.max(0, v - 1));
      setFeedback({
        ok: false,
        text:
          game === "clothes"
            ? `Hint: it starts with ${expected[0].toUpperCase()}`
            : current.tip,
      });
    }
    if (game === "past" || game === "pronouns")
      setTimeout(() => {
        if (idx + 1 >= total || (game === "pronouns" && nextEnergy <= 0))
          finish(
            nextCorrect,
            total,
            nextCorrect * 100 + Math.max(0, streak - 2) * 25,
          );
        else {
          setIdx((v) => v + 1);
          setFeedback(null);
        }
      }, 650);
  };
  const next = () => {
    if (idx + 1 >= total) {
      done();
      return;
    }
    setIdx((v) => v + 1);
    setFeedback(null);
    setTyped("");
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (game === "pronouns" || game === "past") &&
        ["1", "2", "3"].includes(e.key) &&
        displayedOptions[+e.key - 1]
      )
        answer(displayedOptions[+e.key - 1]);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  });
  if (game === "past")
    return (
      <PastArena
        current={current}
        options={displayedOptions}
        idx={idx}
        total={total}
        correct={correct}
        streak={streak}
        lives={lives}
        feedback={feedback}
        answer={answer}
        back={back}
        muted={muted}
        toggle={toggle}
      />
    );
  game = game as Game;
  return (
    <section className={`game-page game-${game}`}>
      <header className="game-top">
        <button className="back" onClick={back}>
          <ArrowLeft /> MAP
        </button>
        <div className="mission-title">
          <small>
            MISSION 0{game === "past" ? 1 : game === "pronouns" ? 2 : 3}
          </small>
          <b>
            {meta[game].place} // {meta[game].topic}
          </b>
        </div>
        <div className="hud">
          <span>
            SCORE <b>{correct * 100}</b>
          </span>
          {game === "past" ? (
            <span className="lives">
              {[0, 1, 2].map((x) => (
                <Heart key={x} fill={x < lives ? "currentColor" : "none"} />
              ))}
            </span>
          ) : game === "pronouns" ? (
            <>
              <span className="energy-hud">
                <Zap /> ENERGY <b>{energy}/3</b>
              </span>
              <span>
                <Clock3 /> <b>00:{String(time).padStart(2, "0")}</b>
              </span>
            </>
          ) : null}
          <Sound muted={muted} toggle={toggle} />
        </div>
      </header>
      <div className="game-layout">
        <div className="scene">
          <div className="fog" />
          {game === "past" ? (
            <div
              className="zombie-answers"
              aria-label="Answer choices on zombies"
            >
              {current.options.map((option, i) => (
                <button
                  className={`answer-zombie ${feedback && option === current.answer ? "correct-target" : ""}`}
                  key={option}
                  disabled={!!feedback}
                  onClick={() => answer(option)}
                  aria-label={`Choice ${i + 1}: ${option}`}
                >
                  <span className="z-option">
                    <kbd>{i + 1}</kbd>
                    {option}
                  </span>
                  <span className="mini-z-head">
                    <i />
                    <i />
                  </span>
                  <span className="mini-z-body" />
                </button>
              ))}
            </div>
          ) : game === "pronouns" ? (
            <PronounRace
              options={current.options}
              answer={current.answer}
              feedback={feedback}
              choose={answer}
            />
          ) : (
            <div className={`zombie ${feedback?.ok ? "hit" : ""}`}>
              <div className="z-head">
                <i />
                <i />
              </div>
              <div className="z-body">
                <span />
                <span />
              </div>
            </div>
          )}
          {game !== "pronouns" && (
            <div className="barricade">
              <Shield />
            </div>
          )}
          <div className="scene-label">
            <Crosshair />
            <b>
              {game === "pronouns"
                ? "CITY CHASE"
                : game === "past"
                  ? "CHOOSE THE RIGHT ZOMBIE"
                  : "TARGET IS CLOSE"}
            </b>
            <span>
              {game === "pronouns"
                ? "CATCH THE RIGHT TARGET"
                : feedback?.ok
                  ? "TARGET STOPPED"
                  : `${Math.max(4, 18 - idx)} METRES`}
            </span>
          </div>
        </div>
        <div className="question-panel">
          <div className="progress-line">
            <span>
              TASK {idx + 1} / {total}
            </span>
            <i>
              <b style={{ width: `${(idx / total) * 100}%` }} />
            </i>
            {streak >= 2 && <strong>STREAK ×{streak}</strong>}
          </div>
          {game === "clothes" ? (
            <ClothesQuestion
              cloth={cloth}
              hard={hard}
              setHard={setHard}
              typed={typed}
              setTyped={setTyped}
              answer={answer}
            />
          ) : (
            <>
              <small className="rule">
                {game === "past"
                  ? "CLICK THE ZOMBIE WITH THE RIGHT ANSWER"
                  : game === "pronouns"
                    ? "CATCH THE ZOMBIE WITH THE RIGHT ANSWER"
                    : "CHOOSE THE RIGHT ANSWER"}
              </small>
              <h2>{current.prompt}</h2>
            </>
          )}
          {feedback && (
            <div
              className={`feedback ${feedback.ok ? "ok" : "bad"} ${game !== "clothes" ? "auto-feedback" : ""}`}
            >
              <div>{feedback.ok ? <Check /> : <X />}</div>
              <p>
                <b>{feedback.text}</b>
                {!feedback.ok && game !== "clothes" && (
                  <span>
                    Right answer: <strong>{current.answer}</strong>
                  </span>
                )}
              </p>
              {game === "clothes" && (
                <button onClick={next}>
                  {idx + 1 >= total ? "RESULT" : "NEXT"} <ChevronRight />
                </button>
              )}
            </div>
          )}
          <p className="keyhint">
            <kbd>1</kbd>–<kbd>4</kbd> choose a target <span>•</span> area:{" "}
            {meta[game].place}
          </p>
        </div>
      </div>
    </section>
  );
}
const raceZombieImages = [
  "zombie-tall.png",
  "zombie-stocky.png",
  "zombie-runner.png",
];
function PronounMemory({
  finish,
  back,
  sfx,
  muted,
  toggle,
}: {
  finish: (c: number, t: number, p: number) => void;
  back: () => void;
  sfx: (ok?: boolean) => void;
  muted: boolean;
  toggle: () => void;
}) {
  const pairs = useMemo(
    () =>
      shuffle([
        { word: "I", translation: "the speaker" },
        { word: "me", translation: "to the speaker" },
        { word: "my", translation: "belongs to me" },
        { word: "he", translation: "one boy" },
        { word: "him", translation: "to one boy" },
        { word: "his", translation: "belongs to him" },
        { word: "she", translation: "one girl" },
        { word: "her", translation: "to one girl" },
        { word: "we", translation: "I and others" },
        { word: "us", translation: "to our group" },
        { word: "they", translation: "other people" },
        { word: "them", translation: "to other people" },
      ]).slice(0, 6),
    [],
  );
  const cards = useMemo(
    () =>
      shuffle(
        pairs.flatMap((item, pair) => [
          { id: `word-${pair}`, pair, kind: "word" as const, text: item.word },
          {
            id: `translation-${pair}`,
            pair,
            kind: "translation" as const,
            text: item.translation,
          },
        ]),
      ),
    [pairs],
  );
  const [open, setOpen] = useState<number[]>([]),
    [matched, setMatched] = useState<number[]>([]),
    [attempts, setAttempts] = useState(0),
    [locked, setLocked] = useState(false);
  const flip = (index: number) => {
    if (locked || open.includes(index) || matched.includes(cards[index].pair))
      return;
    const next = [...open, index];
    setOpen(next);
    if (next.length === 2) {
      setLocked(true);
      setAttempts((value) => value + 1);
      const [a, b] = next.map((card) => cards[card]);
      const ok = a.pair === b.pair && a.kind !== b.kind;
      sfx(ok);
      setTimeout(() => {
        if (ok) {
          const done = [...matched, a.pair];
          setMatched(done);
          setOpen([]);
          if (done.length === 6)
            finish(6, 6, Math.max(600, 1500 - attempts * 35));
        } else setOpen([]);
        setLocked(false);
      }, 700);
    }
  };
  return (
    <section className="memory-game">
      <header className="game-top">
        <button className="back" onClick={back}>
          <ArrowLeft /> MAP
        </button>
        <div className="mission-title">
          <small>MISSION 02</small>
          <b>DOWNTOWN // ZOMBIE MEMORY</b>
        </div>
        <div className="hud">
          <span>
            TRIES <b>{attempts}</b>
          </span>
          <Sound muted={muted} toggle={toggle} />
        </div>
      </header>
      <div className="memory-stage">
        <div className="memory-heading">
          <small>MATCH THE PAIRS</small>
          <h2>PRONOUN + MEANING</h2>
          <p>
            Open two cards. You can try again and again. Find all six pairs.
          </p>
        </div>
        <div className="memory-grid">
          {cards.map((card, index) => {
            const visible = open.includes(index) || matched.includes(card.pair);
            return (
              <button
                key={card.id}
                className={`memory-card ${visible ? "is-open" : ""} ${matched.includes(card.pair) ? "is-matched" : ""}`}
                onClick={() => flip(index)}
                disabled={matched.includes(card.pair)}
              >
                <span className="card-back">
                  <Skull />
                  <b>{String(index + 1).padStart(2, "0")}</b>
                </span>
                <span className="card-face">
                  <small>{card.kind === "word" ? "PRONOUN" : "MEANING"}</small>
                  <b>{card.text}</b>
                </span>
              </button>
            );
          })}
        </div>
        <div className="memory-status">
          <span>PAIRS FOUND</span>
          <b>{matched.length} / 6</b>
          <i>
            <em style={{ width: `${(matched.length / 6) * 100}%` }} />
          </i>
        </div>
      </div>
    </section>
  );
}
function ClothesHangman({
  finish,
  back,
  sfx,
  muted,
  toggle,
}: {
  finish: (c: number, t: number, p: number) => void;
  back: () => void;
  sfx: (ok?: boolean) => void;
  muted: boolean;
  toggle: () => void;
}) {
  const items = useMemo(() => shuffle(clothes.slice(0, 10)), []);
  const [idx, setIdx] = useState(0),
    [correct, setCorrect] = useState(0),
    [typed, setTyped] = useState(""),
    [misses, setMisses] = useState(0),
    [feedback, setFeedback] = useState(""),
    [caught, setCaught] = useState(false);
  const item = items[idx];
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (caught || !typed.trim()) return;
    const ok = typed.trim().toLowerCase() === item.word.toLowerCase();
    sfx(ok);
    if (ok) {
      const score = correct + 1;
      setCorrect(score);
      setCaught(true);
      setFeedback("RIGHT WORD — THE CAGE IS CLOSED!");
      setTimeout(() => {
        if (idx === 9) finish(score, 10, score * 150);
        else {
          setIdx((value) => value + 1);
          setTyped("");
          setMisses(0);
          setFeedback("");
          setCaught(false);
        }
      }, 850);
    } else {
      setMisses((value) => value + 1);
      setFeedback(`Hint: the word starts with ${item.word[0].toUpperCase()}`);
    }
  };
  return (
    <section className="hangman-game">
      <header className="game-top">
        <button className="back" onClick={back}>
          <ArrowLeft /> MAP
        </button>
        <div className="mission-title">
          <small>MISSION 03</small>
          <b>SHOPPING MALL // WORD CAGE</b>
        </div>
        <div className="hud">
          <span>
            WORDS <b>{correct}/10</b>
          </span>
          <Sound muted={muted} toggle={toggle} />
        </div>
      </header>
      <div className="hangman-stage">
        <div className="word-progress">
          <span>ITEM {idx + 1} / 10</span>
          <i>
            <b style={{ width: `${(idx / 10) * 100}%` }} />
          </i>
        </div>
        <div className="clothes-clue">
          <small>WHAT IS THIS?</small>
          <div className="clothes-image">
            <img
              src={`${import.meta.env.BASE_URL}images/clothes/${item.icon}.png?v=clothes-2`}
              alt={item.ru}
            />
          </div>
          <div className="letter-slots">
            {item.word.split("").map((letter, i) => (
              <span key={i}>
                {caught ? letter.toUpperCase() : typed[i]?.toUpperCase() || ""}
              </span>
            ))}
          </div>
          <form onSubmit={submit}>
            <input
              autoFocus
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              placeholder="Type the clothing word"
              aria-label="Answer in English"
            />
            <button type="submit">
              CLOSE THE CAGE <ChevronRight />
            </button>
          </form>
          {feedback && (
            <p className={caught ? "success" : "hint"}>{feedback}</p>
          )}
        </div>
        <div className={`word-trap cage-trap ${caught ? "trap-fired" : ""}`}>
          <img
            className="zombie-prisoner"
            src={`${import.meta.env.BASE_URL}images/zombies/${raceZombieImages[idx % 3]}`}
            alt="Zombie near the cage"
          />
          <img
            className="cage-art"
            src={`${import.meta.env.BASE_URL}images/traps/zombie-cage.png`}
            alt="Metal zombie cage"
          />
          <div className="danger">
            <span>MISTAKES</span>
            <b>{misses}</b>
          </div>
        </div>
      </div>
    </section>
  );
}
function PastArena({
  current,
  options,
  idx,
  total,
  correct,
  streak,
  lives,
  feedback,
  answer,
  back,
  muted,
  toggle,
}: {
  current: Q;
  options: string[];
  idx: number;
  total: number;
  correct: number;
  streak: number;
  lives: number;
  feedback: { ok: boolean; text: string } | null;
  answer: (value: string) => void;
  back: () => void;
  muted: boolean;
  toggle: () => void;
}) {
  return (
    <section className="past-arena">
      <header className="game-top">
        <button className="back" onClick={back}>
          <ArrowLeft /> MAP
        </button>
        <div className="mission-title">
          <small>MISSION 01</small>
          <b>SCHOOL DISTRICT // PAST SIMPLE</b>
        </div>
        <div className="hud">
          <span>
            SCORE <b>{correct * 100}</b>
          </span>
          <span className="lives">
            {[0, 1, 2].map((x) => (
              <Heart key={x} fill={x < lives ? "currentColor" : "none"} />
            ))}
          </span>
          <Sound muted={muted} toggle={toggle} />
        </div>
      </header>
      <div className="past-stage">
        <div className="past-progress">
          <span>
            TASK {idx + 1} / {total}
          </span>
          <i>
            <b style={{ width: `${(idx / total) * 100}%` }} />
          </i>
          {streak >= 2 && <strong>STREAK ×{streak}</strong>}
        </div>
        <div className="past-question">
          <small>CLICK THE ZOMBIE WITH THE RIGHT ANSWER</small>
          <h2>{current.prompt}</h2>
        </div>
        <div className="past-zombies">
          {options.map((option, i) => (
            <button
              key={option}
              className={`past-zombie pz-${i + 1} ${feedback && option === current.answer ? "past-caught" : ""}`}
              disabled={!!feedback}
              onClick={() => answer(option)}
              aria-label={`Choice ${i + 1}: ${option}`}
            >
              <span className="past-option">
                <kbd>{i + 1}</kbd>
                {option}
              </span>
              <img
                src={`${import.meta.env.BASE_URL}images/zombies/${raceZombieImages[i]}`}
                alt=""
                draggable={false}
              />
            </button>
          ))}
        </div>
        {feedback && (
          <div className={`past-flash ${feedback.ok ? "ok" : "bad"}`}>
            <div>{feedback.ok ? <Check /> : <X />}</div>
            <p>
              <b>{feedback.ok ? "ZOMBIE STOPPED!" : feedback.text}</b>
              {!feedback.ok && (
                <span>
                  Right answer: <strong>{current.answer}</strong>
                </span>
              )}
            </p>
          </div>
        )}
        <div className="past-distance">
          <Shield />
          <span>BARRICADE</span>
          <b>{lives}/3</b>
        </div>
      </div>
    </section>
  );
}
function PronounRace({
  options,
  answer,
  feedback,
  choose,
}: {
  options: string[];
  answer: string;
  feedback: { ok: boolean; text: string } | null;
  choose: (value: string) => void;
}) {
  return (
    <div className="race-track">
      <div className="speed-lines" />
      <div className="runner">
        <span className="runner-head" />
        <span className="runner-body" />
      </div>
      {options.map((option, i) => (
        <button
          key={option}
          className={`race-zombie lane-${i + 1} ${feedback && option === answer ? "caught" : ""}`}
          onClick={() => choose(option)}
          disabled={!!feedback}
          aria-label={`Catch zombie ${i + 1}: ${option}`}
        >
          <span className="race-label">
            <kbd>{i + 1}</kbd>
            {option}
          </span>
          <img
            src={`${import.meta.env.BASE_URL}images/zombies/${raceZombieImages[i]}`}
            alt=""
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}
function ClothesQuestion({
  cloth,
  hard,
  setHard,
  typed,
  setTyped,
  answer,
}: {
  cloth: { word: string; ru: string; icon: string };
  hard: boolean;
  setHard: (v: boolean) => void;
  typed: string;
  setTyped: (v: string) => void;
  answer: (v: string) => void;
}) {
  const opts = useMemo(
    () =>
      shuffle([
        cloth.word,
        ...shuffle(clothes.filter((x) => x.word !== cloth.word))
          .slice(0, 3)
          .map((x) => x.word),
      ]),
    [cloth],
  );
  return (
    <>
      <div className="difficulty">
        <button
          className={!hard ? "active" : ""}
          onClick={() => setHard(false)}
        >
          CHOICE
        </button>
        <button className={hard ? "active" : ""} onClick={() => setHard(true)}>
          TYPE
        </button>
      </div>
      <small className="rule">WHAT IS THIS?</small>
      <div className={`clothing ${cloth.icon}`}>
        <div className="hanger" />
        <b>?</b>
      </div>
      {hard ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            answer(typed);
          }}
          className="type-form"
        >
          <input
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type the word…"
          />
          <button>ANSWER</button>
        </form>
      ) : (
        <div className="answers compact">
          {opts.map((o, i) => (
            <button key={o} onClick={() => answer(o)}>
              <kbd>{i + 1}</kbd>
              {o}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
function Result({
  result,
  game,
  replay,
  map,
}: {
  result: { correct: number; total: number; won: boolean; score: number };
  game: Game;
  replay: () => void;
  map: () => void;
}) {
  return (
    <section className="modal-page">
      <div className={`result-badge ${result.won ? "win" : "lose"}`}>
        {result.won ? <Shield /> : <Skull />}
      </div>
      <p className="eyebrow">
        <span /> MISSION COMPLETE
      </p>
      <h2>{result.won ? "AREA CLEAR" : "TRY AGAIN"}</h2>
      <p>
        {result.won
          ? meta[game].place + " is safe again."
          : `You need ${meta[game].goal} right answers. Try again!`}
      </p>
      <div className="stats">
        <div>
          <b>
            {result.correct}/{result.total}
          </b>
          <span>RIGHT</span>
        </div>
        <div>
          <b>{Math.round((result.correct / result.total) * 100)}%</b>
          <span>ACCURACY</span>
        </div>
        <div>
          <b>+{result.score}</b>
          <span>SCORE</span>
        </div>
      </div>
      <div className="result-actions">
        <button className="primary" onClick={map}>
          <Map /> TO THE MAP
        </button>
        <button onClick={replay}>
          <RotateCcw /> PLAY AGAIN
        </button>
      </div>
    </section>
  );
}
function Victory({ score, reset }: { score: number; reset: () => void }) {
  return (
    <section className="victory">
      <div>
        <p className="eyebrow">
          <span /> OPERATION COMPLETE
        </p>
        <h1>
          CITY
          <br />
          <em>SAVED</em>
        </h1>
        <p>All three areas are clear. Your English stopped the outbreak.</p>
        <div className="victory-score">
          <span>FINAL SCORE</span>
          <b>{score}</b>
        </div>
        <button className="primary huge" onClick={reset}>
          NEW MISSION <ChevronRight />
        </button>
      </div>
    </section>
  );
}
