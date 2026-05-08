export interface DevFormula {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
}

export interface DevFormulaSection {
  id: string;
  code: string;
  title: string;
  position: number;
  formulas: DevFormula[];
}

export interface DevCourseLesson {
  id: string;
  title: string;
  position: number;
  lessonType: string;
  durationSeconds?: number | null;
  videoPlaybackId?: string | null;
  videoUrl?: string | null;
  quiz?: { id: string; title: string; timeLimitSeconds?: number | null; shuffleQuestions: boolean; shuffleChoices: boolean } | null;
  contentJson?: string | null;
  module?: {
    course: {
      slug: string;
      title: string;
    };
  };
}

export interface DevCourseModule {
  id: string;
  title: string;
  position: number;
  prerequisiteModuleIds?: string | null;
  lessons_on_module: DevCourseLesson[];
}

export interface DevCourse {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  modules_on_course: DevCourseModule[];
}

const DEV_COURSE_ID = "8130c8f2-e834-43cc-aa61-092180207376";
const DEV_MODULE_ID = "6e30b37b-6ad3-4fff-9a81-cfa63d2a41b5";
const DEV_LESSON_ID = "11111111-1111-1111-1111-111111111111";

export const DEV_FORMULA_SECTIONS: DevFormulaSection[] = [
  {
    id: "3adf6e6f-4a7d-4f7b-9e79-8f85a1ac0101",
    code: "S1",
    title: "Section 1 - Sales Comparison",
    position: 0,
    formulas: [
      {
        id: "formula-trend",
        code: "S1.F1",
        name: "Trending Forward",
        expression: "Adjusted Sale Price = Sale Price x (1 + Market Change Rate)",
        notes: "Used to bring older comparable sales forward to the valuation date.",
      },
      {
        id: "formula-time-adjustment",
        code: "S1.F2",
        name: "Monthly Time Adjustment",
        expression: "Monthly Adjustment = Annual Market Change Rate / 12",
        notes: "Helps convert an annual market trend into a monthly adjustment factor.",
      },
    ],
  },
  {
    id: "3adf6e6f-4a7d-4f7b-9e79-8f85a1ac0102",
    code: "S2",
    title: "Section 2 - Income Capitalization",
    position: 1,
    formulas: [
      {
        id: "formula-direct-cap",
        code: "S2.F1",
        name: "Direct Capitalization",
        expression: "Value = Net Operating Income / Capitalization Rate",
        notes: "Core income approach formula for stabilized properties.",
      },
      {
        id: "formula-grm",
        code: "S2.F2",
        name: "Gross Rent Multiplier",
        expression: "Value = Monthly Rent x GRM",
        notes: "Useful when market participants price properties off gross rent.",
      },
    ],
  },
  {
    id: "3adf6e6f-4a7d-4f7b-9e79-8f85a1ac0103",
    code: "S3",
    title: "Section 3 - Cost Approach",
    position: 2,
    formulas: [
      {
        id: "formula-rcnld",
        code: "S3.F1",
        name: "RCNLD",
        expression: "Improvement Value = Replacement Cost New - Depreciation",
        notes: "Replacement cost new less depreciation is central to the cost approach.",
      },
      {
        id: "formula-land-plus-improvements",
        code: "S3.F2",
        name: "Cost Approach Indication",
        expression: "Value = Land Value + Improvement Value",
        notes: "Combines land and depreciated improvements into a total indication.",
      },
    ],
  },
  {
    id: "3adf6e6f-4a7d-4f7b-9e79-8f85a1ac0104",
    code: "S4",
    title: "Section 4 - Ratio Studies",
    position: 3,
    formulas: [
      {
        id: "formula-asr",
        code: "S4.F1",
        name: "Assessment-to-Sale Ratio",
        expression: "ASR = Assessed Value / Sale Price",
        notes: "Measures how an assessment compares with market evidence from a sale.",
      },
      {
        id: "formula-cod",
        code: "S4.F2",
        name: "Coefficient of Dispersion",
        expression: "COD = Average Absolute Deviation from Median Ratio / Median Ratio x 100",
        notes: "Shows uniformity of assessments around the median ratio.",
      },
      {
        id: "formula-prd",
        code: "S4.F3",
        name: "Price-Related Differential",
        expression: "PRD = Mean Ratio / Weighted Mean Ratio",
        notes: "Used to detect regressivity or progressivity in assessments.",
      },
    ],
  },
];

const DEV_LESSON: DevCourseLesson = {
  id: DEV_LESSON_ID,
  title: "Welcome to Property Assessment",
  position: 1,
  lessonType: "text",
  durationSeconds: 600,
  contentJson: JSON.stringify({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This sample lesson is shown in local development when Data Connect has not been seeded yet.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Use the Formula Compass to review common assessment formulas, then return here once course data has been imported.",
          },
        ],
      },
    ],
  }),
  module: {
    course: {
      slug: "property-assessment-mastery",
      title: "Property Assessment Mastery",
    },
  },
};

export const DEV_COURSES: DevCourse[] = [
  {
    id: DEV_COURSE_ID,
    slug: "property-assessment-mastery",
    title: "Property Assessment Mastery",
    description:
      "A built-in local development course covering the student journey until live Data Connect content is imported.",
    thumbnailUrl: null,
    modules_on_course: [
      {
        id: DEV_MODULE_ID,
        title: "Introduction to Assessment",
        position: 1,
        prerequisiteModuleIds: null,
        lessons_on_module: [DEV_LESSON],
      },
    ],
  },
];

export function getDevPublishedCourses() {
  return DEV_COURSES.map(({ modules_on_course, ...course }) => course);
}

export function getDevCourseBySlug(slug: string) {
  return DEV_COURSES.find((course) => course.slug === slug) ?? null;
}

export function getDevLessonById(id: string) {
  for (const course of DEV_COURSES) {
    for (const module of course.modules_on_course) {
      for (const lesson of module.lessons_on_module) {
        if (lesson.id === id) return lesson;
      }
    }
  }
  return null;
}
