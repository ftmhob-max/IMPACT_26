import { EmptyState, LearnerPage, PageHeader } from "@/components/ui/LearnerPrimitives";
import { FormulaCompass } from "@/components/layout/FormulaCompass";
import { getFormulaSections } from "@/lib/firebase/generated";
import { getPlatformDataConnect } from "@/lib/firebase/dataconnect";
import { listUserFavorites } from "@/lib/firebase/favorites";
import { getLearnerSession } from "@/lib/firebase/learner-session";
import * as Icons from "@/components/ui/Icons";

async function getFormulaSectionsData() {
  try {
    const dc = getPlatformDataConnect();
    const { data } = await getFormulaSections(dc);
    return data.formulaSections.map((s) => ({
      ...s,
      formulas: s.formulas_on_section,
    }));
  } catch {
    return [];
  }
}

export default async function FormulasPage() {
  const session = await getLearnerSession();
  const sections = await getFormulaSectionsData();
  const favoriteFormulaIds = session
    ? (await listUserFavorites(session.uid, "formula")).map((favorite) => favorite.itemId)
    : [];
  const totalFormulas = sections.reduce((sum, section) => sum + section.formulas.length, 0);

  return (
    <LearnerPage width="narrow">
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
        <FormulaCompass
          sections={sections}
          initialFavoriteFormulaIds={favoriteFormulaIds}
          canFavorite={Boolean(session)}
        />
      )}
    </LearnerPage>
  );
}
