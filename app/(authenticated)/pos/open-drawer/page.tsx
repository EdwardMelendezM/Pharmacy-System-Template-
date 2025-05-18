import { OpenDrawerForm } from "@/modules/pos/components/open-drawer-form"

export default function OpenDrawerPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Abrir Caja</h1>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <OpenDrawerForm />
      </div>
    </div>
  )
}
