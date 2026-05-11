import { useEffect, useRef } from "react"

type Props = {
  onChange: (value: string) => void
}

export default function PackageTypeFilter({ onChange }: Props) {
  const selectRef = useRef<HTMLCalciteSelectElement>(null)

  useEffect(() => {
    const el = selectRef.current
    if (!el) return

    const handler = (event: Event) => {
      const target = event.target as HTMLCalciteSelectElement
      onChange(target.value)
    }

    el.addEventListener("calciteSelectChange", handler)

    return () => {
      el.removeEventListener("calciteSelectChange", handler)
    }
  }, [onChange])

  return (
    <calcite-panel heading="Package Type" id="package-filter">
      <calcite-select
        ref={selectRef}
        selection-mode="single"
        selection-appearance="border"
        value="all"
      >
        <calcite-option value="all" label="All" />
        <calcite-option value="Basic" label="Basic" />
        <calcite-option value="Silver" label="Silver" />
        <calcite-option value="Gold" label="Gold" />
        <calcite-option value="Platinum" label="Platinum" />
      </calcite-select>
    </calcite-panel>
  )
}