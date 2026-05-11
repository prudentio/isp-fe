import { useEffect, useRef } from "react"

type Props = {
  onChange: (value: string) => void
}

export default function FiberOperatorFilter({ onChange }: Props) {
  const selectRef = useRef<HTMLCalciteSelectElement>(null)

  useEffect(() => {
    const el = selectRef.current
    if (!el) return

    const handler = (event: Event) => {
      const target = event.target as HTMLCalciteSelectElement
      onChange(target.value as string)
    }

    el.addEventListener("calciteSelectChange", handler)

    return () => {
      el.removeEventListener("calciteSelectChange", handler)
    }
  }, [onChange])

  return (
    <calcite-panel heading="Fiber Operator" id="filter-panel">
      <calcite-select
        ref={selectRef}
        selection-mode="single"
        selection-appearance="border"
        value="all"
      >
        <calcite-option value="all" label="All" />
        <calcite-option value="XL" label="XL" />
        <calcite-option value="Telkom" label="Telkom" />
        <calcite-option value="Indosat" label="Indosat" />
        <calcite-option value="Biznet" label="Biznet" />
      </calcite-select>
    </calcite-panel>
  )
}