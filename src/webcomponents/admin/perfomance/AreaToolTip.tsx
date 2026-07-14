// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AreaTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full inline-block bg-primary" />
        <span className="text-gray-500">Avg. Score:</span>
        <span className="font-semibold text-gray-700">{payload[0].value}%</span>
      </div>
    </div>
  )
}