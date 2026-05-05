import { FormulaIndex } from "@/components/layout/FormulaIndex";

// In production this fetches from Data Connect via server component
// For now using empty array — populate after running the migration script
async function getFormulaSections() {
  return [];
}

export default async function FormulasPage() {
  const sections = await getFormulaSections();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Formula Reference Index</h1>
        <p className="text-slate-500 mt-1 text-sm">
          53 formulas across 8 sections. Run the migration script to populate.
        </p>
      </div>
      {sections.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm">
          No formulas yet. Run <code className="font-mono bg-slate-100 px-1 rounded">npx tsx scripts/import-questions.ts</code> to import them.
        </div>
      ) : (
        <FormulaIndex sections={sections} />
      )}
    </div>
  );
}
