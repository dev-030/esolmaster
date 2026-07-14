'use client';
import { useEffect, useRef, useState } from "react"

export type TabKey = "All" | "Students" | "Teachers"

const TABS: TabKey[] = ["All", "Students", "Teachers"]
export const UserTabs = ({
  active,
  onChange,
}: {
  active: TabKey
  onChange: (t: TabKey) => void
}) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [prevIndex, setPrevIndex] = useState(0)

  useEffect(() => {
    const el = tabRefs.current[active]
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [active])

  const handleClick = (tab: TabKey) => {
    setPrevIndex(TABS.indexOf(active))
    onChange(tab)
  }

  return (
    <div className="relative flex gap-1 border-b border-gray-200">
      {TABS.map((tab) => (
        <button
          key={tab}
          ref={(el) => { tabRefs.current[tab] = el }}
          onClick={() => handleClick(tab)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative z-10 whitespace-nowrap ${
            active === tab ? "text-primary" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}

      {/* Animated bottom border indicator */}
      <span
        className="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-in-out"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
    </div>
  )
}
