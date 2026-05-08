import { EmptyState, LearnerPage, PageHeader } from "@/components/ui/LearnerPrimitives";
import { FormulaCompass } from "@/components/layout/FormulaCompass";
import { FormulaCalculatorProvider } from "@/components/layout/FormulaCalculatorProvider";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { DEV_FORMULA_SECTIONS } from "@/lib/dev-content";
import { ensureDevDataSeeded } from "@/lib/dev-seed";
import { dedupeFormulaSections } from "@/lib/formula-sections";
import { listUserFavorites } from "@/lib/firebase/favorites";
import { getLearnerSession } from "@/lib/firebase/learner-session";
import * as Icons from "@/components/ui/Icons";

async function getFormulaSectionsData() {
  try {
    type FormulaSectionsData = {
      formulaSections: Array<{
        id: string;
        code: string;
        title: string;
        position: number;
        formulas_on_section: Array<{
          id: string;
          code: string;
          name: string;
          expression: string;
          notes?: string | null;
          calcMetaJson?: string | null;
        }>;
      }>;
    };

    let data = await adminDcQuery<FormulaSectionsData>("GetFormulaSections");
    if (data.formulaSections.length === 0) {
      await ensureDevDataSeeded().catch(() => null);
      data = await adminDcQuery<FormulaSectionsData>("GetFormulaSections").catch(
        (): FormulaSectionsData => ({ formulaSections: [] })
      );
    }
    const sections = dedupeFormulaSections(data.formulaSections.map((s) => ({
      ...s,
      formulas: s.formulas_on_section,
    })));
    return sections.length > 0 ? sections : DEV_FORMULA_SECTIONS;
  } catch {
    return DEV_FORMULA_SECTIONS;
  }
}

export default async function FormulasPage() {
  const sections = await getFormulaSectionsData();
  let session = null as Awaited<ReturnType<typeof getLearnerSession>>;
  let favoriteFormulaIds: string[] = [];

  try {
    session = await getLearnerSession();
  } catch {
    session = null;
  }

  if (session) {
    try {
      favoriteFormulaIds = (await listUserFavorites(session.uid, "formula")).map((favorite) => favorite.itemId);
    } catch {
      favoriteFormulaIds = [];
    }
  }

  const totalFormulas = sections.reduce((sum, section) => sum + section.formulas.length, 0);

  return (
    <LearnerPage width="wide">
      <PageHeader
        eyebrow="Formula Compass"
        title="Assessment formula reference"
        description={`${totalFormulas || 53} formulas organized by assessment method section for fast study and exam review.`}
        icon={Icons.Calculator}
      />
      {sections.length === 0 ? (
        <EmptyState
          title="No formulas available"
          description="Formula data could not be loaded or has not been imported yet. If you are developing locally, confirm the Data Connect service you intend to use is available."
          icon={Icons.Search}
        />
      ) : (
        <FormulaCalculatorProvider initialSections={sections as any}>
          <FormulaCompass
            sections={sections}
            initialFavoriteFormulaIds={favoriteFormulaIds}
            canFavorite={Boolean(session)}
          />
        </FormulaCalculatorProvider>
      )}
    </LearnerPage>
  );
}
