import { useEffect, useRef } from "react"

type Props = {
  onChange: (value: string) => void
}

export default function AreaCoverageFilter({ onChange }: Props) {
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
    <calcite-panel heading="Area Coverage">
      <calcite-select
        ref={selectRef}
        value="all"
        selection-mode="single"
      >
        <calcite-option value="all" selected>
          All Areas
        </calcite-option>

        <calcite-option value="Balaraja">Balaraja</calcite-option>
        <calcite-option value="Cikupa">Cikupa</calcite-option>
        <calcite-option value="Cisauk">Cisauk</calcite-option>
        <calcite-option value="Cisoka">Cisoka</calcite-option>
        <calcite-option value="Curug">Curug</calcite-option>
        <calcite-option value="Gunung Kaler">Gunung Kaler</calcite-option>
        <calcite-option value="Jambe">Jambe</calcite-option>
        <calcite-option value="Jayanti">Jayanti</calcite-option>
        <calcite-option value="Kelapa Dua">Kelapa Dua</calcite-option>
        <calcite-option value="Kemiri">Kemiri</calcite-option>
        <calcite-option value="Kosambi">Kosambi</calcite-option>
        <calcite-option value="Kresek">Kresek</calcite-option>
        <calcite-option value="Kronjo">Kronjo</calcite-option>
        <calcite-option value="Legok">Legok</calcite-option>
        <calcite-option value="Mauk">Mauk</calcite-option>
        <calcite-option value="Mekarbaru">Mekarbaru</calcite-option>
        <calcite-option value="Pagedangan">Pagedangan</calcite-option>
        <calcite-option value="Pakuhaji">Pakuhaji</calcite-option>
        <calcite-option value="Panongan">Panongan</calcite-option>
        <calcite-option value="Pasarkemis">Pasarkemis</calcite-option>
        <calcite-option value="Rajeg">Rajeg</calcite-option>
        <calcite-option value="Sepatan">Sepatan</calcite-option>
        <calcite-option value="Sepatan Timur">Sepatan Timur</calcite-option>
        <calcite-option value="Sindangjaya">Sindangjaya</calcite-option>
        <calcite-option value="Solear">Solear</calcite-option>
        <calcite-option value="Sukadiri">Sukadiri</calcite-option>
        <calcite-option value="Sukamulya">Sukamulya</calcite-option>
        <calcite-option value="Teluknaga">Teluknaga</calcite-option>
        <calcite-option value="Tigaraksa">Tigaraksa</calcite-option>
      </calcite-select>
    </calcite-panel>
  )
}