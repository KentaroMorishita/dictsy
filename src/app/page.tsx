"use client"
import { useEffect, useState } from "react"

interface Problem {
  id: number
  text: string
}

export default function DictationPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [current, setCurrent] = useState<Problem | null>(null)
  const [answer, setAnswer] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)
  const [showReveal, setShowReveal] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // 音声一覧取得
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices()
      const enUSVoices = allVoices.filter((v) => v.lang === "en-US")
      setVoices(enUSVoices)
      if (enUSVoices.length > 0) {
        const samantha = enUSVoices.find((v) => v.name === "Samantha")
        setSelectedVoice(samantha ? samantha.name : enUSVoices[0].name)
      }
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  useEffect(() => {
    fetch("/problems.json")
      .then((res) => res.json())
      .then((data: Problem[]) => {
        setProblems(data)
        setCurrent(data[Math.floor(Math.random() * data.length)])
      })
  }, [])

  const speak = () => {
    if (current) {
      const utter = new window.SpeechSynthesisUtterance(current.text)
      utter.lang = "en-US"
      // 選択中voiceを適用
      const voice = voices.find((v) => v.name === selectedVoice)
      if (voice) utter.voice = voice
      window.speechSynthesis.speak(utter)
    }
  }

  const normalize = (str: string) => {
    let s = str
      .trim()
      .replace(/[.,!?\-\"'`]/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
    // 省略形⇔展開形を統一
    const contractions: [RegExp, string][] = [
      [/\bi am\b/g, "i'm"],
      [/\bi'm\b/g, "i am"],
      [/\bdo not\b/g, "don't"],
      [/\bdon't\b/g, "do not"],
      [/\bdoes not\b/g, "doesn't"],
      [/\bdoesn't\b/g, "does not"],
      [/\bdid not\b/g, "didn't"],
      [/\bdidn't\b/g, "did not"],
      [/\bcan not\b/g, "can't"],
      [/\bcan't\b/g, "can not"],
      [/\bwill not\b/g, "won't"],
      [/\bwon't\b/g, "will not"],
      [/\bare not\b/g, "aren't"],
      [/\baren't\b/g, "are not"],
      [/\bis not\b/g, "isn't"],
      [/\bisn't\b/g, "is not"],
      [/\bhave not\b/g, "haven't"],
      [/\bhaven't\b/g, "have not"],
      [/\bhas not\b/g, "hasn't"],
      [/\bhasn't\b/g, "has not"],
      [/\bhad not\b/g, "hadn't"],
      [/\bhadn't\b/g, "had not"],
      [/\bwould not\b/g, "wouldn't"],
      [/\bwouldn't\b/g, "would not"],
      [/\bshould not\b/g, "shouldn't"],
      [/\bshouldn't\b/g, "should not"],
      [/\bcannot\b/g, "can't"],
      [/\bthey are\b/g, "they're"],
      [/\bthey're\b/g, "they are"],
      [/\bwe are\b/g, "we're"],
      [/\bwe're\b/g, "we are"],
      [/\byou are\b/g, "you're"],
      [/\byou're\b/g, "you are"],
      [/\bit is\b/g, "it's"],
      [/\bit's\b/g, "it is"],
    ]
    contractions.forEach(([re, rep]) => {
      s = s.replace(re, rep)
    })
    return s
  }

  const handleCheck = () => {
    setShowAnswer(true)
    if (current) {
      setIsCorrect(normalize(answer) === normalize(current.text))
    }
  }

  if (!current) return <div className="p-10 text-center">Loading...</div>

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4">
      <div className="w-full max-w-xl flex flex-col gap-6 items-center">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-blue-500 drop-shadow mb-2 tracking-tight"
          style={{
            fontFamily: "var(--font-leckerli), Montserrat, Inter, sans-serif",
          }}
        >
          Dictsy
        </h1>
        <div className="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 mb-2">
          <span className="inline-block text-indigo-500 animate-bounce">
            🎧
          </span>
          <span>音声を聞いて英語を書き取ろう！</span>
          <span className="inline-block text-pink-400 animate-bounce">✍️</span>
        </div>
        {/* 進捗バーのダミー（今後拡張） */}
        <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-300 via-indigo-400 to-pink-300 shadow-inner mb-4">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-indigo-500 transition-all"
            style={{ width: "20%" }}
          ></div>
        </div>
        <section className="w-full bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-6 items-center border border-indigo-100 dark:border-gray-700 relative">
          <div className="flex items-center justify-center gap-1 text-sm text-pink-300 dark:text-pink-200 mb-2">
            <span className="animate-pulse">✨</span>
            <span>Dictsyで楽しくディクテーション！</span>
          </div>
          {/* 音声選択UI */}
          <div className="w-full flex flex-col sm:flex-row gap-2 items-center justify-center mb-2">
            <label
              className="text-sm text-gray-500 dark:text-gray-400 font-semibold"
              htmlFor="voice-select"
            >
              音声:
            </label>
            <select
              id="voice-select"
              className="rounded px-2 py-1 border border-indigo-200 dark:border-gray-700 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices
                .filter((v) => v.lang === "en-US")
                .map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
            </select>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all font-bold text-lg"
            onClick={speak}
          >
            <span className="text-xl">🔊</span> Play
          </button>
          <textarea
            className="w-full h-32 p-3 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl resize-none text-lg shadow focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:border-pink-400 transition-all bg-white/80 dark:bg-gray-800/80"
            placeholder="ここに英語を書き取ろう..."
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value)
              setIsCorrect(null)
              setShowAnswer(false)
              setShowReveal(false)
            }}
          />
          {(!showAnswer || isCorrect === null) && (
            <button
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50"
              onClick={handleCheck}
            >
              Check
            </button>
          )}
          {showAnswer && (
            <>
              {isCorrect === true ? (
                <>
                  <div
                    className={`w-full mt-2 p-4 rounded-xl shadow-inner flex flex-col items-center bg-green-50 dark:bg-green-900/60`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎉</span>
                      <span className="text-green-600 dark:text-green-300 font-bold text-xl">
                        正解！
                      </span>
                    </div>
                    <div className="w-full flex flex-col gap-2 justify-center items-center">
                      <div className="flex-1 w-full">
                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                          あなたの解答
                        </p>
                        <div className="text-base font-mono break-words text-indigo-900 dark:text-indigo-100 tracking-wide bg-white/80 dark:bg-gray-800/80 rounded px-2 py-1 border border-indigo-100 dark:border-indigo-700">
                          {answer || (
                            <span className="text-gray-400">（未入力）</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xl my-2 text-gray-400">↓</span>
                      <div className="flex-1 w-full">
                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                          正解
                        </p>
                        <div className="text-base font-mono break-words text-indigo-900 dark:text-indigo-100 tracking-wide bg-white/80 dark:bg-gray-800/80 rounded px-2 py-1 border border-indigo-100 dark:border-indigo-700">
                          {current.text}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all font-bold text-lg"
                    onClick={() => {
                      if (problems.length > 1) {
                        let next
                        do {
                          next =
                            problems[
                              Math.floor(Math.random() * problems.length)
                            ]
                        } while (next.id === current.id)
                        setCurrent(next)
                      }
                      setAnswer("")
                      setShowAnswer(false)
                      setIsCorrect(null)
                      setShowReveal(false)
                    }}
                  >
                    Next Question
                  </button>
                </>
              ) : isCorrect === false && !showReveal ? (
                <>
                  <div
                    className={`w-full mt-2 p-4 rounded-xl shadow-inner flex flex-col items-center bg-red-50 dark:bg-red-900/60`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">😢</span>
                      <span className="text-red-600 dark:text-red-300 font-bold text-xl">
                        不正解
                      </span>
                    </div>
                    <div className="w-full flex flex-col gap-2 justify-center items-center">
                      <div className="flex-1 w-full">
                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                          あなたの解答
                        </p>
                        <div className="text-base font-mono break-words text-indigo-900 dark:text-indigo-100 tracking-wide bg-white/80 dark:bg-gray-800/80 rounded px-2 py-1 border border-indigo-100 dark:border-indigo-700">
                          {answer || (
                            <span className="text-gray-400">（未入力）</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-400 to-indigo-500 text-white rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all font-bold text-lg"
                    onClick={() => setShowReveal(true)}
                  >
                    Show Answer
                  </button>
                </>
              ) : (
                <>
                  <div
                    className={`w-full mt-2 p-4 rounded-xl shadow-inner flex flex-col items-center bg-red-50 dark:bg-red-900/60`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">😢</span>
                      <span className="text-red-600 dark:text-red-300 font-bold text-xl">
                        不正解
                      </span>
                    </div>
                    <div className="w-full flex flex-col gap-2 justify-center items-center">
                      <div className="flex-1 w-full">
                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                          あなたの解答
                        </p>
                        <div className="text-base font-mono break-words text-indigo-900 dark:text-indigo-100 tracking-wide bg-white/80 dark:bg-gray-800/80 rounded px-2 py-1 border border-indigo-100 dark:border-indigo-700">
                          {answer || (
                            <span className="text-gray-400">（未入力）</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xl my-2 text-gray-400">↓</span>
                      <div className="flex-1 w-full">
                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                          正解
                        </p>
                        <div className="text-base font-mono break-words text-indigo-900 dark:text-indigo-100 tracking-wide bg-white/80 dark:bg-gray-800/80 rounded px-2 py-1 border border-indigo-100 dark:border-indigo-700">
                          {current.text}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all font-bold text-lg"
                    onClick={() => {
                      if (problems.length > 1) {
                        let next
                        do {
                          next =
                            problems[
                              Math.floor(Math.random() * problems.length)
                            ]
                        } while (next.id === current.id)
                        setCurrent(next)
                      }
                      setAnswer("")
                      setShowAnswer(false)
                      setIsCorrect(null)
                      setShowReveal(false)
                    }}
                  >
                    Next Question
                  </button>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}
