import { EndShiftForm } from "@/modules/pos/components/end-shift-form"

export default function EndShiftPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Cerrar Caja</h1>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <EndShiftForm />
      </div>
    </div>
  )
}
