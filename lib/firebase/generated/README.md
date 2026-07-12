# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `impact26-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListPublishedCourses*](#listpublishedcourses)
  - [*GetLearnerCatalog*](#getlearnercatalog)
  - [*GetLearnerProfile*](#getlearnerprofile)
  - [*GetCourseBySlug*](#getcoursebyslug)
  - [*GetPublishedCourseBySlug*](#getpublishedcoursebyslug)
  - [*GetLesson*](#getlesson)
  - [*ListPublishedQuizzes*](#listpublishedquizzes)
  - [*GetQuizSummary*](#getquizsummary)
  - [*GetAttemptReview*](#getattemptreview)
  - [*ListLearnerSourceMaterials*](#listlearnersourcematerials)
  - [*GetLearnerSourceMaterialAccess*](#getlearnersourcematerialaccess)
  - [*GetQuizById*](#getquizbyid)
  - [*GetQuizQuestions*](#getquizquestions)
  - [*GetInProgressAttempt*](#getinprogressattempt)
  - [*GetUserCourseProgress*](#getusercourseprogress)
  - [*GetLessonProgress*](#getlessonprogress)
  - [*GetUserCourseProgressFull*](#getusercourseprogressfull)
  - [*GetUserLessonProgressSummary*](#getuserlessonprogresssummary)
  - [*GetUserAttemptHistory*](#getuserattempthistory)
  - [*GetUserActivityHistory*](#getuseractivityhistory)
  - [*GetAttemptResults*](#getattemptresults)
  - [*GetFormulaSections*](#getformulasections)
  - [*GetUserProgressDetails*](#getuserprogressdetails)
  - [*ListAdminQuizzes*](#listadminquizzes)
  - [*GetQuizQuestionCount*](#getquizquestioncount)
  - [*GetQuizQuestionsAdmin*](#getquizquestionsadmin)
  - [*GetAttemptForEvaluation*](#getattemptforevaluation)
  - [*GetQuestionWithAnswers*](#getquestionwithanswers)
  - [*GetQuizQuestionPointValue*](#getquizquestionpointvalue)
  - [*GetAttemptForCompletion*](#getattemptforcompletion)
  - [*GetAttemptOwner*](#getattemptowner)
  - [*AdminListQuestions*](#adminlistquestions)
  - [*AdminListQuestionsPage*](#adminlistquestionspage)
  - [*AdminCountQuestions*](#admincountquestions)
  - [*AdminListQuizQuestionUsage*](#adminlistquizquestionusage)
  - [*AdminListCourses*](#adminlistcourses)
  - [*GetLessonVersions*](#getlessonversions)
  - [*AdminListSourceMaterialsRich*](#adminlistsourcematerialsrich)
  - [*AdminListSourceMaterials*](#adminlistsourcematerials)
  - [*AdminListSourceMaterialFolders*](#adminlistsourcematerialfolders)
  - [*AdminListSourceMaterialTags*](#adminlistsourcematerialtags)
  - [*AdminListUsers*](#adminlistusers)
  - [*AdminCohortStats*](#admincohortstats)
  - [*AdminListGlossaryTerms*](#adminlistglossaryterms)
  - [*ListPublishedGlossaryTerms*](#listpublishedglossaryterms)
  - [*GetGlossaryNotesForUser*](#getglossarynotesforuser)
  - [*GetGlossaryNoteForUserTerm*](#getglossarynoteforuserterm)
  - [*GetLessonNotesForUser*](#getlessonnotesforuser)
  - [*GetLessonNoteForUserLesson*](#getlessonnoteforuserlesson)
  - [*GetUserFavorites*](#getuserfavorites)
  - [*GetUserFavoritesByType*](#getuserfavoritesbytype)
  - [*ListCustomDomains*](#listcustomdomains)
  - [*AdminListCohorts*](#adminlistcohorts)
  - [*ListCohortsForInstructor*](#listcohortsforinstructor)
  - [*GetCohortDetail*](#getcohortdetail)
  - [*GetCohortMemberIds*](#getcohortmemberids)
  - [*GetCohortAttempts*](#getcohortattempts)
  - [*GetCohortEngagement*](#getcohortengagement)
  - [*GetLearnerProgressDetail*](#getlearnerprogressdetail)
  - [*AdminGetAttemptReview*](#admingetattemptreview)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUserRole*](#updateuserrole)
  - [*CreateCourse*](#createcourse)
  - [*UpdateCourse*](#updatecourse)
  - [*CreateModule*](#createmodule)
  - [*UpdateModule*](#updatemodule)
  - [*CreateLessonVersion*](#createlessonversion)
  - [*CreateLesson*](#createlesson)
  - [*UpdateLesson*](#updatelesson)
  - [*DeleteLesson*](#deletelesson)
  - [*DeleteModule*](#deletemodule)
  - [*DeleteCourse*](#deletecourse)
  - [*DeleteSourceLinksForCourse*](#deletesourcelinksforcourse)
  - [*DeleteUserCourseProgressForCourse*](#deleteusercourseprogressforcourse)
  - [*DeleteLessonVersionsForLesson*](#deletelessonversionsforlesson)
  - [*DeleteSourceLinksForLesson*](#deletesourcelinksforlesson)
  - [*DeleteSourceLinksForQuestion*](#deletesourcelinksforquestion)
  - [*DeleteSourceLinksForMaterial*](#deletesourcelinksformaterial)
  - [*DeleteUserLessonProgressForLesson*](#deleteuserlessonprogressforlesson)
  - [*DeleteIngestionJobsForMaterial*](#deleteingestionjobsformaterial)
  - [*DeleteSourceMaterial*](#deletesourcematerial)
  - [*UpdateSourceMaterial*](#updatesourcematerial)
  - [*UpdateSourceMaterialLibraryState*](#updatesourcemateriallibrarystate)
  - [*CreateSourceMaterial*](#createsourcematerial)
  - [*CreateIngestionJob*](#createingestionjob)
  - [*CreateSourceMaterialFolder*](#createsourcematerialfolder)
  - [*UpdateSourceMaterialFolder*](#updatesourcematerialfolder)
  - [*DeleteSourceMaterialFolder*](#deletesourcematerialfolder)
  - [*CreateSourceMaterialTag*](#createsourcematerialtag)
  - [*CreateSourceMaterialTagAssignment*](#createsourcematerialtagassignment)
  - [*DeleteTagAssignmentsForMaterial*](#deletetagassignmentsformaterial)
  - [*CreateSourceMaterialActivity*](#createsourcematerialactivity)
  - [*CreateQuestion*](#createquestion)
  - [*UpdateQuestion*](#updatequestion)
  - [*UpdateQuestionStatus*](#updatequestionstatus)
  - [*CreateAnswerChoice*](#createanswerchoice)
  - [*UpdateAnswerChoice*](#updateanswerchoice)
  - [*DeleteAnswerChoicesForQuestion*](#deleteanswerchoicesforquestion)
  - [*DeleteQuizQuestionsForQuestion*](#deletequizquestionsforquestion)
  - [*DeleteQuestion*](#deletequestion)
  - [*CreateQuiz*](#createquiz)
  - [*AddQuestionToQuiz*](#addquestiontoquiz)
  - [*UpdateQuizCalculatorSettings*](#updatequizcalculatorsettings)
  - [*UpdateQuizStatus*](#updatequizstatus)
  - [*UpdateQuiz*](#updatequiz)
  - [*DeleteQuizQuestionsForQuiz*](#deletequizquestionsforquiz)
  - [*RemoveQuestionFromQuiz*](#removequestionfromquiz)
  - [*ReorderQuizQuestion*](#reorderquizquestion)
  - [*DeleteQuizResponsesForQuiz*](#deletequizresponsesforquiz)
  - [*DeleteQuizAttemptsForQuiz*](#deletequizattemptsforquiz)
  - [*DeleteQuiz*](#deletequiz)
  - [*EnrollInCourse*](#enrollincourse)
  - [*UpdateUserCourseProgress*](#updateusercourseprogress)
  - [*UpsertLessonProgress*](#upsertlessonprogress)
  - [*UpdateLessonPlayback*](#updatelessonplayback)
  - [*CompleteLessonProgress*](#completelessonprogress)
  - [*RecordDailyActivity*](#recorddailyactivity)
  - [*CreateQuizAttempt*](#createquizattempt)
  - [*UpsertQuizResponse*](#upsertquizresponse)
  - [*CompleteQuizAttempt*](#completequizattempt)
  - [*MarkAnsweredAt*](#markansweredat)
  - [*CreateFormulaSection*](#createformulasection)
  - [*CreateFormula*](#createformula)
  - [*UpdateFormula*](#updateformula)
  - [*DeleteFormula*](#deleteformula)
  - [*UpdateFormulaSection*](#updateformulasection)
  - [*DeleteFormulasForSection*](#deleteformulasforsection)
  - [*DeleteFormulaSection*](#deleteformulasection)
  - [*CreateContentSourceLink*](#createcontentsourcelink)
  - [*DeleteContentSourceLink*](#deletecontentsourcelink)
  - [*CreateGlossaryTerm*](#createglossaryterm)
  - [*UpdateGlossaryTerm*](#updateglossaryterm)
  - [*DeleteGlossaryTerm*](#deleteglossaryterm)
  - [*DeleteGlossaryNotesForTerm*](#deleteglossarynotesforterm)
  - [*CreateGlossaryNote*](#createglossarynote)
  - [*UpdateGlossaryNote*](#updateglossarynote)
  - [*DeleteGlossaryNote*](#deleteglossarynote)
  - [*CreateLessonNote*](#createlessonnote)
  - [*UpdateLessonNote*](#updatelessonnote)
  - [*DeleteLessonNote*](#deletelessonnote)
  - [*UpsertUserFavorite*](#upsertuserfavorite)
  - [*DeleteUserFavorite*](#deleteuserfavorite)
  - [*CreateCustomDomain*](#createcustomdomain)
  - [*CreateCohort*](#createcohort)
  - [*UpdateCohort*](#updatecohort)
  - [*DeleteCohort*](#deletecohort)
  - [*DeleteCohortMembershipsForCohort*](#deletecohortmembershipsforcohort)
  - [*DeleteCohortInstructorsForCohort*](#deletecohortinstructorsforcohort)
  - [*AddCohortMembership*](#addcohortmembership)
  - [*RemoveCohortMembership*](#removecohortmembership)
  - [*AddCohortInstructor*](#addcohortinstructor)
  - [*RemoveCohortInstructor*](#removecohortinstructor)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `impact26-connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@impact26/dataconnect-sdk` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@impact26/dataconnect-sdk';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@impact26/dataconnect-sdk';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `impact26-connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListPublishedCourses
You can execute the `ListPublishedCourses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listPublishedCourses(options?: ExecuteQueryOptions): QueryPromise<ListPublishedCoursesData, undefined>;

interface ListPublishedCoursesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublishedCoursesData, undefined>;
}
export const listPublishedCoursesRef: ListPublishedCoursesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublishedCourses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublishedCoursesData, undefined>;

interface ListPublishedCoursesRef {
  ...
  (dc: DataConnect): QueryRef<ListPublishedCoursesData, undefined>;
}
export const listPublishedCoursesRef: ListPublishedCoursesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublishedCoursesRef:
```typescript
const name = listPublishedCoursesRef.operationName;
console.log(name);
```

### Variables
The `ListPublishedCourses` query has no variables.
### Return Type
Recall that executing the `ListPublishedCourses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublishedCoursesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublishedCoursesData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    publishedAt?: DateString | null;
    modules_on_course: ({
      id: UUIDString;
      title: string;
      position: number;
      lessons_on_module: ({
        id: UUIDString;
        title: string;
        position: number;
        lessonType: string;
        durationSeconds?: number | null;
      } & Lesson_Key)[];
    } & Module_Key)[];
  } & Course_Key)[];
}
```
### Using `ListPublishedCourses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublishedCourses } from '@impact26/dataconnect-sdk';


// Call the `listPublishedCourses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublishedCourses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublishedCourses(dataConnect);

console.log(data.courses);

// Or, you can use the `Promise` API.
listPublishedCourses().then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `ListPublishedCourses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublishedCoursesRef } from '@impact26/dataconnect-sdk';


// Call the `listPublishedCoursesRef()` function to get a reference to the query.
const ref = listPublishedCoursesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublishedCoursesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetLearnerCatalog
You can execute the `GetLearnerCatalog` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLearnerCatalog(vars: GetLearnerCatalogVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearnerCatalogData, GetLearnerCatalogVariables>;

interface GetLearnerCatalogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLearnerCatalogVariables): QueryRef<GetLearnerCatalogData, GetLearnerCatalogVariables>;
}
export const getLearnerCatalogRef: GetLearnerCatalogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLearnerCatalog(dc: DataConnect, vars: GetLearnerCatalogVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearnerCatalogData, GetLearnerCatalogVariables>;

interface GetLearnerCatalogRef {
  ...
  (dc: DataConnect, vars: GetLearnerCatalogVariables): QueryRef<GetLearnerCatalogData, GetLearnerCatalogVariables>;
}
export const getLearnerCatalogRef: GetLearnerCatalogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLearnerCatalogRef:
```typescript
const name = getLearnerCatalogRef.operationName;
console.log(name);
```

### Variables
The `GetLearnerCatalog` query requires an argument of type `GetLearnerCatalogVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLearnerCatalogVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetLearnerCatalog` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLearnerCatalogData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLearnerCatalogData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    publishedAt?: DateString | null;
    modules_on_course: ({
      id: UUIDString;
      title: string;
      position: number;
      lessons_on_module: ({
        id: UUIDString;
        title: string;
        position: number;
        lessonType: string;
        durationSeconds?: number | null;
      } & Lesson_Key)[];
    } & Module_Key)[];
  } & Course_Key)[];
    userCourseProgresses: ({
      course: {
        id: UUIDString;
      } & Course_Key;
        enrolledAt: DateString;
        lastAccessedAt?: DateString | null;
        completedAt?: DateString | null;
    })[];
      userLessonProgresses: ({
        lesson: {
          id: UUIDString;
        } & Lesson_Key;
          status: string;
          videoPositionSeconds?: number | null;
          completedAt?: DateString | null;
      })[];
}
```
### Using `GetLearnerCatalog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLearnerCatalog, GetLearnerCatalogVariables } from '@impact26/dataconnect-sdk';

// The `GetLearnerCatalog` query requires an argument of type `GetLearnerCatalogVariables`:
const getLearnerCatalogVars: GetLearnerCatalogVariables = {
  userId: ..., 
};

// Call the `getLearnerCatalog()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLearnerCatalog(getLearnerCatalogVars);
// Variables can be defined inline as well.
const { data } = await getLearnerCatalog({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLearnerCatalog(dataConnect, getLearnerCatalogVars);

console.log(data.courses);
console.log(data.userCourseProgresses);
console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
getLearnerCatalog(getLearnerCatalogVars).then((response) => {
  const data = response.data;
  console.log(data.courses);
  console.log(data.userCourseProgresses);
  console.log(data.userLessonProgresses);
});
```

### Using `GetLearnerCatalog`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLearnerCatalogRef, GetLearnerCatalogVariables } from '@impact26/dataconnect-sdk';

// The `GetLearnerCatalog` query requires an argument of type `GetLearnerCatalogVariables`:
const getLearnerCatalogVars: GetLearnerCatalogVariables = {
  userId: ..., 
};

// Call the `getLearnerCatalogRef()` function to get a reference to the query.
const ref = getLearnerCatalogRef(getLearnerCatalogVars);
// Variables can be defined inline as well.
const ref = getLearnerCatalogRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLearnerCatalogRef(dataConnect, getLearnerCatalogVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);
console.log(data.userCourseProgresses);
console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
  console.log(data.userCourseProgresses);
  console.log(data.userLessonProgresses);
});
```

## GetLearnerProfile
You can execute the `GetLearnerProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLearnerProfile(vars: GetLearnerProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearnerProfileData, GetLearnerProfileVariables>;

interface GetLearnerProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLearnerProfileVariables): QueryRef<GetLearnerProfileData, GetLearnerProfileVariables>;
}
export const getLearnerProfileRef: GetLearnerProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLearnerProfile(dc: DataConnect, vars: GetLearnerProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearnerProfileData, GetLearnerProfileVariables>;

interface GetLearnerProfileRef {
  ...
  (dc: DataConnect, vars: GetLearnerProfileVariables): QueryRef<GetLearnerProfileData, GetLearnerProfileVariables>;
}
export const getLearnerProfileRef: GetLearnerProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLearnerProfileRef:
```typescript
const name = getLearnerProfileRef.operationName;
console.log(name);
```

### Variables
The `GetLearnerProfile` query requires an argument of type `GetLearnerProfileVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLearnerProfileVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetLearnerProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLearnerProfileData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLearnerProfileData {
  users: ({
    fullName?: string | null;
    email: string;
  })[];
}
```
### Using `GetLearnerProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLearnerProfile, GetLearnerProfileVariables } from '@impact26/dataconnect-sdk';

// The `GetLearnerProfile` query requires an argument of type `GetLearnerProfileVariables`:
const getLearnerProfileVars: GetLearnerProfileVariables = {
  userId: ..., 
};

// Call the `getLearnerProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLearnerProfile(getLearnerProfileVars);
// Variables can be defined inline as well.
const { data } = await getLearnerProfile({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLearnerProfile(dataConnect, getLearnerProfileVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getLearnerProfile(getLearnerProfileVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetLearnerProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLearnerProfileRef, GetLearnerProfileVariables } from '@impact26/dataconnect-sdk';

// The `GetLearnerProfile` query requires an argument of type `GetLearnerProfileVariables`:
const getLearnerProfileVars: GetLearnerProfileVariables = {
  userId: ..., 
};

// Call the `getLearnerProfileRef()` function to get a reference to the query.
const ref = getLearnerProfileRef(getLearnerProfileVars);
// Variables can be defined inline as well.
const ref = getLearnerProfileRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLearnerProfileRef(dataConnect, getLearnerProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetCourseBySlug
You can execute the `GetCourseBySlug` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getCourseBySlug(vars: GetCourseBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetCourseBySlugData, GetCourseBySlugVariables>;

interface GetCourseBySlugRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCourseBySlugVariables): QueryRef<GetCourseBySlugData, GetCourseBySlugVariables>;
}
export const getCourseBySlugRef: GetCourseBySlugRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCourseBySlug(dc: DataConnect, vars: GetCourseBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetCourseBySlugData, GetCourseBySlugVariables>;

interface GetCourseBySlugRef {
  ...
  (dc: DataConnect, vars: GetCourseBySlugVariables): QueryRef<GetCourseBySlugData, GetCourseBySlugVariables>;
}
export const getCourseBySlugRef: GetCourseBySlugRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCourseBySlugRef:
```typescript
const name = getCourseBySlugRef.operationName;
console.log(name);
```

### Variables
The `GetCourseBySlug` query requires an argument of type `GetCourseBySlugVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCourseBySlugVariables {
  slug: string;
}
```
### Return Type
Recall that executing the `GetCourseBySlug` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCourseBySlugData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCourseBySlugData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    modules_on_course: ({
      id: UUIDString;
      title: string;
      position: number;
      prerequisiteModuleIds?: string | null;
      lessons_on_module: ({
        id: UUIDString;
        title: string;
        position: number;
        lessonType: string;
        durationSeconds?: number | null;
        videoPlaybackId?: string | null;
        videoUrl?: string | null;
        quiz?: {
          id: UUIDString;
        } & Quiz_Key;
      } & Lesson_Key)[];
    } & Module_Key)[];
  } & Course_Key)[];
}
```
### Using `GetCourseBySlug`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCourseBySlug, GetCourseBySlugVariables } from '@impact26/dataconnect-sdk';

// The `GetCourseBySlug` query requires an argument of type `GetCourseBySlugVariables`:
const getCourseBySlugVars: GetCourseBySlugVariables = {
  slug: ..., 
};

// Call the `getCourseBySlug()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCourseBySlug(getCourseBySlugVars);
// Variables can be defined inline as well.
const { data } = await getCourseBySlug({ slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCourseBySlug(dataConnect, getCourseBySlugVars);

console.log(data.courses);

// Or, you can use the `Promise` API.
getCourseBySlug(getCourseBySlugVars).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `GetCourseBySlug`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCourseBySlugRef, GetCourseBySlugVariables } from '@impact26/dataconnect-sdk';

// The `GetCourseBySlug` query requires an argument of type `GetCourseBySlugVariables`:
const getCourseBySlugVars: GetCourseBySlugVariables = {
  slug: ..., 
};

// Call the `getCourseBySlugRef()` function to get a reference to the query.
const ref = getCourseBySlugRef(getCourseBySlugVars);
// Variables can be defined inline as well.
const ref = getCourseBySlugRef({ slug: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCourseBySlugRef(dataConnect, getCourseBySlugVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetPublishedCourseBySlug
You can execute the `GetPublishedCourseBySlug` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getPublishedCourseBySlug(vars: GetPublishedCourseBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedCourseBySlugData, GetPublishedCourseBySlugVariables>;

interface GetPublishedCourseBySlugRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublishedCourseBySlugVariables): QueryRef<GetPublishedCourseBySlugData, GetPublishedCourseBySlugVariables>;
}
export const getPublishedCourseBySlugRef: GetPublishedCourseBySlugRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPublishedCourseBySlug(dc: DataConnect, vars: GetPublishedCourseBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedCourseBySlugData, GetPublishedCourseBySlugVariables>;

interface GetPublishedCourseBySlugRef {
  ...
  (dc: DataConnect, vars: GetPublishedCourseBySlugVariables): QueryRef<GetPublishedCourseBySlugData, GetPublishedCourseBySlugVariables>;
}
export const getPublishedCourseBySlugRef: GetPublishedCourseBySlugRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPublishedCourseBySlugRef:
```typescript
const name = getPublishedCourseBySlugRef.operationName;
console.log(name);
```

### Variables
The `GetPublishedCourseBySlug` query requires an argument of type `GetPublishedCourseBySlugVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPublishedCourseBySlugVariables {
  slug: string;
}
```
### Return Type
Recall that executing the `GetPublishedCourseBySlug` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPublishedCourseBySlugData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPublishedCourseBySlugData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    isPublished: boolean;
    modules_on_course: ({
      lessons_on_module: ({
        id: UUIDString;
      } & Lesson_Key)[];
    })[];
  } & Course_Key)[];
}
```
### Using `GetPublishedCourseBySlug`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPublishedCourseBySlug, GetPublishedCourseBySlugVariables } from '@impact26/dataconnect-sdk';

// The `GetPublishedCourseBySlug` query requires an argument of type `GetPublishedCourseBySlugVariables`:
const getPublishedCourseBySlugVars: GetPublishedCourseBySlugVariables = {
  slug: ..., 
};

// Call the `getPublishedCourseBySlug()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPublishedCourseBySlug(getPublishedCourseBySlugVars);
// Variables can be defined inline as well.
const { data } = await getPublishedCourseBySlug({ slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPublishedCourseBySlug(dataConnect, getPublishedCourseBySlugVars);

console.log(data.courses);

// Or, you can use the `Promise` API.
getPublishedCourseBySlug(getPublishedCourseBySlugVars).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `GetPublishedCourseBySlug`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPublishedCourseBySlugRef, GetPublishedCourseBySlugVariables } from '@impact26/dataconnect-sdk';

// The `GetPublishedCourseBySlug` query requires an argument of type `GetPublishedCourseBySlugVariables`:
const getPublishedCourseBySlugVars: GetPublishedCourseBySlugVariables = {
  slug: ..., 
};

// Call the `getPublishedCourseBySlugRef()` function to get a reference to the query.
const ref = getPublishedCourseBySlugRef(getPublishedCourseBySlugVars);
// Variables can be defined inline as well.
const ref = getPublishedCourseBySlugRef({ slug: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPublishedCourseBySlugRef(dataConnect, getPublishedCourseBySlugVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetLesson
You can execute the `GetLesson` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLesson(vars: GetLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonData, GetLessonVariables>;

interface GetLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonVariables): QueryRef<GetLessonData, GetLessonVariables>;
}
export const getLessonRef: GetLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLesson(dc: DataConnect, vars: GetLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonData, GetLessonVariables>;

interface GetLessonRef {
  ...
  (dc: DataConnect, vars: GetLessonVariables): QueryRef<GetLessonData, GetLessonVariables>;
}
export const getLessonRef: GetLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonRef:
```typescript
const name = getLessonRef.operationName;
console.log(name);
```

### Variables
The `GetLesson` query requires an argument of type `GetLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLessonVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetLesson` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonData {
  lesson?: {
    id: UUIDString;
    title: string;
    lessonType: string;
    contentJson?: string | null;
    videoPlaybackId?: string | null;
    videoUrl?: string | null;
    durationSeconds?: number | null;
    quiz?: {
      id: UUIDString;
      title: string;
      description?: string | null;
      timeLimitSeconds?: number | null;
      passingScore?: number | null;
      shuffleQuestions: boolean;
      shuffleChoices: boolean;
      calculatorSettingsJson?: string | null;
      status: string;
      publishedAt?: DateString | null;
    } & Quiz_Key;
      sourceMaterial?: {
        id: UUIDString;
      } & SourceMaterial_Key;
        module: {
          course: {
            slug: string;
            title: string;
          };
        };
  } & Lesson_Key;
}
```
### Using `GetLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLesson, GetLessonVariables } from '@impact26/dataconnect-sdk';

// The `GetLesson` query requires an argument of type `GetLessonVariables`:
const getLessonVars: GetLessonVariables = {
  id: ..., 
};

// Call the `getLesson()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLesson(getLessonVars);
// Variables can be defined inline as well.
const { data } = await getLesson({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLesson(dataConnect, getLessonVars);

console.log(data.lesson);

// Or, you can use the `Promise` API.
getLesson(getLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lesson);
});
```

### Using `GetLesson`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonRef, GetLessonVariables } from '@impact26/dataconnect-sdk';

// The `GetLesson` query requires an argument of type `GetLessonVariables`:
const getLessonVars: GetLessonVariables = {
  id: ..., 
};

// Call the `getLessonRef()` function to get a reference to the query.
const ref = getLessonRef(getLessonVars);
// Variables can be defined inline as well.
const ref = getLessonRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonRef(dataConnect, getLessonVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.lesson);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson);
});
```

## ListPublishedQuizzes
You can execute the `ListPublishedQuizzes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listPublishedQuizzes(options?: ExecuteQueryOptions): QueryPromise<ListPublishedQuizzesData, undefined>;

interface ListPublishedQuizzesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublishedQuizzesData, undefined>;
}
export const listPublishedQuizzesRef: ListPublishedQuizzesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublishedQuizzes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublishedQuizzesData, undefined>;

interface ListPublishedQuizzesRef {
  ...
  (dc: DataConnect): QueryRef<ListPublishedQuizzesData, undefined>;
}
export const listPublishedQuizzesRef: ListPublishedQuizzesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublishedQuizzesRef:
```typescript
const name = listPublishedQuizzesRef.operationName;
console.log(name);
```

### Variables
The `ListPublishedQuizzes` query has no variables.
### Return Type
Recall that executing the `ListPublishedQuizzes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublishedQuizzesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublishedQuizzesData {
  quizzes: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    timeLimitSeconds?: number | null;
    passingScore?: number | null;
    shuffleQuestions: boolean;
    shuffleChoices: boolean;
    calculatorSettingsJson?: string | null;
    publishedAt?: DateString | null;
    quizQuestions_on_quiz: ({
      position: number;
      pointValue: number;
      question: {
        id: UUIDString;
        domain: string;
        difficulty: string;
      } & Question_Key;
    })[];
  } & Quiz_Key)[];
}
```
### Using `ListPublishedQuizzes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublishedQuizzes } from '@impact26/dataconnect-sdk';


// Call the `listPublishedQuizzes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublishedQuizzes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublishedQuizzes(dataConnect);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
listPublishedQuizzes().then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

### Using `ListPublishedQuizzes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublishedQuizzesRef } from '@impact26/dataconnect-sdk';


// Call the `listPublishedQuizzesRef()` function to get a reference to the query.
const ref = listPublishedQuizzesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublishedQuizzesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

## GetQuizSummary
You can execute the `GetQuizSummary` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizSummary(vars: GetQuizSummaryVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizSummaryData, GetQuizSummaryVariables>;

interface GetQuizSummaryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizSummaryVariables): QueryRef<GetQuizSummaryData, GetQuizSummaryVariables>;
}
export const getQuizSummaryRef: GetQuizSummaryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizSummary(dc: DataConnect, vars: GetQuizSummaryVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizSummaryData, GetQuizSummaryVariables>;

interface GetQuizSummaryRef {
  ...
  (dc: DataConnect, vars: GetQuizSummaryVariables): QueryRef<GetQuizSummaryData, GetQuizSummaryVariables>;
}
export const getQuizSummaryRef: GetQuizSummaryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizSummaryRef:
```typescript
const name = getQuizSummaryRef.operationName;
console.log(name);
```

### Variables
The `GetQuizSummary` query requires an argument of type `GetQuizSummaryVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizSummaryVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizSummary` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizSummaryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizSummaryData {
  quiz?: {
    id: UUIDString;
    title: string;
    description?: string | null;
    timeLimitSeconds?: number | null;
    passingScore?: number | null;
    status: string;
    publishedAt?: DateString | null;
  } & Quiz_Key;
    quizQuestions: ({
      position: number;
      pointValue: number;
      question: {
        id: UUIDString;
        domain: string;
        difficulty: string;
      } & Question_Key;
    })[];
}
```
### Using `GetQuizSummary`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizSummary, GetQuizSummaryVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizSummary` query requires an argument of type `GetQuizSummaryVariables`:
const getQuizSummaryVars: GetQuizSummaryVariables = {
  quizId: ..., 
};

// Call the `getQuizSummary()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizSummary(getQuizSummaryVars);
// Variables can be defined inline as well.
const { data } = await getQuizSummary({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizSummary(dataConnect, getQuizSummaryVars);

console.log(data.quiz);
console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
getQuizSummary(getQuizSummaryVars).then((response) => {
  const data = response.data;
  console.log(data.quiz);
  console.log(data.quizQuestions);
});
```

### Using `GetQuizSummary`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizSummaryRef, GetQuizSummaryVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizSummary` query requires an argument of type `GetQuizSummaryVariables`:
const getQuizSummaryVars: GetQuizSummaryVariables = {
  quizId: ..., 
};

// Call the `getQuizSummaryRef()` function to get a reference to the query.
const ref = getQuizSummaryRef(getQuizSummaryVars);
// Variables can be defined inline as well.
const ref = getQuizSummaryRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizSummaryRef(dataConnect, getQuizSummaryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quiz);
console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz);
  console.log(data.quizQuestions);
});
```

## GetAttemptReview
You can execute the `GetAttemptReview` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAttemptReview(vars: GetAttemptReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptReviewData, GetAttemptReviewVariables>;

interface GetAttemptReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptReviewVariables): QueryRef<GetAttemptReviewData, GetAttemptReviewVariables>;
}
export const getAttemptReviewRef: GetAttemptReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttemptReview(dc: DataConnect, vars: GetAttemptReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptReviewData, GetAttemptReviewVariables>;

interface GetAttemptReviewRef {
  ...
  (dc: DataConnect, vars: GetAttemptReviewVariables): QueryRef<GetAttemptReviewData, GetAttemptReviewVariables>;
}
export const getAttemptReviewRef: GetAttemptReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttemptReviewRef:
```typescript
const name = getAttemptReviewRef.operationName;
console.log(name);
```

### Variables
The `GetAttemptReview` query requires an argument of type `GetAttemptReviewVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttemptReviewVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAttemptReview` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttemptReviewData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttemptReviewData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    questionOrder: string;
    scoreRaw?: number | null;
    scoreMax?: number | null;
    scorePct?: number | null;
    passed?: boolean | null;
    startedAt: DateString;
    completedAt?: DateString | null;
    user: {
      id: string;
    } & User_Key;
      quiz: {
        id: UUIDString;
        title: string;
        passingScore?: number | null;
        quizQuestions_on_quiz: ({
          position: number;
          pointValue: number;
          question: {
            id: UUIDString;
            questionText: string;
            difficulty: string;
            domain: string;
            formulaRef?: string | null;
            rationale?: string | null;
            calculation?: string | null;
            sourceRef?: string | null;
            answerChoices_on_question: ({
              id: UUIDString;
              letter: string;
              choiceText: string;
              isCorrect: boolean;
              explanation?: string | null;
              position: number;
            } & AnswerChoice_Key)[];
          } & Question_Key;
        })[];
      } & Quiz_Key;
        quizResponses_on_attempt: ({
          selectedLetters: string;
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          answeredAt?: DateString | null;
          question: {
            id: UUIDString;
            questionText: string;
            difficulty: string;
            domain: string;
            formulaRef?: string | null;
            rationale?: string | null;
            calculation?: string | null;
            sourceRef?: string | null;
            answerChoices_on_question: ({
              id: UUIDString;
              letter: string;
              choiceText: string;
              isCorrect: boolean;
              explanation?: string | null;
              position: number;
            } & AnswerChoice_Key)[];
          } & Question_Key;
        })[];
  } & QuizAttempt_Key;
}
```
### Using `GetAttemptReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttemptReview, GetAttemptReviewVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptReview` query requires an argument of type `GetAttemptReviewVariables`:
const getAttemptReviewVars: GetAttemptReviewVariables = {
  attemptId: ..., 
};

// Call the `getAttemptReview()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttemptReview(getAttemptReviewVars);
// Variables can be defined inline as well.
const { data } = await getAttemptReview({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttemptReview(dataConnect, getAttemptReviewVars);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
getAttemptReview(getAttemptReviewVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

### Using `GetAttemptReview`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttemptReviewRef, GetAttemptReviewVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptReview` query requires an argument of type `GetAttemptReviewVariables`:
const getAttemptReviewVars: GetAttemptReviewVariables = {
  attemptId: ..., 
};

// Call the `getAttemptReviewRef()` function to get a reference to the query.
const ref = getAttemptReviewRef(getAttemptReviewVars);
// Variables can be defined inline as well.
const ref = getAttemptReviewRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttemptReviewRef(dataConnect, getAttemptReviewVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

## ListLearnerSourceMaterials
You can execute the `ListLearnerSourceMaterials` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listLearnerSourceMaterials(options?: ExecuteQueryOptions): QueryPromise<ListLearnerSourceMaterialsData, undefined>;

interface ListLearnerSourceMaterialsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListLearnerSourceMaterialsData, undefined>;
}
export const listLearnerSourceMaterialsRef: ListLearnerSourceMaterialsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listLearnerSourceMaterials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListLearnerSourceMaterialsData, undefined>;

interface ListLearnerSourceMaterialsRef {
  ...
  (dc: DataConnect): QueryRef<ListLearnerSourceMaterialsData, undefined>;
}
export const listLearnerSourceMaterialsRef: ListLearnerSourceMaterialsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listLearnerSourceMaterialsRef:
```typescript
const name = listLearnerSourceMaterialsRef.operationName;
console.log(name);
```

### Variables
The `ListLearnerSourceMaterials` query has no variables.
### Return Type
Recall that executing the `ListLearnerSourceMaterials` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListLearnerSourceMaterialsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListLearnerSourceMaterialsData {
  sourceMaterials: ({
    id: UUIDString;
    title: string;
    fileName: string;
    fileType: string;
    metadataJson?: string | null;
    status: string;
    reviewStatus: string;
    visibility: string;
    archivedAt?: DateString | null;
    trashedAt?: DateString | null;
    createdAt: DateString;
    updatedAt: DateString;
    folder?: {
      id: UUIDString;
      name: string;
      folderType: string;
    } & SourceMaterialFolder_Key;
      sourceMaterialTagAssignments_on_sourceMaterial: ({
        tag: {
          id: UUIDString;
          name: string;
          color?: string | null;
        } & SourceMaterialTag_Key;
      })[];
  } & SourceMaterial_Key)[];
}
```
### Using `ListLearnerSourceMaterials`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listLearnerSourceMaterials } from '@impact26/dataconnect-sdk';


// Call the `listLearnerSourceMaterials()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listLearnerSourceMaterials();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listLearnerSourceMaterials(dataConnect);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
listLearnerSourceMaterials().then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

### Using `ListLearnerSourceMaterials`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listLearnerSourceMaterialsRef } from '@impact26/dataconnect-sdk';


// Call the `listLearnerSourceMaterialsRef()` function to get a reference to the query.
const ref = listLearnerSourceMaterialsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listLearnerSourceMaterialsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

## GetLearnerSourceMaterialAccess
You can execute the `GetLearnerSourceMaterialAccess` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLearnerSourceMaterialAccess(vars: GetLearnerSourceMaterialAccessVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearnerSourceMaterialAccessData, GetLearnerSourceMaterialAccessVariables>;

interface GetLearnerSourceMaterialAccessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLearnerSourceMaterialAccessVariables): QueryRef<GetLearnerSourceMaterialAccessData, GetLearnerSourceMaterialAccessVariables>;
}
export const getLearnerSourceMaterialAccessRef: GetLearnerSourceMaterialAccessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLearnerSourceMaterialAccess(dc: DataConnect, vars: GetLearnerSourceMaterialAccessVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearnerSourceMaterialAccessData, GetLearnerSourceMaterialAccessVariables>;

interface GetLearnerSourceMaterialAccessRef {
  ...
  (dc: DataConnect, vars: GetLearnerSourceMaterialAccessVariables): QueryRef<GetLearnerSourceMaterialAccessData, GetLearnerSourceMaterialAccessVariables>;
}
export const getLearnerSourceMaterialAccessRef: GetLearnerSourceMaterialAccessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLearnerSourceMaterialAccessRef:
```typescript
const name = getLearnerSourceMaterialAccessRef.operationName;
console.log(name);
```

### Variables
The `GetLearnerSourceMaterialAccess` query requires an argument of type `GetLearnerSourceMaterialAccessVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLearnerSourceMaterialAccessVariables {
  materialId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLearnerSourceMaterialAccess` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLearnerSourceMaterialAccessData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLearnerSourceMaterialAccessData {
  sourceMaterials: ({
    id: UUIDString;
    title: string;
    fileName: string;
    fileType: string;
    storagePath: string;
    downloadUrl?: string | null;
    status: string;
    visibility: string;
    metadataJson?: string | null;
    archivedAt?: DateString | null;
    trashedAt?: DateString | null;
    updatedAt: DateString;
    lessons_on_sourceMaterial: ({
      id: UUIDString;
      status: string;
      isPublished: boolean;
    } & Lesson_Key)[];
      contentSourceLinks_on_sourceMaterial: ({
        lesson?: {
          id: UUIDString;
          status: string;
          isPublished: boolean;
        } & Lesson_Key;
      })[];
  } & SourceMaterial_Key)[];
}
```
### Using `GetLearnerSourceMaterialAccess`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLearnerSourceMaterialAccess, GetLearnerSourceMaterialAccessVariables } from '@impact26/dataconnect-sdk';

// The `GetLearnerSourceMaterialAccess` query requires an argument of type `GetLearnerSourceMaterialAccessVariables`:
const getLearnerSourceMaterialAccessVars: GetLearnerSourceMaterialAccessVariables = {
  materialId: ..., 
};

// Call the `getLearnerSourceMaterialAccess()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLearnerSourceMaterialAccess(getLearnerSourceMaterialAccessVars);
// Variables can be defined inline as well.
const { data } = await getLearnerSourceMaterialAccess({ materialId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLearnerSourceMaterialAccess(dataConnect, getLearnerSourceMaterialAccessVars);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
getLearnerSourceMaterialAccess(getLearnerSourceMaterialAccessVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

### Using `GetLearnerSourceMaterialAccess`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLearnerSourceMaterialAccessRef, GetLearnerSourceMaterialAccessVariables } from '@impact26/dataconnect-sdk';

// The `GetLearnerSourceMaterialAccess` query requires an argument of type `GetLearnerSourceMaterialAccessVariables`:
const getLearnerSourceMaterialAccessVars: GetLearnerSourceMaterialAccessVariables = {
  materialId: ..., 
};

// Call the `getLearnerSourceMaterialAccessRef()` function to get a reference to the query.
const ref = getLearnerSourceMaterialAccessRef(getLearnerSourceMaterialAccessVars);
// Variables can be defined inline as well.
const ref = getLearnerSourceMaterialAccessRef({ materialId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLearnerSourceMaterialAccessRef(dataConnect, getLearnerSourceMaterialAccessVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

## GetQuizById
You can execute the `GetQuizById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizById(vars: GetQuizByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizByIdData, GetQuizByIdVariables>;

interface GetQuizByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizByIdVariables): QueryRef<GetQuizByIdData, GetQuizByIdVariables>;
}
export const getQuizByIdRef: GetQuizByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizById(dc: DataConnect, vars: GetQuizByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizByIdData, GetQuizByIdVariables>;

interface GetQuizByIdRef {
  ...
  (dc: DataConnect, vars: GetQuizByIdVariables): QueryRef<GetQuizByIdData, GetQuizByIdVariables>;
}
export const getQuizByIdRef: GetQuizByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizByIdRef:
```typescript
const name = getQuizByIdRef.operationName;
console.log(name);
```

### Variables
The `GetQuizById` query requires an argument of type `GetQuizByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizByIdVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizByIdData {
  quiz?: {
    id: UUIDString;
    status: string;
  } & Quiz_Key;
}
```
### Using `GetQuizById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizById, GetQuizByIdVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizById` query requires an argument of type `GetQuizByIdVariables`:
const getQuizByIdVars: GetQuizByIdVariables = {
  quizId: ..., 
};

// Call the `getQuizById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizById(getQuizByIdVars);
// Variables can be defined inline as well.
const { data } = await getQuizById({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizById(dataConnect, getQuizByIdVars);

console.log(data.quiz);

// Or, you can use the `Promise` API.
getQuizById(getQuizByIdVars).then((response) => {
  const data = response.data;
  console.log(data.quiz);
});
```

### Using `GetQuizById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizByIdRef, GetQuizByIdVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizById` query requires an argument of type `GetQuizByIdVariables`:
const getQuizByIdVars: GetQuizByIdVariables = {
  quizId: ..., 
};

// Call the `getQuizByIdRef()` function to get a reference to the query.
const ref = getQuizByIdRef(getQuizByIdVars);
// Variables can be defined inline as well.
const ref = getQuizByIdRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizByIdRef(dataConnect, getQuizByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quiz);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz);
});
```

## GetQuizQuestions
You can execute the `GetQuizQuestions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizQuestions(vars: GetQuizQuestionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsData, GetQuizQuestionsVariables>;

interface GetQuizQuestionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionsVariables): QueryRef<GetQuizQuestionsData, GetQuizQuestionsVariables>;
}
export const getQuizQuestionsRef: GetQuizQuestionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizQuestions(dc: DataConnect, vars: GetQuizQuestionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsData, GetQuizQuestionsVariables>;

interface GetQuizQuestionsRef {
  ...
  (dc: DataConnect, vars: GetQuizQuestionsVariables): QueryRef<GetQuizQuestionsData, GetQuizQuestionsVariables>;
}
export const getQuizQuestionsRef: GetQuizQuestionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizQuestionsRef:
```typescript
const name = getQuizQuestionsRef.operationName;
console.log(name);
```

### Variables
The `GetQuizQuestions` query requires an argument of type `GetQuizQuestionsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizQuestionsVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizQuestions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizQuestionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizQuestionsData {
  quizQuestions: ({
    position: number;
    pointValue: number;
    question: {
      id: UUIDString;
      questionText: string;
      difficulty: string;
      domain: string;
      formulaRef?: string | null;
      isMultiselect: boolean;
      answerChoices_on_question: ({
        id: UUIDString;
        letter: string;
        choiceText: string;
        position: number;
      } & AnswerChoice_Key)[];
    } & Question_Key;
  })[];
}
```
### Using `GetQuizQuestions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestions, GetQuizQuestionsVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestions` query requires an argument of type `GetQuizQuestionsVariables`:
const getQuizQuestionsVars: GetQuizQuestionsVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizQuestions(getQuizQuestionsVars);
// Variables can be defined inline as well.
const { data } = await getQuizQuestions({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizQuestions(dataConnect, getQuizQuestionsVars);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
getQuizQuestions(getQuizQuestionsVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

### Using `GetQuizQuestions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionsRef, GetQuizQuestionsVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestions` query requires an argument of type `GetQuizQuestionsVariables`:
const getQuizQuestionsVars: GetQuizQuestionsVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionsRef()` function to get a reference to the query.
const ref = getQuizQuestionsRef(getQuizQuestionsVars);
// Variables can be defined inline as well.
const ref = getQuizQuestionsRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizQuestionsRef(dataConnect, getQuizQuestionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

## GetInProgressAttempt
You can execute the `GetInProgressAttempt` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getInProgressAttempt(vars: GetInProgressAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetInProgressAttemptData, GetInProgressAttemptVariables>;

interface GetInProgressAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInProgressAttemptVariables): QueryRef<GetInProgressAttemptData, GetInProgressAttemptVariables>;
}
export const getInProgressAttemptRef: GetInProgressAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInProgressAttempt(dc: DataConnect, vars: GetInProgressAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetInProgressAttemptData, GetInProgressAttemptVariables>;

interface GetInProgressAttemptRef {
  ...
  (dc: DataConnect, vars: GetInProgressAttemptVariables): QueryRef<GetInProgressAttemptData, GetInProgressAttemptVariables>;
}
export const getInProgressAttemptRef: GetInProgressAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInProgressAttemptRef:
```typescript
const name = getInProgressAttemptRef.operationName;
console.log(name);
```

### Variables
The `GetInProgressAttempt` query requires an argument of type `GetInProgressAttemptVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetInProgressAttemptVariables {
  userId: string;
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetInProgressAttempt` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInProgressAttemptData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetInProgressAttemptData {
  quizAttempts: ({
    id: UUIDString;
    status: string;
    questionOrder: string;
    startedAt: DateString;
    quiz: {
      timeLimitSeconds?: number | null;
    };
      quizResponses_on_attempt: ({
        question: {
          id: UUIDString;
        } & Question_Key;
          selectedLetters: string;
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          answeredAt?: DateString | null;
      })[];
  } & QuizAttempt_Key)[];
}
```
### Using `GetInProgressAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInProgressAttempt, GetInProgressAttemptVariables } from '@impact26/dataconnect-sdk';

// The `GetInProgressAttempt` query requires an argument of type `GetInProgressAttemptVariables`:
const getInProgressAttemptVars: GetInProgressAttemptVariables = {
  userId: ..., 
  quizId: ..., 
};

// Call the `getInProgressAttempt()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInProgressAttempt(getInProgressAttemptVars);
// Variables can be defined inline as well.
const { data } = await getInProgressAttempt({ userId: ..., quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInProgressAttempt(dataConnect, getInProgressAttemptVars);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
getInProgressAttempt(getInProgressAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

### Using `GetInProgressAttempt`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInProgressAttemptRef, GetInProgressAttemptVariables } from '@impact26/dataconnect-sdk';

// The `GetInProgressAttempt` query requires an argument of type `GetInProgressAttemptVariables`:
const getInProgressAttemptVars: GetInProgressAttemptVariables = {
  userId: ..., 
  quizId: ..., 
};

// Call the `getInProgressAttemptRef()` function to get a reference to the query.
const ref = getInProgressAttemptRef(getInProgressAttemptVars);
// Variables can be defined inline as well.
const ref = getInProgressAttemptRef({ userId: ..., quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInProgressAttemptRef(dataConnect, getInProgressAttemptVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

## GetUserCourseProgress
You can execute the `GetUserCourseProgress` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserCourseProgress(vars: GetUserCourseProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressData, GetUserCourseProgressVariables>;

interface GetUserCourseProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserCourseProgressVariables): QueryRef<GetUserCourseProgressData, GetUserCourseProgressVariables>;
}
export const getUserCourseProgressRef: GetUserCourseProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserCourseProgress(dc: DataConnect, vars: GetUserCourseProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressData, GetUserCourseProgressVariables>;

interface GetUserCourseProgressRef {
  ...
  (dc: DataConnect, vars: GetUserCourseProgressVariables): QueryRef<GetUserCourseProgressData, GetUserCourseProgressVariables>;
}
export const getUserCourseProgressRef: GetUserCourseProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserCourseProgressRef:
```typescript
const name = getUserCourseProgressRef.operationName;
console.log(name);
```

### Variables
The `GetUserCourseProgress` query requires an argument of type `GetUserCourseProgressVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserCourseProgressVariables {
  userId: string;
  courseId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserCourseProgress` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserCourseProgressData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserCourseProgressData {
  userLessonProgresses: ({
    lesson: {
      id: UUIDString;
    } & Lesson_Key;
      status: string;
      videoPositionSeconds?: number | null;
      completedAt?: DateString | null;
  })[];
}
```
### Using `GetUserCourseProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserCourseProgress, GetUserCourseProgressVariables } from '@impact26/dataconnect-sdk';

// The `GetUserCourseProgress` query requires an argument of type `GetUserCourseProgressVariables`:
const getUserCourseProgressVars: GetUserCourseProgressVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `getUserCourseProgress()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserCourseProgress(getUserCourseProgressVars);
// Variables can be defined inline as well.
const { data } = await getUserCourseProgress({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserCourseProgress(dataConnect, getUserCourseProgressVars);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
getUserCourseProgress(getUserCourseProgressVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

### Using `GetUserCourseProgress`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserCourseProgressRef, GetUserCourseProgressVariables } from '@impact26/dataconnect-sdk';

// The `GetUserCourseProgress` query requires an argument of type `GetUserCourseProgressVariables`:
const getUserCourseProgressVars: GetUserCourseProgressVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `getUserCourseProgressRef()` function to get a reference to the query.
const ref = getUserCourseProgressRef(getUserCourseProgressVars);
// Variables can be defined inline as well.
const ref = getUserCourseProgressRef({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserCourseProgressRef(dataConnect, getUserCourseProgressVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

## GetLessonProgress
You can execute the `GetLessonProgress` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLessonProgress(vars: GetLessonProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonProgressData, GetLessonProgressVariables>;

interface GetLessonProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonProgressVariables): QueryRef<GetLessonProgressData, GetLessonProgressVariables>;
}
export const getLessonProgressRef: GetLessonProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLessonProgress(dc: DataConnect, vars: GetLessonProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonProgressData, GetLessonProgressVariables>;

interface GetLessonProgressRef {
  ...
  (dc: DataConnect, vars: GetLessonProgressVariables): QueryRef<GetLessonProgressData, GetLessonProgressVariables>;
}
export const getLessonProgressRef: GetLessonProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonProgressRef:
```typescript
const name = getLessonProgressRef.operationName;
console.log(name);
```

### Variables
The `GetLessonProgress` query requires an argument of type `GetLessonProgressVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLessonProgressVariables {
  userId: string;
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLessonProgress` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonProgressData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonProgressData {
  userLessonProgresses: ({
    status: string;
    videoPositionSeconds?: number | null;
    completedAt?: DateString | null;
  })[];
}
```
### Using `GetLessonProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLessonProgress, GetLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonProgress` query requires an argument of type `GetLessonProgressVariables`:
const getLessonProgressVars: GetLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
};

// Call the `getLessonProgress()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLessonProgress(getLessonProgressVars);
// Variables can be defined inline as well.
const { data } = await getLessonProgress({ userId: ..., lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLessonProgress(dataConnect, getLessonProgressVars);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
getLessonProgress(getLessonProgressVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

### Using `GetLessonProgress`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonProgressRef, GetLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonProgress` query requires an argument of type `GetLessonProgressVariables`:
const getLessonProgressVars: GetLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
};

// Call the `getLessonProgressRef()` function to get a reference to the query.
const ref = getLessonProgressRef(getLessonProgressVars);
// Variables can be defined inline as well.
const ref = getLessonProgressRef({ userId: ..., lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonProgressRef(dataConnect, getLessonProgressVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

## GetUserCourseProgressFull
You can execute the `GetUserCourseProgressFull` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserCourseProgressFull(vars: GetUserCourseProgressFullVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;

interface GetUserCourseProgressFullRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserCourseProgressFullVariables): QueryRef<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;
}
export const getUserCourseProgressFullRef: GetUserCourseProgressFullRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserCourseProgressFull(dc: DataConnect, vars: GetUserCourseProgressFullVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;

interface GetUserCourseProgressFullRef {
  ...
  (dc: DataConnect, vars: GetUserCourseProgressFullVariables): QueryRef<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;
}
export const getUserCourseProgressFullRef: GetUserCourseProgressFullRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserCourseProgressFullRef:
```typescript
const name = getUserCourseProgressFullRef.operationName;
console.log(name);
```

### Variables
The `GetUserCourseProgressFull` query requires an argument of type `GetUserCourseProgressFullVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserCourseProgressFullVariables {
  userId: string;
  courseId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserCourseProgressFull` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserCourseProgressFullData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserCourseProgressFullData {
  userCourseProgress: ({
    enrolledAt: DateString;
    completedAt?: DateString | null;
  })[];
    userLessonProgresses: ({
      lesson: {
        id: UUIDString;
      } & Lesson_Key;
        status: string;
        videoPositionSeconds?: number | null;
        completedAt?: DateString | null;
    })[];
}
```
### Using `GetUserCourseProgressFull`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserCourseProgressFull, GetUserCourseProgressFullVariables } from '@impact26/dataconnect-sdk';

// The `GetUserCourseProgressFull` query requires an argument of type `GetUserCourseProgressFullVariables`:
const getUserCourseProgressFullVars: GetUserCourseProgressFullVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `getUserCourseProgressFull()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserCourseProgressFull(getUserCourseProgressFullVars);
// Variables can be defined inline as well.
const { data } = await getUserCourseProgressFull({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserCourseProgressFull(dataConnect, getUserCourseProgressFullVars);

console.log(data.userCourseProgress);
console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
getUserCourseProgressFull(getUserCourseProgressFullVars).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress);
  console.log(data.userLessonProgresses);
});
```

### Using `GetUserCourseProgressFull`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserCourseProgressFullRef, GetUserCourseProgressFullVariables } from '@impact26/dataconnect-sdk';

// The `GetUserCourseProgressFull` query requires an argument of type `GetUserCourseProgressFullVariables`:
const getUserCourseProgressFullVars: GetUserCourseProgressFullVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `getUserCourseProgressFullRef()` function to get a reference to the query.
const ref = getUserCourseProgressFullRef(getUserCourseProgressFullVars);
// Variables can be defined inline as well.
const ref = getUserCourseProgressFullRef({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserCourseProgressFullRef(dataConnect, getUserCourseProgressFullVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userCourseProgress);
console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress);
  console.log(data.userLessonProgresses);
});
```

## GetUserLessonProgressSummary
You can execute the `GetUserLessonProgressSummary` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserLessonProgressSummary(vars: GetUserLessonProgressSummaryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLessonProgressSummaryData, GetUserLessonProgressSummaryVariables>;

interface GetUserLessonProgressSummaryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserLessonProgressSummaryVariables): QueryRef<GetUserLessonProgressSummaryData, GetUserLessonProgressSummaryVariables>;
}
export const getUserLessonProgressSummaryRef: GetUserLessonProgressSummaryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserLessonProgressSummary(dc: DataConnect, vars: GetUserLessonProgressSummaryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLessonProgressSummaryData, GetUserLessonProgressSummaryVariables>;

interface GetUserLessonProgressSummaryRef {
  ...
  (dc: DataConnect, vars: GetUserLessonProgressSummaryVariables): QueryRef<GetUserLessonProgressSummaryData, GetUserLessonProgressSummaryVariables>;
}
export const getUserLessonProgressSummaryRef: GetUserLessonProgressSummaryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserLessonProgressSummaryRef:
```typescript
const name = getUserLessonProgressSummaryRef.operationName;
console.log(name);
```

### Variables
The `GetUserLessonProgressSummary` query requires an argument of type `GetUserLessonProgressSummaryVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserLessonProgressSummaryVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserLessonProgressSummary` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserLessonProgressSummaryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserLessonProgressSummaryData {
  userLessonProgresses: ({
    status: string;
  })[];
}
```
### Using `GetUserLessonProgressSummary`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserLessonProgressSummary, GetUserLessonProgressSummaryVariables } from '@impact26/dataconnect-sdk';

// The `GetUserLessonProgressSummary` query requires an argument of type `GetUserLessonProgressSummaryVariables`:
const getUserLessonProgressSummaryVars: GetUserLessonProgressSummaryVariables = {
  userId: ..., 
};

// Call the `getUserLessonProgressSummary()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserLessonProgressSummary(getUserLessonProgressSummaryVars);
// Variables can be defined inline as well.
const { data } = await getUserLessonProgressSummary({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserLessonProgressSummary(dataConnect, getUserLessonProgressSummaryVars);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
getUserLessonProgressSummary(getUserLessonProgressSummaryVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

### Using `GetUserLessonProgressSummary`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserLessonProgressSummaryRef, GetUserLessonProgressSummaryVariables } from '@impact26/dataconnect-sdk';

// The `GetUserLessonProgressSummary` query requires an argument of type `GetUserLessonProgressSummaryVariables`:
const getUserLessonProgressSummaryVars: GetUserLessonProgressSummaryVariables = {
  userId: ..., 
};

// Call the `getUserLessonProgressSummaryRef()` function to get a reference to the query.
const ref = getUserLessonProgressSummaryRef(getUserLessonProgressSummaryVars);
// Variables can be defined inline as well.
const ref = getUserLessonProgressSummaryRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserLessonProgressSummaryRef(dataConnect, getUserLessonProgressSummaryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userLessonProgresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgresses);
});
```

## GetUserAttemptHistory
You can execute the `GetUserAttemptHistory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserAttemptHistory(vars: GetUserAttemptHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;

interface GetUserAttemptHistoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserAttemptHistoryVariables): QueryRef<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;
}
export const getUserAttemptHistoryRef: GetUserAttemptHistoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserAttemptHistory(dc: DataConnect, vars: GetUserAttemptHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;

interface GetUserAttemptHistoryRef {
  ...
  (dc: DataConnect, vars: GetUserAttemptHistoryVariables): QueryRef<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;
}
export const getUserAttemptHistoryRef: GetUserAttemptHistoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserAttemptHistoryRef:
```typescript
const name = getUserAttemptHistoryRef.operationName;
console.log(name);
```

### Variables
The `GetUserAttemptHistory` query requires an argument of type `GetUserAttemptHistoryVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserAttemptHistoryVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserAttemptHistory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserAttemptHistoryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserAttemptHistoryData {
  quizAttempts: ({
    id: UUIDString;
    quiz: {
      id: UUIDString;
      title: string;
    } & Quiz_Key;
      scorePct?: number | null;
      passed?: boolean | null;
      completedAt?: DateString | null;
  } & QuizAttempt_Key)[];
}
```
### Using `GetUserAttemptHistory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserAttemptHistory, GetUserAttemptHistoryVariables } from '@impact26/dataconnect-sdk';

// The `GetUserAttemptHistory` query requires an argument of type `GetUserAttemptHistoryVariables`:
const getUserAttemptHistoryVars: GetUserAttemptHistoryVariables = {
  userId: ..., 
};

// Call the `getUserAttemptHistory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserAttemptHistory(getUserAttemptHistoryVars);
// Variables can be defined inline as well.
const { data } = await getUserAttemptHistory({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserAttemptHistory(dataConnect, getUserAttemptHistoryVars);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
getUserAttemptHistory(getUserAttemptHistoryVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

### Using `GetUserAttemptHistory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserAttemptHistoryRef, GetUserAttemptHistoryVariables } from '@impact26/dataconnect-sdk';

// The `GetUserAttemptHistory` query requires an argument of type `GetUserAttemptHistoryVariables`:
const getUserAttemptHistoryVars: GetUserAttemptHistoryVariables = {
  userId: ..., 
};

// Call the `getUserAttemptHistoryRef()` function to get a reference to the query.
const ref = getUserAttemptHistoryRef(getUserAttemptHistoryVars);
// Variables can be defined inline as well.
const ref = getUserAttemptHistoryRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserAttemptHistoryRef(dataConnect, getUserAttemptHistoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

## GetUserActivityHistory
You can execute the `GetUserActivityHistory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserActivityHistory(vars: GetUserActivityHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserActivityHistoryData, GetUserActivityHistoryVariables>;

interface GetUserActivityHistoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserActivityHistoryVariables): QueryRef<GetUserActivityHistoryData, GetUserActivityHistoryVariables>;
}
export const getUserActivityHistoryRef: GetUserActivityHistoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserActivityHistory(dc: DataConnect, vars: GetUserActivityHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserActivityHistoryData, GetUserActivityHistoryVariables>;

interface GetUserActivityHistoryRef {
  ...
  (dc: DataConnect, vars: GetUserActivityHistoryVariables): QueryRef<GetUserActivityHistoryData, GetUserActivityHistoryVariables>;
}
export const getUserActivityHistoryRef: GetUserActivityHistoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserActivityHistoryRef:
```typescript
const name = getUserActivityHistoryRef.operationName;
console.log(name);
```

### Variables
The `GetUserActivityHistory` query requires an argument of type `GetUserActivityHistoryVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserActivityHistoryVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserActivityHistory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserActivityHistoryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserActivityHistoryData {
  dailyActivities: ({
    activityDate: string;
    lastActivityAt: DateString;
  })[];
    completedAttempts: ({
      completedAt?: DateString | null;
    })[];
      completedLessons: ({
        completedAt?: DateString | null;
      })[];
        lessonNoteActivity: ({
          createdAt: DateString;
          updatedAt: DateString;
        })[];
          glossaryNoteActivity: ({
            createdAt: DateString;
            updatedAt: DateString;
          })[];
}
```
### Using `GetUserActivityHistory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserActivityHistory, GetUserActivityHistoryVariables } from '@impact26/dataconnect-sdk';

// The `GetUserActivityHistory` query requires an argument of type `GetUserActivityHistoryVariables`:
const getUserActivityHistoryVars: GetUserActivityHistoryVariables = {
  userId: ..., 
};

// Call the `getUserActivityHistory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserActivityHistory(getUserActivityHistoryVars);
// Variables can be defined inline as well.
const { data } = await getUserActivityHistory({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserActivityHistory(dataConnect, getUserActivityHistoryVars);

console.log(data.dailyActivities);
console.log(data.completedAttempts);
console.log(data.completedLessons);
console.log(data.lessonNoteActivity);
console.log(data.glossaryNoteActivity);

// Or, you can use the `Promise` API.
getUserActivityHistory(getUserActivityHistoryVars).then((response) => {
  const data = response.data;
  console.log(data.dailyActivities);
  console.log(data.completedAttempts);
  console.log(data.completedLessons);
  console.log(data.lessonNoteActivity);
  console.log(data.glossaryNoteActivity);
});
```

### Using `GetUserActivityHistory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserActivityHistoryRef, GetUserActivityHistoryVariables } from '@impact26/dataconnect-sdk';

// The `GetUserActivityHistory` query requires an argument of type `GetUserActivityHistoryVariables`:
const getUserActivityHistoryVars: GetUserActivityHistoryVariables = {
  userId: ..., 
};

// Call the `getUserActivityHistoryRef()` function to get a reference to the query.
const ref = getUserActivityHistoryRef(getUserActivityHistoryVars);
// Variables can be defined inline as well.
const ref = getUserActivityHistoryRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserActivityHistoryRef(dataConnect, getUserActivityHistoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.dailyActivities);
console.log(data.completedAttempts);
console.log(data.completedLessons);
console.log(data.lessonNoteActivity);
console.log(data.glossaryNoteActivity);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.dailyActivities);
  console.log(data.completedAttempts);
  console.log(data.completedLessons);
  console.log(data.lessonNoteActivity);
  console.log(data.glossaryNoteActivity);
});
```

## GetAttemptResults
You can execute the `GetAttemptResults` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAttemptResults(vars: GetAttemptResultsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptResultsData, GetAttemptResultsVariables>;

interface GetAttemptResultsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptResultsVariables): QueryRef<GetAttemptResultsData, GetAttemptResultsVariables>;
}
export const getAttemptResultsRef: GetAttemptResultsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttemptResults(dc: DataConnect, vars: GetAttemptResultsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptResultsData, GetAttemptResultsVariables>;

interface GetAttemptResultsRef {
  ...
  (dc: DataConnect, vars: GetAttemptResultsVariables): QueryRef<GetAttemptResultsData, GetAttemptResultsVariables>;
}
export const getAttemptResultsRef: GetAttemptResultsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttemptResultsRef:
```typescript
const name = getAttemptResultsRef.operationName;
console.log(name);
```

### Variables
The `GetAttemptResults` query requires an argument of type `GetAttemptResultsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttemptResultsVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAttemptResults` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttemptResultsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttemptResultsData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    scoreRaw?: number | null;
    scoreMax?: number | null;
    scorePct?: number | null;
    passed?: boolean | null;
    startedAt: DateString;
    completedAt?: DateString | null;
    quiz: {
      title: string;
      passingScore?: number | null;
    };
      quizResponses_on_attempt: ({
        question: {
          id: UUIDString;
          questionText: string;
          difficulty: string;
          domain: string;
          formulaRef?: string | null;
          rationale?: string | null;
          calculation?: string | null;
          sourceRef?: string | null;
        } & Question_Key;
          selectedLetters: string;
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
      })[];
  } & QuizAttempt_Key;
}
```
### Using `GetAttemptResults`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttemptResults, GetAttemptResultsVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptResults` query requires an argument of type `GetAttemptResultsVariables`:
const getAttemptResultsVars: GetAttemptResultsVariables = {
  attemptId: ..., 
};

// Call the `getAttemptResults()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttemptResults(getAttemptResultsVars);
// Variables can be defined inline as well.
const { data } = await getAttemptResults({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttemptResults(dataConnect, getAttemptResultsVars);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
getAttemptResults(getAttemptResultsVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

### Using `GetAttemptResults`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttemptResultsRef, GetAttemptResultsVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptResults` query requires an argument of type `GetAttemptResultsVariables`:
const getAttemptResultsVars: GetAttemptResultsVariables = {
  attemptId: ..., 
};

// Call the `getAttemptResultsRef()` function to get a reference to the query.
const ref = getAttemptResultsRef(getAttemptResultsVars);
// Variables can be defined inline as well.
const ref = getAttemptResultsRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttemptResultsRef(dataConnect, getAttemptResultsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

## GetFormulaSections
You can execute the `GetFormulaSections` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getFormulaSections(options?: ExecuteQueryOptions): QueryPromise<GetFormulaSectionsData, undefined>;

interface GetFormulaSectionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetFormulaSectionsData, undefined>;
}
export const getFormulaSectionsRef: GetFormulaSectionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFormulaSections(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetFormulaSectionsData, undefined>;

interface GetFormulaSectionsRef {
  ...
  (dc: DataConnect): QueryRef<GetFormulaSectionsData, undefined>;
}
export const getFormulaSectionsRef: GetFormulaSectionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFormulaSectionsRef:
```typescript
const name = getFormulaSectionsRef.operationName;
console.log(name);
```

### Variables
The `GetFormulaSections` query has no variables.
### Return Type
Recall that executing the `GetFormulaSections` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFormulaSectionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetFormulaSectionsData {
  formulaSections: ({
    id: UUIDString;
    code: string;
    title: string;
    position: number;
    formulas_on_section: ({
      id: UUIDString;
      code: string;
      name: string;
      expression: string;
      notes?: string | null;
      calcMetaJson?: string | null;
      examplesJson?: string | null;
      symbolsJson?: string | null;
    } & Formula_Key)[];
  } & FormulaSection_Key)[];
}
```
### Using `GetFormulaSections`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFormulaSections } from '@impact26/dataconnect-sdk';


// Call the `getFormulaSections()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFormulaSections();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFormulaSections(dataConnect);

console.log(data.formulaSections);

// Or, you can use the `Promise` API.
getFormulaSections().then((response) => {
  const data = response.data;
  console.log(data.formulaSections);
});
```

### Using `GetFormulaSections`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFormulaSectionsRef } from '@impact26/dataconnect-sdk';


// Call the `getFormulaSectionsRef()` function to get a reference to the query.
const ref = getFormulaSectionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFormulaSectionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.formulaSections);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.formulaSections);
});
```

## GetUserProgressDetails
You can execute the `GetUserProgressDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserProgressDetails(vars: GetUserProgressDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;

interface GetUserProgressDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProgressDetailsVariables): QueryRef<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;
}
export const getUserProgressDetailsRef: GetUserProgressDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProgressDetails(dc: DataConnect, vars: GetUserProgressDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;

interface GetUserProgressDetailsRef {
  ...
  (dc: DataConnect, vars: GetUserProgressDetailsVariables): QueryRef<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;
}
export const getUserProgressDetailsRef: GetUserProgressDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProgressDetailsRef:
```typescript
const name = getUserProgressDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetUserProgressDetails` query requires an argument of type `GetUserProgressDetailsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserProgressDetailsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserProgressDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProgressDetailsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserProgressDetailsData {
  quizAttempts: ({
    id: UUIDString;
    quiz: {
      id: UUIDString;
      title: string;
      passingScore?: number | null;
    } & Quiz_Key;
      scorePct?: number | null;
      scoreRaw?: number | null;
      scoreMax?: number | null;
      passed?: boolean | null;
      startedAt: DateString;
      completedAt?: DateString | null;
      quizResponses_on_attempt: ({
        isCorrect?: boolean | null;
        pointsEarned?: number | null;
        pointsPossible?: number | null;
        question: {
          domain: string;
        };
      })[];
  } & QuizAttempt_Key)[];
}
```
### Using `GetUserProgressDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProgressDetails, GetUserProgressDetailsVariables } from '@impact26/dataconnect-sdk';

// The `GetUserProgressDetails` query requires an argument of type `GetUserProgressDetailsVariables`:
const getUserProgressDetailsVars: GetUserProgressDetailsVariables = {
  userId: ..., 
};

// Call the `getUserProgressDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProgressDetails(getUserProgressDetailsVars);
// Variables can be defined inline as well.
const { data } = await getUserProgressDetails({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProgressDetails(dataConnect, getUserProgressDetailsVars);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
getUserProgressDetails(getUserProgressDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

### Using `GetUserProgressDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProgressDetailsRef, GetUserProgressDetailsVariables } from '@impact26/dataconnect-sdk';

// The `GetUserProgressDetails` query requires an argument of type `GetUserProgressDetailsVariables`:
const getUserProgressDetailsVars: GetUserProgressDetailsVariables = {
  userId: ..., 
};

// Call the `getUserProgressDetailsRef()` function to get a reference to the query.
const ref = getUserProgressDetailsRef(getUserProgressDetailsVars);
// Variables can be defined inline as well.
const ref = getUserProgressDetailsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProgressDetailsRef(dataConnect, getUserProgressDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

## ListAdminQuizzes
You can execute the `ListAdminQuizzes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listAdminQuizzes(options?: ExecuteQueryOptions): QueryPromise<ListAdminQuizzesData, undefined>;

interface ListAdminQuizzesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAdminQuizzesData, undefined>;
}
export const listAdminQuizzesRef: ListAdminQuizzesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAdminQuizzes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAdminQuizzesData, undefined>;

interface ListAdminQuizzesRef {
  ...
  (dc: DataConnect): QueryRef<ListAdminQuizzesData, undefined>;
}
export const listAdminQuizzesRef: ListAdminQuizzesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAdminQuizzesRef:
```typescript
const name = listAdminQuizzesRef.operationName;
console.log(name);
```

### Variables
The `ListAdminQuizzes` query has no variables.
### Return Type
Recall that executing the `ListAdminQuizzes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAdminQuizzesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAdminQuizzesData {
  quizzes: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    status: string;
    passingScore?: number | null;
    timeLimitSeconds?: number | null;
    shuffleQuestions: boolean;
    shuffleChoices: boolean;
    calculatorSettingsJson?: string | null;
    createdAt: DateString;
  } & Quiz_Key)[];
}
```
### Using `ListAdminQuizzes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAdminQuizzes } from '@impact26/dataconnect-sdk';


// Call the `listAdminQuizzes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAdminQuizzes();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAdminQuizzes(dataConnect);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
listAdminQuizzes().then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

### Using `ListAdminQuizzes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAdminQuizzesRef } from '@impact26/dataconnect-sdk';


// Call the `listAdminQuizzesRef()` function to get a reference to the query.
const ref = listAdminQuizzesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAdminQuizzesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizzes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizzes);
});
```

## GetQuizQuestionCount
You can execute the `GetQuizQuestionCount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizQuestionCount(vars: GetQuizQuestionCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;

interface GetQuizQuestionCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionCountVariables): QueryRef<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;
}
export const getQuizQuestionCountRef: GetQuizQuestionCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizQuestionCount(dc: DataConnect, vars: GetQuizQuestionCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;

interface GetQuizQuestionCountRef {
  ...
  (dc: DataConnect, vars: GetQuizQuestionCountVariables): QueryRef<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;
}
export const getQuizQuestionCountRef: GetQuizQuestionCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizQuestionCountRef:
```typescript
const name = getQuizQuestionCountRef.operationName;
console.log(name);
```

### Variables
The `GetQuizQuestionCount` query requires an argument of type `GetQuizQuestionCountVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizQuestionCountVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizQuestionCount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizQuestionCountData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizQuestionCountData {
  quizQuestions: ({
    position: number;
  })[];
}
```
### Using `GetQuizQuestionCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionCount, GetQuizQuestionCountVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionCount` query requires an argument of type `GetQuizQuestionCountVariables`:
const getQuizQuestionCountVars: GetQuizQuestionCountVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionCount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizQuestionCount(getQuizQuestionCountVars);
// Variables can be defined inline as well.
const { data } = await getQuizQuestionCount({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizQuestionCount(dataConnect, getQuizQuestionCountVars);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
getQuizQuestionCount(getQuizQuestionCountVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

### Using `GetQuizQuestionCount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionCountRef, GetQuizQuestionCountVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionCount` query requires an argument of type `GetQuizQuestionCountVariables`:
const getQuizQuestionCountVars: GetQuizQuestionCountVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionCountRef()` function to get a reference to the query.
const ref = getQuizQuestionCountRef(getQuizQuestionCountVars);
// Variables can be defined inline as well.
const ref = getQuizQuestionCountRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizQuestionCountRef(dataConnect, getQuizQuestionCountVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

## GetQuizQuestionsAdmin
You can execute the `GetQuizQuestionsAdmin` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizQuestionsAdmin(vars: GetQuizQuestionsAdminVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;

interface GetQuizQuestionsAdminRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionsAdminVariables): QueryRef<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;
}
export const getQuizQuestionsAdminRef: GetQuizQuestionsAdminRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizQuestionsAdmin(dc: DataConnect, vars: GetQuizQuestionsAdminVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;

interface GetQuizQuestionsAdminRef {
  ...
  (dc: DataConnect, vars: GetQuizQuestionsAdminVariables): QueryRef<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;
}
export const getQuizQuestionsAdminRef: GetQuizQuestionsAdminRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizQuestionsAdminRef:
```typescript
const name = getQuizQuestionsAdminRef.operationName;
console.log(name);
```

### Variables
The `GetQuizQuestionsAdmin` query requires an argument of type `GetQuizQuestionsAdminVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizQuestionsAdminVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizQuestionsAdmin` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizQuestionsAdminData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizQuestionsAdminData {
  quiz?: {
    id: UUIDString;
    title: string;
    timeLimitSeconds?: number | null;
    shuffleQuestions: boolean;
    shuffleChoices: boolean;
  } & Quiz_Key;
    quizQuestions: ({
      position: number;
      pointValue: number;
      question: {
        id: UUIDString;
        questionText: string;
        difficulty: string;
        domain: string;
        formulaRef?: string | null;
        isMultiselect: boolean;
        answerChoices_on_question: ({
          id: UUIDString;
          letter: string;
          choiceText: string;
          isCorrect: boolean;
          explanation?: string | null;
          position: number;
        } & AnswerChoice_Key)[];
      } & Question_Key;
    })[];
}
```
### Using `GetQuizQuestionsAdmin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionsAdmin, GetQuizQuestionsAdminVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionsAdmin` query requires an argument of type `GetQuizQuestionsAdminVariables`:
const getQuizQuestionsAdminVars: GetQuizQuestionsAdminVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionsAdmin()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizQuestionsAdmin(getQuizQuestionsAdminVars);
// Variables can be defined inline as well.
const { data } = await getQuizQuestionsAdmin({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizQuestionsAdmin(dataConnect, getQuizQuestionsAdminVars);

console.log(data.quiz);
console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
getQuizQuestionsAdmin(getQuizQuestionsAdminVars).then((response) => {
  const data = response.data;
  console.log(data.quiz);
  console.log(data.quizQuestions);
});
```

### Using `GetQuizQuestionsAdmin`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionsAdminRef, GetQuizQuestionsAdminVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionsAdmin` query requires an argument of type `GetQuizQuestionsAdminVariables`:
const getQuizQuestionsAdminVars: GetQuizQuestionsAdminVariables = {
  quizId: ..., 
};

// Call the `getQuizQuestionsAdminRef()` function to get a reference to the query.
const ref = getQuizQuestionsAdminRef(getQuizQuestionsAdminVars);
// Variables can be defined inline as well.
const ref = getQuizQuestionsAdminRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizQuestionsAdminRef(dataConnect, getQuizQuestionsAdminVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quiz);
console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz);
  console.log(data.quizQuestions);
});
```

## GetAttemptForEvaluation
You can execute the `GetAttemptForEvaluation` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAttemptForEvaluation(vars: GetAttemptForEvaluationVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;

interface GetAttemptForEvaluationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptForEvaluationVariables): QueryRef<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;
}
export const getAttemptForEvaluationRef: GetAttemptForEvaluationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttemptForEvaluation(dc: DataConnect, vars: GetAttemptForEvaluationVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;

interface GetAttemptForEvaluationRef {
  ...
  (dc: DataConnect, vars: GetAttemptForEvaluationVariables): QueryRef<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;
}
export const getAttemptForEvaluationRef: GetAttemptForEvaluationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttemptForEvaluationRef:
```typescript
const name = getAttemptForEvaluationRef.operationName;
console.log(name);
```

### Variables
The `GetAttemptForEvaluation` query requires an argument of type `GetAttemptForEvaluationVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttemptForEvaluationVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAttemptForEvaluation` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttemptForEvaluationData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttemptForEvaluationData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    questionOrder: string;
    user: {
      id: string;
    } & User_Key;
      quiz: {
        id: UUIDString;
      } & Quiz_Key;
        quizResponses_on_attempt: ({
          question: {
            id: UUIDString;
          } & Question_Key;
            isCorrect?: boolean | null;
        })[];
  } & QuizAttempt_Key;
}
```
### Using `GetAttemptForEvaluation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttemptForEvaluation, GetAttemptForEvaluationVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptForEvaluation` query requires an argument of type `GetAttemptForEvaluationVariables`:
const getAttemptForEvaluationVars: GetAttemptForEvaluationVariables = {
  attemptId: ..., 
};

// Call the `getAttemptForEvaluation()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttemptForEvaluation(getAttemptForEvaluationVars);
// Variables can be defined inline as well.
const { data } = await getAttemptForEvaluation({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttemptForEvaluation(dataConnect, getAttemptForEvaluationVars);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
getAttemptForEvaluation(getAttemptForEvaluationVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

### Using `GetAttemptForEvaluation`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttemptForEvaluationRef, GetAttemptForEvaluationVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptForEvaluation` query requires an argument of type `GetAttemptForEvaluationVariables`:
const getAttemptForEvaluationVars: GetAttemptForEvaluationVariables = {
  attemptId: ..., 
};

// Call the `getAttemptForEvaluationRef()` function to get a reference to the query.
const ref = getAttemptForEvaluationRef(getAttemptForEvaluationVars);
// Variables can be defined inline as well.
const ref = getAttemptForEvaluationRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttemptForEvaluationRef(dataConnect, getAttemptForEvaluationVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

## GetQuestionWithAnswers
You can execute the `GetQuestionWithAnswers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuestionWithAnswers(vars: GetQuestionWithAnswersVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;

interface GetQuestionWithAnswersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuestionWithAnswersVariables): QueryRef<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;
}
export const getQuestionWithAnswersRef: GetQuestionWithAnswersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuestionWithAnswers(dc: DataConnect, vars: GetQuestionWithAnswersVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;

interface GetQuestionWithAnswersRef {
  ...
  (dc: DataConnect, vars: GetQuestionWithAnswersVariables): QueryRef<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;
}
export const getQuestionWithAnswersRef: GetQuestionWithAnswersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuestionWithAnswersRef:
```typescript
const name = getQuestionWithAnswersRef.operationName;
console.log(name);
```

### Variables
The `GetQuestionWithAnswers` query requires an argument of type `GetQuestionWithAnswersVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuestionWithAnswersVariables {
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuestionWithAnswers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuestionWithAnswersData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuestionWithAnswersData {
  question?: {
    id: UUIDString;
    questionText: string;
    difficulty: string;
    domain: string;
    formulaRef?: string | null;
    isMultiselect: boolean;
    rationale?: string | null;
    calculation?: string | null;
    sourceRef?: string | null;
    answerChoices_on_question: ({
      id: UUIDString;
      letter: string;
      choiceText: string;
      isCorrect: boolean;
      explanation?: string | null;
      position: number;
    } & AnswerChoice_Key)[];
  } & Question_Key;
}
```
### Using `GetQuestionWithAnswers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuestionWithAnswers, GetQuestionWithAnswersVariables } from '@impact26/dataconnect-sdk';

// The `GetQuestionWithAnswers` query requires an argument of type `GetQuestionWithAnswersVariables`:
const getQuestionWithAnswersVars: GetQuestionWithAnswersVariables = {
  questionId: ..., 
};

// Call the `getQuestionWithAnswers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuestionWithAnswers(getQuestionWithAnswersVars);
// Variables can be defined inline as well.
const { data } = await getQuestionWithAnswers({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuestionWithAnswers(dataConnect, getQuestionWithAnswersVars);

console.log(data.question);

// Or, you can use the `Promise` API.
getQuestionWithAnswers(getQuestionWithAnswersVars).then((response) => {
  const data = response.data;
  console.log(data.question);
});
```

### Using `GetQuestionWithAnswers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuestionWithAnswersRef, GetQuestionWithAnswersVariables } from '@impact26/dataconnect-sdk';

// The `GetQuestionWithAnswers` query requires an argument of type `GetQuestionWithAnswersVariables`:
const getQuestionWithAnswersVars: GetQuestionWithAnswersVariables = {
  questionId: ..., 
};

// Call the `getQuestionWithAnswersRef()` function to get a reference to the query.
const ref = getQuestionWithAnswersRef(getQuestionWithAnswersVars);
// Variables can be defined inline as well.
const ref = getQuestionWithAnswersRef({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuestionWithAnswersRef(dataConnect, getQuestionWithAnswersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.question);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.question);
});
```

## GetQuizQuestionPointValue
You can execute the `GetQuizQuestionPointValue` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getQuizQuestionPointValue(vars: GetQuizQuestionPointValueVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;

interface GetQuizQuestionPointValueRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionPointValueVariables): QueryRef<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;
}
export const getQuizQuestionPointValueRef: GetQuizQuestionPointValueRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getQuizQuestionPointValue(dc: DataConnect, vars: GetQuizQuestionPointValueVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;

interface GetQuizQuestionPointValueRef {
  ...
  (dc: DataConnect, vars: GetQuizQuestionPointValueVariables): QueryRef<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;
}
export const getQuizQuestionPointValueRef: GetQuizQuestionPointValueRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getQuizQuestionPointValueRef:
```typescript
const name = getQuizQuestionPointValueRef.operationName;
console.log(name);
```

### Variables
The `GetQuizQuestionPointValue` query requires an argument of type `GetQuizQuestionPointValueVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetQuizQuestionPointValueVariables {
  quizId: UUIDString;
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetQuizQuestionPointValue` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetQuizQuestionPointValueData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetQuizQuestionPointValueData {
  quizQuestions: ({
    pointValue: number;
  })[];
}
```
### Using `GetQuizQuestionPointValue`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionPointValue, GetQuizQuestionPointValueVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionPointValue` query requires an argument of type `GetQuizQuestionPointValueVariables`:
const getQuizQuestionPointValueVars: GetQuizQuestionPointValueVariables = {
  quizId: ..., 
  questionId: ..., 
};

// Call the `getQuizQuestionPointValue()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getQuizQuestionPointValue(getQuizQuestionPointValueVars);
// Variables can be defined inline as well.
const { data } = await getQuizQuestionPointValue({ quizId: ..., questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getQuizQuestionPointValue(dataConnect, getQuizQuestionPointValueVars);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
getQuizQuestionPointValue(getQuizQuestionPointValueVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

### Using `GetQuizQuestionPointValue`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getQuizQuestionPointValueRef, GetQuizQuestionPointValueVariables } from '@impact26/dataconnect-sdk';

// The `GetQuizQuestionPointValue` query requires an argument of type `GetQuizQuestionPointValueVariables`:
const getQuizQuestionPointValueVars: GetQuizQuestionPointValueVariables = {
  quizId: ..., 
  questionId: ..., 
};

// Call the `getQuizQuestionPointValueRef()` function to get a reference to the query.
const ref = getQuizQuestionPointValueRef(getQuizQuestionPointValueVars);
// Variables can be defined inline as well.
const ref = getQuizQuestionPointValueRef({ quizId: ..., questionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getQuizQuestionPointValueRef(dataConnect, getQuizQuestionPointValueVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizQuestions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
});
```

## GetAttemptForCompletion
You can execute the `GetAttemptForCompletion` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAttemptForCompletion(vars: GetAttemptForCompletionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;

interface GetAttemptForCompletionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptForCompletionVariables): QueryRef<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;
}
export const getAttemptForCompletionRef: GetAttemptForCompletionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttemptForCompletion(dc: DataConnect, vars: GetAttemptForCompletionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;

interface GetAttemptForCompletionRef {
  ...
  (dc: DataConnect, vars: GetAttemptForCompletionVariables): QueryRef<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;
}
export const getAttemptForCompletionRef: GetAttemptForCompletionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttemptForCompletionRef:
```typescript
const name = getAttemptForCompletionRef.operationName;
console.log(name);
```

### Variables
The `GetAttemptForCompletion` query requires an argument of type `GetAttemptForCompletionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttemptForCompletionVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAttemptForCompletion` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttemptForCompletionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttemptForCompletionData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    questionOrder: string;
    user: {
      id: string;
    } & User_Key;
      quiz: {
        id: UUIDString;
        passingScore?: number | null;
        quizQuestions_on_quiz: ({
          position: number;
          pointValue: number;
          question: {
            id: UUIDString;
            domain: string;
          } & Question_Key;
        })[];
      } & Quiz_Key;
        quizResponses_on_attempt: ({
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          question: {
            id: UUIDString;
            domain: string;
          } & Question_Key;
        })[];
  } & QuizAttempt_Key;
}
```
### Using `GetAttemptForCompletion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttemptForCompletion, GetAttemptForCompletionVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptForCompletion` query requires an argument of type `GetAttemptForCompletionVariables`:
const getAttemptForCompletionVars: GetAttemptForCompletionVariables = {
  attemptId: ..., 
};

// Call the `getAttemptForCompletion()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttemptForCompletion(getAttemptForCompletionVars);
// Variables can be defined inline as well.
const { data } = await getAttemptForCompletion({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttemptForCompletion(dataConnect, getAttemptForCompletionVars);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
getAttemptForCompletion(getAttemptForCompletionVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

### Using `GetAttemptForCompletion`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttemptForCompletionRef, GetAttemptForCompletionVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptForCompletion` query requires an argument of type `GetAttemptForCompletionVariables`:
const getAttemptForCompletionVars: GetAttemptForCompletionVariables = {
  attemptId: ..., 
};

// Call the `getAttemptForCompletionRef()` function to get a reference to the query.
const ref = getAttemptForCompletionRef(getAttemptForCompletionVars);
// Variables can be defined inline as well.
const ref = getAttemptForCompletionRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttemptForCompletionRef(dataConnect, getAttemptForCompletionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

## GetAttemptOwner
You can execute the `GetAttemptOwner` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getAttemptOwner(vars: GetAttemptOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptOwnerData, GetAttemptOwnerVariables>;

interface GetAttemptOwnerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptOwnerVariables): QueryRef<GetAttemptOwnerData, GetAttemptOwnerVariables>;
}
export const getAttemptOwnerRef: GetAttemptOwnerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttemptOwner(dc: DataConnect, vars: GetAttemptOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptOwnerData, GetAttemptOwnerVariables>;

interface GetAttemptOwnerRef {
  ...
  (dc: DataConnect, vars: GetAttemptOwnerVariables): QueryRef<GetAttemptOwnerData, GetAttemptOwnerVariables>;
}
export const getAttemptOwnerRef: GetAttemptOwnerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttemptOwnerRef:
```typescript
const name = getAttemptOwnerRef.operationName;
console.log(name);
```

### Variables
The `GetAttemptOwner` query requires an argument of type `GetAttemptOwnerVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttemptOwnerVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAttemptOwner` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttemptOwnerData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttemptOwnerData {
  quizAttempt?: {
    id: UUIDString;
    user: {
      id: string;
    } & User_Key;
  } & QuizAttempt_Key;
}
```
### Using `GetAttemptOwner`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttemptOwner, GetAttemptOwnerVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptOwner` query requires an argument of type `GetAttemptOwnerVariables`:
const getAttemptOwnerVars: GetAttemptOwnerVariables = {
  attemptId: ..., 
};

// Call the `getAttemptOwner()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttemptOwner(getAttemptOwnerVars);
// Variables can be defined inline as well.
const { data } = await getAttemptOwner({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttemptOwner(dataConnect, getAttemptOwnerVars);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
getAttemptOwner(getAttemptOwnerVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

### Using `GetAttemptOwner`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttemptOwnerRef, GetAttemptOwnerVariables } from '@impact26/dataconnect-sdk';

// The `GetAttemptOwner` query requires an argument of type `GetAttemptOwnerVariables`:
const getAttemptOwnerVars: GetAttemptOwnerVariables = {
  attemptId: ..., 
};

// Call the `getAttemptOwnerRef()` function to get a reference to the query.
const ref = getAttemptOwnerRef(getAttemptOwnerVars);
// Variables can be defined inline as well.
const ref = getAttemptOwnerRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttemptOwnerRef(dataConnect, getAttemptOwnerVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
});
```

## AdminListQuestions
You can execute the `AdminListQuestions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListQuestions(options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsData, undefined>;

interface AdminListQuestionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListQuestionsData, undefined>;
}
export const adminListQuestionsRef: AdminListQuestionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListQuestions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsData, undefined>;

interface AdminListQuestionsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListQuestionsData, undefined>;
}
export const adminListQuestionsRef: AdminListQuestionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListQuestionsRef:
```typescript
const name = adminListQuestionsRef.operationName;
console.log(name);
```

### Variables
The `AdminListQuestions` query has no variables.
### Return Type
Recall that executing the `AdminListQuestions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListQuestionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListQuestionsData {
  questions: ({
    id: UUIDString;
    questionText: string;
    questionType: string;
    difficulty: string;
    domain: string;
    formulaRef?: string | null;
    topicTags?: string | null;
    status: string;
    version: number;
    isMultiselect: boolean;
    rationale?: string | null;
    calculation?: string | null;
    sourceRef?: string | null;
    createdAt: DateString;
    answerChoices_on_question: ({
      id: UUIDString;
      letter: string;
      choiceText: string;
      isCorrect: boolean;
      explanation?: string | null;
      position: number;
    } & AnswerChoice_Key)[];
  } & Question_Key)[];
}
```
### Using `AdminListQuestions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListQuestions } from '@impact26/dataconnect-sdk';


// Call the `adminListQuestions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListQuestions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListQuestions(dataConnect);

console.log(data.questions);

// Or, you can use the `Promise` API.
adminListQuestions().then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

### Using `AdminListQuestions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListQuestionsRef } from '@impact26/dataconnect-sdk';


// Call the `adminListQuestionsRef()` function to get a reference to the query.
const ref = adminListQuestionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListQuestionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.questions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

## AdminListQuestionsPage
You can execute the `AdminListQuestionsPage` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListQuestionsPage(vars: AdminListQuestionsPageVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;

interface AdminListQuestionsPageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminListQuestionsPageVariables): QueryRef<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;
}
export const adminListQuestionsPageRef: AdminListQuestionsPageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListQuestionsPage(dc: DataConnect, vars: AdminListQuestionsPageVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;

interface AdminListQuestionsPageRef {
  ...
  (dc: DataConnect, vars: AdminListQuestionsPageVariables): QueryRef<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;
}
export const adminListQuestionsPageRef: AdminListQuestionsPageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListQuestionsPageRef:
```typescript
const name = adminListQuestionsPageRef.operationName;
console.log(name);
```

### Variables
The `AdminListQuestionsPage` query requires an argument of type `AdminListQuestionsPageVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminListQuestionsPageVariables {
  limit: number;
  offset: number;
}
```
### Return Type
Recall that executing the `AdminListQuestionsPage` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListQuestionsPageData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListQuestionsPageData {
  questions: ({
    id: UUIDString;
    questionText: string;
    questionType: string;
    difficulty: string;
    domain: string;
    formulaRef?: string | null;
    topicTags?: string | null;
    status: string;
    version: number;
    isMultiselect: boolean;
    createdAt: DateString;
  } & Question_Key)[];
}
```
### Using `AdminListQuestionsPage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListQuestionsPage, AdminListQuestionsPageVariables } from '@impact26/dataconnect-sdk';

// The `AdminListQuestionsPage` query requires an argument of type `AdminListQuestionsPageVariables`:
const adminListQuestionsPageVars: AdminListQuestionsPageVariables = {
  limit: ..., 
  offset: ..., 
};

// Call the `adminListQuestionsPage()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListQuestionsPage(adminListQuestionsPageVars);
// Variables can be defined inline as well.
const { data } = await adminListQuestionsPage({ limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListQuestionsPage(dataConnect, adminListQuestionsPageVars);

console.log(data.questions);

// Or, you can use the `Promise` API.
adminListQuestionsPage(adminListQuestionsPageVars).then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

### Using `AdminListQuestionsPage`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListQuestionsPageRef, AdminListQuestionsPageVariables } from '@impact26/dataconnect-sdk';

// The `AdminListQuestionsPage` query requires an argument of type `AdminListQuestionsPageVariables`:
const adminListQuestionsPageVars: AdminListQuestionsPageVariables = {
  limit: ..., 
  offset: ..., 
};

// Call the `adminListQuestionsPageRef()` function to get a reference to the query.
const ref = adminListQuestionsPageRef(adminListQuestionsPageVars);
// Variables can be defined inline as well.
const ref = adminListQuestionsPageRef({ limit: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListQuestionsPageRef(dataConnect, adminListQuestionsPageVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.questions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

## AdminCountQuestions
You can execute the `AdminCountQuestions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminCountQuestions(options?: ExecuteQueryOptions): QueryPromise<AdminCountQuestionsData, undefined>;

interface AdminCountQuestionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminCountQuestionsData, undefined>;
}
export const adminCountQuestionsRef: AdminCountQuestionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminCountQuestions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminCountQuestionsData, undefined>;

interface AdminCountQuestionsRef {
  ...
  (dc: DataConnect): QueryRef<AdminCountQuestionsData, undefined>;
}
export const adminCountQuestionsRef: AdminCountQuestionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCountQuestionsRef:
```typescript
const name = adminCountQuestionsRef.operationName;
console.log(name);
```

### Variables
The `AdminCountQuestions` query has no variables.
### Return Type
Recall that executing the `AdminCountQuestions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCountQuestionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCountQuestionsData {
  questions: ({
    id: UUIDString;
  } & Question_Key)[];
}
```
### Using `AdminCountQuestions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCountQuestions } from '@impact26/dataconnect-sdk';


// Call the `adminCountQuestions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCountQuestions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCountQuestions(dataConnect);

console.log(data.questions);

// Or, you can use the `Promise` API.
adminCountQuestions().then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

### Using `AdminCountQuestions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminCountQuestionsRef } from '@impact26/dataconnect-sdk';


// Call the `adminCountQuestionsRef()` function to get a reference to the query.
const ref = adminCountQuestionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCountQuestionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.questions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.questions);
});
```

## AdminListQuizQuestionUsage
You can execute the `AdminListQuizQuestionUsage` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListQuizQuestionUsage(options?: ExecuteQueryOptions): QueryPromise<AdminListQuizQuestionUsageData, undefined>;

interface AdminListQuizQuestionUsageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListQuizQuestionUsageData, undefined>;
}
export const adminListQuizQuestionUsageRef: AdminListQuizQuestionUsageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListQuizQuestionUsage(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListQuizQuestionUsageData, undefined>;

interface AdminListQuizQuestionUsageRef {
  ...
  (dc: DataConnect): QueryRef<AdminListQuizQuestionUsageData, undefined>;
}
export const adminListQuizQuestionUsageRef: AdminListQuizQuestionUsageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListQuizQuestionUsageRef:
```typescript
const name = adminListQuizQuestionUsageRef.operationName;
console.log(name);
```

### Variables
The `AdminListQuizQuestionUsage` query has no variables.
### Return Type
Recall that executing the `AdminListQuizQuestionUsage` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListQuizQuestionUsageData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListQuizQuestionUsageData {
  quizQuestions: ({
    quiz: {
      id: UUIDString;
      title: string;
    } & Quiz_Key;
      question: {
        id: UUIDString;
      } & Question_Key;
  })[];
    lessons: ({
      id: UUIDString;
      title: string;
      quiz?: {
        id: UUIDString;
      } & Quiz_Key;
        module: {
          id: UUIDString;
          title: string;
        } & Module_Key;
    } & Lesson_Key)[];
}
```
### Using `AdminListQuizQuestionUsage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListQuizQuestionUsage } from '@impact26/dataconnect-sdk';


// Call the `adminListQuizQuestionUsage()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListQuizQuestionUsage();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListQuizQuestionUsage(dataConnect);

console.log(data.quizQuestions);
console.log(data.lessons);

// Or, you can use the `Promise` API.
adminListQuizQuestionUsage().then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
  console.log(data.lessons);
});
```

### Using `AdminListQuizQuestionUsage`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListQuizQuestionUsageRef } from '@impact26/dataconnect-sdk';


// Call the `adminListQuizQuestionUsageRef()` function to get a reference to the query.
const ref = adminListQuizQuestionUsageRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListQuizQuestionUsageRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizQuestions);
console.log(data.lessons);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestions);
  console.log(data.lessons);
});
```

## AdminListCourses
You can execute the `AdminListCourses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListCourses(options?: ExecuteQueryOptions): QueryPromise<AdminListCoursesData, undefined>;

interface AdminListCoursesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListCoursesData, undefined>;
}
export const adminListCoursesRef: AdminListCoursesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListCourses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListCoursesData, undefined>;

interface AdminListCoursesRef {
  ...
  (dc: DataConnect): QueryRef<AdminListCoursesData, undefined>;
}
export const adminListCoursesRef: AdminListCoursesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListCoursesRef:
```typescript
const name = adminListCoursesRef.operationName;
console.log(name);
```

### Variables
The `AdminListCourses` query has no variables.
### Return Type
Recall that executing the `AdminListCourses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListCoursesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListCoursesData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    status: string;
    version: number;
    isPublished: boolean;
    publishedAt?: DateString | null;
    createdAt: DateString;
    updatedAt: DateString;
    createdBy: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      modules_on_course: ({
        id: UUIDString;
        title: string;
        description?: string | null;
        learningObjectives?: string | null;
        prerequisiteModuleIds?: string | null;
        position: number;
        status: string;
        lessons_on_module: ({
          id: UUIDString;
          title: string;
          position: number;
          lessonType: string;
          status: string;
          isPublished: boolean;
          durationSeconds?: number | null;
          videoPlaybackId?: string | null;
          videoUrl?: string | null;
          contentJson?: string | null;
          quiz?: {
            id: UUIDString;
          } & Quiz_Key;
        } & Lesson_Key)[];
      } & Module_Key)[];
  } & Course_Key)[];
}
```
### Using `AdminListCourses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListCourses } from '@impact26/dataconnect-sdk';


// Call the `adminListCourses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListCourses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListCourses(dataConnect);

console.log(data.courses);

// Or, you can use the `Promise` API.
adminListCourses().then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `AdminListCourses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListCoursesRef } from '@impact26/dataconnect-sdk';


// Call the `adminListCoursesRef()` function to get a reference to the query.
const ref = adminListCoursesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListCoursesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetLessonVersions
You can execute the `GetLessonVersions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLessonVersions(vars: GetLessonVersionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonVersionsData, GetLessonVersionsVariables>;

interface GetLessonVersionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonVersionsVariables): QueryRef<GetLessonVersionsData, GetLessonVersionsVariables>;
}
export const getLessonVersionsRef: GetLessonVersionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLessonVersions(dc: DataConnect, vars: GetLessonVersionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonVersionsData, GetLessonVersionsVariables>;

interface GetLessonVersionsRef {
  ...
  (dc: DataConnect, vars: GetLessonVersionsVariables): QueryRef<GetLessonVersionsData, GetLessonVersionsVariables>;
}
export const getLessonVersionsRef: GetLessonVersionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonVersionsRef:
```typescript
const name = getLessonVersionsRef.operationName;
console.log(name);
```

### Variables
The `GetLessonVersions` query requires an argument of type `GetLessonVersionsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLessonVersionsVariables {
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLessonVersions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonVersionsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonVersionsData {
  lessonVersions: ({
    id: UUIDString;
    contentJson?: string | null;
    videoPlaybackId?: string | null;
    versionNote?: string | null;
    createdAt: DateString;
    createdBy: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
  } & LessonVersion_Key)[];
}
```
### Using `GetLessonVersions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLessonVersions, GetLessonVersionsVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonVersions` query requires an argument of type `GetLessonVersionsVariables`:
const getLessonVersionsVars: GetLessonVersionsVariables = {
  lessonId: ..., 
};

// Call the `getLessonVersions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLessonVersions(getLessonVersionsVars);
// Variables can be defined inline as well.
const { data } = await getLessonVersions({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLessonVersions(dataConnect, getLessonVersionsVars);

console.log(data.lessonVersions);

// Or, you can use the `Promise` API.
getLessonVersions(getLessonVersionsVars).then((response) => {
  const data = response.data;
  console.log(data.lessonVersions);
});
```

### Using `GetLessonVersions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonVersionsRef, GetLessonVersionsVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonVersions` query requires an argument of type `GetLessonVersionsVariables`:
const getLessonVersionsVars: GetLessonVersionsVariables = {
  lessonId: ..., 
};

// Call the `getLessonVersionsRef()` function to get a reference to the query.
const ref = getLessonVersionsRef(getLessonVersionsVars);
// Variables can be defined inline as well.
const ref = getLessonVersionsRef({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonVersionsRef(dataConnect, getLessonVersionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.lessonVersions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonVersions);
});
```

## AdminListSourceMaterialsRich
You can execute the `AdminListSourceMaterialsRich` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListSourceMaterialsRich(options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsRichData, undefined>;

interface AdminListSourceMaterialsRichRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListSourceMaterialsRichData, undefined>;
}
export const adminListSourceMaterialsRichRef: AdminListSourceMaterialsRichRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListSourceMaterialsRich(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsRichData, undefined>;

interface AdminListSourceMaterialsRichRef {
  ...
  (dc: DataConnect): QueryRef<AdminListSourceMaterialsRichData, undefined>;
}
export const adminListSourceMaterialsRichRef: AdminListSourceMaterialsRichRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListSourceMaterialsRichRef:
```typescript
const name = adminListSourceMaterialsRichRef.operationName;
console.log(name);
```

### Variables
The `AdminListSourceMaterialsRich` query has no variables.
### Return Type
Recall that executing the `AdminListSourceMaterialsRich` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListSourceMaterialsRichData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListSourceMaterialsRichData {
  sourceMaterials: ({
    id: UUIDString;
    title: string;
    fileName: string;
    fileType: string;
    folder?: {
      id: UUIDString;
      name: string;
      folderType: string;
      parentFolder?: {
        id: UUIDString;
        name: string;
      } & SourceMaterialFolder_Key;
        course?: {
          id: UUIDString;
          title: string;
        } & Course_Key;
          lesson?: {
            id: UUIDString;
            title: string;
          } & Lesson_Key;
            archivedAt?: DateString | null;
            trashedAt?: DateString | null;
            createdAt: DateString;
            updatedAt: DateString;
    } & SourceMaterialFolder_Key;
      storagePath: string;
      downloadUrl?: string | null;
      extractedText?: string | null;
      metadataJson?: string | null;
      status: string;
      starred: boolean;
      archivedAt?: DateString | null;
      trashedAt?: DateString | null;
      reviewStatus: string;
      visibility: string;
      duplicateOf?: {
        id: UUIDString;
        title: string;
      } & SourceMaterial_Key;
        lastActivityAt?: DateString | null;
        createdAt: DateString;
        updatedAt: DateString;
        uploadedBy?: {
          id: string;
          email: string;
          fullName?: string | null;
        } & User_Key;
          sourceMaterialTagAssignments_on_sourceMaterial: ({
            tag: {
              id: UUIDString;
              name: string;
              color?: string | null;
            } & SourceMaterialTag_Key;
          })[];
            sourceMaterialActivities_on_sourceMaterial: ({
              id: UUIDString;
              activityType: string;
              message?: string | null;
              metadataJson?: string | null;
              createdAt: DateString;
              actor?: {
                id: string;
                email: string;
                fullName?: string | null;
              } & User_Key;
            } & SourceMaterialActivity_Key)[];
              ingestionJobs_on_sourceMaterial: ({
                id: UUIDString;
                status: string;
                parser: string;
                extractedCharacters: number;
                errorMessage?: string | null;
                createdAt: DateString;
                completedAt?: DateString | null;
              } & IngestionJob_Key)[];
                contentSourceLinks_on_sourceMaterial: ({
                  id: UUIDString;
                  referenceLabel?: string | null;
                  createdAt: DateString;
                  course?: {
                    id: UUIDString;
                    title: string;
                  } & Course_Key;
                    lesson?: {
                      id: UUIDString;
                      title: string;
                      module: {
                        id: UUIDString;
                        title: string;
                        course: {
                          id: UUIDString;
                          title: string;
                        } & Course_Key;
                      } & Module_Key;
                    } & Lesson_Key;
                      question?: {
                        id: UUIDString;
                        questionText: string;
                        domain: string;
                        difficulty: string;
                      } & Question_Key;
                } & ContentSourceLink_Key)[];
  } & SourceMaterial_Key)[];
}
```
### Using `AdminListSourceMaterialsRich`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterialsRich } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterialsRich()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListSourceMaterialsRich();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListSourceMaterialsRich(dataConnect);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
adminListSourceMaterialsRich().then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

### Using `AdminListSourceMaterialsRich`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterialsRichRef } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterialsRichRef()` function to get a reference to the query.
const ref = adminListSourceMaterialsRichRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListSourceMaterialsRichRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

## AdminListSourceMaterials
You can execute the `AdminListSourceMaterials` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListSourceMaterials(options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsData, undefined>;

interface AdminListSourceMaterialsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListSourceMaterialsData, undefined>;
}
export const adminListSourceMaterialsRef: AdminListSourceMaterialsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListSourceMaterials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsData, undefined>;

interface AdminListSourceMaterialsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListSourceMaterialsData, undefined>;
}
export const adminListSourceMaterialsRef: AdminListSourceMaterialsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListSourceMaterialsRef:
```typescript
const name = adminListSourceMaterialsRef.operationName;
console.log(name);
```

### Variables
The `AdminListSourceMaterials` query has no variables.
### Return Type
Recall that executing the `AdminListSourceMaterials` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListSourceMaterialsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListSourceMaterialsData {
  sourceMaterials: ({
    id: UUIDString;
    title: string;
    fileName: string;
    fileType: string;
    storagePath: string;
    downloadUrl?: string | null;
    extractedText?: string | null;
    metadataJson?: string | null;
    status: string;
    createdAt: DateString;
    updatedAt: DateString;
    uploadedBy?: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      ingestionJobs_on_sourceMaterial: ({
        id: UUIDString;
        status: string;
        parser: string;
        extractedCharacters: number;
        errorMessage?: string | null;
        createdAt: DateString;
        completedAt?: DateString | null;
      } & IngestionJob_Key)[];
        contentSourceLinks_on_sourceMaterial: ({
          id: UUIDString;
          referenceLabel?: string | null;
          createdAt: DateString;
          course?: {
            id: UUIDString;
            title: string;
          } & Course_Key;
            lesson?: {
              id: UUIDString;
              title: string;
              module: {
                id: UUIDString;
                title: string;
                course: {
                  id: UUIDString;
                  title: string;
                } & Course_Key;
              } & Module_Key;
            } & Lesson_Key;
              question?: {
                id: UUIDString;
                questionText: string;
                domain: string;
                difficulty: string;
              } & Question_Key;
        } & ContentSourceLink_Key)[];
  } & SourceMaterial_Key)[];
}
```
### Using `AdminListSourceMaterials`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterials } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterials()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListSourceMaterials();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListSourceMaterials(dataConnect);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
adminListSourceMaterials().then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

### Using `AdminListSourceMaterials`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterialsRef } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterialsRef()` function to get a reference to the query.
const ref = adminListSourceMaterialsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListSourceMaterialsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceMaterials);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterials);
});
```

## AdminListSourceMaterialFolders
You can execute the `AdminListSourceMaterialFolders` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListSourceMaterialFolders(options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialFoldersData, undefined>;

interface AdminListSourceMaterialFoldersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListSourceMaterialFoldersData, undefined>;
}
export const adminListSourceMaterialFoldersRef: AdminListSourceMaterialFoldersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListSourceMaterialFolders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialFoldersData, undefined>;

interface AdminListSourceMaterialFoldersRef {
  ...
  (dc: DataConnect): QueryRef<AdminListSourceMaterialFoldersData, undefined>;
}
export const adminListSourceMaterialFoldersRef: AdminListSourceMaterialFoldersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListSourceMaterialFoldersRef:
```typescript
const name = adminListSourceMaterialFoldersRef.operationName;
console.log(name);
```

### Variables
The `AdminListSourceMaterialFolders` query has no variables.
### Return Type
Recall that executing the `AdminListSourceMaterialFolders` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListSourceMaterialFoldersData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListSourceMaterialFoldersData {
  sourceMaterialFolders: ({
    id: UUIDString;
    name: string;
    folderType: string;
    archivedAt?: DateString | null;
    trashedAt?: DateString | null;
    createdAt: DateString;
    updatedAt: DateString;
    parentFolder?: {
      id: UUIDString;
      name: string;
    } & SourceMaterialFolder_Key;
      course?: {
        id: UUIDString;
        title: string;
      } & Course_Key;
        lesson?: {
          id: UUIDString;
          title: string;
          module: {
            id: UUIDString;
            title: string;
            course: {
              id: UUIDString;
              title: string;
            } & Course_Key;
          } & Module_Key;
        } & Lesson_Key;
          createdBy?: {
            id: string;
            email: string;
            fullName?: string | null;
          } & User_Key;
  } & SourceMaterialFolder_Key)[];
}
```
### Using `AdminListSourceMaterialFolders`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterialFolders } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterialFolders()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListSourceMaterialFolders();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListSourceMaterialFolders(dataConnect);

console.log(data.sourceMaterialFolders);

// Or, you can use the `Promise` API.
adminListSourceMaterialFolders().then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialFolders);
});
```

### Using `AdminListSourceMaterialFolders`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterialFoldersRef } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterialFoldersRef()` function to get a reference to the query.
const ref = adminListSourceMaterialFoldersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListSourceMaterialFoldersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceMaterialFolders);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialFolders);
});
```

## AdminListSourceMaterialTags
You can execute the `AdminListSourceMaterialTags` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListSourceMaterialTags(options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialTagsData, undefined>;

interface AdminListSourceMaterialTagsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListSourceMaterialTagsData, undefined>;
}
export const adminListSourceMaterialTagsRef: AdminListSourceMaterialTagsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListSourceMaterialTags(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialTagsData, undefined>;

interface AdminListSourceMaterialTagsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListSourceMaterialTagsData, undefined>;
}
export const adminListSourceMaterialTagsRef: AdminListSourceMaterialTagsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListSourceMaterialTagsRef:
```typescript
const name = adminListSourceMaterialTagsRef.operationName;
console.log(name);
```

### Variables
The `AdminListSourceMaterialTags` query has no variables.
### Return Type
Recall that executing the `AdminListSourceMaterialTags` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListSourceMaterialTagsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListSourceMaterialTagsData {
  sourceMaterialTags: ({
    id: UUIDString;
    name: string;
    color?: string | null;
    createdAt: DateString;
    updatedAt: DateString;
  } & SourceMaterialTag_Key)[];
}
```
### Using `AdminListSourceMaterialTags`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterialTags } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterialTags()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListSourceMaterialTags();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListSourceMaterialTags(dataConnect);

console.log(data.sourceMaterialTags);

// Or, you can use the `Promise` API.
adminListSourceMaterialTags().then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialTags);
});
```

### Using `AdminListSourceMaterialTags`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListSourceMaterialTagsRef } from '@impact26/dataconnect-sdk';


// Call the `adminListSourceMaterialTagsRef()` function to get a reference to the query.
const ref = adminListSourceMaterialTagsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListSourceMaterialTagsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourceMaterialTags);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialTags);
});
```

## AdminListUsers
You can execute the `AdminListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListUsers(options?: ExecuteQueryOptions): QueryPromise<AdminListUsersData, undefined>;

interface AdminListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListUsersData, undefined>;
}
export const adminListUsersRef: AdminListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListUsersData, undefined>;

interface AdminListUsersRef {
  ...
  (dc: DataConnect): QueryRef<AdminListUsersData, undefined>;
}
export const adminListUsersRef: AdminListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListUsersRef:
```typescript
const name = adminListUsersRef.operationName;
console.log(name);
```

### Variables
The `AdminListUsers` query has no variables.
### Return Type
Recall that executing the `AdminListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListUsersData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListUsersData {
  users: ({
    id: string;
    email: string;
    fullName?: string | null;
    role: string;
    createdAt: DateString;
  } & User_Key)[];
}
```
### Using `AdminListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListUsers } from '@impact26/dataconnect-sdk';


// Call the `adminListUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
adminListUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `AdminListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListUsersRef } from '@impact26/dataconnect-sdk';


// Call the `adminListUsersRef()` function to get a reference to the query.
const ref = adminListUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## AdminCohortStats
You can execute the `AdminCohortStats` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminCohortStats(options?: ExecuteQueryOptions): QueryPromise<AdminCohortStatsData, undefined>;

interface AdminCohortStatsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminCohortStatsData, undefined>;
}
export const adminCohortStatsRef: AdminCohortStatsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminCohortStats(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminCohortStatsData, undefined>;

interface AdminCohortStatsRef {
  ...
  (dc: DataConnect): QueryRef<AdminCohortStatsData, undefined>;
}
export const adminCohortStatsRef: AdminCohortStatsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminCohortStatsRef:
```typescript
const name = adminCohortStatsRef.operationName;
console.log(name);
```

### Variables
The `AdminCohortStats` query has no variables.
### Return Type
Recall that executing the `AdminCohortStats` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminCohortStatsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminCohortStatsData {
  quizAttempts: ({
    id: UUIDString;
    user: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      quiz: {
        id: UUIDString;
        title: string;
      } & Quiz_Key;
        scorePct?: number | null;
        passed?: boolean | null;
        completedAt?: DateString | null;
        quizResponses_on_attempt: ({
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          question: {
            id: UUIDString;
            domain: string;
            difficulty: string;
            questionText: string;
            topicTags?: string | null;
          } & Question_Key;
        })[];
  } & QuizAttempt_Key)[];
}
```
### Using `AdminCohortStats`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminCohortStats } from '@impact26/dataconnect-sdk';


// Call the `adminCohortStats()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminCohortStats();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminCohortStats(dataConnect);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
adminCohortStats().then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

### Using `AdminCohortStats`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminCohortStatsRef } from '@impact26/dataconnect-sdk';


// Call the `adminCohortStatsRef()` function to get a reference to the query.
const ref = adminCohortStatsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminCohortStatsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

## AdminListGlossaryTerms
You can execute the `AdminListGlossaryTerms` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListGlossaryTerms(options?: ExecuteQueryOptions): QueryPromise<AdminListGlossaryTermsData, undefined>;

interface AdminListGlossaryTermsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListGlossaryTermsData, undefined>;
}
export const adminListGlossaryTermsRef: AdminListGlossaryTermsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListGlossaryTerms(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListGlossaryTermsData, undefined>;

interface AdminListGlossaryTermsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListGlossaryTermsData, undefined>;
}
export const adminListGlossaryTermsRef: AdminListGlossaryTermsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListGlossaryTermsRef:
```typescript
const name = adminListGlossaryTermsRef.operationName;
console.log(name);
```

### Variables
The `AdminListGlossaryTerms` query has no variables.
### Return Type
Recall that executing the `AdminListGlossaryTerms` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListGlossaryTermsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListGlossaryTermsData {
  glossaryTerms: ({
    id: UUIDString;
    term: string;
    definition: string;
    fullDefinition?: string | null;
    domain?: string | null;
    category?: string | null;
    example?: string | null;
    relatedTerms?: string | null;
    isPublished: boolean;
    sourceDocument?: string | null;
    createdBy?: {
      id: string;
      fullName?: string | null;
    } & User_Key;
      createdAt: DateString;
      updatedAt: DateString;
  } & GlossaryTerm_Key)[];
}
```
### Using `AdminListGlossaryTerms`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListGlossaryTerms } from '@impact26/dataconnect-sdk';


// Call the `adminListGlossaryTerms()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListGlossaryTerms();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListGlossaryTerms(dataConnect);

console.log(data.glossaryTerms);

// Or, you can use the `Promise` API.
adminListGlossaryTerms().then((response) => {
  const data = response.data;
  console.log(data.glossaryTerms);
});
```

### Using `AdminListGlossaryTerms`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListGlossaryTermsRef } from '@impact26/dataconnect-sdk';


// Call the `adminListGlossaryTermsRef()` function to get a reference to the query.
const ref = adminListGlossaryTermsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListGlossaryTermsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.glossaryTerms);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryTerms);
});
```

## ListPublishedGlossaryTerms
You can execute the `ListPublishedGlossaryTerms` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listPublishedGlossaryTerms(options?: ExecuteQueryOptions): QueryPromise<ListPublishedGlossaryTermsData, undefined>;

interface ListPublishedGlossaryTermsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublishedGlossaryTermsData, undefined>;
}
export const listPublishedGlossaryTermsRef: ListPublishedGlossaryTermsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublishedGlossaryTerms(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublishedGlossaryTermsData, undefined>;

interface ListPublishedGlossaryTermsRef {
  ...
  (dc: DataConnect): QueryRef<ListPublishedGlossaryTermsData, undefined>;
}
export const listPublishedGlossaryTermsRef: ListPublishedGlossaryTermsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublishedGlossaryTermsRef:
```typescript
const name = listPublishedGlossaryTermsRef.operationName;
console.log(name);
```

### Variables
The `ListPublishedGlossaryTerms` query has no variables.
### Return Type
Recall that executing the `ListPublishedGlossaryTerms` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublishedGlossaryTermsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublishedGlossaryTermsData {
  glossaryTerms: ({
    id: UUIDString;
    term: string;
    definition: string;
    fullDefinition?: string | null;
    domain?: string | null;
    category?: string | null;
    example?: string | null;
    relatedTerms?: string | null;
    sourceDocument?: string | null;
    createdAt: DateString;
    updatedAt: DateString;
  } & GlossaryTerm_Key)[];
}
```
### Using `ListPublishedGlossaryTerms`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublishedGlossaryTerms } from '@impact26/dataconnect-sdk';


// Call the `listPublishedGlossaryTerms()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublishedGlossaryTerms();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublishedGlossaryTerms(dataConnect);

console.log(data.glossaryTerms);

// Or, you can use the `Promise` API.
listPublishedGlossaryTerms().then((response) => {
  const data = response.data;
  console.log(data.glossaryTerms);
});
```

### Using `ListPublishedGlossaryTerms`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublishedGlossaryTermsRef } from '@impact26/dataconnect-sdk';


// Call the `listPublishedGlossaryTermsRef()` function to get a reference to the query.
const ref = listPublishedGlossaryTermsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublishedGlossaryTermsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.glossaryTerms);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryTerms);
});
```

## GetGlossaryNotesForUser
You can execute the `GetGlossaryNotesForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getGlossaryNotesForUser(vars: GetGlossaryNotesForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetGlossaryNotesForUserData, GetGlossaryNotesForUserVariables>;

interface GetGlossaryNotesForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGlossaryNotesForUserVariables): QueryRef<GetGlossaryNotesForUserData, GetGlossaryNotesForUserVariables>;
}
export const getGlossaryNotesForUserRef: GetGlossaryNotesForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGlossaryNotesForUser(dc: DataConnect, vars: GetGlossaryNotesForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetGlossaryNotesForUserData, GetGlossaryNotesForUserVariables>;

interface GetGlossaryNotesForUserRef {
  ...
  (dc: DataConnect, vars: GetGlossaryNotesForUserVariables): QueryRef<GetGlossaryNotesForUserData, GetGlossaryNotesForUserVariables>;
}
export const getGlossaryNotesForUserRef: GetGlossaryNotesForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGlossaryNotesForUserRef:
```typescript
const name = getGlossaryNotesForUserRef.operationName;
console.log(name);
```

### Variables
The `GetGlossaryNotesForUser` query requires an argument of type `GetGlossaryNotesForUserVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetGlossaryNotesForUserVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetGlossaryNotesForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGlossaryNotesForUserData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetGlossaryNotesForUserData {
  glossaryNotes: ({
    id: UUIDString;
    note: string;
    term: {
      id: UUIDString;
    } & GlossaryTerm_Key;
      createdAt: DateString;
      updatedAt: DateString;
  } & GlossaryNote_Key)[];
}
```
### Using `GetGlossaryNotesForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGlossaryNotesForUser, GetGlossaryNotesForUserVariables } from '@impact26/dataconnect-sdk';

// The `GetGlossaryNotesForUser` query requires an argument of type `GetGlossaryNotesForUserVariables`:
const getGlossaryNotesForUserVars: GetGlossaryNotesForUserVariables = {
  userId: ..., 
};

// Call the `getGlossaryNotesForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGlossaryNotesForUser(getGlossaryNotesForUserVars);
// Variables can be defined inline as well.
const { data } = await getGlossaryNotesForUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGlossaryNotesForUser(dataConnect, getGlossaryNotesForUserVars);

console.log(data.glossaryNotes);

// Or, you can use the `Promise` API.
getGlossaryNotesForUser(getGlossaryNotesForUserVars).then((response) => {
  const data = response.data;
  console.log(data.glossaryNotes);
});
```

### Using `GetGlossaryNotesForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGlossaryNotesForUserRef, GetGlossaryNotesForUserVariables } from '@impact26/dataconnect-sdk';

// The `GetGlossaryNotesForUser` query requires an argument of type `GetGlossaryNotesForUserVariables`:
const getGlossaryNotesForUserVars: GetGlossaryNotesForUserVariables = {
  userId: ..., 
};

// Call the `getGlossaryNotesForUserRef()` function to get a reference to the query.
const ref = getGlossaryNotesForUserRef(getGlossaryNotesForUserVars);
// Variables can be defined inline as well.
const ref = getGlossaryNotesForUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGlossaryNotesForUserRef(dataConnect, getGlossaryNotesForUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.glossaryNotes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryNotes);
});
```

## GetGlossaryNoteForUserTerm
You can execute the `GetGlossaryNoteForUserTerm` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getGlossaryNoteForUserTerm(vars: GetGlossaryNoteForUserTermVariables, options?: ExecuteQueryOptions): QueryPromise<GetGlossaryNoteForUserTermData, GetGlossaryNoteForUserTermVariables>;

interface GetGlossaryNoteForUserTermRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGlossaryNoteForUserTermVariables): QueryRef<GetGlossaryNoteForUserTermData, GetGlossaryNoteForUserTermVariables>;
}
export const getGlossaryNoteForUserTermRef: GetGlossaryNoteForUserTermRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGlossaryNoteForUserTerm(dc: DataConnect, vars: GetGlossaryNoteForUserTermVariables, options?: ExecuteQueryOptions): QueryPromise<GetGlossaryNoteForUserTermData, GetGlossaryNoteForUserTermVariables>;

interface GetGlossaryNoteForUserTermRef {
  ...
  (dc: DataConnect, vars: GetGlossaryNoteForUserTermVariables): QueryRef<GetGlossaryNoteForUserTermData, GetGlossaryNoteForUserTermVariables>;
}
export const getGlossaryNoteForUserTermRef: GetGlossaryNoteForUserTermRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGlossaryNoteForUserTermRef:
```typescript
const name = getGlossaryNoteForUserTermRef.operationName;
console.log(name);
```

### Variables
The `GetGlossaryNoteForUserTerm` query requires an argument of type `GetGlossaryNoteForUserTermVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetGlossaryNoteForUserTermVariables {
  userId: string;
  termId: UUIDString;
}
```
### Return Type
Recall that executing the `GetGlossaryNoteForUserTerm` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGlossaryNoteForUserTermData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetGlossaryNoteForUserTermData {
  glossaryNotes: ({
    id: UUIDString;
    note: string;
    updatedAt: DateString;
  } & GlossaryNote_Key)[];
}
```
### Using `GetGlossaryNoteForUserTerm`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGlossaryNoteForUserTerm, GetGlossaryNoteForUserTermVariables } from '@impact26/dataconnect-sdk';

// The `GetGlossaryNoteForUserTerm` query requires an argument of type `GetGlossaryNoteForUserTermVariables`:
const getGlossaryNoteForUserTermVars: GetGlossaryNoteForUserTermVariables = {
  userId: ..., 
  termId: ..., 
};

// Call the `getGlossaryNoteForUserTerm()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGlossaryNoteForUserTerm(getGlossaryNoteForUserTermVars);
// Variables can be defined inline as well.
const { data } = await getGlossaryNoteForUserTerm({ userId: ..., termId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGlossaryNoteForUserTerm(dataConnect, getGlossaryNoteForUserTermVars);

console.log(data.glossaryNotes);

// Or, you can use the `Promise` API.
getGlossaryNoteForUserTerm(getGlossaryNoteForUserTermVars).then((response) => {
  const data = response.data;
  console.log(data.glossaryNotes);
});
```

### Using `GetGlossaryNoteForUserTerm`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGlossaryNoteForUserTermRef, GetGlossaryNoteForUserTermVariables } from '@impact26/dataconnect-sdk';

// The `GetGlossaryNoteForUserTerm` query requires an argument of type `GetGlossaryNoteForUserTermVariables`:
const getGlossaryNoteForUserTermVars: GetGlossaryNoteForUserTermVariables = {
  userId: ..., 
  termId: ..., 
};

// Call the `getGlossaryNoteForUserTermRef()` function to get a reference to the query.
const ref = getGlossaryNoteForUserTermRef(getGlossaryNoteForUserTermVars);
// Variables can be defined inline as well.
const ref = getGlossaryNoteForUserTermRef({ userId: ..., termId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGlossaryNoteForUserTermRef(dataConnect, getGlossaryNoteForUserTermVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.glossaryNotes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryNotes);
});
```

## GetLessonNotesForUser
You can execute the `GetLessonNotesForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLessonNotesForUser(vars: GetLessonNotesForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonNotesForUserData, GetLessonNotesForUserVariables>;

interface GetLessonNotesForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonNotesForUserVariables): QueryRef<GetLessonNotesForUserData, GetLessonNotesForUserVariables>;
}
export const getLessonNotesForUserRef: GetLessonNotesForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLessonNotesForUser(dc: DataConnect, vars: GetLessonNotesForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonNotesForUserData, GetLessonNotesForUserVariables>;

interface GetLessonNotesForUserRef {
  ...
  (dc: DataConnect, vars: GetLessonNotesForUserVariables): QueryRef<GetLessonNotesForUserData, GetLessonNotesForUserVariables>;
}
export const getLessonNotesForUserRef: GetLessonNotesForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonNotesForUserRef:
```typescript
const name = getLessonNotesForUserRef.operationName;
console.log(name);
```

### Variables
The `GetLessonNotesForUser` query requires an argument of type `GetLessonNotesForUserVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLessonNotesForUserVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetLessonNotesForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonNotesForUserData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonNotesForUserData {
  lessonNotes: ({
    id: UUIDString;
    lessonId?: UUIDString | null;
    lessonTitle?: string | null;
    content: string;
    createdAt: DateString;
    updatedAt: DateString;
  } & LessonNote_Key)[];
}
```
### Using `GetLessonNotesForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLessonNotesForUser, GetLessonNotesForUserVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonNotesForUser` query requires an argument of type `GetLessonNotesForUserVariables`:
const getLessonNotesForUserVars: GetLessonNotesForUserVariables = {
  userId: ..., 
};

// Call the `getLessonNotesForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLessonNotesForUser(getLessonNotesForUserVars);
// Variables can be defined inline as well.
const { data } = await getLessonNotesForUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLessonNotesForUser(dataConnect, getLessonNotesForUserVars);

console.log(data.lessonNotes);

// Or, you can use the `Promise` API.
getLessonNotesForUser(getLessonNotesForUserVars).then((response) => {
  const data = response.data;
  console.log(data.lessonNotes);
});
```

### Using `GetLessonNotesForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonNotesForUserRef, GetLessonNotesForUserVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonNotesForUser` query requires an argument of type `GetLessonNotesForUserVariables`:
const getLessonNotesForUserVars: GetLessonNotesForUserVariables = {
  userId: ..., 
};

// Call the `getLessonNotesForUserRef()` function to get a reference to the query.
const ref = getLessonNotesForUserRef(getLessonNotesForUserVars);
// Variables can be defined inline as well.
const ref = getLessonNotesForUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonNotesForUserRef(dataConnect, getLessonNotesForUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.lessonNotes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonNotes);
});
```

## GetLessonNoteForUserLesson
You can execute the `GetLessonNoteForUserLesson` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLessonNoteForUserLesson(vars: GetLessonNoteForUserLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonNoteForUserLessonData, GetLessonNoteForUserLessonVariables>;

interface GetLessonNoteForUserLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonNoteForUserLessonVariables): QueryRef<GetLessonNoteForUserLessonData, GetLessonNoteForUserLessonVariables>;
}
export const getLessonNoteForUserLessonRef: GetLessonNoteForUserLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLessonNoteForUserLesson(dc: DataConnect, vars: GetLessonNoteForUserLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonNoteForUserLessonData, GetLessonNoteForUserLessonVariables>;

interface GetLessonNoteForUserLessonRef {
  ...
  (dc: DataConnect, vars: GetLessonNoteForUserLessonVariables): QueryRef<GetLessonNoteForUserLessonData, GetLessonNoteForUserLessonVariables>;
}
export const getLessonNoteForUserLessonRef: GetLessonNoteForUserLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLessonNoteForUserLessonRef:
```typescript
const name = getLessonNoteForUserLessonRef.operationName;
console.log(name);
```

### Variables
The `GetLessonNoteForUserLesson` query requires an argument of type `GetLessonNoteForUserLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLessonNoteForUserLessonVariables {
  userId: string;
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLessonNoteForUserLesson` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLessonNoteForUserLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLessonNoteForUserLessonData {
  lessonNotes: ({
    id: UUIDString;
    content: string;
    updatedAt: DateString;
  } & LessonNote_Key)[];
}
```
### Using `GetLessonNoteForUserLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLessonNoteForUserLesson, GetLessonNoteForUserLessonVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonNoteForUserLesson` query requires an argument of type `GetLessonNoteForUserLessonVariables`:
const getLessonNoteForUserLessonVars: GetLessonNoteForUserLessonVariables = {
  userId: ..., 
  lessonId: ..., 
};

// Call the `getLessonNoteForUserLesson()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLessonNoteForUserLesson(getLessonNoteForUserLessonVars);
// Variables can be defined inline as well.
const { data } = await getLessonNoteForUserLesson({ userId: ..., lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLessonNoteForUserLesson(dataConnect, getLessonNoteForUserLessonVars);

console.log(data.lessonNotes);

// Or, you can use the `Promise` API.
getLessonNoteForUserLesson(getLessonNoteForUserLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lessonNotes);
});
```

### Using `GetLessonNoteForUserLesson`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLessonNoteForUserLessonRef, GetLessonNoteForUserLessonVariables } from '@impact26/dataconnect-sdk';

// The `GetLessonNoteForUserLesson` query requires an argument of type `GetLessonNoteForUserLessonVariables`:
const getLessonNoteForUserLessonVars: GetLessonNoteForUserLessonVariables = {
  userId: ..., 
  lessonId: ..., 
};

// Call the `getLessonNoteForUserLessonRef()` function to get a reference to the query.
const ref = getLessonNoteForUserLessonRef(getLessonNoteForUserLessonVars);
// Variables can be defined inline as well.
const ref = getLessonNoteForUserLessonRef({ userId: ..., lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLessonNoteForUserLessonRef(dataConnect, getLessonNoteForUserLessonVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.lessonNotes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonNotes);
});
```

## GetUserFavorites
You can execute the `GetUserFavorites` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserFavorites(vars: GetUserFavoritesVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserFavoritesData, GetUserFavoritesVariables>;

interface GetUserFavoritesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserFavoritesVariables): QueryRef<GetUserFavoritesData, GetUserFavoritesVariables>;
}
export const getUserFavoritesRef: GetUserFavoritesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserFavorites(dc: DataConnect, vars: GetUserFavoritesVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserFavoritesData, GetUserFavoritesVariables>;

interface GetUserFavoritesRef {
  ...
  (dc: DataConnect, vars: GetUserFavoritesVariables): QueryRef<GetUserFavoritesData, GetUserFavoritesVariables>;
}
export const getUserFavoritesRef: GetUserFavoritesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserFavoritesRef:
```typescript
const name = getUserFavoritesRef.operationName;
console.log(name);
```

### Variables
The `GetUserFavorites` query requires an argument of type `GetUserFavoritesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserFavoritesVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserFavorites` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserFavoritesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserFavoritesData {
  userFavorites: ({
    itemType: string;
    itemId: string;
    createdAt: DateString;
  })[];
}
```
### Using `GetUserFavorites`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserFavorites, GetUserFavoritesVariables } from '@impact26/dataconnect-sdk';

// The `GetUserFavorites` query requires an argument of type `GetUserFavoritesVariables`:
const getUserFavoritesVars: GetUserFavoritesVariables = {
  userId: ..., 
};

// Call the `getUserFavorites()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserFavorites(getUserFavoritesVars);
// Variables can be defined inline as well.
const { data } = await getUserFavorites({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserFavorites(dataConnect, getUserFavoritesVars);

console.log(data.userFavorites);

// Or, you can use the `Promise` API.
getUserFavorites(getUserFavoritesVars).then((response) => {
  const data = response.data;
  console.log(data.userFavorites);
});
```

### Using `GetUserFavorites`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserFavoritesRef, GetUserFavoritesVariables } from '@impact26/dataconnect-sdk';

// The `GetUserFavorites` query requires an argument of type `GetUserFavoritesVariables`:
const getUserFavoritesVars: GetUserFavoritesVariables = {
  userId: ..., 
};

// Call the `getUserFavoritesRef()` function to get a reference to the query.
const ref = getUserFavoritesRef(getUserFavoritesVars);
// Variables can be defined inline as well.
const ref = getUserFavoritesRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserFavoritesRef(dataConnect, getUserFavoritesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userFavorites);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userFavorites);
});
```

## GetUserFavoritesByType
You can execute the `GetUserFavoritesByType` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserFavoritesByType(vars: GetUserFavoritesByTypeVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserFavoritesByTypeData, GetUserFavoritesByTypeVariables>;

interface GetUserFavoritesByTypeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserFavoritesByTypeVariables): QueryRef<GetUserFavoritesByTypeData, GetUserFavoritesByTypeVariables>;
}
export const getUserFavoritesByTypeRef: GetUserFavoritesByTypeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserFavoritesByType(dc: DataConnect, vars: GetUserFavoritesByTypeVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserFavoritesByTypeData, GetUserFavoritesByTypeVariables>;

interface GetUserFavoritesByTypeRef {
  ...
  (dc: DataConnect, vars: GetUserFavoritesByTypeVariables): QueryRef<GetUserFavoritesByTypeData, GetUserFavoritesByTypeVariables>;
}
export const getUserFavoritesByTypeRef: GetUserFavoritesByTypeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserFavoritesByTypeRef:
```typescript
const name = getUserFavoritesByTypeRef.operationName;
console.log(name);
```

### Variables
The `GetUserFavoritesByType` query requires an argument of type `GetUserFavoritesByTypeVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserFavoritesByTypeVariables {
  userId: string;
  itemType: string;
}
```
### Return Type
Recall that executing the `GetUserFavoritesByType` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserFavoritesByTypeData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserFavoritesByTypeData {
  userFavorites: ({
    itemType: string;
    itemId: string;
    createdAt: DateString;
  })[];
}
```
### Using `GetUserFavoritesByType`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserFavoritesByType, GetUserFavoritesByTypeVariables } from '@impact26/dataconnect-sdk';

// The `GetUserFavoritesByType` query requires an argument of type `GetUserFavoritesByTypeVariables`:
const getUserFavoritesByTypeVars: GetUserFavoritesByTypeVariables = {
  userId: ..., 
  itemType: ..., 
};

// Call the `getUserFavoritesByType()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserFavoritesByType(getUserFavoritesByTypeVars);
// Variables can be defined inline as well.
const { data } = await getUserFavoritesByType({ userId: ..., itemType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserFavoritesByType(dataConnect, getUserFavoritesByTypeVars);

console.log(data.userFavorites);

// Or, you can use the `Promise` API.
getUserFavoritesByType(getUserFavoritesByTypeVars).then((response) => {
  const data = response.data;
  console.log(data.userFavorites);
});
```

### Using `GetUserFavoritesByType`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserFavoritesByTypeRef, GetUserFavoritesByTypeVariables } from '@impact26/dataconnect-sdk';

// The `GetUserFavoritesByType` query requires an argument of type `GetUserFavoritesByTypeVariables`:
const getUserFavoritesByTypeVars: GetUserFavoritesByTypeVariables = {
  userId: ..., 
  itemType: ..., 
};

// Call the `getUserFavoritesByTypeRef()` function to get a reference to the query.
const ref = getUserFavoritesByTypeRef(getUserFavoritesByTypeVars);
// Variables can be defined inline as well.
const ref = getUserFavoritesByTypeRef({ userId: ..., itemType: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserFavoritesByTypeRef(dataConnect, getUserFavoritesByTypeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userFavorites);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userFavorites);
});
```

## ListCustomDomains
You can execute the `ListCustomDomains` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listCustomDomains(options?: ExecuteQueryOptions): QueryPromise<ListCustomDomainsData, undefined>;

interface ListCustomDomainsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCustomDomainsData, undefined>;
}
export const listCustomDomainsRef: ListCustomDomainsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCustomDomains(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCustomDomainsData, undefined>;

interface ListCustomDomainsRef {
  ...
  (dc: DataConnect): QueryRef<ListCustomDomainsData, undefined>;
}
export const listCustomDomainsRef: ListCustomDomainsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCustomDomainsRef:
```typescript
const name = listCustomDomainsRef.operationName;
console.log(name);
```

### Variables
The `ListCustomDomains` query has no variables.
### Return Type
Recall that executing the `ListCustomDomains` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCustomDomainsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCustomDomainsData {
  customDomains: ({
    id: UUIDString;
    name: string;
  } & CustomDomain_Key)[];
}
```
### Using `ListCustomDomains`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCustomDomains } from '@impact26/dataconnect-sdk';


// Call the `listCustomDomains()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCustomDomains();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCustomDomains(dataConnect);

console.log(data.customDomains);

// Or, you can use the `Promise` API.
listCustomDomains().then((response) => {
  const data = response.data;
  console.log(data.customDomains);
});
```

### Using `ListCustomDomains`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCustomDomainsRef } from '@impact26/dataconnect-sdk';


// Call the `listCustomDomainsRef()` function to get a reference to the query.
const ref = listCustomDomainsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCustomDomainsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.customDomains);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.customDomains);
});
```

## AdminListCohorts
You can execute the `AdminListCohorts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListCohorts(options?: ExecuteQueryOptions): QueryPromise<AdminListCohortsData, undefined>;

interface AdminListCohortsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListCohortsData, undefined>;
}
export const adminListCohortsRef: AdminListCohortsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListCohorts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListCohortsData, undefined>;

interface AdminListCohortsRef {
  ...
  (dc: DataConnect): QueryRef<AdminListCohortsData, undefined>;
}
export const adminListCohortsRef: AdminListCohortsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListCohortsRef:
```typescript
const name = adminListCohortsRef.operationName;
console.log(name);
```

### Variables
The `AdminListCohorts` query has no variables.
### Return Type
Recall that executing the `AdminListCohorts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListCohortsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListCohortsData {
  cohorts: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    archivedAt?: DateString | null;
    createdAt: DateString;
    updatedAt: DateString;
    createdBy: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      cohortMemberships_on_cohort: ({
        user: {
          id: string;
        } & User_Key;
      })[];
        cohortInstructors_on_cohort: ({
          instructor: {
            id: string;
          } & User_Key;
        })[];
  } & Cohort_Key)[];
}
```
### Using `AdminListCohorts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListCohorts } from '@impact26/dataconnect-sdk';


// Call the `adminListCohorts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListCohorts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListCohorts(dataConnect);

console.log(data.cohorts);

// Or, you can use the `Promise` API.
adminListCohorts().then((response) => {
  const data = response.data;
  console.log(data.cohorts);
});
```

### Using `AdminListCohorts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListCohortsRef } from '@impact26/dataconnect-sdk';


// Call the `adminListCohortsRef()` function to get a reference to the query.
const ref = adminListCohortsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListCohortsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.cohorts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.cohorts);
});
```

## ListCohortsForInstructor
You can execute the `ListCohortsForInstructor` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listCohortsForInstructor(vars: ListCohortsForInstructorVariables, options?: ExecuteQueryOptions): QueryPromise<ListCohortsForInstructorData, ListCohortsForInstructorVariables>;

interface ListCohortsForInstructorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCohortsForInstructorVariables): QueryRef<ListCohortsForInstructorData, ListCohortsForInstructorVariables>;
}
export const listCohortsForInstructorRef: ListCohortsForInstructorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCohortsForInstructor(dc: DataConnect, vars: ListCohortsForInstructorVariables, options?: ExecuteQueryOptions): QueryPromise<ListCohortsForInstructorData, ListCohortsForInstructorVariables>;

interface ListCohortsForInstructorRef {
  ...
  (dc: DataConnect, vars: ListCohortsForInstructorVariables): QueryRef<ListCohortsForInstructorData, ListCohortsForInstructorVariables>;
}
export const listCohortsForInstructorRef: ListCohortsForInstructorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCohortsForInstructorRef:
```typescript
const name = listCohortsForInstructorRef.operationName;
console.log(name);
```

### Variables
The `ListCohortsForInstructor` query requires an argument of type `ListCohortsForInstructorVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCohortsForInstructorVariables {
  instructorId: string;
}
```
### Return Type
Recall that executing the `ListCohortsForInstructor` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCohortsForInstructorData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCohortsForInstructorData {
  cohorts: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    archivedAt?: DateString | null;
    createdAt: DateString;
    updatedAt: DateString;
    createdBy: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      cohortMemberships_on_cohort: ({
        user: {
          id: string;
        } & User_Key;
      })[];
        cohortInstructors_on_cohort: ({
          instructor: {
            id: string;
          } & User_Key;
        })[];
  } & Cohort_Key)[];
    cohortInstructors: ({
      cohort: {
        id: UUIDString;
        name: string;
        description?: string | null;
        archivedAt?: DateString | null;
        createdAt: DateString;
        updatedAt: DateString;
        createdBy: {
          id: string;
          email: string;
          fullName?: string | null;
        } & User_Key;
          cohortMemberships_on_cohort: ({
            user: {
              id: string;
            } & User_Key;
          })[];
            cohortInstructors_on_cohort: ({
              instructor: {
                id: string;
              } & User_Key;
            })[];
      } & Cohort_Key;
    })[];
}
```
### Using `ListCohortsForInstructor`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCohortsForInstructor, ListCohortsForInstructorVariables } from '@impact26/dataconnect-sdk';

// The `ListCohortsForInstructor` query requires an argument of type `ListCohortsForInstructorVariables`:
const listCohortsForInstructorVars: ListCohortsForInstructorVariables = {
  instructorId: ..., 
};

// Call the `listCohortsForInstructor()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCohortsForInstructor(listCohortsForInstructorVars);
// Variables can be defined inline as well.
const { data } = await listCohortsForInstructor({ instructorId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCohortsForInstructor(dataConnect, listCohortsForInstructorVars);

console.log(data.cohorts);
console.log(data.cohortInstructors);

// Or, you can use the `Promise` API.
listCohortsForInstructor(listCohortsForInstructorVars).then((response) => {
  const data = response.data;
  console.log(data.cohorts);
  console.log(data.cohortInstructors);
});
```

### Using `ListCohortsForInstructor`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCohortsForInstructorRef, ListCohortsForInstructorVariables } from '@impact26/dataconnect-sdk';

// The `ListCohortsForInstructor` query requires an argument of type `ListCohortsForInstructorVariables`:
const listCohortsForInstructorVars: ListCohortsForInstructorVariables = {
  instructorId: ..., 
};

// Call the `listCohortsForInstructorRef()` function to get a reference to the query.
const ref = listCohortsForInstructorRef(listCohortsForInstructorVars);
// Variables can be defined inline as well.
const ref = listCohortsForInstructorRef({ instructorId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCohortsForInstructorRef(dataConnect, listCohortsForInstructorVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.cohorts);
console.log(data.cohortInstructors);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.cohorts);
  console.log(data.cohortInstructors);
});
```

## GetCohortDetail
You can execute the `GetCohortDetail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getCohortDetail(vars: GetCohortDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetCohortDetailData, GetCohortDetailVariables>;

interface GetCohortDetailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCohortDetailVariables): QueryRef<GetCohortDetailData, GetCohortDetailVariables>;
}
export const getCohortDetailRef: GetCohortDetailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCohortDetail(dc: DataConnect, vars: GetCohortDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetCohortDetailData, GetCohortDetailVariables>;

interface GetCohortDetailRef {
  ...
  (dc: DataConnect, vars: GetCohortDetailVariables): QueryRef<GetCohortDetailData, GetCohortDetailVariables>;
}
export const getCohortDetailRef: GetCohortDetailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCohortDetailRef:
```typescript
const name = getCohortDetailRef.operationName;
console.log(name);
```

### Variables
The `GetCohortDetail` query requires an argument of type `GetCohortDetailVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCohortDetailVariables {
  cohortId: UUIDString;
}
```
### Return Type
Recall that executing the `GetCohortDetail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCohortDetailData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCohortDetailData {
  cohort?: {
    id: UUIDString;
    name: string;
    description?: string | null;
    archivedAt?: DateString | null;
    createdAt: DateString;
    updatedAt: DateString;
    createdBy: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
  } & Cohort_Key;
    cohortMemberships: ({
      joinedAt: DateString;
      user: {
        id: string;
        email: string;
        fullName?: string | null;
        role: string;
      } & User_Key;
    })[];
      cohortInstructors: ({
        assignedAt: DateString;
        instructor: {
          id: string;
          email: string;
          fullName?: string | null;
          role: string;
        } & User_Key;
      })[];
}
```
### Using `GetCohortDetail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCohortDetail, GetCohortDetailVariables } from '@impact26/dataconnect-sdk';

// The `GetCohortDetail` query requires an argument of type `GetCohortDetailVariables`:
const getCohortDetailVars: GetCohortDetailVariables = {
  cohortId: ..., 
};

// Call the `getCohortDetail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCohortDetail(getCohortDetailVars);
// Variables can be defined inline as well.
const { data } = await getCohortDetail({ cohortId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCohortDetail(dataConnect, getCohortDetailVars);

console.log(data.cohort);
console.log(data.cohortMemberships);
console.log(data.cohortInstructors);

// Or, you can use the `Promise` API.
getCohortDetail(getCohortDetailVars).then((response) => {
  const data = response.data;
  console.log(data.cohort);
  console.log(data.cohortMemberships);
  console.log(data.cohortInstructors);
});
```

### Using `GetCohortDetail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCohortDetailRef, GetCohortDetailVariables } from '@impact26/dataconnect-sdk';

// The `GetCohortDetail` query requires an argument of type `GetCohortDetailVariables`:
const getCohortDetailVars: GetCohortDetailVariables = {
  cohortId: ..., 
};

// Call the `getCohortDetailRef()` function to get a reference to the query.
const ref = getCohortDetailRef(getCohortDetailVars);
// Variables can be defined inline as well.
const ref = getCohortDetailRef({ cohortId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCohortDetailRef(dataConnect, getCohortDetailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.cohort);
console.log(data.cohortMemberships);
console.log(data.cohortInstructors);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.cohort);
  console.log(data.cohortMemberships);
  console.log(data.cohortInstructors);
});
```

## GetCohortMemberIds
You can execute the `GetCohortMemberIds` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getCohortMemberIds(vars: GetCohortMemberIdsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCohortMemberIdsData, GetCohortMemberIdsVariables>;

interface GetCohortMemberIdsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCohortMemberIdsVariables): QueryRef<GetCohortMemberIdsData, GetCohortMemberIdsVariables>;
}
export const getCohortMemberIdsRef: GetCohortMemberIdsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCohortMemberIds(dc: DataConnect, vars: GetCohortMemberIdsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCohortMemberIdsData, GetCohortMemberIdsVariables>;

interface GetCohortMemberIdsRef {
  ...
  (dc: DataConnect, vars: GetCohortMemberIdsVariables): QueryRef<GetCohortMemberIdsData, GetCohortMemberIdsVariables>;
}
export const getCohortMemberIdsRef: GetCohortMemberIdsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCohortMemberIdsRef:
```typescript
const name = getCohortMemberIdsRef.operationName;
console.log(name);
```

### Variables
The `GetCohortMemberIds` query requires an argument of type `GetCohortMemberIdsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCohortMemberIdsVariables {
  cohortId: UUIDString;
}
```
### Return Type
Recall that executing the `GetCohortMemberIds` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCohortMemberIdsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCohortMemberIdsData {
  cohortMemberships: ({
    user: {
      id: string;
    } & User_Key;
  })[];
}
```
### Using `GetCohortMemberIds`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCohortMemberIds, GetCohortMemberIdsVariables } from '@impact26/dataconnect-sdk';

// The `GetCohortMemberIds` query requires an argument of type `GetCohortMemberIdsVariables`:
const getCohortMemberIdsVars: GetCohortMemberIdsVariables = {
  cohortId: ..., 
};

// Call the `getCohortMemberIds()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCohortMemberIds(getCohortMemberIdsVars);
// Variables can be defined inline as well.
const { data } = await getCohortMemberIds({ cohortId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCohortMemberIds(dataConnect, getCohortMemberIdsVars);

console.log(data.cohortMemberships);

// Or, you can use the `Promise` API.
getCohortMemberIds(getCohortMemberIdsVars).then((response) => {
  const data = response.data;
  console.log(data.cohortMemberships);
});
```

### Using `GetCohortMemberIds`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCohortMemberIdsRef, GetCohortMemberIdsVariables } from '@impact26/dataconnect-sdk';

// The `GetCohortMemberIds` query requires an argument of type `GetCohortMemberIdsVariables`:
const getCohortMemberIdsVars: GetCohortMemberIdsVariables = {
  cohortId: ..., 
};

// Call the `getCohortMemberIdsRef()` function to get a reference to the query.
const ref = getCohortMemberIdsRef(getCohortMemberIdsVars);
// Variables can be defined inline as well.
const ref = getCohortMemberIdsRef({ cohortId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCohortMemberIdsRef(dataConnect, getCohortMemberIdsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.cohortMemberships);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.cohortMemberships);
});
```

## GetCohortAttempts
You can execute the `GetCohortAttempts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getCohortAttempts(vars: GetCohortAttemptsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCohortAttemptsData, GetCohortAttemptsVariables>;

interface GetCohortAttemptsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCohortAttemptsVariables): QueryRef<GetCohortAttemptsData, GetCohortAttemptsVariables>;
}
export const getCohortAttemptsRef: GetCohortAttemptsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCohortAttempts(dc: DataConnect, vars: GetCohortAttemptsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCohortAttemptsData, GetCohortAttemptsVariables>;

interface GetCohortAttemptsRef {
  ...
  (dc: DataConnect, vars: GetCohortAttemptsVariables): QueryRef<GetCohortAttemptsData, GetCohortAttemptsVariables>;
}
export const getCohortAttemptsRef: GetCohortAttemptsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCohortAttemptsRef:
```typescript
const name = getCohortAttemptsRef.operationName;
console.log(name);
```

### Variables
The `GetCohortAttempts` query requires an argument of type `GetCohortAttemptsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCohortAttemptsVariables {
  userIds: string[];
}
```
### Return Type
Recall that executing the `GetCohortAttempts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCohortAttemptsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCohortAttemptsData {
  quizAttempts: ({
    id: UUIDString;
    user: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      quiz: {
        id: UUIDString;
        title: string;
      } & Quiz_Key;
        scorePct?: number | null;
        passed?: boolean | null;
        completedAt?: DateString | null;
        quizResponses_on_attempt: ({
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          question: {
            id: UUIDString;
            domain: string;
            difficulty: string;
            questionText: string;
            topicTags?: string | null;
          } & Question_Key;
        })[];
  } & QuizAttempt_Key)[];
}
```
### Using `GetCohortAttempts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCohortAttempts, GetCohortAttemptsVariables } from '@impact26/dataconnect-sdk';

// The `GetCohortAttempts` query requires an argument of type `GetCohortAttemptsVariables`:
const getCohortAttemptsVars: GetCohortAttemptsVariables = {
  userIds: ..., 
};

// Call the `getCohortAttempts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCohortAttempts(getCohortAttemptsVars);
// Variables can be defined inline as well.
const { data } = await getCohortAttempts({ userIds: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCohortAttempts(dataConnect, getCohortAttemptsVars);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
getCohortAttempts(getCohortAttemptsVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

### Using `GetCohortAttempts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCohortAttemptsRef, GetCohortAttemptsVariables } from '@impact26/dataconnect-sdk';

// The `GetCohortAttempts` query requires an argument of type `GetCohortAttemptsVariables`:
const getCohortAttemptsVars: GetCohortAttemptsVariables = {
  userIds: ..., 
};

// Call the `getCohortAttemptsRef()` function to get a reference to the query.
const ref = getCohortAttemptsRef(getCohortAttemptsVars);
// Variables can be defined inline as well.
const ref = getCohortAttemptsRef({ userIds: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCohortAttemptsRef(dataConnect, getCohortAttemptsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempts);
});
```

## GetCohortEngagement
You can execute the `GetCohortEngagement` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getCohortEngagement(vars: GetCohortEngagementVariables, options?: ExecuteQueryOptions): QueryPromise<GetCohortEngagementData, GetCohortEngagementVariables>;

interface GetCohortEngagementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCohortEngagementVariables): QueryRef<GetCohortEngagementData, GetCohortEngagementVariables>;
}
export const getCohortEngagementRef: GetCohortEngagementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCohortEngagement(dc: DataConnect, vars: GetCohortEngagementVariables, options?: ExecuteQueryOptions): QueryPromise<GetCohortEngagementData, GetCohortEngagementVariables>;

interface GetCohortEngagementRef {
  ...
  (dc: DataConnect, vars: GetCohortEngagementVariables): QueryRef<GetCohortEngagementData, GetCohortEngagementVariables>;
}
export const getCohortEngagementRef: GetCohortEngagementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCohortEngagementRef:
```typescript
const name = getCohortEngagementRef.operationName;
console.log(name);
```

### Variables
The `GetCohortEngagement` query requires an argument of type `GetCohortEngagementVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCohortEngagementVariables {
  userIds: string[];
}
```
### Return Type
Recall that executing the `GetCohortEngagement` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCohortEngagementData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCohortEngagementData {
  userCourseProgresses: ({
    user: {
      id: string;
    } & User_Key;
      course: {
        id: UUIDString;
        title: string;
      } & Course_Key;
        enrolledAt: DateString;
        completedAt?: DateString | null;
        lastAccessedAt?: DateString | null;
  })[];
    userLessonProgresses: ({
      user: {
        id: string;
      } & User_Key;
        lesson: {
          id: UUIDString;
        } & Lesson_Key;
          status: string;
          completedAt?: DateString | null;
    })[];
      dailyActivities: ({
        user: {
          id: string;
        } & User_Key;
          activityDate: string;
          lastActivityAt: DateString;
      })[];
}
```
### Using `GetCohortEngagement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCohortEngagement, GetCohortEngagementVariables } from '@impact26/dataconnect-sdk';

// The `GetCohortEngagement` query requires an argument of type `GetCohortEngagementVariables`:
const getCohortEngagementVars: GetCohortEngagementVariables = {
  userIds: ..., 
};

// Call the `getCohortEngagement()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCohortEngagement(getCohortEngagementVars);
// Variables can be defined inline as well.
const { data } = await getCohortEngagement({ userIds: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCohortEngagement(dataConnect, getCohortEngagementVars);

console.log(data.userCourseProgresses);
console.log(data.userLessonProgresses);
console.log(data.dailyActivities);

// Or, you can use the `Promise` API.
getCohortEngagement(getCohortEngagementVars).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgresses);
  console.log(data.userLessonProgresses);
  console.log(data.dailyActivities);
});
```

### Using `GetCohortEngagement`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCohortEngagementRef, GetCohortEngagementVariables } from '@impact26/dataconnect-sdk';

// The `GetCohortEngagement` query requires an argument of type `GetCohortEngagementVariables`:
const getCohortEngagementVars: GetCohortEngagementVariables = {
  userIds: ..., 
};

// Call the `getCohortEngagementRef()` function to get a reference to the query.
const ref = getCohortEngagementRef(getCohortEngagementVars);
// Variables can be defined inline as well.
const ref = getCohortEngagementRef({ userIds: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCohortEngagementRef(dataConnect, getCohortEngagementVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userCourseProgresses);
console.log(data.userLessonProgresses);
console.log(data.dailyActivities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgresses);
  console.log(data.userLessonProgresses);
  console.log(data.dailyActivities);
});
```

## GetLearnerProgressDetail
You can execute the `GetLearnerProgressDetail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getLearnerProgressDetail(vars: GetLearnerProgressDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearnerProgressDetailData, GetLearnerProgressDetailVariables>;

interface GetLearnerProgressDetailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLearnerProgressDetailVariables): QueryRef<GetLearnerProgressDetailData, GetLearnerProgressDetailVariables>;
}
export const getLearnerProgressDetailRef: GetLearnerProgressDetailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLearnerProgressDetail(dc: DataConnect, vars: GetLearnerProgressDetailVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearnerProgressDetailData, GetLearnerProgressDetailVariables>;

interface GetLearnerProgressDetailRef {
  ...
  (dc: DataConnect, vars: GetLearnerProgressDetailVariables): QueryRef<GetLearnerProgressDetailData, GetLearnerProgressDetailVariables>;
}
export const getLearnerProgressDetailRef: GetLearnerProgressDetailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLearnerProgressDetailRef:
```typescript
const name = getLearnerProgressDetailRef.operationName;
console.log(name);
```

### Variables
The `GetLearnerProgressDetail` query requires an argument of type `GetLearnerProgressDetailVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLearnerProgressDetailVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetLearnerProgressDetail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLearnerProgressDetailData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLearnerProgressDetailData {
  users: ({
    id: string;
    email: string;
    fullName?: string | null;
    role: string;
    createdAt: DateString;
  } & User_Key)[];
    quizAttempts: ({
      id: UUIDString;
      quiz: {
        id: UUIDString;
        title: string;
        passingScore?: number | null;
      } & Quiz_Key;
        scorePct?: number | null;
        scoreRaw?: number | null;
        scoreMax?: number | null;
        passed?: boolean | null;
        startedAt: DateString;
        completedAt?: DateString | null;
        quizResponses_on_attempt: ({
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          question: {
            domain: string;
          };
        })[];
    } & QuizAttempt_Key)[];
      userCourseProgresses: ({
        course: {
          id: UUIDString;
          title: string;
        } & Course_Key;
          enrolledAt: DateString;
          completedAt?: DateString | null;
          lastAccessedAt?: DateString | null;
      })[];
        userLessonProgresses: ({
          lesson: {
            id: UUIDString;
          } & Lesson_Key;
            status: string;
            completedAt?: DateString | null;
        })[];
          dailyActivities: ({
            activityDate: string;
            lastActivityAt: DateString;
          })[];
}
```
### Using `GetLearnerProgressDetail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLearnerProgressDetail, GetLearnerProgressDetailVariables } from '@impact26/dataconnect-sdk';

// The `GetLearnerProgressDetail` query requires an argument of type `GetLearnerProgressDetailVariables`:
const getLearnerProgressDetailVars: GetLearnerProgressDetailVariables = {
  userId: ..., 
};

// Call the `getLearnerProgressDetail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLearnerProgressDetail(getLearnerProgressDetailVars);
// Variables can be defined inline as well.
const { data } = await getLearnerProgressDetail({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLearnerProgressDetail(dataConnect, getLearnerProgressDetailVars);

console.log(data.users);
console.log(data.quizAttempts);
console.log(data.userCourseProgresses);
console.log(data.userLessonProgresses);
console.log(data.dailyActivities);

// Or, you can use the `Promise` API.
getLearnerProgressDetail(getLearnerProgressDetailVars).then((response) => {
  const data = response.data;
  console.log(data.users);
  console.log(data.quizAttempts);
  console.log(data.userCourseProgresses);
  console.log(data.userLessonProgresses);
  console.log(data.dailyActivities);
});
```

### Using `GetLearnerProgressDetail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLearnerProgressDetailRef, GetLearnerProgressDetailVariables } from '@impact26/dataconnect-sdk';

// The `GetLearnerProgressDetail` query requires an argument of type `GetLearnerProgressDetailVariables`:
const getLearnerProgressDetailVars: GetLearnerProgressDetailVariables = {
  userId: ..., 
};

// Call the `getLearnerProgressDetailRef()` function to get a reference to the query.
const ref = getLearnerProgressDetailRef(getLearnerProgressDetailVars);
// Variables can be defined inline as well.
const ref = getLearnerProgressDetailRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLearnerProgressDetailRef(dataConnect, getLearnerProgressDetailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);
console.log(data.quizAttempts);
console.log(data.userCourseProgresses);
console.log(data.userLessonProgresses);
console.log(data.dailyActivities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
  console.log(data.quizAttempts);
  console.log(data.userCourseProgresses);
  console.log(data.userLessonProgresses);
  console.log(data.dailyActivities);
});
```

## AdminGetAttemptReview
You can execute the `AdminGetAttemptReview` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminGetAttemptReview(vars: AdminGetAttemptReviewVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetAttemptReviewData, AdminGetAttemptReviewVariables>;

interface AdminGetAttemptReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminGetAttemptReviewVariables): QueryRef<AdminGetAttemptReviewData, AdminGetAttemptReviewVariables>;
}
export const adminGetAttemptReviewRef: AdminGetAttemptReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminGetAttemptReview(dc: DataConnect, vars: AdminGetAttemptReviewVariables, options?: ExecuteQueryOptions): QueryPromise<AdminGetAttemptReviewData, AdminGetAttemptReviewVariables>;

interface AdminGetAttemptReviewRef {
  ...
  (dc: DataConnect, vars: AdminGetAttemptReviewVariables): QueryRef<AdminGetAttemptReviewData, AdminGetAttemptReviewVariables>;
}
export const adminGetAttemptReviewRef: AdminGetAttemptReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminGetAttemptReviewRef:
```typescript
const name = adminGetAttemptReviewRef.operationName;
console.log(name);
```

### Variables
The `AdminGetAttemptReview` query requires an argument of type `AdminGetAttemptReviewVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdminGetAttemptReviewVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `AdminGetAttemptReview` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminGetAttemptReviewData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminGetAttemptReviewData {
  quizAttempt?: {
    id: UUIDString;
    user: {
      id: string;
    } & User_Key;
      quiz: {
        id: UUIDString;
        title: string;
        passingScore?: number | null;
      } & Quiz_Key;
        status: string;
        questionOrder: string;
        scoreRaw?: number | null;
        scoreMax?: number | null;
        scorePct?: number | null;
        passed?: boolean | null;
        startedAt: DateString;
        completedAt?: DateString | null;
  } & QuizAttempt_Key;
    quizResponses: ({
      question: {
        id: UUIDString;
        questionText: string;
        domain: string;
        difficulty: string;
        rationale?: string | null;
        calculation?: string | null;
        sourceRef?: string | null;
        answerChoices_on_question: ({
          letter: string;
          choiceText: string;
          isCorrect: boolean;
          explanation?: string | null;
          position: number;
        })[];
      } & Question_Key;
        selectedLetters: string;
        isCorrect?: boolean | null;
        pointsEarned?: number | null;
        pointsPossible?: number | null;
    })[];
}
```
### Using `AdminGetAttemptReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminGetAttemptReview, AdminGetAttemptReviewVariables } from '@impact26/dataconnect-sdk';

// The `AdminGetAttemptReview` query requires an argument of type `AdminGetAttemptReviewVariables`:
const adminGetAttemptReviewVars: AdminGetAttemptReviewVariables = {
  attemptId: ..., 
};

// Call the `adminGetAttemptReview()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminGetAttemptReview(adminGetAttemptReviewVars);
// Variables can be defined inline as well.
const { data } = await adminGetAttemptReview({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminGetAttemptReview(dataConnect, adminGetAttemptReviewVars);

console.log(data.quizAttempt);
console.log(data.quizResponses);

// Or, you can use the `Promise` API.
adminGetAttemptReview(adminGetAttemptReviewVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
  console.log(data.quizResponses);
});
```

### Using `AdminGetAttemptReview`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminGetAttemptReviewRef, AdminGetAttemptReviewVariables } from '@impact26/dataconnect-sdk';

// The `AdminGetAttemptReview` query requires an argument of type `AdminGetAttemptReviewVariables`:
const adminGetAttemptReviewVars: AdminGetAttemptReviewVariables = {
  attemptId: ..., 
};

// Call the `adminGetAttemptReviewRef()` function to get a reference to the query.
const ref = adminGetAttemptReviewRef(adminGetAttemptReviewVars);
// Variables can be defined inline as well.
const ref = adminGetAttemptReviewRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminGetAttemptReviewRef(dataConnect, adminGetAttemptReviewVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quizAttempt);
console.log(data.quizResponses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt);
  console.log(data.quizResponses);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `impact26-connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  id: string;
  email: string;
  fullName?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@impact26/dataconnect-sdk';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  fullName: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ id: ..., email: ..., fullName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@impact26/dataconnect-sdk';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  fullName: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ id: ..., email: ..., fullName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUserRole
You can execute the `UpdateUserRole` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateUserRole(vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateUserRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
}
export const updateUserRoleRef: UpdateUserRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface UpdateUserRoleRef {
  ...
  (dc: DataConnect, vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
}
export const updateUserRoleRef: UpdateUserRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRoleRef:
```typescript
const name = updateUserRoleRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserRoleVariables {
  id: string;
  role: string;
}
```
### Return Type
Recall that executing the `UpdateUserRole` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserRoleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserRoleData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserRole, UpdateUserRoleVariables } from '@impact26/dataconnect-sdk';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  id: ..., 
  role: ..., 
};

// Call the `updateUserRole()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserRole(updateUserRoleVars);
// Variables can be defined inline as well.
const { data } = await updateUserRole({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserRole(dataConnect, updateUserRoleVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserRole(updateUserRoleVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserRole`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRoleRef, UpdateUserRoleVariables } from '@impact26/dataconnect-sdk';

// The `UpdateUserRole` mutation requires an argument of type `UpdateUserRoleVariables`:
const updateUserRoleVars: UpdateUserRoleVariables = {
  id: ..., 
  role: ..., 
};

// Call the `updateUserRoleRef()` function to get a reference to the mutation.
const ref = updateUserRoleRef(updateUserRoleVars);
// Variables can be defined inline as well.
const ref = updateUserRoleRef({ id: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRoleRef(dataConnect, updateUserRoleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## CreateCourse
You can execute the `CreateCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createCourse(vars: CreateCourseVariables): MutationPromise<CreateCourseData, CreateCourseVariables>;

interface CreateCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCourseVariables): MutationRef<CreateCourseData, CreateCourseVariables>;
}
export const createCourseRef: CreateCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCourse(dc: DataConnect, vars: CreateCourseVariables): MutationPromise<CreateCourseData, CreateCourseVariables>;

interface CreateCourseRef {
  ...
  (dc: DataConnect, vars: CreateCourseVariables): MutationRef<CreateCourseData, CreateCourseVariables>;
}
export const createCourseRef: CreateCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCourseRef:
```typescript
const name = createCourseRef.operationName;
console.log(name);
```

### Variables
The `CreateCourse` mutation requires an argument of type `CreateCourseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCourseVariables {
  id: UUIDString;
  slug: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  createdById: string;
}
```
### Return Type
Recall that executing the `CreateCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCourseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCourseData {
  course_insert: Course_Key;
}
```
### Using `CreateCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCourse, CreateCourseVariables } from '@impact26/dataconnect-sdk';

// The `CreateCourse` mutation requires an argument of type `CreateCourseVariables`:
const createCourseVars: CreateCourseVariables = {
  id: ..., 
  slug: ..., 
  title: ..., 
  description: ..., // optional
  thumbnailUrl: ..., // optional
  createdById: ..., 
};

// Call the `createCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCourse(createCourseVars);
// Variables can be defined inline as well.
const { data } = await createCourse({ id: ..., slug: ..., title: ..., description: ..., thumbnailUrl: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCourse(dataConnect, createCourseVars);

console.log(data.course_insert);

// Or, you can use the `Promise` API.
createCourse(createCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course_insert);
});
```

### Using `CreateCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCourseRef, CreateCourseVariables } from '@impact26/dataconnect-sdk';

// The `CreateCourse` mutation requires an argument of type `CreateCourseVariables`:
const createCourseVars: CreateCourseVariables = {
  id: ..., 
  slug: ..., 
  title: ..., 
  description: ..., // optional
  thumbnailUrl: ..., // optional
  createdById: ..., 
};

// Call the `createCourseRef()` function to get a reference to the mutation.
const ref = createCourseRef(createCourseVars);
// Variables can be defined inline as well.
const ref = createCourseRef({ id: ..., slug: ..., title: ..., description: ..., thumbnailUrl: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCourseRef(dataConnect, createCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_insert);
});
```

## UpdateCourse
You can execute the `UpdateCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateCourse(vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;

interface UpdateCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
}
export const updateCourseRef: UpdateCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCourse(dc: DataConnect, vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;

interface UpdateCourseRef {
  ...
  (dc: DataConnect, vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
}
export const updateCourseRef: UpdateCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCourseRef:
```typescript
const name = updateCourseRef.operationName;
console.log(name);
```

### Variables
The `UpdateCourse` mutation requires an argument of type `UpdateCourseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCourseVariables {
  id: UUIDString;
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  status?: string | null;
  isPublished?: boolean | null;
  updatedById?: string | null;
  publishedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdateCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCourseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCourseData {
  course_update?: Course_Key | null;
}
```
### Using `UpdateCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCourse, UpdateCourseVariables } from '@impact26/dataconnect-sdk';

// The `UpdateCourse` mutation requires an argument of type `UpdateCourseVariables`:
const updateCourseVars: UpdateCourseVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  thumbnailUrl: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCourse(updateCourseVars);
// Variables can be defined inline as well.
const { data } = await updateCourse({ id: ..., title: ..., description: ..., thumbnailUrl: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCourse(dataConnect, updateCourseVars);

console.log(data.course_update);

// Or, you can use the `Promise` API.
updateCourse(updateCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course_update);
});
```

### Using `UpdateCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCourseRef, UpdateCourseVariables } from '@impact26/dataconnect-sdk';

// The `UpdateCourse` mutation requires an argument of type `UpdateCourseVariables`:
const updateCourseVars: UpdateCourseVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  thumbnailUrl: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateCourseRef()` function to get a reference to the mutation.
const ref = updateCourseRef(updateCourseVars);
// Variables can be defined inline as well.
const ref = updateCourseRef({ id: ..., title: ..., description: ..., thumbnailUrl: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCourseRef(dataConnect, updateCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_update);
});
```

## CreateModule
You can execute the `CreateModule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createModule(vars: CreateModuleVariables): MutationPromise<CreateModuleData, CreateModuleVariables>;

interface CreateModuleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateModuleVariables): MutationRef<CreateModuleData, CreateModuleVariables>;
}
export const createModuleRef: CreateModuleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createModule(dc: DataConnect, vars: CreateModuleVariables): MutationPromise<CreateModuleData, CreateModuleVariables>;

interface CreateModuleRef {
  ...
  (dc: DataConnect, vars: CreateModuleVariables): MutationRef<CreateModuleData, CreateModuleVariables>;
}
export const createModuleRef: CreateModuleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createModuleRef:
```typescript
const name = createModuleRef.operationName;
console.log(name);
```

### Variables
The `CreateModule` mutation requires an argument of type `CreateModuleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateModuleVariables {
  id: UUIDString;
  courseId: UUIDString;
  title: string;
  position: number;
}
```
### Return Type
Recall that executing the `CreateModule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateModuleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateModuleData {
  module_insert: Module_Key;
}
```
### Using `CreateModule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createModule, CreateModuleVariables } from '@impact26/dataconnect-sdk';

// The `CreateModule` mutation requires an argument of type `CreateModuleVariables`:
const createModuleVars: CreateModuleVariables = {
  id: ..., 
  courseId: ..., 
  title: ..., 
  position: ..., 
};

// Call the `createModule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createModule(createModuleVars);
// Variables can be defined inline as well.
const { data } = await createModule({ id: ..., courseId: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createModule(dataConnect, createModuleVars);

console.log(data.module_insert);

// Or, you can use the `Promise` API.
createModule(createModuleVars).then((response) => {
  const data = response.data;
  console.log(data.module_insert);
});
```

### Using `CreateModule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createModuleRef, CreateModuleVariables } from '@impact26/dataconnect-sdk';

// The `CreateModule` mutation requires an argument of type `CreateModuleVariables`:
const createModuleVars: CreateModuleVariables = {
  id: ..., 
  courseId: ..., 
  title: ..., 
  position: ..., 
};

// Call the `createModuleRef()` function to get a reference to the mutation.
const ref = createModuleRef(createModuleVars);
// Variables can be defined inline as well.
const ref = createModuleRef({ id: ..., courseId: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createModuleRef(dataConnect, createModuleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.module_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.module_insert);
});
```

## UpdateModule
You can execute the `UpdateModule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateModule(vars: UpdateModuleVariables): MutationPromise<UpdateModuleData, UpdateModuleVariables>;

interface UpdateModuleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateModuleVariables): MutationRef<UpdateModuleData, UpdateModuleVariables>;
}
export const updateModuleRef: UpdateModuleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateModule(dc: DataConnect, vars: UpdateModuleVariables): MutationPromise<UpdateModuleData, UpdateModuleVariables>;

interface UpdateModuleRef {
  ...
  (dc: DataConnect, vars: UpdateModuleVariables): MutationRef<UpdateModuleData, UpdateModuleVariables>;
}
export const updateModuleRef: UpdateModuleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateModuleRef:
```typescript
const name = updateModuleRef.operationName;
console.log(name);
```

### Variables
The `UpdateModule` mutation requires an argument of type `UpdateModuleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateModuleVariables {
  id: UUIDString;
  title?: string | null;
  description?: string | null;
  learningObjectives?: string | null;
  prerequisiteModuleIds?: string | null;
  position?: number | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateModule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateModuleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateModuleData {
  module_update?: Module_Key | null;
}
```
### Using `UpdateModule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateModule, UpdateModuleVariables } from '@impact26/dataconnect-sdk';

// The `UpdateModule` mutation requires an argument of type `UpdateModuleVariables`:
const updateModuleVars: UpdateModuleVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  learningObjectives: ..., // optional
  prerequisiteModuleIds: ..., // optional
  position: ..., // optional
  status: ..., // optional
};

// Call the `updateModule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateModule(updateModuleVars);
// Variables can be defined inline as well.
const { data } = await updateModule({ id: ..., title: ..., description: ..., learningObjectives: ..., prerequisiteModuleIds: ..., position: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateModule(dataConnect, updateModuleVars);

console.log(data.module_update);

// Or, you can use the `Promise` API.
updateModule(updateModuleVars).then((response) => {
  const data = response.data;
  console.log(data.module_update);
});
```

### Using `UpdateModule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateModuleRef, UpdateModuleVariables } from '@impact26/dataconnect-sdk';

// The `UpdateModule` mutation requires an argument of type `UpdateModuleVariables`:
const updateModuleVars: UpdateModuleVariables = {
  id: ..., 
  title: ..., // optional
  description: ..., // optional
  learningObjectives: ..., // optional
  prerequisiteModuleIds: ..., // optional
  position: ..., // optional
  status: ..., // optional
};

// Call the `updateModuleRef()` function to get a reference to the mutation.
const ref = updateModuleRef(updateModuleVars);
// Variables can be defined inline as well.
const ref = updateModuleRef({ id: ..., title: ..., description: ..., learningObjectives: ..., prerequisiteModuleIds: ..., position: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateModuleRef(dataConnect, updateModuleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.module_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.module_update);
});
```

## CreateLessonVersion
You can execute the `CreateLessonVersion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createLessonVersion(vars: CreateLessonVersionVariables): MutationPromise<CreateLessonVersionData, CreateLessonVersionVariables>;

interface CreateLessonVersionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLessonVersionVariables): MutationRef<CreateLessonVersionData, CreateLessonVersionVariables>;
}
export const createLessonVersionRef: CreateLessonVersionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLessonVersion(dc: DataConnect, vars: CreateLessonVersionVariables): MutationPromise<CreateLessonVersionData, CreateLessonVersionVariables>;

interface CreateLessonVersionRef {
  ...
  (dc: DataConnect, vars: CreateLessonVersionVariables): MutationRef<CreateLessonVersionData, CreateLessonVersionVariables>;
}
export const createLessonVersionRef: CreateLessonVersionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLessonVersionRef:
```typescript
const name = createLessonVersionRef.operationName;
console.log(name);
```

### Variables
The `CreateLessonVersion` mutation requires an argument of type `CreateLessonVersionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateLessonVersionVariables {
  id: UUIDString;
  lessonId: UUIDString;
  contentJson?: string | null;
  videoPlaybackId?: string | null;
  versionNote?: string | null;
  createdById: string;
}
```
### Return Type
Recall that executing the `CreateLessonVersion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLessonVersionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLessonVersionData {
  lessonVersion_insert: LessonVersion_Key;
}
```
### Using `CreateLessonVersion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLessonVersion, CreateLessonVersionVariables } from '@impact26/dataconnect-sdk';

// The `CreateLessonVersion` mutation requires an argument of type `CreateLessonVersionVariables`:
const createLessonVersionVars: CreateLessonVersionVariables = {
  id: ..., 
  lessonId: ..., 
  contentJson: ..., // optional
  videoPlaybackId: ..., // optional
  versionNote: ..., // optional
  createdById: ..., 
};

// Call the `createLessonVersion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLessonVersion(createLessonVersionVars);
// Variables can be defined inline as well.
const { data } = await createLessonVersion({ id: ..., lessonId: ..., contentJson: ..., videoPlaybackId: ..., versionNote: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLessonVersion(dataConnect, createLessonVersionVars);

console.log(data.lessonVersion_insert);

// Or, you can use the `Promise` API.
createLessonVersion(createLessonVersionVars).then((response) => {
  const data = response.data;
  console.log(data.lessonVersion_insert);
});
```

### Using `CreateLessonVersion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLessonVersionRef, CreateLessonVersionVariables } from '@impact26/dataconnect-sdk';

// The `CreateLessonVersion` mutation requires an argument of type `CreateLessonVersionVariables`:
const createLessonVersionVars: CreateLessonVersionVariables = {
  id: ..., 
  lessonId: ..., 
  contentJson: ..., // optional
  videoPlaybackId: ..., // optional
  versionNote: ..., // optional
  createdById: ..., 
};

// Call the `createLessonVersionRef()` function to get a reference to the mutation.
const ref = createLessonVersionRef(createLessonVersionVars);
// Variables can be defined inline as well.
const ref = createLessonVersionRef({ id: ..., lessonId: ..., contentJson: ..., videoPlaybackId: ..., versionNote: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLessonVersionRef(dataConnect, createLessonVersionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lessonVersion_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonVersion_insert);
});
```

## CreateLesson
You can execute the `CreateLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createLesson(vars: CreateLessonVariables): MutationPromise<CreateLessonData, CreateLessonVariables>;

interface CreateLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLessonVariables): MutationRef<CreateLessonData, CreateLessonVariables>;
}
export const createLessonRef: CreateLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLesson(dc: DataConnect, vars: CreateLessonVariables): MutationPromise<CreateLessonData, CreateLessonVariables>;

interface CreateLessonRef {
  ...
  (dc: DataConnect, vars: CreateLessonVariables): MutationRef<CreateLessonData, CreateLessonVariables>;
}
export const createLessonRef: CreateLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLessonRef:
```typescript
const name = createLessonRef.operationName;
console.log(name);
```

### Variables
The `CreateLesson` mutation requires an argument of type `CreateLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateLessonVariables {
  id: UUIDString;
  moduleId: UUIDString;
  title: string;
  position: number;
  lessonType: string;
}
```
### Return Type
Recall that executing the `CreateLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLessonData {
  lesson_insert: Lesson_Key;
}
```
### Using `CreateLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLesson, CreateLessonVariables } from '@impact26/dataconnect-sdk';

// The `CreateLesson` mutation requires an argument of type `CreateLessonVariables`:
const createLessonVars: CreateLessonVariables = {
  id: ..., 
  moduleId: ..., 
  title: ..., 
  position: ..., 
  lessonType: ..., 
};

// Call the `createLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLesson(createLessonVars);
// Variables can be defined inline as well.
const { data } = await createLesson({ id: ..., moduleId: ..., title: ..., position: ..., lessonType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLesson(dataConnect, createLessonVars);

console.log(data.lesson_insert);

// Or, you can use the `Promise` API.
createLesson(createLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lesson_insert);
});
```

### Using `CreateLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLessonRef, CreateLessonVariables } from '@impact26/dataconnect-sdk';

// The `CreateLesson` mutation requires an argument of type `CreateLessonVariables`:
const createLessonVars: CreateLessonVariables = {
  id: ..., 
  moduleId: ..., 
  title: ..., 
  position: ..., 
  lessonType: ..., 
};

// Call the `createLessonRef()` function to get a reference to the mutation.
const ref = createLessonRef(createLessonVars);
// Variables can be defined inline as well.
const ref = createLessonRef({ id: ..., moduleId: ..., title: ..., position: ..., lessonType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLessonRef(dataConnect, createLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lesson_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson_insert);
});
```

## UpdateLesson
You can execute the `UpdateLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateLesson(vars: UpdateLessonVariables): MutationPromise<UpdateLessonData, UpdateLessonVariables>;

interface UpdateLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLessonVariables): MutationRef<UpdateLessonData, UpdateLessonVariables>;
}
export const updateLessonRef: UpdateLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLesson(dc: DataConnect, vars: UpdateLessonVariables): MutationPromise<UpdateLessonData, UpdateLessonVariables>;

interface UpdateLessonRef {
  ...
  (dc: DataConnect, vars: UpdateLessonVariables): MutationRef<UpdateLessonData, UpdateLessonVariables>;
}
export const updateLessonRef: UpdateLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLessonRef:
```typescript
const name = updateLessonRef.operationName;
console.log(name);
```

### Variables
The `UpdateLesson` mutation requires an argument of type `UpdateLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateLessonVariables {
  id: UUIDString;
  title?: string | null;
  contentJson?: string | null;
  videoPlaybackId?: string | null;
  videoUrl?: string | null;
  quizId?: UUIDString | null;
  sourceMaterialId?: UUIDString | null;
  durationSeconds?: number | null;
  position?: number | null;
  status?: string | null;
  isPublished?: boolean | null;
  updatedById?: string | null;
  publishedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdateLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLessonData {
  lesson_update?: Lesson_Key | null;
}
```
### Using `UpdateLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLesson, UpdateLessonVariables } from '@impact26/dataconnect-sdk';

// The `UpdateLesson` mutation requires an argument of type `UpdateLessonVariables`:
const updateLessonVars: UpdateLessonVariables = {
  id: ..., 
  title: ..., // optional
  contentJson: ..., // optional
  videoPlaybackId: ..., // optional
  videoUrl: ..., // optional
  quizId: ..., // optional
  sourceMaterialId: ..., // optional
  durationSeconds: ..., // optional
  position: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLesson(updateLessonVars);
// Variables can be defined inline as well.
const { data } = await updateLesson({ id: ..., title: ..., contentJson: ..., videoPlaybackId: ..., videoUrl: ..., quizId: ..., sourceMaterialId: ..., durationSeconds: ..., position: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLesson(dataConnect, updateLessonVars);

console.log(data.lesson_update);

// Or, you can use the `Promise` API.
updateLesson(updateLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lesson_update);
});
```

### Using `UpdateLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLessonRef, UpdateLessonVariables } from '@impact26/dataconnect-sdk';

// The `UpdateLesson` mutation requires an argument of type `UpdateLessonVariables`:
const updateLessonVars: UpdateLessonVariables = {
  id: ..., 
  title: ..., // optional
  contentJson: ..., // optional
  videoPlaybackId: ..., // optional
  videoUrl: ..., // optional
  quizId: ..., // optional
  sourceMaterialId: ..., // optional
  durationSeconds: ..., // optional
  position: ..., // optional
  status: ..., // optional
  isPublished: ..., // optional
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateLessonRef()` function to get a reference to the mutation.
const ref = updateLessonRef(updateLessonVars);
// Variables can be defined inline as well.
const ref = updateLessonRef({ id: ..., title: ..., contentJson: ..., videoPlaybackId: ..., videoUrl: ..., quizId: ..., sourceMaterialId: ..., durationSeconds: ..., position: ..., status: ..., isPublished: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLessonRef(dataConnect, updateLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lesson_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson_update);
});
```

## DeleteLesson
You can execute the `DeleteLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteLesson(vars: DeleteLessonVariables): MutationPromise<DeleteLessonData, DeleteLessonVariables>;

interface DeleteLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLessonVariables): MutationRef<DeleteLessonData, DeleteLessonVariables>;
}
export const deleteLessonRef: DeleteLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteLesson(dc: DataConnect, vars: DeleteLessonVariables): MutationPromise<DeleteLessonData, DeleteLessonVariables>;

interface DeleteLessonRef {
  ...
  (dc: DataConnect, vars: DeleteLessonVariables): MutationRef<DeleteLessonData, DeleteLessonVariables>;
}
export const deleteLessonRef: DeleteLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteLessonRef:
```typescript
const name = deleteLessonRef.operationName;
console.log(name);
```

### Variables
The `DeleteLesson` mutation requires an argument of type `DeleteLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteLessonVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteLessonData {
  lesson_delete?: Lesson_Key | null;
}
```
### Using `DeleteLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteLesson, DeleteLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLesson` mutation requires an argument of type `DeleteLessonVariables`:
const deleteLessonVars: DeleteLessonVariables = {
  id: ..., 
};

// Call the `deleteLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteLesson(deleteLessonVars);
// Variables can be defined inline as well.
const { data } = await deleteLesson({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteLesson(dataConnect, deleteLessonVars);

console.log(data.lesson_delete);

// Or, you can use the `Promise` API.
deleteLesson(deleteLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lesson_delete);
});
```

### Using `DeleteLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteLessonRef, DeleteLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLesson` mutation requires an argument of type `DeleteLessonVariables`:
const deleteLessonVars: DeleteLessonVariables = {
  id: ..., 
};

// Call the `deleteLessonRef()` function to get a reference to the mutation.
const ref = deleteLessonRef(deleteLessonVars);
// Variables can be defined inline as well.
const ref = deleteLessonRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteLessonRef(dataConnect, deleteLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lesson_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lesson_delete);
});
```

## DeleteModule
You can execute the `DeleteModule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteModule(vars: DeleteModuleVariables): MutationPromise<DeleteModuleData, DeleteModuleVariables>;

interface DeleteModuleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteModuleVariables): MutationRef<DeleteModuleData, DeleteModuleVariables>;
}
export const deleteModuleRef: DeleteModuleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteModule(dc: DataConnect, vars: DeleteModuleVariables): MutationPromise<DeleteModuleData, DeleteModuleVariables>;

interface DeleteModuleRef {
  ...
  (dc: DataConnect, vars: DeleteModuleVariables): MutationRef<DeleteModuleData, DeleteModuleVariables>;
}
export const deleteModuleRef: DeleteModuleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteModuleRef:
```typescript
const name = deleteModuleRef.operationName;
console.log(name);
```

### Variables
The `DeleteModule` mutation requires an argument of type `DeleteModuleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteModuleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteModule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteModuleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteModuleData {
  module_delete?: Module_Key | null;
}
```
### Using `DeleteModule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteModule, DeleteModuleVariables } from '@impact26/dataconnect-sdk';

// The `DeleteModule` mutation requires an argument of type `DeleteModuleVariables`:
const deleteModuleVars: DeleteModuleVariables = {
  id: ..., 
};

// Call the `deleteModule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteModule(deleteModuleVars);
// Variables can be defined inline as well.
const { data } = await deleteModule({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteModule(dataConnect, deleteModuleVars);

console.log(data.module_delete);

// Or, you can use the `Promise` API.
deleteModule(deleteModuleVars).then((response) => {
  const data = response.data;
  console.log(data.module_delete);
});
```

### Using `DeleteModule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteModuleRef, DeleteModuleVariables } from '@impact26/dataconnect-sdk';

// The `DeleteModule` mutation requires an argument of type `DeleteModuleVariables`:
const deleteModuleVars: DeleteModuleVariables = {
  id: ..., 
};

// Call the `deleteModuleRef()` function to get a reference to the mutation.
const ref = deleteModuleRef(deleteModuleVars);
// Variables can be defined inline as well.
const ref = deleteModuleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteModuleRef(dataConnect, deleteModuleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.module_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.module_delete);
});
```

## DeleteCourse
You can execute the `DeleteCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteCourse(vars: DeleteCourseVariables): MutationPromise<DeleteCourseData, DeleteCourseVariables>;

interface DeleteCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCourseVariables): MutationRef<DeleteCourseData, DeleteCourseVariables>;
}
export const deleteCourseRef: DeleteCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCourse(dc: DataConnect, vars: DeleteCourseVariables): MutationPromise<DeleteCourseData, DeleteCourseVariables>;

interface DeleteCourseRef {
  ...
  (dc: DataConnect, vars: DeleteCourseVariables): MutationRef<DeleteCourseData, DeleteCourseVariables>;
}
export const deleteCourseRef: DeleteCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCourseRef:
```typescript
const name = deleteCourseRef.operationName;
console.log(name);
```

### Variables
The `DeleteCourse` mutation requires an argument of type `DeleteCourseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCourseVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCourseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCourseData {
  course_delete?: Course_Key | null;
}
```
### Using `DeleteCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCourse, DeleteCourseVariables } from '@impact26/dataconnect-sdk';

// The `DeleteCourse` mutation requires an argument of type `DeleteCourseVariables`:
const deleteCourseVars: DeleteCourseVariables = {
  id: ..., 
};

// Call the `deleteCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCourse(deleteCourseVars);
// Variables can be defined inline as well.
const { data } = await deleteCourse({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCourse(dataConnect, deleteCourseVars);

console.log(data.course_delete);

// Or, you can use the `Promise` API.
deleteCourse(deleteCourseVars).then((response) => {
  const data = response.data;
  console.log(data.course_delete);
});
```

### Using `DeleteCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCourseRef, DeleteCourseVariables } from '@impact26/dataconnect-sdk';

// The `DeleteCourse` mutation requires an argument of type `DeleteCourseVariables`:
const deleteCourseVars: DeleteCourseVariables = {
  id: ..., 
};

// Call the `deleteCourseRef()` function to get a reference to the mutation.
const ref = deleteCourseRef(deleteCourseVars);
// Variables can be defined inline as well.
const ref = deleteCourseRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCourseRef(dataConnect, deleteCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_delete);
});
```

## DeleteSourceLinksForCourse
You can execute the `DeleteSourceLinksForCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceLinksForCourse(vars: DeleteSourceLinksForCourseVariables): MutationPromise<DeleteSourceLinksForCourseData, DeleteSourceLinksForCourseVariables>;

interface DeleteSourceLinksForCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForCourseVariables): MutationRef<DeleteSourceLinksForCourseData, DeleteSourceLinksForCourseVariables>;
}
export const deleteSourceLinksForCourseRef: DeleteSourceLinksForCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceLinksForCourse(dc: DataConnect, vars: DeleteSourceLinksForCourseVariables): MutationPromise<DeleteSourceLinksForCourseData, DeleteSourceLinksForCourseVariables>;

interface DeleteSourceLinksForCourseRef {
  ...
  (dc: DataConnect, vars: DeleteSourceLinksForCourseVariables): MutationRef<DeleteSourceLinksForCourseData, DeleteSourceLinksForCourseVariables>;
}
export const deleteSourceLinksForCourseRef: DeleteSourceLinksForCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceLinksForCourseRef:
```typescript
const name = deleteSourceLinksForCourseRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceLinksForCourse` mutation requires an argument of type `DeleteSourceLinksForCourseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceLinksForCourseVariables {
  courseId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceLinksForCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceLinksForCourseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceLinksForCourseData {
  contentSourceLink_deleteMany: number;
}
```
### Using `DeleteSourceLinksForCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForCourse, DeleteSourceLinksForCourseVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForCourse` mutation requires an argument of type `DeleteSourceLinksForCourseVariables`:
const deleteSourceLinksForCourseVars: DeleteSourceLinksForCourseVariables = {
  courseId: ..., 
};

// Call the `deleteSourceLinksForCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceLinksForCourse(deleteSourceLinksForCourseVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceLinksForCourse({ courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceLinksForCourse(dataConnect, deleteSourceLinksForCourseVars);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
deleteSourceLinksForCourse(deleteSourceLinksForCourseVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

### Using `DeleteSourceLinksForCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForCourseRef, DeleteSourceLinksForCourseVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForCourse` mutation requires an argument of type `DeleteSourceLinksForCourseVariables`:
const deleteSourceLinksForCourseVars: DeleteSourceLinksForCourseVariables = {
  courseId: ..., 
};

// Call the `deleteSourceLinksForCourseRef()` function to get a reference to the mutation.
const ref = deleteSourceLinksForCourseRef(deleteSourceLinksForCourseVars);
// Variables can be defined inline as well.
const ref = deleteSourceLinksForCourseRef({ courseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceLinksForCourseRef(dataConnect, deleteSourceLinksForCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

## DeleteUserCourseProgressForCourse
You can execute the `DeleteUserCourseProgressForCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteUserCourseProgressForCourse(vars: DeleteUserCourseProgressForCourseVariables): MutationPromise<DeleteUserCourseProgressForCourseData, DeleteUserCourseProgressForCourseVariables>;

interface DeleteUserCourseProgressForCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserCourseProgressForCourseVariables): MutationRef<DeleteUserCourseProgressForCourseData, DeleteUserCourseProgressForCourseVariables>;
}
export const deleteUserCourseProgressForCourseRef: DeleteUserCourseProgressForCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserCourseProgressForCourse(dc: DataConnect, vars: DeleteUserCourseProgressForCourseVariables): MutationPromise<DeleteUserCourseProgressForCourseData, DeleteUserCourseProgressForCourseVariables>;

interface DeleteUserCourseProgressForCourseRef {
  ...
  (dc: DataConnect, vars: DeleteUserCourseProgressForCourseVariables): MutationRef<DeleteUserCourseProgressForCourseData, DeleteUserCourseProgressForCourseVariables>;
}
export const deleteUserCourseProgressForCourseRef: DeleteUserCourseProgressForCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserCourseProgressForCourseRef:
```typescript
const name = deleteUserCourseProgressForCourseRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserCourseProgressForCourse` mutation requires an argument of type `DeleteUserCourseProgressForCourseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserCourseProgressForCourseVariables {
  courseId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteUserCourseProgressForCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserCourseProgressForCourseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserCourseProgressForCourseData {
  userCourseProgress_deleteMany: number;
}
```
### Using `DeleteUserCourseProgressForCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserCourseProgressForCourse, DeleteUserCourseProgressForCourseVariables } from '@impact26/dataconnect-sdk';

// The `DeleteUserCourseProgressForCourse` mutation requires an argument of type `DeleteUserCourseProgressForCourseVariables`:
const deleteUserCourseProgressForCourseVars: DeleteUserCourseProgressForCourseVariables = {
  courseId: ..., 
};

// Call the `deleteUserCourseProgressForCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserCourseProgressForCourse(deleteUserCourseProgressForCourseVars);
// Variables can be defined inline as well.
const { data } = await deleteUserCourseProgressForCourse({ courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserCourseProgressForCourse(dataConnect, deleteUserCourseProgressForCourseVars);

console.log(data.userCourseProgress_deleteMany);

// Or, you can use the `Promise` API.
deleteUserCourseProgressForCourse(deleteUserCourseProgressForCourseVars).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress_deleteMany);
});
```

### Using `DeleteUserCourseProgressForCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserCourseProgressForCourseRef, DeleteUserCourseProgressForCourseVariables } from '@impact26/dataconnect-sdk';

// The `DeleteUserCourseProgressForCourse` mutation requires an argument of type `DeleteUserCourseProgressForCourseVariables`:
const deleteUserCourseProgressForCourseVars: DeleteUserCourseProgressForCourseVariables = {
  courseId: ..., 
};

// Call the `deleteUserCourseProgressForCourseRef()` function to get a reference to the mutation.
const ref = deleteUserCourseProgressForCourseRef(deleteUserCourseProgressForCourseVars);
// Variables can be defined inline as well.
const ref = deleteUserCourseProgressForCourseRef({ courseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserCourseProgressForCourseRef(dataConnect, deleteUserCourseProgressForCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userCourseProgress_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress_deleteMany);
});
```

## DeleteLessonVersionsForLesson
You can execute the `DeleteLessonVersionsForLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteLessonVersionsForLesson(vars: DeleteLessonVersionsForLessonVariables): MutationPromise<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;

interface DeleteLessonVersionsForLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLessonVersionsForLessonVariables): MutationRef<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;
}
export const deleteLessonVersionsForLessonRef: DeleteLessonVersionsForLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteLessonVersionsForLesson(dc: DataConnect, vars: DeleteLessonVersionsForLessonVariables): MutationPromise<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;

interface DeleteLessonVersionsForLessonRef {
  ...
  (dc: DataConnect, vars: DeleteLessonVersionsForLessonVariables): MutationRef<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;
}
export const deleteLessonVersionsForLessonRef: DeleteLessonVersionsForLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteLessonVersionsForLessonRef:
```typescript
const name = deleteLessonVersionsForLessonRef.operationName;
console.log(name);
```

### Variables
The `DeleteLessonVersionsForLesson` mutation requires an argument of type `DeleteLessonVersionsForLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteLessonVersionsForLessonVariables {
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteLessonVersionsForLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteLessonVersionsForLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteLessonVersionsForLessonData {
  lessonVersion_deleteMany: number;
}
```
### Using `DeleteLessonVersionsForLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteLessonVersionsForLesson, DeleteLessonVersionsForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLessonVersionsForLesson` mutation requires an argument of type `DeleteLessonVersionsForLessonVariables`:
const deleteLessonVersionsForLessonVars: DeleteLessonVersionsForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteLessonVersionsForLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteLessonVersionsForLesson(deleteLessonVersionsForLessonVars);
// Variables can be defined inline as well.
const { data } = await deleteLessonVersionsForLesson({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteLessonVersionsForLesson(dataConnect, deleteLessonVersionsForLessonVars);

console.log(data.lessonVersion_deleteMany);

// Or, you can use the `Promise` API.
deleteLessonVersionsForLesson(deleteLessonVersionsForLessonVars).then((response) => {
  const data = response.data;
  console.log(data.lessonVersion_deleteMany);
});
```

### Using `DeleteLessonVersionsForLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteLessonVersionsForLessonRef, DeleteLessonVersionsForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLessonVersionsForLesson` mutation requires an argument of type `DeleteLessonVersionsForLessonVariables`:
const deleteLessonVersionsForLessonVars: DeleteLessonVersionsForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteLessonVersionsForLessonRef()` function to get a reference to the mutation.
const ref = deleteLessonVersionsForLessonRef(deleteLessonVersionsForLessonVars);
// Variables can be defined inline as well.
const ref = deleteLessonVersionsForLessonRef({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteLessonVersionsForLessonRef(dataConnect, deleteLessonVersionsForLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lessonVersion_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonVersion_deleteMany);
});
```

## DeleteSourceLinksForLesson
You can execute the `DeleteSourceLinksForLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceLinksForLesson(vars: DeleteSourceLinksForLessonVariables): MutationPromise<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;

interface DeleteSourceLinksForLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForLessonVariables): MutationRef<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;
}
export const deleteSourceLinksForLessonRef: DeleteSourceLinksForLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceLinksForLesson(dc: DataConnect, vars: DeleteSourceLinksForLessonVariables): MutationPromise<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;

interface DeleteSourceLinksForLessonRef {
  ...
  (dc: DataConnect, vars: DeleteSourceLinksForLessonVariables): MutationRef<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;
}
export const deleteSourceLinksForLessonRef: DeleteSourceLinksForLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceLinksForLessonRef:
```typescript
const name = deleteSourceLinksForLessonRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceLinksForLesson` mutation requires an argument of type `DeleteSourceLinksForLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceLinksForLessonVariables {
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceLinksForLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceLinksForLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceLinksForLessonData {
  contentSourceLink_deleteMany: number;
}
```
### Using `DeleteSourceLinksForLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForLesson, DeleteSourceLinksForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForLesson` mutation requires an argument of type `DeleteSourceLinksForLessonVariables`:
const deleteSourceLinksForLessonVars: DeleteSourceLinksForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteSourceLinksForLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceLinksForLesson(deleteSourceLinksForLessonVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceLinksForLesson({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceLinksForLesson(dataConnect, deleteSourceLinksForLessonVars);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
deleteSourceLinksForLesson(deleteSourceLinksForLessonVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

### Using `DeleteSourceLinksForLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForLessonRef, DeleteSourceLinksForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForLesson` mutation requires an argument of type `DeleteSourceLinksForLessonVariables`:
const deleteSourceLinksForLessonVars: DeleteSourceLinksForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteSourceLinksForLessonRef()` function to get a reference to the mutation.
const ref = deleteSourceLinksForLessonRef(deleteSourceLinksForLessonVars);
// Variables can be defined inline as well.
const ref = deleteSourceLinksForLessonRef({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceLinksForLessonRef(dataConnect, deleteSourceLinksForLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

## DeleteSourceLinksForQuestion
You can execute the `DeleteSourceLinksForQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceLinksForQuestion(vars: DeleteSourceLinksForQuestionVariables): MutationPromise<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;

interface DeleteSourceLinksForQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForQuestionVariables): MutationRef<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;
}
export const deleteSourceLinksForQuestionRef: DeleteSourceLinksForQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceLinksForQuestion(dc: DataConnect, vars: DeleteSourceLinksForQuestionVariables): MutationPromise<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;

interface DeleteSourceLinksForQuestionRef {
  ...
  (dc: DataConnect, vars: DeleteSourceLinksForQuestionVariables): MutationRef<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;
}
export const deleteSourceLinksForQuestionRef: DeleteSourceLinksForQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceLinksForQuestionRef:
```typescript
const name = deleteSourceLinksForQuestionRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceLinksForQuestion` mutation requires an argument of type `DeleteSourceLinksForQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceLinksForQuestionVariables {
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceLinksForQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceLinksForQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceLinksForQuestionData {
  contentSourceLink_deleteMany: number;
}
```
### Using `DeleteSourceLinksForQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForQuestion, DeleteSourceLinksForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForQuestion` mutation requires an argument of type `DeleteSourceLinksForQuestionVariables`:
const deleteSourceLinksForQuestionVars: DeleteSourceLinksForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteSourceLinksForQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceLinksForQuestion(deleteSourceLinksForQuestionVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceLinksForQuestion({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceLinksForQuestion(dataConnect, deleteSourceLinksForQuestionVars);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
deleteSourceLinksForQuestion(deleteSourceLinksForQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

### Using `DeleteSourceLinksForQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForQuestionRef, DeleteSourceLinksForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForQuestion` mutation requires an argument of type `DeleteSourceLinksForQuestionVariables`:
const deleteSourceLinksForQuestionVars: DeleteSourceLinksForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteSourceLinksForQuestionRef()` function to get a reference to the mutation.
const ref = deleteSourceLinksForQuestionRef(deleteSourceLinksForQuestionVars);
// Variables can be defined inline as well.
const ref = deleteSourceLinksForQuestionRef({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceLinksForQuestionRef(dataConnect, deleteSourceLinksForQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

## DeleteSourceLinksForMaterial
You can execute the `DeleteSourceLinksForMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceLinksForMaterial(vars: DeleteSourceLinksForMaterialVariables): MutationPromise<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;

interface DeleteSourceLinksForMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForMaterialVariables): MutationRef<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;
}
export const deleteSourceLinksForMaterialRef: DeleteSourceLinksForMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceLinksForMaterial(dc: DataConnect, vars: DeleteSourceLinksForMaterialVariables): MutationPromise<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;

interface DeleteSourceLinksForMaterialRef {
  ...
  (dc: DataConnect, vars: DeleteSourceLinksForMaterialVariables): MutationRef<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;
}
export const deleteSourceLinksForMaterialRef: DeleteSourceLinksForMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceLinksForMaterialRef:
```typescript
const name = deleteSourceLinksForMaterialRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceLinksForMaterial` mutation requires an argument of type `DeleteSourceLinksForMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceLinksForMaterialVariables {
  sourceMaterialId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceLinksForMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceLinksForMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceLinksForMaterialData {
  contentSourceLink_deleteMany: number;
}
```
### Using `DeleteSourceLinksForMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForMaterial, DeleteSourceLinksForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForMaterial` mutation requires an argument of type `DeleteSourceLinksForMaterialVariables`:
const deleteSourceLinksForMaterialVars: DeleteSourceLinksForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteSourceLinksForMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceLinksForMaterial(deleteSourceLinksForMaterialVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceLinksForMaterial({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceLinksForMaterial(dataConnect, deleteSourceLinksForMaterialVars);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
deleteSourceLinksForMaterial(deleteSourceLinksForMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

### Using `DeleteSourceLinksForMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceLinksForMaterialRef, DeleteSourceLinksForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceLinksForMaterial` mutation requires an argument of type `DeleteSourceLinksForMaterialVariables`:
const deleteSourceLinksForMaterialVars: DeleteSourceLinksForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteSourceLinksForMaterialRef()` function to get a reference to the mutation.
const ref = deleteSourceLinksForMaterialRef(deleteSourceLinksForMaterialVars);
// Variables can be defined inline as well.
const ref = deleteSourceLinksForMaterialRef({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceLinksForMaterialRef(dataConnect, deleteSourceLinksForMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_deleteMany);
});
```

## DeleteUserLessonProgressForLesson
You can execute the `DeleteUserLessonProgressForLesson` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteUserLessonProgressForLesson(vars: DeleteUserLessonProgressForLessonVariables): MutationPromise<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;

interface DeleteUserLessonProgressForLessonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserLessonProgressForLessonVariables): MutationRef<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;
}
export const deleteUserLessonProgressForLessonRef: DeleteUserLessonProgressForLessonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserLessonProgressForLesson(dc: DataConnect, vars: DeleteUserLessonProgressForLessonVariables): MutationPromise<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;

interface DeleteUserLessonProgressForLessonRef {
  ...
  (dc: DataConnect, vars: DeleteUserLessonProgressForLessonVariables): MutationRef<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;
}
export const deleteUserLessonProgressForLessonRef: DeleteUserLessonProgressForLessonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserLessonProgressForLessonRef:
```typescript
const name = deleteUserLessonProgressForLessonRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserLessonProgressForLesson` mutation requires an argument of type `DeleteUserLessonProgressForLessonVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserLessonProgressForLessonVariables {
  lessonId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteUserLessonProgressForLesson` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserLessonProgressForLessonData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserLessonProgressForLessonData {
  userLessonProgress_deleteMany: number;
}
```
### Using `DeleteUserLessonProgressForLesson`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserLessonProgressForLesson, DeleteUserLessonProgressForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteUserLessonProgressForLesson` mutation requires an argument of type `DeleteUserLessonProgressForLessonVariables`:
const deleteUserLessonProgressForLessonVars: DeleteUserLessonProgressForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteUserLessonProgressForLesson()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserLessonProgressForLesson(deleteUserLessonProgressForLessonVars);
// Variables can be defined inline as well.
const { data } = await deleteUserLessonProgressForLesson({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserLessonProgressForLesson(dataConnect, deleteUserLessonProgressForLessonVars);

console.log(data.userLessonProgress_deleteMany);

// Or, you can use the `Promise` API.
deleteUserLessonProgressForLesson(deleteUserLessonProgressForLessonVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_deleteMany);
});
```

### Using `DeleteUserLessonProgressForLesson`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserLessonProgressForLessonRef, DeleteUserLessonProgressForLessonVariables } from '@impact26/dataconnect-sdk';

// The `DeleteUserLessonProgressForLesson` mutation requires an argument of type `DeleteUserLessonProgressForLessonVariables`:
const deleteUserLessonProgressForLessonVars: DeleteUserLessonProgressForLessonVariables = {
  lessonId: ..., 
};

// Call the `deleteUserLessonProgressForLessonRef()` function to get a reference to the mutation.
const ref = deleteUserLessonProgressForLessonRef(deleteUserLessonProgressForLessonVars);
// Variables can be defined inline as well.
const ref = deleteUserLessonProgressForLessonRef({ lessonId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserLessonProgressForLessonRef(dataConnect, deleteUserLessonProgressForLessonVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userLessonProgress_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_deleteMany);
});
```

## DeleteIngestionJobsForMaterial
You can execute the `DeleteIngestionJobsForMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteIngestionJobsForMaterial(vars: DeleteIngestionJobsForMaterialVariables): MutationPromise<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;

interface DeleteIngestionJobsForMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIngestionJobsForMaterialVariables): MutationRef<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;
}
export const deleteIngestionJobsForMaterialRef: DeleteIngestionJobsForMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteIngestionJobsForMaterial(dc: DataConnect, vars: DeleteIngestionJobsForMaterialVariables): MutationPromise<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;

interface DeleteIngestionJobsForMaterialRef {
  ...
  (dc: DataConnect, vars: DeleteIngestionJobsForMaterialVariables): MutationRef<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;
}
export const deleteIngestionJobsForMaterialRef: DeleteIngestionJobsForMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteIngestionJobsForMaterialRef:
```typescript
const name = deleteIngestionJobsForMaterialRef.operationName;
console.log(name);
```

### Variables
The `DeleteIngestionJobsForMaterial` mutation requires an argument of type `DeleteIngestionJobsForMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteIngestionJobsForMaterialVariables {
  sourceMaterialId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteIngestionJobsForMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteIngestionJobsForMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteIngestionJobsForMaterialData {
  ingestionJob_deleteMany: number;
}
```
### Using `DeleteIngestionJobsForMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteIngestionJobsForMaterial, DeleteIngestionJobsForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteIngestionJobsForMaterial` mutation requires an argument of type `DeleteIngestionJobsForMaterialVariables`:
const deleteIngestionJobsForMaterialVars: DeleteIngestionJobsForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteIngestionJobsForMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteIngestionJobsForMaterial(deleteIngestionJobsForMaterialVars);
// Variables can be defined inline as well.
const { data } = await deleteIngestionJobsForMaterial({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteIngestionJobsForMaterial(dataConnect, deleteIngestionJobsForMaterialVars);

console.log(data.ingestionJob_deleteMany);

// Or, you can use the `Promise` API.
deleteIngestionJobsForMaterial(deleteIngestionJobsForMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.ingestionJob_deleteMany);
});
```

### Using `DeleteIngestionJobsForMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteIngestionJobsForMaterialRef, DeleteIngestionJobsForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteIngestionJobsForMaterial` mutation requires an argument of type `DeleteIngestionJobsForMaterialVariables`:
const deleteIngestionJobsForMaterialVars: DeleteIngestionJobsForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteIngestionJobsForMaterialRef()` function to get a reference to the mutation.
const ref = deleteIngestionJobsForMaterialRef(deleteIngestionJobsForMaterialVars);
// Variables can be defined inline as well.
const ref = deleteIngestionJobsForMaterialRef({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteIngestionJobsForMaterialRef(dataConnect, deleteIngestionJobsForMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.ingestionJob_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.ingestionJob_deleteMany);
});
```

## DeleteSourceMaterial
You can execute the `DeleteSourceMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceMaterial(vars: DeleteSourceMaterialVariables): MutationPromise<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;

interface DeleteSourceMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceMaterialVariables): MutationRef<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;
}
export const deleteSourceMaterialRef: DeleteSourceMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceMaterial(dc: DataConnect, vars: DeleteSourceMaterialVariables): MutationPromise<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;

interface DeleteSourceMaterialRef {
  ...
  (dc: DataConnect, vars: DeleteSourceMaterialVariables): MutationRef<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;
}
export const deleteSourceMaterialRef: DeleteSourceMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceMaterialRef:
```typescript
const name = deleteSourceMaterialRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceMaterial` mutation requires an argument of type `DeleteSourceMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceMaterialVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceMaterialData {
  sourceMaterial_delete?: SourceMaterial_Key | null;
}
```
### Using `DeleteSourceMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceMaterial, DeleteSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceMaterial` mutation requires an argument of type `DeleteSourceMaterialVariables`:
const deleteSourceMaterialVars: DeleteSourceMaterialVariables = {
  id: ..., 
};

// Call the `deleteSourceMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceMaterial(deleteSourceMaterialVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceMaterial({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceMaterial(dataConnect, deleteSourceMaterialVars);

console.log(data.sourceMaterial_delete);

// Or, you can use the `Promise` API.
deleteSourceMaterial(deleteSourceMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_delete);
});
```

### Using `DeleteSourceMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceMaterialRef, DeleteSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceMaterial` mutation requires an argument of type `DeleteSourceMaterialVariables`:
const deleteSourceMaterialVars: DeleteSourceMaterialVariables = {
  id: ..., 
};

// Call the `deleteSourceMaterialRef()` function to get a reference to the mutation.
const ref = deleteSourceMaterialRef(deleteSourceMaterialVars);
// Variables can be defined inline as well.
const ref = deleteSourceMaterialRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceMaterialRef(dataConnect, deleteSourceMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterial_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_delete);
});
```

## UpdateSourceMaterial
You can execute the `UpdateSourceMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateSourceMaterial(vars: UpdateSourceMaterialVariables): MutationPromise<UpdateSourceMaterialData, UpdateSourceMaterialVariables>;

interface UpdateSourceMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSourceMaterialVariables): MutationRef<UpdateSourceMaterialData, UpdateSourceMaterialVariables>;
}
export const updateSourceMaterialRef: UpdateSourceMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSourceMaterial(dc: DataConnect, vars: UpdateSourceMaterialVariables): MutationPromise<UpdateSourceMaterialData, UpdateSourceMaterialVariables>;

interface UpdateSourceMaterialRef {
  ...
  (dc: DataConnect, vars: UpdateSourceMaterialVariables): MutationRef<UpdateSourceMaterialData, UpdateSourceMaterialVariables>;
}
export const updateSourceMaterialRef: UpdateSourceMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSourceMaterialRef:
```typescript
const name = updateSourceMaterialRef.operationName;
console.log(name);
```

### Variables
The `UpdateSourceMaterial` mutation requires an argument of type `UpdateSourceMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSourceMaterialVariables {
  id: UUIDString;
  extractedText?: string | null;
  metadataJson?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateSourceMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSourceMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSourceMaterialData {
  sourceMaterial_update?: SourceMaterial_Key | null;
}
```
### Using `UpdateSourceMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSourceMaterial, UpdateSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `UpdateSourceMaterial` mutation requires an argument of type `UpdateSourceMaterialVariables`:
const updateSourceMaterialVars: UpdateSourceMaterialVariables = {
  id: ..., 
  extractedText: ..., // optional
  metadataJson: ..., // optional
  status: ..., // optional
};

// Call the `updateSourceMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSourceMaterial(updateSourceMaterialVars);
// Variables can be defined inline as well.
const { data } = await updateSourceMaterial({ id: ..., extractedText: ..., metadataJson: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSourceMaterial(dataConnect, updateSourceMaterialVars);

console.log(data.sourceMaterial_update);

// Or, you can use the `Promise` API.
updateSourceMaterial(updateSourceMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_update);
});
```

### Using `UpdateSourceMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSourceMaterialRef, UpdateSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `UpdateSourceMaterial` mutation requires an argument of type `UpdateSourceMaterialVariables`:
const updateSourceMaterialVars: UpdateSourceMaterialVariables = {
  id: ..., 
  extractedText: ..., // optional
  metadataJson: ..., // optional
  status: ..., // optional
};

// Call the `updateSourceMaterialRef()` function to get a reference to the mutation.
const ref = updateSourceMaterialRef(updateSourceMaterialVars);
// Variables can be defined inline as well.
const ref = updateSourceMaterialRef({ id: ..., extractedText: ..., metadataJson: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSourceMaterialRef(dataConnect, updateSourceMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterial_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_update);
});
```

## UpdateSourceMaterialLibraryState
You can execute the `UpdateSourceMaterialLibraryState` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateSourceMaterialLibraryState(vars: UpdateSourceMaterialLibraryStateVariables): MutationPromise<UpdateSourceMaterialLibraryStateData, UpdateSourceMaterialLibraryStateVariables>;

interface UpdateSourceMaterialLibraryStateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSourceMaterialLibraryStateVariables): MutationRef<UpdateSourceMaterialLibraryStateData, UpdateSourceMaterialLibraryStateVariables>;
}
export const updateSourceMaterialLibraryStateRef: UpdateSourceMaterialLibraryStateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSourceMaterialLibraryState(dc: DataConnect, vars: UpdateSourceMaterialLibraryStateVariables): MutationPromise<UpdateSourceMaterialLibraryStateData, UpdateSourceMaterialLibraryStateVariables>;

interface UpdateSourceMaterialLibraryStateRef {
  ...
  (dc: DataConnect, vars: UpdateSourceMaterialLibraryStateVariables): MutationRef<UpdateSourceMaterialLibraryStateData, UpdateSourceMaterialLibraryStateVariables>;
}
export const updateSourceMaterialLibraryStateRef: UpdateSourceMaterialLibraryStateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSourceMaterialLibraryStateRef:
```typescript
const name = updateSourceMaterialLibraryStateRef.operationName;
console.log(name);
```

### Variables
The `UpdateSourceMaterialLibraryState` mutation requires an argument of type `UpdateSourceMaterialLibraryStateVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSourceMaterialLibraryStateVariables {
  id: UUIDString;
  title?: string | null;
  folderId?: UUIDString | null;
  starred?: boolean | null;
  archivedAt?: DateString | null;
  trashedAt?: DateString | null;
  reviewStatus?: string | null;
  visibility?: string | null;
  duplicateOfId?: UUIDString | null;
  lastActivityAt?: DateString | null;
  metadataJson?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateSourceMaterialLibraryState` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSourceMaterialLibraryStateData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSourceMaterialLibraryStateData {
  sourceMaterial_update?: SourceMaterial_Key | null;
}
```
### Using `UpdateSourceMaterialLibraryState`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSourceMaterialLibraryState, UpdateSourceMaterialLibraryStateVariables } from '@impact26/dataconnect-sdk';

// The `UpdateSourceMaterialLibraryState` mutation requires an argument of type `UpdateSourceMaterialLibraryStateVariables`:
const updateSourceMaterialLibraryStateVars: UpdateSourceMaterialLibraryStateVariables = {
  id: ..., 
  title: ..., // optional
  folderId: ..., // optional
  starred: ..., // optional
  archivedAt: ..., // optional
  trashedAt: ..., // optional
  reviewStatus: ..., // optional
  visibility: ..., // optional
  duplicateOfId: ..., // optional
  lastActivityAt: ..., // optional
  metadataJson: ..., // optional
  status: ..., // optional
};

// Call the `updateSourceMaterialLibraryState()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSourceMaterialLibraryState(updateSourceMaterialLibraryStateVars);
// Variables can be defined inline as well.
const { data } = await updateSourceMaterialLibraryState({ id: ..., title: ..., folderId: ..., starred: ..., archivedAt: ..., trashedAt: ..., reviewStatus: ..., visibility: ..., duplicateOfId: ..., lastActivityAt: ..., metadataJson: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSourceMaterialLibraryState(dataConnect, updateSourceMaterialLibraryStateVars);

console.log(data.sourceMaterial_update);

// Or, you can use the `Promise` API.
updateSourceMaterialLibraryState(updateSourceMaterialLibraryStateVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_update);
});
```

### Using `UpdateSourceMaterialLibraryState`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSourceMaterialLibraryStateRef, UpdateSourceMaterialLibraryStateVariables } from '@impact26/dataconnect-sdk';

// The `UpdateSourceMaterialLibraryState` mutation requires an argument of type `UpdateSourceMaterialLibraryStateVariables`:
const updateSourceMaterialLibraryStateVars: UpdateSourceMaterialLibraryStateVariables = {
  id: ..., 
  title: ..., // optional
  folderId: ..., // optional
  starred: ..., // optional
  archivedAt: ..., // optional
  trashedAt: ..., // optional
  reviewStatus: ..., // optional
  visibility: ..., // optional
  duplicateOfId: ..., // optional
  lastActivityAt: ..., // optional
  metadataJson: ..., // optional
  status: ..., // optional
};

// Call the `updateSourceMaterialLibraryStateRef()` function to get a reference to the mutation.
const ref = updateSourceMaterialLibraryStateRef(updateSourceMaterialLibraryStateVars);
// Variables can be defined inline as well.
const ref = updateSourceMaterialLibraryStateRef({ id: ..., title: ..., folderId: ..., starred: ..., archivedAt: ..., trashedAt: ..., reviewStatus: ..., visibility: ..., duplicateOfId: ..., lastActivityAt: ..., metadataJson: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSourceMaterialLibraryStateRef(dataConnect, updateSourceMaterialLibraryStateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterial_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_update);
});
```

## CreateSourceMaterial
You can execute the `CreateSourceMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createSourceMaterial(vars: CreateSourceMaterialVariables): MutationPromise<CreateSourceMaterialData, CreateSourceMaterialVariables>;

interface CreateSourceMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialVariables): MutationRef<CreateSourceMaterialData, CreateSourceMaterialVariables>;
}
export const createSourceMaterialRef: CreateSourceMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSourceMaterial(dc: DataConnect, vars: CreateSourceMaterialVariables): MutationPromise<CreateSourceMaterialData, CreateSourceMaterialVariables>;

interface CreateSourceMaterialRef {
  ...
  (dc: DataConnect, vars: CreateSourceMaterialVariables): MutationRef<CreateSourceMaterialData, CreateSourceMaterialVariables>;
}
export const createSourceMaterialRef: CreateSourceMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSourceMaterialRef:
```typescript
const name = createSourceMaterialRef.operationName;
console.log(name);
```

### Variables
The `CreateSourceMaterial` mutation requires an argument of type `CreateSourceMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSourceMaterialVariables {
  id: UUIDString;
  title: string;
  fileName: string;
  fileType: string;
  folderId?: UUIDString | null;
  storagePath: string;
  downloadUrl?: string | null;
  extractedText?: string | null;
  metadataJson?: string | null;
  status: string;
  uploadedById?: string | null;
}
```
### Return Type
Recall that executing the `CreateSourceMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSourceMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSourceMaterialData {
  sourceMaterial_insert: SourceMaterial_Key;
}
```
### Using `CreateSourceMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterial, CreateSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterial` mutation requires an argument of type `CreateSourceMaterialVariables`:
const createSourceMaterialVars: CreateSourceMaterialVariables = {
  id: ..., 
  title: ..., 
  fileName: ..., 
  fileType: ..., 
  folderId: ..., // optional
  storagePath: ..., 
  downloadUrl: ..., // optional
  extractedText: ..., // optional
  metadataJson: ..., // optional
  status: ..., 
  uploadedById: ..., // optional
};

// Call the `createSourceMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSourceMaterial(createSourceMaterialVars);
// Variables can be defined inline as well.
const { data } = await createSourceMaterial({ id: ..., title: ..., fileName: ..., fileType: ..., folderId: ..., storagePath: ..., downloadUrl: ..., extractedText: ..., metadataJson: ..., status: ..., uploadedById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSourceMaterial(dataConnect, createSourceMaterialVars);

console.log(data.sourceMaterial_insert);

// Or, you can use the `Promise` API.
createSourceMaterial(createSourceMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_insert);
});
```

### Using `CreateSourceMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialRef, CreateSourceMaterialVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterial` mutation requires an argument of type `CreateSourceMaterialVariables`:
const createSourceMaterialVars: CreateSourceMaterialVariables = {
  id: ..., 
  title: ..., 
  fileName: ..., 
  fileType: ..., 
  folderId: ..., // optional
  storagePath: ..., 
  downloadUrl: ..., // optional
  extractedText: ..., // optional
  metadataJson: ..., // optional
  status: ..., 
  uploadedById: ..., // optional
};

// Call the `createSourceMaterialRef()` function to get a reference to the mutation.
const ref = createSourceMaterialRef(createSourceMaterialVars);
// Variables can be defined inline as well.
const ref = createSourceMaterialRef({ id: ..., title: ..., fileName: ..., fileType: ..., folderId: ..., storagePath: ..., downloadUrl: ..., extractedText: ..., metadataJson: ..., status: ..., uploadedById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSourceMaterialRef(dataConnect, createSourceMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterial_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterial_insert);
});
```

## CreateIngestionJob
You can execute the `CreateIngestionJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createIngestionJob(vars: CreateIngestionJobVariables): MutationPromise<CreateIngestionJobData, CreateIngestionJobVariables>;

interface CreateIngestionJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIngestionJobVariables): MutationRef<CreateIngestionJobData, CreateIngestionJobVariables>;
}
export const createIngestionJobRef: CreateIngestionJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createIngestionJob(dc: DataConnect, vars: CreateIngestionJobVariables): MutationPromise<CreateIngestionJobData, CreateIngestionJobVariables>;

interface CreateIngestionJobRef {
  ...
  (dc: DataConnect, vars: CreateIngestionJobVariables): MutationRef<CreateIngestionJobData, CreateIngestionJobVariables>;
}
export const createIngestionJobRef: CreateIngestionJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createIngestionJobRef:
```typescript
const name = createIngestionJobRef.operationName;
console.log(name);
```

### Variables
The `CreateIngestionJob` mutation requires an argument of type `CreateIngestionJobVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateIngestionJobVariables {
  id: UUIDString;
  sourceMaterialId: UUIDString;
  status: string;
  parser: string;
  extractedCharacters: number;
  errorMessage?: string | null;
  completedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `CreateIngestionJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateIngestionJobData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateIngestionJobData {
  ingestionJob_insert: IngestionJob_Key;
}
```
### Using `CreateIngestionJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createIngestionJob, CreateIngestionJobVariables } from '@impact26/dataconnect-sdk';

// The `CreateIngestionJob` mutation requires an argument of type `CreateIngestionJobVariables`:
const createIngestionJobVars: CreateIngestionJobVariables = {
  id: ..., 
  sourceMaterialId: ..., 
  status: ..., 
  parser: ..., 
  extractedCharacters: ..., 
  errorMessage: ..., // optional
  completedAt: ..., // optional
};

// Call the `createIngestionJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createIngestionJob(createIngestionJobVars);
// Variables can be defined inline as well.
const { data } = await createIngestionJob({ id: ..., sourceMaterialId: ..., status: ..., parser: ..., extractedCharacters: ..., errorMessage: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createIngestionJob(dataConnect, createIngestionJobVars);

console.log(data.ingestionJob_insert);

// Or, you can use the `Promise` API.
createIngestionJob(createIngestionJobVars).then((response) => {
  const data = response.data;
  console.log(data.ingestionJob_insert);
});
```

### Using `CreateIngestionJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createIngestionJobRef, CreateIngestionJobVariables } from '@impact26/dataconnect-sdk';

// The `CreateIngestionJob` mutation requires an argument of type `CreateIngestionJobVariables`:
const createIngestionJobVars: CreateIngestionJobVariables = {
  id: ..., 
  sourceMaterialId: ..., 
  status: ..., 
  parser: ..., 
  extractedCharacters: ..., 
  errorMessage: ..., // optional
  completedAt: ..., // optional
};

// Call the `createIngestionJobRef()` function to get a reference to the mutation.
const ref = createIngestionJobRef(createIngestionJobVars);
// Variables can be defined inline as well.
const ref = createIngestionJobRef({ id: ..., sourceMaterialId: ..., status: ..., parser: ..., extractedCharacters: ..., errorMessage: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createIngestionJobRef(dataConnect, createIngestionJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.ingestionJob_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.ingestionJob_insert);
});
```

## CreateSourceMaterialFolder
You can execute the `CreateSourceMaterialFolder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createSourceMaterialFolder(vars: CreateSourceMaterialFolderVariables): MutationPromise<CreateSourceMaterialFolderData, CreateSourceMaterialFolderVariables>;

interface CreateSourceMaterialFolderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialFolderVariables): MutationRef<CreateSourceMaterialFolderData, CreateSourceMaterialFolderVariables>;
}
export const createSourceMaterialFolderRef: CreateSourceMaterialFolderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSourceMaterialFolder(dc: DataConnect, vars: CreateSourceMaterialFolderVariables): MutationPromise<CreateSourceMaterialFolderData, CreateSourceMaterialFolderVariables>;

interface CreateSourceMaterialFolderRef {
  ...
  (dc: DataConnect, vars: CreateSourceMaterialFolderVariables): MutationRef<CreateSourceMaterialFolderData, CreateSourceMaterialFolderVariables>;
}
export const createSourceMaterialFolderRef: CreateSourceMaterialFolderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSourceMaterialFolderRef:
```typescript
const name = createSourceMaterialFolderRef.operationName;
console.log(name);
```

### Variables
The `CreateSourceMaterialFolder` mutation requires an argument of type `CreateSourceMaterialFolderVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSourceMaterialFolderVariables {
  id: UUIDString;
  name: string;
  parentFolderId?: UUIDString | null;
  folderType: string;
  courseId?: UUIDString | null;
  lessonId?: UUIDString | null;
  createdById?: string | null;
}
```
### Return Type
Recall that executing the `CreateSourceMaterialFolder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSourceMaterialFolderData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSourceMaterialFolderData {
  sourceMaterialFolder_insert: SourceMaterialFolder_Key;
}
```
### Using `CreateSourceMaterialFolder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialFolder, CreateSourceMaterialFolderVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterialFolder` mutation requires an argument of type `CreateSourceMaterialFolderVariables`:
const createSourceMaterialFolderVars: CreateSourceMaterialFolderVariables = {
  id: ..., 
  name: ..., 
  parentFolderId: ..., // optional
  folderType: ..., 
  courseId: ..., // optional
  lessonId: ..., // optional
  createdById: ..., // optional
};

// Call the `createSourceMaterialFolder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSourceMaterialFolder(createSourceMaterialFolderVars);
// Variables can be defined inline as well.
const { data } = await createSourceMaterialFolder({ id: ..., name: ..., parentFolderId: ..., folderType: ..., courseId: ..., lessonId: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSourceMaterialFolder(dataConnect, createSourceMaterialFolderVars);

console.log(data.sourceMaterialFolder_insert);

// Or, you can use the `Promise` API.
createSourceMaterialFolder(createSourceMaterialFolderVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialFolder_insert);
});
```

### Using `CreateSourceMaterialFolder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialFolderRef, CreateSourceMaterialFolderVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterialFolder` mutation requires an argument of type `CreateSourceMaterialFolderVariables`:
const createSourceMaterialFolderVars: CreateSourceMaterialFolderVariables = {
  id: ..., 
  name: ..., 
  parentFolderId: ..., // optional
  folderType: ..., 
  courseId: ..., // optional
  lessonId: ..., // optional
  createdById: ..., // optional
};

// Call the `createSourceMaterialFolderRef()` function to get a reference to the mutation.
const ref = createSourceMaterialFolderRef(createSourceMaterialFolderVars);
// Variables can be defined inline as well.
const ref = createSourceMaterialFolderRef({ id: ..., name: ..., parentFolderId: ..., folderType: ..., courseId: ..., lessonId: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSourceMaterialFolderRef(dataConnect, createSourceMaterialFolderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterialFolder_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialFolder_insert);
});
```

## UpdateSourceMaterialFolder
You can execute the `UpdateSourceMaterialFolder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateSourceMaterialFolder(vars: UpdateSourceMaterialFolderVariables): MutationPromise<UpdateSourceMaterialFolderData, UpdateSourceMaterialFolderVariables>;

interface UpdateSourceMaterialFolderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSourceMaterialFolderVariables): MutationRef<UpdateSourceMaterialFolderData, UpdateSourceMaterialFolderVariables>;
}
export const updateSourceMaterialFolderRef: UpdateSourceMaterialFolderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSourceMaterialFolder(dc: DataConnect, vars: UpdateSourceMaterialFolderVariables): MutationPromise<UpdateSourceMaterialFolderData, UpdateSourceMaterialFolderVariables>;

interface UpdateSourceMaterialFolderRef {
  ...
  (dc: DataConnect, vars: UpdateSourceMaterialFolderVariables): MutationRef<UpdateSourceMaterialFolderData, UpdateSourceMaterialFolderVariables>;
}
export const updateSourceMaterialFolderRef: UpdateSourceMaterialFolderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSourceMaterialFolderRef:
```typescript
const name = updateSourceMaterialFolderRef.operationName;
console.log(name);
```

### Variables
The `UpdateSourceMaterialFolder` mutation requires an argument of type `UpdateSourceMaterialFolderVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSourceMaterialFolderVariables {
  id: UUIDString;
  name?: string | null;
  parentFolderId?: UUIDString | null;
  archivedAt?: DateString | null;
  trashedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdateSourceMaterialFolder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSourceMaterialFolderData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSourceMaterialFolderData {
  sourceMaterialFolder_update?: SourceMaterialFolder_Key | null;
}
```
### Using `UpdateSourceMaterialFolder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSourceMaterialFolder, UpdateSourceMaterialFolderVariables } from '@impact26/dataconnect-sdk';

// The `UpdateSourceMaterialFolder` mutation requires an argument of type `UpdateSourceMaterialFolderVariables`:
const updateSourceMaterialFolderVars: UpdateSourceMaterialFolderVariables = {
  id: ..., 
  name: ..., // optional
  parentFolderId: ..., // optional
  archivedAt: ..., // optional
  trashedAt: ..., // optional
};

// Call the `updateSourceMaterialFolder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSourceMaterialFolder(updateSourceMaterialFolderVars);
// Variables can be defined inline as well.
const { data } = await updateSourceMaterialFolder({ id: ..., name: ..., parentFolderId: ..., archivedAt: ..., trashedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSourceMaterialFolder(dataConnect, updateSourceMaterialFolderVars);

console.log(data.sourceMaterialFolder_update);

// Or, you can use the `Promise` API.
updateSourceMaterialFolder(updateSourceMaterialFolderVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialFolder_update);
});
```

### Using `UpdateSourceMaterialFolder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSourceMaterialFolderRef, UpdateSourceMaterialFolderVariables } from '@impact26/dataconnect-sdk';

// The `UpdateSourceMaterialFolder` mutation requires an argument of type `UpdateSourceMaterialFolderVariables`:
const updateSourceMaterialFolderVars: UpdateSourceMaterialFolderVariables = {
  id: ..., 
  name: ..., // optional
  parentFolderId: ..., // optional
  archivedAt: ..., // optional
  trashedAt: ..., // optional
};

// Call the `updateSourceMaterialFolderRef()` function to get a reference to the mutation.
const ref = updateSourceMaterialFolderRef(updateSourceMaterialFolderVars);
// Variables can be defined inline as well.
const ref = updateSourceMaterialFolderRef({ id: ..., name: ..., parentFolderId: ..., archivedAt: ..., trashedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSourceMaterialFolderRef(dataConnect, updateSourceMaterialFolderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterialFolder_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialFolder_update);
});
```

## DeleteSourceMaterialFolder
You can execute the `DeleteSourceMaterialFolder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteSourceMaterialFolder(vars: DeleteSourceMaterialFolderVariables): MutationPromise<DeleteSourceMaterialFolderData, DeleteSourceMaterialFolderVariables>;

interface DeleteSourceMaterialFolderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceMaterialFolderVariables): MutationRef<DeleteSourceMaterialFolderData, DeleteSourceMaterialFolderVariables>;
}
export const deleteSourceMaterialFolderRef: DeleteSourceMaterialFolderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSourceMaterialFolder(dc: DataConnect, vars: DeleteSourceMaterialFolderVariables): MutationPromise<DeleteSourceMaterialFolderData, DeleteSourceMaterialFolderVariables>;

interface DeleteSourceMaterialFolderRef {
  ...
  (dc: DataConnect, vars: DeleteSourceMaterialFolderVariables): MutationRef<DeleteSourceMaterialFolderData, DeleteSourceMaterialFolderVariables>;
}
export const deleteSourceMaterialFolderRef: DeleteSourceMaterialFolderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSourceMaterialFolderRef:
```typescript
const name = deleteSourceMaterialFolderRef.operationName;
console.log(name);
```

### Variables
The `DeleteSourceMaterialFolder` mutation requires an argument of type `DeleteSourceMaterialFolderVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSourceMaterialFolderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSourceMaterialFolder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSourceMaterialFolderData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSourceMaterialFolderData {
  sourceMaterialFolder_delete?: SourceMaterialFolder_Key | null;
}
```
### Using `DeleteSourceMaterialFolder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSourceMaterialFolder, DeleteSourceMaterialFolderVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceMaterialFolder` mutation requires an argument of type `DeleteSourceMaterialFolderVariables`:
const deleteSourceMaterialFolderVars: DeleteSourceMaterialFolderVariables = {
  id: ..., 
};

// Call the `deleteSourceMaterialFolder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSourceMaterialFolder(deleteSourceMaterialFolderVars);
// Variables can be defined inline as well.
const { data } = await deleteSourceMaterialFolder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSourceMaterialFolder(dataConnect, deleteSourceMaterialFolderVars);

console.log(data.sourceMaterialFolder_delete);

// Or, you can use the `Promise` API.
deleteSourceMaterialFolder(deleteSourceMaterialFolderVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialFolder_delete);
});
```

### Using `DeleteSourceMaterialFolder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSourceMaterialFolderRef, DeleteSourceMaterialFolderVariables } from '@impact26/dataconnect-sdk';

// The `DeleteSourceMaterialFolder` mutation requires an argument of type `DeleteSourceMaterialFolderVariables`:
const deleteSourceMaterialFolderVars: DeleteSourceMaterialFolderVariables = {
  id: ..., 
};

// Call the `deleteSourceMaterialFolderRef()` function to get a reference to the mutation.
const ref = deleteSourceMaterialFolderRef(deleteSourceMaterialFolderVars);
// Variables can be defined inline as well.
const ref = deleteSourceMaterialFolderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSourceMaterialFolderRef(dataConnect, deleteSourceMaterialFolderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterialFolder_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialFolder_delete);
});
```

## CreateSourceMaterialTag
You can execute the `CreateSourceMaterialTag` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createSourceMaterialTag(vars: CreateSourceMaterialTagVariables): MutationPromise<CreateSourceMaterialTagData, CreateSourceMaterialTagVariables>;

interface CreateSourceMaterialTagRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialTagVariables): MutationRef<CreateSourceMaterialTagData, CreateSourceMaterialTagVariables>;
}
export const createSourceMaterialTagRef: CreateSourceMaterialTagRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSourceMaterialTag(dc: DataConnect, vars: CreateSourceMaterialTagVariables): MutationPromise<CreateSourceMaterialTagData, CreateSourceMaterialTagVariables>;

interface CreateSourceMaterialTagRef {
  ...
  (dc: DataConnect, vars: CreateSourceMaterialTagVariables): MutationRef<CreateSourceMaterialTagData, CreateSourceMaterialTagVariables>;
}
export const createSourceMaterialTagRef: CreateSourceMaterialTagRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSourceMaterialTagRef:
```typescript
const name = createSourceMaterialTagRef.operationName;
console.log(name);
```

### Variables
The `CreateSourceMaterialTag` mutation requires an argument of type `CreateSourceMaterialTagVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSourceMaterialTagVariables {
  id: UUIDString;
  name: string;
  color?: string | null;
  createdById?: string | null;
}
```
### Return Type
Recall that executing the `CreateSourceMaterialTag` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSourceMaterialTagData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSourceMaterialTagData {
  sourceMaterialTag_insert: SourceMaterialTag_Key;
}
```
### Using `CreateSourceMaterialTag`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialTag, CreateSourceMaterialTagVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterialTag` mutation requires an argument of type `CreateSourceMaterialTagVariables`:
const createSourceMaterialTagVars: CreateSourceMaterialTagVariables = {
  id: ..., 
  name: ..., 
  color: ..., // optional
  createdById: ..., // optional
};

// Call the `createSourceMaterialTag()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSourceMaterialTag(createSourceMaterialTagVars);
// Variables can be defined inline as well.
const { data } = await createSourceMaterialTag({ id: ..., name: ..., color: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSourceMaterialTag(dataConnect, createSourceMaterialTagVars);

console.log(data.sourceMaterialTag_insert);

// Or, you can use the `Promise` API.
createSourceMaterialTag(createSourceMaterialTagVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialTag_insert);
});
```

### Using `CreateSourceMaterialTag`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialTagRef, CreateSourceMaterialTagVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterialTag` mutation requires an argument of type `CreateSourceMaterialTagVariables`:
const createSourceMaterialTagVars: CreateSourceMaterialTagVariables = {
  id: ..., 
  name: ..., 
  color: ..., // optional
  createdById: ..., // optional
};

// Call the `createSourceMaterialTagRef()` function to get a reference to the mutation.
const ref = createSourceMaterialTagRef(createSourceMaterialTagVars);
// Variables can be defined inline as well.
const ref = createSourceMaterialTagRef({ id: ..., name: ..., color: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSourceMaterialTagRef(dataConnect, createSourceMaterialTagVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterialTag_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialTag_insert);
});
```

## CreateSourceMaterialTagAssignment
You can execute the `CreateSourceMaterialTagAssignment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createSourceMaterialTagAssignment(vars: CreateSourceMaterialTagAssignmentVariables): MutationPromise<CreateSourceMaterialTagAssignmentData, CreateSourceMaterialTagAssignmentVariables>;

interface CreateSourceMaterialTagAssignmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialTagAssignmentVariables): MutationRef<CreateSourceMaterialTagAssignmentData, CreateSourceMaterialTagAssignmentVariables>;
}
export const createSourceMaterialTagAssignmentRef: CreateSourceMaterialTagAssignmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSourceMaterialTagAssignment(dc: DataConnect, vars: CreateSourceMaterialTagAssignmentVariables): MutationPromise<CreateSourceMaterialTagAssignmentData, CreateSourceMaterialTagAssignmentVariables>;

interface CreateSourceMaterialTagAssignmentRef {
  ...
  (dc: DataConnect, vars: CreateSourceMaterialTagAssignmentVariables): MutationRef<CreateSourceMaterialTagAssignmentData, CreateSourceMaterialTagAssignmentVariables>;
}
export const createSourceMaterialTagAssignmentRef: CreateSourceMaterialTagAssignmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSourceMaterialTagAssignmentRef:
```typescript
const name = createSourceMaterialTagAssignmentRef.operationName;
console.log(name);
```

### Variables
The `CreateSourceMaterialTagAssignment` mutation requires an argument of type `CreateSourceMaterialTagAssignmentVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSourceMaterialTagAssignmentVariables {
  sourceMaterialId: UUIDString;
  tagId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateSourceMaterialTagAssignment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSourceMaterialTagAssignmentData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSourceMaterialTagAssignmentData {
  sourceMaterialTagAssignment_insert: SourceMaterialTagAssignment_Key;
}
```
### Using `CreateSourceMaterialTagAssignment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialTagAssignment, CreateSourceMaterialTagAssignmentVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterialTagAssignment` mutation requires an argument of type `CreateSourceMaterialTagAssignmentVariables`:
const createSourceMaterialTagAssignmentVars: CreateSourceMaterialTagAssignmentVariables = {
  sourceMaterialId: ..., 
  tagId: ..., 
};

// Call the `createSourceMaterialTagAssignment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSourceMaterialTagAssignment(createSourceMaterialTagAssignmentVars);
// Variables can be defined inline as well.
const { data } = await createSourceMaterialTagAssignment({ sourceMaterialId: ..., tagId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSourceMaterialTagAssignment(dataConnect, createSourceMaterialTagAssignmentVars);

console.log(data.sourceMaterialTagAssignment_insert);

// Or, you can use the `Promise` API.
createSourceMaterialTagAssignment(createSourceMaterialTagAssignmentVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialTagAssignment_insert);
});
```

### Using `CreateSourceMaterialTagAssignment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialTagAssignmentRef, CreateSourceMaterialTagAssignmentVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterialTagAssignment` mutation requires an argument of type `CreateSourceMaterialTagAssignmentVariables`:
const createSourceMaterialTagAssignmentVars: CreateSourceMaterialTagAssignmentVariables = {
  sourceMaterialId: ..., 
  tagId: ..., 
};

// Call the `createSourceMaterialTagAssignmentRef()` function to get a reference to the mutation.
const ref = createSourceMaterialTagAssignmentRef(createSourceMaterialTagAssignmentVars);
// Variables can be defined inline as well.
const ref = createSourceMaterialTagAssignmentRef({ sourceMaterialId: ..., tagId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSourceMaterialTagAssignmentRef(dataConnect, createSourceMaterialTagAssignmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterialTagAssignment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialTagAssignment_insert);
});
```

## DeleteTagAssignmentsForMaterial
You can execute the `DeleteTagAssignmentsForMaterial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteTagAssignmentsForMaterial(vars: DeleteTagAssignmentsForMaterialVariables): MutationPromise<DeleteTagAssignmentsForMaterialData, DeleteTagAssignmentsForMaterialVariables>;

interface DeleteTagAssignmentsForMaterialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTagAssignmentsForMaterialVariables): MutationRef<DeleteTagAssignmentsForMaterialData, DeleteTagAssignmentsForMaterialVariables>;
}
export const deleteTagAssignmentsForMaterialRef: DeleteTagAssignmentsForMaterialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTagAssignmentsForMaterial(dc: DataConnect, vars: DeleteTagAssignmentsForMaterialVariables): MutationPromise<DeleteTagAssignmentsForMaterialData, DeleteTagAssignmentsForMaterialVariables>;

interface DeleteTagAssignmentsForMaterialRef {
  ...
  (dc: DataConnect, vars: DeleteTagAssignmentsForMaterialVariables): MutationRef<DeleteTagAssignmentsForMaterialData, DeleteTagAssignmentsForMaterialVariables>;
}
export const deleteTagAssignmentsForMaterialRef: DeleteTagAssignmentsForMaterialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTagAssignmentsForMaterialRef:
```typescript
const name = deleteTagAssignmentsForMaterialRef.operationName;
console.log(name);
```

### Variables
The `DeleteTagAssignmentsForMaterial` mutation requires an argument of type `DeleteTagAssignmentsForMaterialVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTagAssignmentsForMaterialVariables {
  sourceMaterialId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTagAssignmentsForMaterial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTagAssignmentsForMaterialData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTagAssignmentsForMaterialData {
  sourceMaterialTagAssignment_deleteMany: number;
}
```
### Using `DeleteTagAssignmentsForMaterial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTagAssignmentsForMaterial, DeleteTagAssignmentsForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteTagAssignmentsForMaterial` mutation requires an argument of type `DeleteTagAssignmentsForMaterialVariables`:
const deleteTagAssignmentsForMaterialVars: DeleteTagAssignmentsForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteTagAssignmentsForMaterial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTagAssignmentsForMaterial(deleteTagAssignmentsForMaterialVars);
// Variables can be defined inline as well.
const { data } = await deleteTagAssignmentsForMaterial({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTagAssignmentsForMaterial(dataConnect, deleteTagAssignmentsForMaterialVars);

console.log(data.sourceMaterialTagAssignment_deleteMany);

// Or, you can use the `Promise` API.
deleteTagAssignmentsForMaterial(deleteTagAssignmentsForMaterialVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialTagAssignment_deleteMany);
});
```

### Using `DeleteTagAssignmentsForMaterial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTagAssignmentsForMaterialRef, DeleteTagAssignmentsForMaterialVariables } from '@impact26/dataconnect-sdk';

// The `DeleteTagAssignmentsForMaterial` mutation requires an argument of type `DeleteTagAssignmentsForMaterialVariables`:
const deleteTagAssignmentsForMaterialVars: DeleteTagAssignmentsForMaterialVariables = {
  sourceMaterialId: ..., 
};

// Call the `deleteTagAssignmentsForMaterialRef()` function to get a reference to the mutation.
const ref = deleteTagAssignmentsForMaterialRef(deleteTagAssignmentsForMaterialVars);
// Variables can be defined inline as well.
const ref = deleteTagAssignmentsForMaterialRef({ sourceMaterialId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTagAssignmentsForMaterialRef(dataConnect, deleteTagAssignmentsForMaterialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterialTagAssignment_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialTagAssignment_deleteMany);
});
```

## CreateSourceMaterialActivity
You can execute the `CreateSourceMaterialActivity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createSourceMaterialActivity(vars: CreateSourceMaterialActivityVariables): MutationPromise<CreateSourceMaterialActivityData, CreateSourceMaterialActivityVariables>;

interface CreateSourceMaterialActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialActivityVariables): MutationRef<CreateSourceMaterialActivityData, CreateSourceMaterialActivityVariables>;
}
export const createSourceMaterialActivityRef: CreateSourceMaterialActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSourceMaterialActivity(dc: DataConnect, vars: CreateSourceMaterialActivityVariables): MutationPromise<CreateSourceMaterialActivityData, CreateSourceMaterialActivityVariables>;

interface CreateSourceMaterialActivityRef {
  ...
  (dc: DataConnect, vars: CreateSourceMaterialActivityVariables): MutationRef<CreateSourceMaterialActivityData, CreateSourceMaterialActivityVariables>;
}
export const createSourceMaterialActivityRef: CreateSourceMaterialActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSourceMaterialActivityRef:
```typescript
const name = createSourceMaterialActivityRef.operationName;
console.log(name);
```

### Variables
The `CreateSourceMaterialActivity` mutation requires an argument of type `CreateSourceMaterialActivityVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSourceMaterialActivityVariables {
  id: UUIDString;
  sourceMaterialId?: UUIDString | null;
  folderId?: UUIDString | null;
  actorId?: string | null;
  activityType: string;
  message?: string | null;
  metadataJson?: string | null;
}
```
### Return Type
Recall that executing the `CreateSourceMaterialActivity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSourceMaterialActivityData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSourceMaterialActivityData {
  sourceMaterialActivity_insert: SourceMaterialActivity_Key;
}
```
### Using `CreateSourceMaterialActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialActivity, CreateSourceMaterialActivityVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterialActivity` mutation requires an argument of type `CreateSourceMaterialActivityVariables`:
const createSourceMaterialActivityVars: CreateSourceMaterialActivityVariables = {
  id: ..., 
  sourceMaterialId: ..., // optional
  folderId: ..., // optional
  actorId: ..., // optional
  activityType: ..., 
  message: ..., // optional
  metadataJson: ..., // optional
};

// Call the `createSourceMaterialActivity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSourceMaterialActivity(createSourceMaterialActivityVars);
// Variables can be defined inline as well.
const { data } = await createSourceMaterialActivity({ id: ..., sourceMaterialId: ..., folderId: ..., actorId: ..., activityType: ..., message: ..., metadataJson: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSourceMaterialActivity(dataConnect, createSourceMaterialActivityVars);

console.log(data.sourceMaterialActivity_insert);

// Or, you can use the `Promise` API.
createSourceMaterialActivity(createSourceMaterialActivityVars).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialActivity_insert);
});
```

### Using `CreateSourceMaterialActivity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSourceMaterialActivityRef, CreateSourceMaterialActivityVariables } from '@impact26/dataconnect-sdk';

// The `CreateSourceMaterialActivity` mutation requires an argument of type `CreateSourceMaterialActivityVariables`:
const createSourceMaterialActivityVars: CreateSourceMaterialActivityVariables = {
  id: ..., 
  sourceMaterialId: ..., // optional
  folderId: ..., // optional
  actorId: ..., // optional
  activityType: ..., 
  message: ..., // optional
  metadataJson: ..., // optional
};

// Call the `createSourceMaterialActivityRef()` function to get a reference to the mutation.
const ref = createSourceMaterialActivityRef(createSourceMaterialActivityVars);
// Variables can be defined inline as well.
const ref = createSourceMaterialActivityRef({ id: ..., sourceMaterialId: ..., folderId: ..., actorId: ..., activityType: ..., message: ..., metadataJson: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSourceMaterialActivityRef(dataConnect, createSourceMaterialActivityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sourceMaterialActivity_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sourceMaterialActivity_insert);
});
```

## CreateQuestion
You can execute the `CreateQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createQuestion(vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;

interface CreateQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
}
export const createQuestionRef: CreateQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQuestion(dc: DataConnect, vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;

interface CreateQuestionRef {
  ...
  (dc: DataConnect, vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
}
export const createQuestionRef: CreateQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQuestionRef:
```typescript
const name = createQuestionRef.operationName;
console.log(name);
```

### Variables
The `CreateQuestion` mutation requires an argument of type `CreateQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQuestionVariables {
  id: UUIDString;
  questionText: string;
  questionType: string;
  difficulty: string;
  domain: string;
  formulaRef?: string | null;
  topicTags?: string | null;
  status: string;
  isMultiselect: boolean;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
  createdById?: string | null;
}
```
### Return Type
Recall that executing the `CreateQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQuestionData {
  question_insert: Question_Key;
}
```
### Using `CreateQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQuestion, CreateQuestionVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuestion` mutation requires an argument of type `CreateQuestionVariables`:
const createQuestionVars: CreateQuestionVariables = {
  id: ..., 
  questionText: ..., 
  questionType: ..., 
  difficulty: ..., 
  domain: ..., 
  formulaRef: ..., // optional
  topicTags: ..., // optional
  status: ..., 
  isMultiselect: ..., 
  rationale: ..., // optional
  calculation: ..., // optional
  sourceRef: ..., // optional
  createdById: ..., // optional
};

// Call the `createQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQuestion(createQuestionVars);
// Variables can be defined inline as well.
const { data } = await createQuestion({ id: ..., questionText: ..., questionType: ..., difficulty: ..., domain: ..., formulaRef: ..., topicTags: ..., status: ..., isMultiselect: ..., rationale: ..., calculation: ..., sourceRef: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQuestion(dataConnect, createQuestionVars);

console.log(data.question_insert);

// Or, you can use the `Promise` API.
createQuestion(createQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.question_insert);
});
```

### Using `CreateQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQuestionRef, CreateQuestionVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuestion` mutation requires an argument of type `CreateQuestionVariables`:
const createQuestionVars: CreateQuestionVariables = {
  id: ..., 
  questionText: ..., 
  questionType: ..., 
  difficulty: ..., 
  domain: ..., 
  formulaRef: ..., // optional
  topicTags: ..., // optional
  status: ..., 
  isMultiselect: ..., 
  rationale: ..., // optional
  calculation: ..., // optional
  sourceRef: ..., // optional
  createdById: ..., // optional
};

// Call the `createQuestionRef()` function to get a reference to the mutation.
const ref = createQuestionRef(createQuestionVars);
// Variables can be defined inline as well.
const ref = createQuestionRef({ id: ..., questionText: ..., questionType: ..., difficulty: ..., domain: ..., formulaRef: ..., topicTags: ..., status: ..., isMultiselect: ..., rationale: ..., calculation: ..., sourceRef: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQuestionRef(dataConnect, createQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.question_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.question_insert);
});
```

## UpdateQuestion
You can execute the `UpdateQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateQuestion(vars: UpdateQuestionVariables): MutationPromise<UpdateQuestionData, UpdateQuestionVariables>;

interface UpdateQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuestionVariables): MutationRef<UpdateQuestionData, UpdateQuestionVariables>;
}
export const updateQuestionRef: UpdateQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuestion(dc: DataConnect, vars: UpdateQuestionVariables): MutationPromise<UpdateQuestionData, UpdateQuestionVariables>;

interface UpdateQuestionRef {
  ...
  (dc: DataConnect, vars: UpdateQuestionVariables): MutationRef<UpdateQuestionData, UpdateQuestionVariables>;
}
export const updateQuestionRef: UpdateQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuestionRef:
```typescript
const name = updateQuestionRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuestion` mutation requires an argument of type `UpdateQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQuestionVariables {
  id: UUIDString;
  questionText?: string | null;
  difficulty?: string | null;
  domain?: string | null;
  formulaRef?: string | null;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
}
```
### Return Type
Recall that executing the `UpdateQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuestionData {
  question_update?: Question_Key | null;
}
```
### Using `UpdateQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuestion, UpdateQuestionVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuestion` mutation requires an argument of type `UpdateQuestionVariables`:
const updateQuestionVars: UpdateQuestionVariables = {
  id: ..., 
  questionText: ..., // optional
  difficulty: ..., // optional
  domain: ..., // optional
  formulaRef: ..., // optional
  rationale: ..., // optional
  calculation: ..., // optional
  sourceRef: ..., // optional
};

// Call the `updateQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuestion(updateQuestionVars);
// Variables can be defined inline as well.
const { data } = await updateQuestion({ id: ..., questionText: ..., difficulty: ..., domain: ..., formulaRef: ..., rationale: ..., calculation: ..., sourceRef: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuestion(dataConnect, updateQuestionVars);

console.log(data.question_update);

// Or, you can use the `Promise` API.
updateQuestion(updateQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.question_update);
});
```

### Using `UpdateQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuestionRef, UpdateQuestionVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuestion` mutation requires an argument of type `UpdateQuestionVariables`:
const updateQuestionVars: UpdateQuestionVariables = {
  id: ..., 
  questionText: ..., // optional
  difficulty: ..., // optional
  domain: ..., // optional
  formulaRef: ..., // optional
  rationale: ..., // optional
  calculation: ..., // optional
  sourceRef: ..., // optional
};

// Call the `updateQuestionRef()` function to get a reference to the mutation.
const ref = updateQuestionRef(updateQuestionVars);
// Variables can be defined inline as well.
const ref = updateQuestionRef({ id: ..., questionText: ..., difficulty: ..., domain: ..., formulaRef: ..., rationale: ..., calculation: ..., sourceRef: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuestionRef(dataConnect, updateQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.question_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.question_update);
});
```

## UpdateQuestionStatus
You can execute the `UpdateQuestionStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateQuestionStatus(vars: UpdateQuestionStatusVariables): MutationPromise<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;

interface UpdateQuestionStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuestionStatusVariables): MutationRef<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;
}
export const updateQuestionStatusRef: UpdateQuestionStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuestionStatus(dc: DataConnect, vars: UpdateQuestionStatusVariables): MutationPromise<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;

interface UpdateQuestionStatusRef {
  ...
  (dc: DataConnect, vars: UpdateQuestionStatusVariables): MutationRef<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;
}
export const updateQuestionStatusRef: UpdateQuestionStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuestionStatusRef:
```typescript
const name = updateQuestionStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuestionStatus` mutation requires an argument of type `UpdateQuestionStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQuestionStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateQuestionStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuestionStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuestionStatusData {
  question_update?: Question_Key | null;
}
```
### Using `UpdateQuestionStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuestionStatus, UpdateQuestionStatusVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuestionStatus` mutation requires an argument of type `UpdateQuestionStatusVariables`:
const updateQuestionStatusVars: UpdateQuestionStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateQuestionStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuestionStatus(updateQuestionStatusVars);
// Variables can be defined inline as well.
const { data } = await updateQuestionStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuestionStatus(dataConnect, updateQuestionStatusVars);

console.log(data.question_update);

// Or, you can use the `Promise` API.
updateQuestionStatus(updateQuestionStatusVars).then((response) => {
  const data = response.data;
  console.log(data.question_update);
});
```

### Using `UpdateQuestionStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuestionStatusRef, UpdateQuestionStatusVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuestionStatus` mutation requires an argument of type `UpdateQuestionStatusVariables`:
const updateQuestionStatusVars: UpdateQuestionStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateQuestionStatusRef()` function to get a reference to the mutation.
const ref = updateQuestionStatusRef(updateQuestionStatusVars);
// Variables can be defined inline as well.
const ref = updateQuestionStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuestionStatusRef(dataConnect, updateQuestionStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.question_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.question_update);
});
```

## CreateAnswerChoice
You can execute the `CreateAnswerChoice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createAnswerChoice(vars: CreateAnswerChoiceVariables): MutationPromise<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;

interface CreateAnswerChoiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAnswerChoiceVariables): MutationRef<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;
}
export const createAnswerChoiceRef: CreateAnswerChoiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAnswerChoice(dc: DataConnect, vars: CreateAnswerChoiceVariables): MutationPromise<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;

interface CreateAnswerChoiceRef {
  ...
  (dc: DataConnect, vars: CreateAnswerChoiceVariables): MutationRef<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;
}
export const createAnswerChoiceRef: CreateAnswerChoiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAnswerChoiceRef:
```typescript
const name = createAnswerChoiceRef.operationName;
console.log(name);
```

### Variables
The `CreateAnswerChoice` mutation requires an argument of type `CreateAnswerChoiceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAnswerChoiceVariables {
  questionId: UUIDString;
  letter: string;
  choiceText: string;
  isCorrect: boolean;
  explanation?: string | null;
  position: number;
}
```
### Return Type
Recall that executing the `CreateAnswerChoice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAnswerChoiceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAnswerChoiceData {
  answerChoice_insert: AnswerChoice_Key;
}
```
### Using `CreateAnswerChoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAnswerChoice, CreateAnswerChoiceVariables } from '@impact26/dataconnect-sdk';

// The `CreateAnswerChoice` mutation requires an argument of type `CreateAnswerChoiceVariables`:
const createAnswerChoiceVars: CreateAnswerChoiceVariables = {
  questionId: ..., 
  letter: ..., 
  choiceText: ..., 
  isCorrect: ..., 
  explanation: ..., // optional
  position: ..., 
};

// Call the `createAnswerChoice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAnswerChoice(createAnswerChoiceVars);
// Variables can be defined inline as well.
const { data } = await createAnswerChoice({ questionId: ..., letter: ..., choiceText: ..., isCorrect: ..., explanation: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAnswerChoice(dataConnect, createAnswerChoiceVars);

console.log(data.answerChoice_insert);

// Or, you can use the `Promise` API.
createAnswerChoice(createAnswerChoiceVars).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_insert);
});
```

### Using `CreateAnswerChoice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAnswerChoiceRef, CreateAnswerChoiceVariables } from '@impact26/dataconnect-sdk';

// The `CreateAnswerChoice` mutation requires an argument of type `CreateAnswerChoiceVariables`:
const createAnswerChoiceVars: CreateAnswerChoiceVariables = {
  questionId: ..., 
  letter: ..., 
  choiceText: ..., 
  isCorrect: ..., 
  explanation: ..., // optional
  position: ..., 
};

// Call the `createAnswerChoiceRef()` function to get a reference to the mutation.
const ref = createAnswerChoiceRef(createAnswerChoiceVars);
// Variables can be defined inline as well.
const ref = createAnswerChoiceRef({ questionId: ..., letter: ..., choiceText: ..., isCorrect: ..., explanation: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAnswerChoiceRef(dataConnect, createAnswerChoiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.answerChoice_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_insert);
});
```

## UpdateAnswerChoice
You can execute the `UpdateAnswerChoice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateAnswerChoice(vars: UpdateAnswerChoiceVariables): MutationPromise<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;

interface UpdateAnswerChoiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAnswerChoiceVariables): MutationRef<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;
}
export const updateAnswerChoiceRef: UpdateAnswerChoiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAnswerChoice(dc: DataConnect, vars: UpdateAnswerChoiceVariables): MutationPromise<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;

interface UpdateAnswerChoiceRef {
  ...
  (dc: DataConnect, vars: UpdateAnswerChoiceVariables): MutationRef<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;
}
export const updateAnswerChoiceRef: UpdateAnswerChoiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAnswerChoiceRef:
```typescript
const name = updateAnswerChoiceRef.operationName;
console.log(name);
```

### Variables
The `UpdateAnswerChoice` mutation requires an argument of type `UpdateAnswerChoiceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAnswerChoiceVariables {
  id: UUIDString;
  choiceText?: string | null;
  isCorrect?: boolean | null;
  explanation?: string | null;
}
```
### Return Type
Recall that executing the `UpdateAnswerChoice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAnswerChoiceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAnswerChoiceData {
  answerChoice_update?: AnswerChoice_Key | null;
}
```
### Using `UpdateAnswerChoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAnswerChoice, UpdateAnswerChoiceVariables } from '@impact26/dataconnect-sdk';

// The `UpdateAnswerChoice` mutation requires an argument of type `UpdateAnswerChoiceVariables`:
const updateAnswerChoiceVars: UpdateAnswerChoiceVariables = {
  id: ..., 
  choiceText: ..., // optional
  isCorrect: ..., // optional
  explanation: ..., // optional
};

// Call the `updateAnswerChoice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAnswerChoice(updateAnswerChoiceVars);
// Variables can be defined inline as well.
const { data } = await updateAnswerChoice({ id: ..., choiceText: ..., isCorrect: ..., explanation: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAnswerChoice(dataConnect, updateAnswerChoiceVars);

console.log(data.answerChoice_update);

// Or, you can use the `Promise` API.
updateAnswerChoice(updateAnswerChoiceVars).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_update);
});
```

### Using `UpdateAnswerChoice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAnswerChoiceRef, UpdateAnswerChoiceVariables } from '@impact26/dataconnect-sdk';

// The `UpdateAnswerChoice` mutation requires an argument of type `UpdateAnswerChoiceVariables`:
const updateAnswerChoiceVars: UpdateAnswerChoiceVariables = {
  id: ..., 
  choiceText: ..., // optional
  isCorrect: ..., // optional
  explanation: ..., // optional
};

// Call the `updateAnswerChoiceRef()` function to get a reference to the mutation.
const ref = updateAnswerChoiceRef(updateAnswerChoiceVars);
// Variables can be defined inline as well.
const ref = updateAnswerChoiceRef({ id: ..., choiceText: ..., isCorrect: ..., explanation: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAnswerChoiceRef(dataConnect, updateAnswerChoiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.answerChoice_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_update);
});
```

## DeleteAnswerChoicesForQuestion
You can execute the `DeleteAnswerChoicesForQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteAnswerChoicesForQuestion(vars: DeleteAnswerChoicesForQuestionVariables): MutationPromise<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;

interface DeleteAnswerChoicesForQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAnswerChoicesForQuestionVariables): MutationRef<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;
}
export const deleteAnswerChoicesForQuestionRef: DeleteAnswerChoicesForQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAnswerChoicesForQuestion(dc: DataConnect, vars: DeleteAnswerChoicesForQuestionVariables): MutationPromise<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;

interface DeleteAnswerChoicesForQuestionRef {
  ...
  (dc: DataConnect, vars: DeleteAnswerChoicesForQuestionVariables): MutationRef<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;
}
export const deleteAnswerChoicesForQuestionRef: DeleteAnswerChoicesForQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAnswerChoicesForQuestionRef:
```typescript
const name = deleteAnswerChoicesForQuestionRef.operationName;
console.log(name);
```

### Variables
The `DeleteAnswerChoicesForQuestion` mutation requires an argument of type `DeleteAnswerChoicesForQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAnswerChoicesForQuestionVariables {
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAnswerChoicesForQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAnswerChoicesForQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAnswerChoicesForQuestionData {
  answerChoice_deleteMany: number;
}
```
### Using `DeleteAnswerChoicesForQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAnswerChoicesForQuestion, DeleteAnswerChoicesForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteAnswerChoicesForQuestion` mutation requires an argument of type `DeleteAnswerChoicesForQuestionVariables`:
const deleteAnswerChoicesForQuestionVars: DeleteAnswerChoicesForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteAnswerChoicesForQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAnswerChoicesForQuestion(deleteAnswerChoicesForQuestionVars);
// Variables can be defined inline as well.
const { data } = await deleteAnswerChoicesForQuestion({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAnswerChoicesForQuestion(dataConnect, deleteAnswerChoicesForQuestionVars);

console.log(data.answerChoice_deleteMany);

// Or, you can use the `Promise` API.
deleteAnswerChoicesForQuestion(deleteAnswerChoicesForQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_deleteMany);
});
```

### Using `DeleteAnswerChoicesForQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAnswerChoicesForQuestionRef, DeleteAnswerChoicesForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteAnswerChoicesForQuestion` mutation requires an argument of type `DeleteAnswerChoicesForQuestionVariables`:
const deleteAnswerChoicesForQuestionVars: DeleteAnswerChoicesForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteAnswerChoicesForQuestionRef()` function to get a reference to the mutation.
const ref = deleteAnswerChoicesForQuestionRef(deleteAnswerChoicesForQuestionVars);
// Variables can be defined inline as well.
const ref = deleteAnswerChoicesForQuestionRef({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAnswerChoicesForQuestionRef(dataConnect, deleteAnswerChoicesForQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.answerChoice_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.answerChoice_deleteMany);
});
```

## DeleteQuizQuestionsForQuestion
You can execute the `DeleteQuizQuestionsForQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuizQuestionsForQuestion(vars: DeleteQuizQuestionsForQuestionVariables): MutationPromise<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;

interface DeleteQuizQuestionsForQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizQuestionsForQuestionVariables): MutationRef<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;
}
export const deleteQuizQuestionsForQuestionRef: DeleteQuizQuestionsForQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuizQuestionsForQuestion(dc: DataConnect, vars: DeleteQuizQuestionsForQuestionVariables): MutationPromise<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;

interface DeleteQuizQuestionsForQuestionRef {
  ...
  (dc: DataConnect, vars: DeleteQuizQuestionsForQuestionVariables): MutationRef<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;
}
export const deleteQuizQuestionsForQuestionRef: DeleteQuizQuestionsForQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizQuestionsForQuestionRef:
```typescript
const name = deleteQuizQuestionsForQuestionRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuizQuestionsForQuestion` mutation requires an argument of type `DeleteQuizQuestionsForQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizQuestionsForQuestionVariables {
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuizQuestionsForQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizQuestionsForQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizQuestionsForQuestionData {
  quizQuestion_deleteMany: number;
}
```
### Using `DeleteQuizQuestionsForQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuizQuestionsForQuestion, DeleteQuizQuestionsForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizQuestionsForQuestion` mutation requires an argument of type `DeleteQuizQuestionsForQuestionVariables`:
const deleteQuizQuestionsForQuestionVars: DeleteQuizQuestionsForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteQuizQuestionsForQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuizQuestionsForQuestion(deleteQuizQuestionsForQuestionVars);
// Variables can be defined inline as well.
const { data } = await deleteQuizQuestionsForQuestion({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuizQuestionsForQuestion(dataConnect, deleteQuizQuestionsForQuestionVars);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
deleteQuizQuestionsForQuestion(deleteQuizQuestionsForQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

### Using `DeleteQuizQuestionsForQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizQuestionsForQuestionRef, DeleteQuizQuestionsForQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizQuestionsForQuestion` mutation requires an argument of type `DeleteQuizQuestionsForQuestionVariables`:
const deleteQuizQuestionsForQuestionVars: DeleteQuizQuestionsForQuestionVariables = {
  questionId: ..., 
};

// Call the `deleteQuizQuestionsForQuestionRef()` function to get a reference to the mutation.
const ref = deleteQuizQuestionsForQuestionRef(deleteQuizQuestionsForQuestionVars);
// Variables can be defined inline as well.
const ref = deleteQuizQuestionsForQuestionRef({ questionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizQuestionsForQuestionRef(dataConnect, deleteQuizQuestionsForQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

## DeleteQuestion
You can execute the `DeleteQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuestion(vars: DeleteQuestionVariables): MutationPromise<DeleteQuestionData, DeleteQuestionVariables>;

interface DeleteQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuestionVariables): MutationRef<DeleteQuestionData, DeleteQuestionVariables>;
}
export const deleteQuestionRef: DeleteQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuestion(dc: DataConnect, vars: DeleteQuestionVariables): MutationPromise<DeleteQuestionData, DeleteQuestionVariables>;

interface DeleteQuestionRef {
  ...
  (dc: DataConnect, vars: DeleteQuestionVariables): MutationRef<DeleteQuestionData, DeleteQuestionVariables>;
}
export const deleteQuestionRef: DeleteQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuestionRef:
```typescript
const name = deleteQuestionRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuestion` mutation requires an argument of type `DeleteQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuestionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuestionData {
  question_delete?: Question_Key | null;
}
```
### Using `DeleteQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuestion, DeleteQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuestion` mutation requires an argument of type `DeleteQuestionVariables`:
const deleteQuestionVars: DeleteQuestionVariables = {
  id: ..., 
};

// Call the `deleteQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuestion(deleteQuestionVars);
// Variables can be defined inline as well.
const { data } = await deleteQuestion({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuestion(dataConnect, deleteQuestionVars);

console.log(data.question_delete);

// Or, you can use the `Promise` API.
deleteQuestion(deleteQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.question_delete);
});
```

### Using `DeleteQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuestionRef, DeleteQuestionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuestion` mutation requires an argument of type `DeleteQuestionVariables`:
const deleteQuestionVars: DeleteQuestionVariables = {
  id: ..., 
};

// Call the `deleteQuestionRef()` function to get a reference to the mutation.
const ref = deleteQuestionRef(deleteQuestionVars);
// Variables can be defined inline as well.
const ref = deleteQuestionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuestionRef(dataConnect, deleteQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.question_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.question_delete);
});
```

## CreateQuiz
You can execute the `CreateQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createQuiz(vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;

interface CreateQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
}
export const createQuizRef: CreateQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQuiz(dc: DataConnect, vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;

interface CreateQuizRef {
  ...
  (dc: DataConnect, vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
}
export const createQuizRef: CreateQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQuizRef:
```typescript
const name = createQuizRef.operationName;
console.log(name);
```

### Variables
The `CreateQuiz` mutation requires an argument of type `CreateQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQuizVariables {
  id: UUIDString;
  title: string;
  description?: string | null;
  timeLimitSeconds?: number | null;
  passingScore?: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  status: string;
  createdById?: string | null;
}
```
### Return Type
Recall that executing the `CreateQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQuizData {
  quiz_insert: Quiz_Key;
}
```
### Using `CreateQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQuiz, CreateQuizVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuiz` mutation requires an argument of type `CreateQuizVariables`:
const createQuizVars: CreateQuizVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
  timeLimitSeconds: ..., // optional
  passingScore: ..., // optional
  shuffleQuestions: ..., 
  shuffleChoices: ..., 
  status: ..., 
  createdById: ..., // optional
};

// Call the `createQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQuiz(createQuizVars);
// Variables can be defined inline as well.
const { data } = await createQuiz({ id: ..., title: ..., description: ..., timeLimitSeconds: ..., passingScore: ..., shuffleQuestions: ..., shuffleChoices: ..., status: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQuiz(dataConnect, createQuizVars);

console.log(data.quiz_insert);

// Or, you can use the `Promise` API.
createQuiz(createQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_insert);
});
```

### Using `CreateQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQuizRef, CreateQuizVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuiz` mutation requires an argument of type `CreateQuizVariables`:
const createQuizVars: CreateQuizVariables = {
  id: ..., 
  title: ..., 
  description: ..., // optional
  timeLimitSeconds: ..., // optional
  passingScore: ..., // optional
  shuffleQuestions: ..., 
  shuffleChoices: ..., 
  status: ..., 
  createdById: ..., // optional
};

// Call the `createQuizRef()` function to get a reference to the mutation.
const ref = createQuizRef(createQuizVars);
// Variables can be defined inline as well.
const ref = createQuizRef({ id: ..., title: ..., description: ..., timeLimitSeconds: ..., passingScore: ..., shuffleQuestions: ..., shuffleChoices: ..., status: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQuizRef(dataConnect, createQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_insert);
});
```

## AddQuestionToQuiz
You can execute the `AddQuestionToQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
addQuestionToQuiz(vars: AddQuestionToQuizVariables): MutationPromise<AddQuestionToQuizData, AddQuestionToQuizVariables>;

interface AddQuestionToQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddQuestionToQuizVariables): MutationRef<AddQuestionToQuizData, AddQuestionToQuizVariables>;
}
export const addQuestionToQuizRef: AddQuestionToQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addQuestionToQuiz(dc: DataConnect, vars: AddQuestionToQuizVariables): MutationPromise<AddQuestionToQuizData, AddQuestionToQuizVariables>;

interface AddQuestionToQuizRef {
  ...
  (dc: DataConnect, vars: AddQuestionToQuizVariables): MutationRef<AddQuestionToQuizData, AddQuestionToQuizVariables>;
}
export const addQuestionToQuizRef: AddQuestionToQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addQuestionToQuizRef:
```typescript
const name = addQuestionToQuizRef.operationName;
console.log(name);
```

### Variables
The `AddQuestionToQuiz` mutation requires an argument of type `AddQuestionToQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddQuestionToQuizVariables {
  quizId: UUIDString;
  questionId: UUIDString;
  position: number;
  pointValue: number;
}
```
### Return Type
Recall that executing the `AddQuestionToQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddQuestionToQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddQuestionToQuizData {
  quizQuestion_insert: QuizQuestion_Key;
}
```
### Using `AddQuestionToQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addQuestionToQuiz, AddQuestionToQuizVariables } from '@impact26/dataconnect-sdk';

// The `AddQuestionToQuiz` mutation requires an argument of type `AddQuestionToQuizVariables`:
const addQuestionToQuizVars: AddQuestionToQuizVariables = {
  quizId: ..., 
  questionId: ..., 
  position: ..., 
  pointValue: ..., 
};

// Call the `addQuestionToQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addQuestionToQuiz(addQuestionToQuizVars);
// Variables can be defined inline as well.
const { data } = await addQuestionToQuiz({ quizId: ..., questionId: ..., position: ..., pointValue: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addQuestionToQuiz(dataConnect, addQuestionToQuizVars);

console.log(data.quizQuestion_insert);

// Or, you can use the `Promise` API.
addQuestionToQuiz(addQuestionToQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_insert);
});
```

### Using `AddQuestionToQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addQuestionToQuizRef, AddQuestionToQuizVariables } from '@impact26/dataconnect-sdk';

// The `AddQuestionToQuiz` mutation requires an argument of type `AddQuestionToQuizVariables`:
const addQuestionToQuizVars: AddQuestionToQuizVariables = {
  quizId: ..., 
  questionId: ..., 
  position: ..., 
  pointValue: ..., 
};

// Call the `addQuestionToQuizRef()` function to get a reference to the mutation.
const ref = addQuestionToQuizRef(addQuestionToQuizVars);
// Variables can be defined inline as well.
const ref = addQuestionToQuizRef({ quizId: ..., questionId: ..., position: ..., pointValue: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addQuestionToQuizRef(dataConnect, addQuestionToQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizQuestion_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_insert);
});
```

## UpdateQuizCalculatorSettings
You can execute the `UpdateQuizCalculatorSettings` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateQuizCalculatorSettings(vars: UpdateQuizCalculatorSettingsVariables): MutationPromise<UpdateQuizCalculatorSettingsData, UpdateQuizCalculatorSettingsVariables>;

interface UpdateQuizCalculatorSettingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuizCalculatorSettingsVariables): MutationRef<UpdateQuizCalculatorSettingsData, UpdateQuizCalculatorSettingsVariables>;
}
export const updateQuizCalculatorSettingsRef: UpdateQuizCalculatorSettingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuizCalculatorSettings(dc: DataConnect, vars: UpdateQuizCalculatorSettingsVariables): MutationPromise<UpdateQuizCalculatorSettingsData, UpdateQuizCalculatorSettingsVariables>;

interface UpdateQuizCalculatorSettingsRef {
  ...
  (dc: DataConnect, vars: UpdateQuizCalculatorSettingsVariables): MutationRef<UpdateQuizCalculatorSettingsData, UpdateQuizCalculatorSettingsVariables>;
}
export const updateQuizCalculatorSettingsRef: UpdateQuizCalculatorSettingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuizCalculatorSettingsRef:
```typescript
const name = updateQuizCalculatorSettingsRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuizCalculatorSettings` mutation requires an argument of type `UpdateQuizCalculatorSettingsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQuizCalculatorSettingsVariables {
  id: UUIDString;
  calculatorSettingsJson?: string | null;
}
```
### Return Type
Recall that executing the `UpdateQuizCalculatorSettings` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuizCalculatorSettingsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuizCalculatorSettingsData {
  quiz_update?: Quiz_Key | null;
}
```
### Using `UpdateQuizCalculatorSettings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuizCalculatorSettings, UpdateQuizCalculatorSettingsVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuizCalculatorSettings` mutation requires an argument of type `UpdateQuizCalculatorSettingsVariables`:
const updateQuizCalculatorSettingsVars: UpdateQuizCalculatorSettingsVariables = {
  id: ..., 
  calculatorSettingsJson: ..., // optional
};

// Call the `updateQuizCalculatorSettings()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuizCalculatorSettings(updateQuizCalculatorSettingsVars);
// Variables can be defined inline as well.
const { data } = await updateQuizCalculatorSettings({ id: ..., calculatorSettingsJson: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuizCalculatorSettings(dataConnect, updateQuizCalculatorSettingsVars);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
updateQuizCalculatorSettings(updateQuizCalculatorSettingsVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

### Using `UpdateQuizCalculatorSettings`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuizCalculatorSettingsRef, UpdateQuizCalculatorSettingsVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuizCalculatorSettings` mutation requires an argument of type `UpdateQuizCalculatorSettingsVariables`:
const updateQuizCalculatorSettingsVars: UpdateQuizCalculatorSettingsVariables = {
  id: ..., 
  calculatorSettingsJson: ..., // optional
};

// Call the `updateQuizCalculatorSettingsRef()` function to get a reference to the mutation.
const ref = updateQuizCalculatorSettingsRef(updateQuizCalculatorSettingsVars);
// Variables can be defined inline as well.
const ref = updateQuizCalculatorSettingsRef({ id: ..., calculatorSettingsJson: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuizCalculatorSettingsRef(dataConnect, updateQuizCalculatorSettingsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

## UpdateQuizStatus
You can execute the `UpdateQuizStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateQuizStatus(vars: UpdateQuizStatusVariables): MutationPromise<UpdateQuizStatusData, UpdateQuizStatusVariables>;

interface UpdateQuizStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuizStatusVariables): MutationRef<UpdateQuizStatusData, UpdateQuizStatusVariables>;
}
export const updateQuizStatusRef: UpdateQuizStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuizStatus(dc: DataConnect, vars: UpdateQuizStatusVariables): MutationPromise<UpdateQuizStatusData, UpdateQuizStatusVariables>;

interface UpdateQuizStatusRef {
  ...
  (dc: DataConnect, vars: UpdateQuizStatusVariables): MutationRef<UpdateQuizStatusData, UpdateQuizStatusVariables>;
}
export const updateQuizStatusRef: UpdateQuizStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuizStatusRef:
```typescript
const name = updateQuizStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuizStatus` mutation requires an argument of type `UpdateQuizStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQuizStatusVariables {
  id: UUIDString;
  status: string;
  updatedById?: string | null;
  publishedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdateQuizStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuizStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuizStatusData {
  quiz_update?: Quiz_Key | null;
}
```
### Using `UpdateQuizStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuizStatus, UpdateQuizStatusVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuizStatus` mutation requires an argument of type `UpdateQuizStatusVariables`:
const updateQuizStatusVars: UpdateQuizStatusVariables = {
  id: ..., 
  status: ..., 
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateQuizStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuizStatus(updateQuizStatusVars);
// Variables can be defined inline as well.
const { data } = await updateQuizStatus({ id: ..., status: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuizStatus(dataConnect, updateQuizStatusVars);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
updateQuizStatus(updateQuizStatusVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

### Using `UpdateQuizStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuizStatusRef, UpdateQuizStatusVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuizStatus` mutation requires an argument of type `UpdateQuizStatusVariables`:
const updateQuizStatusVars: UpdateQuizStatusVariables = {
  id: ..., 
  status: ..., 
  updatedById: ..., // optional
  publishedAt: ..., // optional
};

// Call the `updateQuizStatusRef()` function to get a reference to the mutation.
const ref = updateQuizStatusRef(updateQuizStatusVars);
// Variables can be defined inline as well.
const ref = updateQuizStatusRef({ id: ..., status: ..., updatedById: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuizStatusRef(dataConnect, updateQuizStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

## UpdateQuiz
You can execute the `UpdateQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateQuiz(vars: UpdateQuizVariables): MutationPromise<UpdateQuizData, UpdateQuizVariables>;

interface UpdateQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuizVariables): MutationRef<UpdateQuizData, UpdateQuizVariables>;
}
export const updateQuizRef: UpdateQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateQuiz(dc: DataConnect, vars: UpdateQuizVariables): MutationPromise<UpdateQuizData, UpdateQuizVariables>;

interface UpdateQuizRef {
  ...
  (dc: DataConnect, vars: UpdateQuizVariables): MutationRef<UpdateQuizData, UpdateQuizVariables>;
}
export const updateQuizRef: UpdateQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateQuizRef:
```typescript
const name = updateQuizRef.operationName;
console.log(name);
```

### Variables
The `UpdateQuiz` mutation requires an argument of type `UpdateQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateQuizVariables {
  id: UUIDString;
  shuffleQuestions?: boolean | null;
  shuffleChoices?: boolean | null;
  passingScore?: number | null;
  timeLimitSeconds?: number | null;
  updatedById?: string | null;
}
```
### Return Type
Recall that executing the `UpdateQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateQuizData {
  quiz_update?: Quiz_Key | null;
}
```
### Using `UpdateQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateQuiz, UpdateQuizVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuiz` mutation requires an argument of type `UpdateQuizVariables`:
const updateQuizVars: UpdateQuizVariables = {
  id: ..., 
  shuffleQuestions: ..., // optional
  shuffleChoices: ..., // optional
  passingScore: ..., // optional
  timeLimitSeconds: ..., // optional
  updatedById: ..., // optional
};

// Call the `updateQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateQuiz(updateQuizVars);
// Variables can be defined inline as well.
const { data } = await updateQuiz({ id: ..., shuffleQuestions: ..., shuffleChoices: ..., passingScore: ..., timeLimitSeconds: ..., updatedById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateQuiz(dataConnect, updateQuizVars);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
updateQuiz(updateQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

### Using `UpdateQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateQuizRef, UpdateQuizVariables } from '@impact26/dataconnect-sdk';

// The `UpdateQuiz` mutation requires an argument of type `UpdateQuizVariables`:
const updateQuizVars: UpdateQuizVariables = {
  id: ..., 
  shuffleQuestions: ..., // optional
  shuffleChoices: ..., // optional
  passingScore: ..., // optional
  timeLimitSeconds: ..., // optional
  updatedById: ..., // optional
};

// Call the `updateQuizRef()` function to get a reference to the mutation.
const ref = updateQuizRef(updateQuizVars);
// Variables can be defined inline as well.
const ref = updateQuizRef({ id: ..., shuffleQuestions: ..., shuffleChoices: ..., passingScore: ..., timeLimitSeconds: ..., updatedById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateQuizRef(dataConnect, updateQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_update);
});
```

## DeleteQuizQuestionsForQuiz
You can execute the `DeleteQuizQuestionsForQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuizQuestionsForQuiz(vars: DeleteQuizQuestionsForQuizVariables): MutationPromise<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;

interface DeleteQuizQuestionsForQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizQuestionsForQuizVariables): MutationRef<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;
}
export const deleteQuizQuestionsForQuizRef: DeleteQuizQuestionsForQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuizQuestionsForQuiz(dc: DataConnect, vars: DeleteQuizQuestionsForQuizVariables): MutationPromise<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;

interface DeleteQuizQuestionsForQuizRef {
  ...
  (dc: DataConnect, vars: DeleteQuizQuestionsForQuizVariables): MutationRef<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;
}
export const deleteQuizQuestionsForQuizRef: DeleteQuizQuestionsForQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizQuestionsForQuizRef:
```typescript
const name = deleteQuizQuestionsForQuizRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuizQuestionsForQuiz` mutation requires an argument of type `DeleteQuizQuestionsForQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizQuestionsForQuizVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuizQuestionsForQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizQuestionsForQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizQuestionsForQuizData {
  quizQuestion_deleteMany: number;
}
```
### Using `DeleteQuizQuestionsForQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuizQuestionsForQuiz, DeleteQuizQuestionsForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizQuestionsForQuiz` mutation requires an argument of type `DeleteQuizQuestionsForQuizVariables`:
const deleteQuizQuestionsForQuizVars: DeleteQuizQuestionsForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizQuestionsForQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuizQuestionsForQuiz(deleteQuizQuestionsForQuizVars);
// Variables can be defined inline as well.
const { data } = await deleteQuizQuestionsForQuiz({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuizQuestionsForQuiz(dataConnect, deleteQuizQuestionsForQuizVars);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
deleteQuizQuestionsForQuiz(deleteQuizQuestionsForQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

### Using `DeleteQuizQuestionsForQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizQuestionsForQuizRef, DeleteQuizQuestionsForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizQuestionsForQuiz` mutation requires an argument of type `DeleteQuizQuestionsForQuizVariables`:
const deleteQuizQuestionsForQuizVars: DeleteQuizQuestionsForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizQuestionsForQuizRef()` function to get a reference to the mutation.
const ref = deleteQuizQuestionsForQuizRef(deleteQuizQuestionsForQuizVars);
// Variables can be defined inline as well.
const ref = deleteQuizQuestionsForQuizRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizQuestionsForQuizRef(dataConnect, deleteQuizQuestionsForQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

## RemoveQuestionFromQuiz
You can execute the `RemoveQuestionFromQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
removeQuestionFromQuiz(vars: RemoveQuestionFromQuizVariables): MutationPromise<RemoveQuestionFromQuizData, RemoveQuestionFromQuizVariables>;

interface RemoveQuestionFromQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveQuestionFromQuizVariables): MutationRef<RemoveQuestionFromQuizData, RemoveQuestionFromQuizVariables>;
}
export const removeQuestionFromQuizRef: RemoveQuestionFromQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeQuestionFromQuiz(dc: DataConnect, vars: RemoveQuestionFromQuizVariables): MutationPromise<RemoveQuestionFromQuizData, RemoveQuestionFromQuizVariables>;

interface RemoveQuestionFromQuizRef {
  ...
  (dc: DataConnect, vars: RemoveQuestionFromQuizVariables): MutationRef<RemoveQuestionFromQuizData, RemoveQuestionFromQuizVariables>;
}
export const removeQuestionFromQuizRef: RemoveQuestionFromQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeQuestionFromQuizRef:
```typescript
const name = removeQuestionFromQuizRef.operationName;
console.log(name);
```

### Variables
The `RemoveQuestionFromQuiz` mutation requires an argument of type `RemoveQuestionFromQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveQuestionFromQuizVariables {
  quizId: UUIDString;
  questionId: UUIDString;
}
```
### Return Type
Recall that executing the `RemoveQuestionFromQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveQuestionFromQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveQuestionFromQuizData {
  quizQuestion_deleteMany: number;
}
```
### Using `RemoveQuestionFromQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeQuestionFromQuiz, RemoveQuestionFromQuizVariables } from '@impact26/dataconnect-sdk';

// The `RemoveQuestionFromQuiz` mutation requires an argument of type `RemoveQuestionFromQuizVariables`:
const removeQuestionFromQuizVars: RemoveQuestionFromQuizVariables = {
  quizId: ..., 
  questionId: ..., 
};

// Call the `removeQuestionFromQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeQuestionFromQuiz(removeQuestionFromQuizVars);
// Variables can be defined inline as well.
const { data } = await removeQuestionFromQuiz({ quizId: ..., questionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeQuestionFromQuiz(dataConnect, removeQuestionFromQuizVars);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
removeQuestionFromQuiz(removeQuestionFromQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

### Using `RemoveQuestionFromQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeQuestionFromQuizRef, RemoveQuestionFromQuizVariables } from '@impact26/dataconnect-sdk';

// The `RemoveQuestionFromQuiz` mutation requires an argument of type `RemoveQuestionFromQuizVariables`:
const removeQuestionFromQuizVars: RemoveQuestionFromQuizVariables = {
  quizId: ..., 
  questionId: ..., 
};

// Call the `removeQuestionFromQuizRef()` function to get a reference to the mutation.
const ref = removeQuestionFromQuizRef(removeQuestionFromQuizVars);
// Variables can be defined inline as well.
const ref = removeQuestionFromQuizRef({ quizId: ..., questionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeQuestionFromQuizRef(dataConnect, removeQuestionFromQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizQuestion_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_deleteMany);
});
```

## ReorderQuizQuestion
You can execute the `ReorderQuizQuestion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
reorderQuizQuestion(vars: ReorderQuizQuestionVariables): MutationPromise<ReorderQuizQuestionData, ReorderQuizQuestionVariables>;

interface ReorderQuizQuestionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReorderQuizQuestionVariables): MutationRef<ReorderQuizQuestionData, ReorderQuizQuestionVariables>;
}
export const reorderQuizQuestionRef: ReorderQuizQuestionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
reorderQuizQuestion(dc: DataConnect, vars: ReorderQuizQuestionVariables): MutationPromise<ReorderQuizQuestionData, ReorderQuizQuestionVariables>;

interface ReorderQuizQuestionRef {
  ...
  (dc: DataConnect, vars: ReorderQuizQuestionVariables): MutationRef<ReorderQuizQuestionData, ReorderQuizQuestionVariables>;
}
export const reorderQuizQuestionRef: ReorderQuizQuestionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the reorderQuizQuestionRef:
```typescript
const name = reorderQuizQuestionRef.operationName;
console.log(name);
```

### Variables
The `ReorderQuizQuestion` mutation requires an argument of type `ReorderQuizQuestionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ReorderQuizQuestionVariables {
  quizId: UUIDString;
  questionId: UUIDString;
  position: number;
}
```
### Return Type
Recall that executing the `ReorderQuizQuestion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ReorderQuizQuestionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ReorderQuizQuestionData {
  quizQuestion_updateMany: number;
}
```
### Using `ReorderQuizQuestion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, reorderQuizQuestion, ReorderQuizQuestionVariables } from '@impact26/dataconnect-sdk';

// The `ReorderQuizQuestion` mutation requires an argument of type `ReorderQuizQuestionVariables`:
const reorderQuizQuestionVars: ReorderQuizQuestionVariables = {
  quizId: ..., 
  questionId: ..., 
  position: ..., 
};

// Call the `reorderQuizQuestion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await reorderQuizQuestion(reorderQuizQuestionVars);
// Variables can be defined inline as well.
const { data } = await reorderQuizQuestion({ quizId: ..., questionId: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await reorderQuizQuestion(dataConnect, reorderQuizQuestionVars);

console.log(data.quizQuestion_updateMany);

// Or, you can use the `Promise` API.
reorderQuizQuestion(reorderQuizQuestionVars).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_updateMany);
});
```

### Using `ReorderQuizQuestion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, reorderQuizQuestionRef, ReorderQuizQuestionVariables } from '@impact26/dataconnect-sdk';

// The `ReorderQuizQuestion` mutation requires an argument of type `ReorderQuizQuestionVariables`:
const reorderQuizQuestionVars: ReorderQuizQuestionVariables = {
  quizId: ..., 
  questionId: ..., 
  position: ..., 
};

// Call the `reorderQuizQuestionRef()` function to get a reference to the mutation.
const ref = reorderQuizQuestionRef(reorderQuizQuestionVars);
// Variables can be defined inline as well.
const ref = reorderQuizQuestionRef({ quizId: ..., questionId: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = reorderQuizQuestionRef(dataConnect, reorderQuizQuestionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizQuestion_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizQuestion_updateMany);
});
```

## DeleteQuizResponsesForQuiz
You can execute the `DeleteQuizResponsesForQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuizResponsesForQuiz(vars: DeleteQuizResponsesForQuizVariables): MutationPromise<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;

interface DeleteQuizResponsesForQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizResponsesForQuizVariables): MutationRef<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;
}
export const deleteQuizResponsesForQuizRef: DeleteQuizResponsesForQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuizResponsesForQuiz(dc: DataConnect, vars: DeleteQuizResponsesForQuizVariables): MutationPromise<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;

interface DeleteQuizResponsesForQuizRef {
  ...
  (dc: DataConnect, vars: DeleteQuizResponsesForQuizVariables): MutationRef<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;
}
export const deleteQuizResponsesForQuizRef: DeleteQuizResponsesForQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizResponsesForQuizRef:
```typescript
const name = deleteQuizResponsesForQuizRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuizResponsesForQuiz` mutation requires an argument of type `DeleteQuizResponsesForQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizResponsesForQuizVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuizResponsesForQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizResponsesForQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizResponsesForQuizData {
  quizResponse_deleteMany: number;
}
```
### Using `DeleteQuizResponsesForQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuizResponsesForQuiz, DeleteQuizResponsesForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizResponsesForQuiz` mutation requires an argument of type `DeleteQuizResponsesForQuizVariables`:
const deleteQuizResponsesForQuizVars: DeleteQuizResponsesForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizResponsesForQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuizResponsesForQuiz(deleteQuizResponsesForQuizVars);
// Variables can be defined inline as well.
const { data } = await deleteQuizResponsesForQuiz({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuizResponsesForQuiz(dataConnect, deleteQuizResponsesForQuizVars);

console.log(data.quizResponse_deleteMany);

// Or, you can use the `Promise` API.
deleteQuizResponsesForQuiz(deleteQuizResponsesForQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_deleteMany);
});
```

### Using `DeleteQuizResponsesForQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizResponsesForQuizRef, DeleteQuizResponsesForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizResponsesForQuiz` mutation requires an argument of type `DeleteQuizResponsesForQuizVariables`:
const deleteQuizResponsesForQuizVars: DeleteQuizResponsesForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizResponsesForQuizRef()` function to get a reference to the mutation.
const ref = deleteQuizResponsesForQuizRef(deleteQuizResponsesForQuizVars);
// Variables can be defined inline as well.
const ref = deleteQuizResponsesForQuizRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizResponsesForQuizRef(dataConnect, deleteQuizResponsesForQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizResponse_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_deleteMany);
});
```

## DeleteQuizAttemptsForQuiz
You can execute the `DeleteQuizAttemptsForQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuizAttemptsForQuiz(vars: DeleteQuizAttemptsForQuizVariables): MutationPromise<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;

interface DeleteQuizAttemptsForQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizAttemptsForQuizVariables): MutationRef<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;
}
export const deleteQuizAttemptsForQuizRef: DeleteQuizAttemptsForQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuizAttemptsForQuiz(dc: DataConnect, vars: DeleteQuizAttemptsForQuizVariables): MutationPromise<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;

interface DeleteQuizAttemptsForQuizRef {
  ...
  (dc: DataConnect, vars: DeleteQuizAttemptsForQuizVariables): MutationRef<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;
}
export const deleteQuizAttemptsForQuizRef: DeleteQuizAttemptsForQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizAttemptsForQuizRef:
```typescript
const name = deleteQuizAttemptsForQuizRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuizAttemptsForQuiz` mutation requires an argument of type `DeleteQuizAttemptsForQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizAttemptsForQuizVariables {
  quizId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuizAttemptsForQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizAttemptsForQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizAttemptsForQuizData {
  quizAttempt_deleteMany: number;
}
```
### Using `DeleteQuizAttemptsForQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuizAttemptsForQuiz, DeleteQuizAttemptsForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizAttemptsForQuiz` mutation requires an argument of type `DeleteQuizAttemptsForQuizVariables`:
const deleteQuizAttemptsForQuizVars: DeleteQuizAttemptsForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizAttemptsForQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuizAttemptsForQuiz(deleteQuizAttemptsForQuizVars);
// Variables can be defined inline as well.
const { data } = await deleteQuizAttemptsForQuiz({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuizAttemptsForQuiz(dataConnect, deleteQuizAttemptsForQuizVars);

console.log(data.quizAttempt_deleteMany);

// Or, you can use the `Promise` API.
deleteQuizAttemptsForQuiz(deleteQuizAttemptsForQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_deleteMany);
});
```

### Using `DeleteQuizAttemptsForQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizAttemptsForQuizRef, DeleteQuizAttemptsForQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuizAttemptsForQuiz` mutation requires an argument of type `DeleteQuizAttemptsForQuizVariables`:
const deleteQuizAttemptsForQuizVars: DeleteQuizAttemptsForQuizVariables = {
  quizId: ..., 
};

// Call the `deleteQuizAttemptsForQuizRef()` function to get a reference to the mutation.
const ref = deleteQuizAttemptsForQuizRef(deleteQuizAttemptsForQuizVars);
// Variables can be defined inline as well.
const ref = deleteQuizAttemptsForQuizRef({ quizId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizAttemptsForQuizRef(dataConnect, deleteQuizAttemptsForQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizAttempt_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_deleteMany);
});
```

## DeleteQuiz
You can execute the `DeleteQuiz` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteQuiz(vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;

interface DeleteQuizRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
}
export const deleteQuizRef: DeleteQuizRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteQuiz(dc: DataConnect, vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;

interface DeleteQuizRef {
  ...
  (dc: DataConnect, vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
}
export const deleteQuizRef: DeleteQuizRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteQuizRef:
```typescript
const name = deleteQuizRef.operationName;
console.log(name);
```

### Variables
The `DeleteQuiz` mutation requires an argument of type `DeleteQuizVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteQuizVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteQuiz` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteQuizData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteQuizData {
  quiz_delete?: Quiz_Key | null;
}
```
### Using `DeleteQuiz`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteQuiz, DeleteQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuiz` mutation requires an argument of type `DeleteQuizVariables`:
const deleteQuizVars: DeleteQuizVariables = {
  id: ..., 
};

// Call the `deleteQuiz()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteQuiz(deleteQuizVars);
// Variables can be defined inline as well.
const { data } = await deleteQuiz({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteQuiz(dataConnect, deleteQuizVars);

console.log(data.quiz_delete);

// Or, you can use the `Promise` API.
deleteQuiz(deleteQuizVars).then((response) => {
  const data = response.data;
  console.log(data.quiz_delete);
});
```

### Using `DeleteQuiz`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteQuizRef, DeleteQuizVariables } from '@impact26/dataconnect-sdk';

// The `DeleteQuiz` mutation requires an argument of type `DeleteQuizVariables`:
const deleteQuizVars: DeleteQuizVariables = {
  id: ..., 
};

// Call the `deleteQuizRef()` function to get a reference to the mutation.
const ref = deleteQuizRef(deleteQuizVars);
// Variables can be defined inline as well.
const ref = deleteQuizRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteQuizRef(dataConnect, deleteQuizVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quiz_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quiz_delete);
});
```

## EnrollInCourse
You can execute the `EnrollInCourse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
enrollInCourse(vars: EnrollInCourseVariables): MutationPromise<EnrollInCourseData, EnrollInCourseVariables>;

interface EnrollInCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EnrollInCourseVariables): MutationRef<EnrollInCourseData, EnrollInCourseVariables>;
}
export const enrollInCourseRef: EnrollInCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
enrollInCourse(dc: DataConnect, vars: EnrollInCourseVariables): MutationPromise<EnrollInCourseData, EnrollInCourseVariables>;

interface EnrollInCourseRef {
  ...
  (dc: DataConnect, vars: EnrollInCourseVariables): MutationRef<EnrollInCourseData, EnrollInCourseVariables>;
}
export const enrollInCourseRef: EnrollInCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the enrollInCourseRef:
```typescript
const name = enrollInCourseRef.operationName;
console.log(name);
```

### Variables
The `EnrollInCourse` mutation requires an argument of type `EnrollInCourseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EnrollInCourseVariables {
  userId: string;
  courseId: UUIDString;
}
```
### Return Type
Recall that executing the `EnrollInCourse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EnrollInCourseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EnrollInCourseData {
  userCourseProgress_insert: UserCourseProgress_Key;
}
```
### Using `EnrollInCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, enrollInCourse, EnrollInCourseVariables } from '@impact26/dataconnect-sdk';

// The `EnrollInCourse` mutation requires an argument of type `EnrollInCourseVariables`:
const enrollInCourseVars: EnrollInCourseVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `enrollInCourse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await enrollInCourse(enrollInCourseVars);
// Variables can be defined inline as well.
const { data } = await enrollInCourse({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await enrollInCourse(dataConnect, enrollInCourseVars);

console.log(data.userCourseProgress_insert);

// Or, you can use the `Promise` API.
enrollInCourse(enrollInCourseVars).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress_insert);
});
```

### Using `EnrollInCourse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, enrollInCourseRef, EnrollInCourseVariables } from '@impact26/dataconnect-sdk';

// The `EnrollInCourse` mutation requires an argument of type `EnrollInCourseVariables`:
const enrollInCourseVars: EnrollInCourseVariables = {
  userId: ..., 
  courseId: ..., 
};

// Call the `enrollInCourseRef()` function to get a reference to the mutation.
const ref = enrollInCourseRef(enrollInCourseVars);
// Variables can be defined inline as well.
const ref = enrollInCourseRef({ userId: ..., courseId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = enrollInCourseRef(dataConnect, enrollInCourseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userCourseProgress_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress_insert);
});
```

## UpdateUserCourseProgress
You can execute the `UpdateUserCourseProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateUserCourseProgress(vars: UpdateUserCourseProgressVariables): MutationPromise<UpdateUserCourseProgressData, UpdateUserCourseProgressVariables>;

interface UpdateUserCourseProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserCourseProgressVariables): MutationRef<UpdateUserCourseProgressData, UpdateUserCourseProgressVariables>;
}
export const updateUserCourseProgressRef: UpdateUserCourseProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserCourseProgress(dc: DataConnect, vars: UpdateUserCourseProgressVariables): MutationPromise<UpdateUserCourseProgressData, UpdateUserCourseProgressVariables>;

interface UpdateUserCourseProgressRef {
  ...
  (dc: DataConnect, vars: UpdateUserCourseProgressVariables): MutationRef<UpdateUserCourseProgressData, UpdateUserCourseProgressVariables>;
}
export const updateUserCourseProgressRef: UpdateUserCourseProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserCourseProgressRef:
```typescript
const name = updateUserCourseProgressRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserCourseProgress` mutation requires an argument of type `UpdateUserCourseProgressVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserCourseProgressVariables {
  userId: string;
  courseId: UUIDString;
  lastAccessedAt?: DateString | null;
  completedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdateUserCourseProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserCourseProgressData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserCourseProgressData {
  userCourseProgress_upsert: UserCourseProgress_Key;
}
```
### Using `UpdateUserCourseProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserCourseProgress, UpdateUserCourseProgressVariables } from '@impact26/dataconnect-sdk';

// The `UpdateUserCourseProgress` mutation requires an argument of type `UpdateUserCourseProgressVariables`:
const updateUserCourseProgressVars: UpdateUserCourseProgressVariables = {
  userId: ..., 
  courseId: ..., 
  lastAccessedAt: ..., // optional
  completedAt: ..., // optional
};

// Call the `updateUserCourseProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserCourseProgress(updateUserCourseProgressVars);
// Variables can be defined inline as well.
const { data } = await updateUserCourseProgress({ userId: ..., courseId: ..., lastAccessedAt: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserCourseProgress(dataConnect, updateUserCourseProgressVars);

console.log(data.userCourseProgress_upsert);

// Or, you can use the `Promise` API.
updateUserCourseProgress(updateUserCourseProgressVars).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress_upsert);
});
```

### Using `UpdateUserCourseProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserCourseProgressRef, UpdateUserCourseProgressVariables } from '@impact26/dataconnect-sdk';

// The `UpdateUserCourseProgress` mutation requires an argument of type `UpdateUserCourseProgressVariables`:
const updateUserCourseProgressVars: UpdateUserCourseProgressVariables = {
  userId: ..., 
  courseId: ..., 
  lastAccessedAt: ..., // optional
  completedAt: ..., // optional
};

// Call the `updateUserCourseProgressRef()` function to get a reference to the mutation.
const ref = updateUserCourseProgressRef(updateUserCourseProgressVars);
// Variables can be defined inline as well.
const ref = updateUserCourseProgressRef({ userId: ..., courseId: ..., lastAccessedAt: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserCourseProgressRef(dataConnect, updateUserCourseProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userCourseProgress_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userCourseProgress_upsert);
});
```

## UpsertLessonProgress
You can execute the `UpsertLessonProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
upsertLessonProgress(vars: UpsertLessonProgressVariables): MutationPromise<UpsertLessonProgressData, UpsertLessonProgressVariables>;

interface UpsertLessonProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertLessonProgressVariables): MutationRef<UpsertLessonProgressData, UpsertLessonProgressVariables>;
}
export const upsertLessonProgressRef: UpsertLessonProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertLessonProgress(dc: DataConnect, vars: UpsertLessonProgressVariables): MutationPromise<UpsertLessonProgressData, UpsertLessonProgressVariables>;

interface UpsertLessonProgressRef {
  ...
  (dc: DataConnect, vars: UpsertLessonProgressVariables): MutationRef<UpsertLessonProgressData, UpsertLessonProgressVariables>;
}
export const upsertLessonProgressRef: UpsertLessonProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertLessonProgressRef:
```typescript
const name = upsertLessonProgressRef.operationName;
console.log(name);
```

### Variables
The `UpsertLessonProgress` mutation requires an argument of type `UpsertLessonProgressVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertLessonProgressVariables {
  userId: string;
  lessonId: UUIDString;
  status: string;
  videoPositionSeconds?: number | null;
  completedAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpsertLessonProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertLessonProgressData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertLessonProgressData {
  userLessonProgress_upsert: UserLessonProgress_Key;
}
```
### Using `UpsertLessonProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertLessonProgress, UpsertLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `UpsertLessonProgress` mutation requires an argument of type `UpsertLessonProgressVariables`:
const upsertLessonProgressVars: UpsertLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
  status: ..., 
  videoPositionSeconds: ..., // optional
  completedAt: ..., // optional
};

// Call the `upsertLessonProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertLessonProgress(upsertLessonProgressVars);
// Variables can be defined inline as well.
const { data } = await upsertLessonProgress({ userId: ..., lessonId: ..., status: ..., videoPositionSeconds: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertLessonProgress(dataConnect, upsertLessonProgressVars);

console.log(data.userLessonProgress_upsert);

// Or, you can use the `Promise` API.
upsertLessonProgress(upsertLessonProgressVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_upsert);
});
```

### Using `UpsertLessonProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertLessonProgressRef, UpsertLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `UpsertLessonProgress` mutation requires an argument of type `UpsertLessonProgressVariables`:
const upsertLessonProgressVars: UpsertLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
  status: ..., 
  videoPositionSeconds: ..., // optional
  completedAt: ..., // optional
};

// Call the `upsertLessonProgressRef()` function to get a reference to the mutation.
const ref = upsertLessonProgressRef(upsertLessonProgressVars);
// Variables can be defined inline as well.
const ref = upsertLessonProgressRef({ userId: ..., lessonId: ..., status: ..., videoPositionSeconds: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertLessonProgressRef(dataConnect, upsertLessonProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userLessonProgress_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_upsert);
});
```

## UpdateLessonPlayback
You can execute the `UpdateLessonPlayback` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateLessonPlayback(vars: UpdateLessonPlaybackVariables): MutationPromise<UpdateLessonPlaybackData, UpdateLessonPlaybackVariables>;

interface UpdateLessonPlaybackRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLessonPlaybackVariables): MutationRef<UpdateLessonPlaybackData, UpdateLessonPlaybackVariables>;
}
export const updateLessonPlaybackRef: UpdateLessonPlaybackRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLessonPlayback(dc: DataConnect, vars: UpdateLessonPlaybackVariables): MutationPromise<UpdateLessonPlaybackData, UpdateLessonPlaybackVariables>;

interface UpdateLessonPlaybackRef {
  ...
  (dc: DataConnect, vars: UpdateLessonPlaybackVariables): MutationRef<UpdateLessonPlaybackData, UpdateLessonPlaybackVariables>;
}
export const updateLessonPlaybackRef: UpdateLessonPlaybackRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLessonPlaybackRef:
```typescript
const name = updateLessonPlaybackRef.operationName;
console.log(name);
```

### Variables
The `UpdateLessonPlayback` mutation requires an argument of type `UpdateLessonPlaybackVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateLessonPlaybackVariables {
  userId: string;
  lessonId: UUIDString;
  videoPositionSeconds?: number | null;
}
```
### Return Type
Recall that executing the `UpdateLessonPlayback` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLessonPlaybackData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLessonPlaybackData {
  userLessonProgress_upsert: UserLessonProgress_Key;
}
```
### Using `UpdateLessonPlayback`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLessonPlayback, UpdateLessonPlaybackVariables } from '@impact26/dataconnect-sdk';

// The `UpdateLessonPlayback` mutation requires an argument of type `UpdateLessonPlaybackVariables`:
const updateLessonPlaybackVars: UpdateLessonPlaybackVariables = {
  userId: ..., 
  lessonId: ..., 
  videoPositionSeconds: ..., // optional
};

// Call the `updateLessonPlayback()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLessonPlayback(updateLessonPlaybackVars);
// Variables can be defined inline as well.
const { data } = await updateLessonPlayback({ userId: ..., lessonId: ..., videoPositionSeconds: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLessonPlayback(dataConnect, updateLessonPlaybackVars);

console.log(data.userLessonProgress_upsert);

// Or, you can use the `Promise` API.
updateLessonPlayback(updateLessonPlaybackVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_upsert);
});
```

### Using `UpdateLessonPlayback`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLessonPlaybackRef, UpdateLessonPlaybackVariables } from '@impact26/dataconnect-sdk';

// The `UpdateLessonPlayback` mutation requires an argument of type `UpdateLessonPlaybackVariables`:
const updateLessonPlaybackVars: UpdateLessonPlaybackVariables = {
  userId: ..., 
  lessonId: ..., 
  videoPositionSeconds: ..., // optional
};

// Call the `updateLessonPlaybackRef()` function to get a reference to the mutation.
const ref = updateLessonPlaybackRef(updateLessonPlaybackVars);
// Variables can be defined inline as well.
const ref = updateLessonPlaybackRef({ userId: ..., lessonId: ..., videoPositionSeconds: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLessonPlaybackRef(dataConnect, updateLessonPlaybackVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userLessonProgress_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_upsert);
});
```

## CompleteLessonProgress
You can execute the `CompleteLessonProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
completeLessonProgress(vars: CompleteLessonProgressVariables): MutationPromise<CompleteLessonProgressData, CompleteLessonProgressVariables>;

interface CompleteLessonProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteLessonProgressVariables): MutationRef<CompleteLessonProgressData, CompleteLessonProgressVariables>;
}
export const completeLessonProgressRef: CompleteLessonProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeLessonProgress(dc: DataConnect, vars: CompleteLessonProgressVariables): MutationPromise<CompleteLessonProgressData, CompleteLessonProgressVariables>;

interface CompleteLessonProgressRef {
  ...
  (dc: DataConnect, vars: CompleteLessonProgressVariables): MutationRef<CompleteLessonProgressData, CompleteLessonProgressVariables>;
}
export const completeLessonProgressRef: CompleteLessonProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeLessonProgressRef:
```typescript
const name = completeLessonProgressRef.operationName;
console.log(name);
```

### Variables
The `CompleteLessonProgress` mutation requires an argument of type `CompleteLessonProgressVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CompleteLessonProgressVariables {
  userId: string;
  lessonId: UUIDString;
  videoPositionSeconds?: number | null;
  completedAt: DateString;
}
```
### Return Type
Recall that executing the `CompleteLessonProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteLessonProgressData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteLessonProgressData {
  userLessonProgress_upsert: UserLessonProgress_Key;
}
```
### Using `CompleteLessonProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeLessonProgress, CompleteLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `CompleteLessonProgress` mutation requires an argument of type `CompleteLessonProgressVariables`:
const completeLessonProgressVars: CompleteLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
  videoPositionSeconds: ..., // optional
  completedAt: ..., 
};

// Call the `completeLessonProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeLessonProgress(completeLessonProgressVars);
// Variables can be defined inline as well.
const { data } = await completeLessonProgress({ userId: ..., lessonId: ..., videoPositionSeconds: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeLessonProgress(dataConnect, completeLessonProgressVars);

console.log(data.userLessonProgress_upsert);

// Or, you can use the `Promise` API.
completeLessonProgress(completeLessonProgressVars).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_upsert);
});
```

### Using `CompleteLessonProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeLessonProgressRef, CompleteLessonProgressVariables } from '@impact26/dataconnect-sdk';

// The `CompleteLessonProgress` mutation requires an argument of type `CompleteLessonProgressVariables`:
const completeLessonProgressVars: CompleteLessonProgressVariables = {
  userId: ..., 
  lessonId: ..., 
  videoPositionSeconds: ..., // optional
  completedAt: ..., 
};

// Call the `completeLessonProgressRef()` function to get a reference to the mutation.
const ref = completeLessonProgressRef(completeLessonProgressVars);
// Variables can be defined inline as well.
const ref = completeLessonProgressRef({ userId: ..., lessonId: ..., videoPositionSeconds: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeLessonProgressRef(dataConnect, completeLessonProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userLessonProgress_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userLessonProgress_upsert);
});
```

## RecordDailyActivity
You can execute the `RecordDailyActivity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
recordDailyActivity(vars: RecordDailyActivityVariables): MutationPromise<RecordDailyActivityData, RecordDailyActivityVariables>;

interface RecordDailyActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordDailyActivityVariables): MutationRef<RecordDailyActivityData, RecordDailyActivityVariables>;
}
export const recordDailyActivityRef: RecordDailyActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordDailyActivity(dc: DataConnect, vars: RecordDailyActivityVariables): MutationPromise<RecordDailyActivityData, RecordDailyActivityVariables>;

interface RecordDailyActivityRef {
  ...
  (dc: DataConnect, vars: RecordDailyActivityVariables): MutationRef<RecordDailyActivityData, RecordDailyActivityVariables>;
}
export const recordDailyActivityRef: RecordDailyActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordDailyActivityRef:
```typescript
const name = recordDailyActivityRef.operationName;
console.log(name);
```

### Variables
The `RecordDailyActivity` mutation requires an argument of type `RecordDailyActivityVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordDailyActivityVariables {
  userId: string;
  activityDate: string;
  lastActivityAt: DateString;
}
```
### Return Type
Recall that executing the `RecordDailyActivity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordDailyActivityData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordDailyActivityData {
  dailyActivity_upsert: DailyActivity_Key;
}
```
### Using `RecordDailyActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordDailyActivity, RecordDailyActivityVariables } from '@impact26/dataconnect-sdk';

// The `RecordDailyActivity` mutation requires an argument of type `RecordDailyActivityVariables`:
const recordDailyActivityVars: RecordDailyActivityVariables = {
  userId: ..., 
  activityDate: ..., 
  lastActivityAt: ..., 
};

// Call the `recordDailyActivity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordDailyActivity(recordDailyActivityVars);
// Variables can be defined inline as well.
const { data } = await recordDailyActivity({ userId: ..., activityDate: ..., lastActivityAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordDailyActivity(dataConnect, recordDailyActivityVars);

console.log(data.dailyActivity_upsert);

// Or, you can use the `Promise` API.
recordDailyActivity(recordDailyActivityVars).then((response) => {
  const data = response.data;
  console.log(data.dailyActivity_upsert);
});
```

### Using `RecordDailyActivity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordDailyActivityRef, RecordDailyActivityVariables } from '@impact26/dataconnect-sdk';

// The `RecordDailyActivity` mutation requires an argument of type `RecordDailyActivityVariables`:
const recordDailyActivityVars: RecordDailyActivityVariables = {
  userId: ..., 
  activityDate: ..., 
  lastActivityAt: ..., 
};

// Call the `recordDailyActivityRef()` function to get a reference to the mutation.
const ref = recordDailyActivityRef(recordDailyActivityVars);
// Variables can be defined inline as well.
const ref = recordDailyActivityRef({ userId: ..., activityDate: ..., lastActivityAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordDailyActivityRef(dataConnect, recordDailyActivityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dailyActivity_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dailyActivity_upsert);
});
```

## CreateQuizAttempt
You can execute the `CreateQuizAttempt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createQuizAttempt(vars: CreateQuizAttemptVariables): MutationPromise<CreateQuizAttemptData, CreateQuizAttemptVariables>;

interface CreateQuizAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuizAttemptVariables): MutationRef<CreateQuizAttemptData, CreateQuizAttemptVariables>;
}
export const createQuizAttemptRef: CreateQuizAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createQuizAttempt(dc: DataConnect, vars: CreateQuizAttemptVariables): MutationPromise<CreateQuizAttemptData, CreateQuizAttemptVariables>;

interface CreateQuizAttemptRef {
  ...
  (dc: DataConnect, vars: CreateQuizAttemptVariables): MutationRef<CreateQuizAttemptData, CreateQuizAttemptVariables>;
}
export const createQuizAttemptRef: CreateQuizAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createQuizAttemptRef:
```typescript
const name = createQuizAttemptRef.operationName;
console.log(name);
```

### Variables
The `CreateQuizAttempt` mutation requires an argument of type `CreateQuizAttemptVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateQuizAttemptVariables {
  userId: string;
  quizId: UUIDString;
  questionOrder: string;
}
```
### Return Type
Recall that executing the `CreateQuizAttempt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateQuizAttemptData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateQuizAttemptData {
  quizAttempt_insert: QuizAttempt_Key;
}
```
### Using `CreateQuizAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createQuizAttempt, CreateQuizAttemptVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuizAttempt` mutation requires an argument of type `CreateQuizAttemptVariables`:
const createQuizAttemptVars: CreateQuizAttemptVariables = {
  userId: ..., 
  quizId: ..., 
  questionOrder: ..., 
};

// Call the `createQuizAttempt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createQuizAttempt(createQuizAttemptVars);
// Variables can be defined inline as well.
const { data } = await createQuizAttempt({ userId: ..., quizId: ..., questionOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createQuizAttempt(dataConnect, createQuizAttemptVars);

console.log(data.quizAttempt_insert);

// Or, you can use the `Promise` API.
createQuizAttempt(createQuizAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_insert);
});
```

### Using `CreateQuizAttempt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createQuizAttemptRef, CreateQuizAttemptVariables } from '@impact26/dataconnect-sdk';

// The `CreateQuizAttempt` mutation requires an argument of type `CreateQuizAttemptVariables`:
const createQuizAttemptVars: CreateQuizAttemptVariables = {
  userId: ..., 
  quizId: ..., 
  questionOrder: ..., 
};

// Call the `createQuizAttemptRef()` function to get a reference to the mutation.
const ref = createQuizAttemptRef(createQuizAttemptVars);
// Variables can be defined inline as well.
const ref = createQuizAttemptRef({ userId: ..., quizId: ..., questionOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createQuizAttemptRef(dataConnect, createQuizAttemptVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizAttempt_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_insert);
});
```

## UpsertQuizResponse
You can execute the `UpsertQuizResponse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
upsertQuizResponse(vars: UpsertQuizResponseVariables): MutationPromise<UpsertQuizResponseData, UpsertQuizResponseVariables>;

interface UpsertQuizResponseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertQuizResponseVariables): MutationRef<UpsertQuizResponseData, UpsertQuizResponseVariables>;
}
export const upsertQuizResponseRef: UpsertQuizResponseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertQuizResponse(dc: DataConnect, vars: UpsertQuizResponseVariables): MutationPromise<UpsertQuizResponseData, UpsertQuizResponseVariables>;

interface UpsertQuizResponseRef {
  ...
  (dc: DataConnect, vars: UpsertQuizResponseVariables): MutationRef<UpsertQuizResponseData, UpsertQuizResponseVariables>;
}
export const upsertQuizResponseRef: UpsertQuizResponseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertQuizResponseRef:
```typescript
const name = upsertQuizResponseRef.operationName;
console.log(name);
```

### Variables
The `UpsertQuizResponse` mutation requires an argument of type `UpsertQuizResponseVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertQuizResponseVariables {
  attemptId: UUIDString;
  questionId: UUIDString;
  selectedLetters: string;
  isCorrect?: boolean | null;
  pointsEarned?: number | null;
  pointsPossible?: number | null;
  answeredAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpsertQuizResponse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertQuizResponseData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertQuizResponseData {
  quizResponse_upsert: QuizResponse_Key;
}
```
### Using `UpsertQuizResponse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertQuizResponse, UpsertQuizResponseVariables } from '@impact26/dataconnect-sdk';

// The `UpsertQuizResponse` mutation requires an argument of type `UpsertQuizResponseVariables`:
const upsertQuizResponseVars: UpsertQuizResponseVariables = {
  attemptId: ..., 
  questionId: ..., 
  selectedLetters: ..., 
  isCorrect: ..., // optional
  pointsEarned: ..., // optional
  pointsPossible: ..., // optional
  answeredAt: ..., // optional
};

// Call the `upsertQuizResponse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertQuizResponse(upsertQuizResponseVars);
// Variables can be defined inline as well.
const { data } = await upsertQuizResponse({ attemptId: ..., questionId: ..., selectedLetters: ..., isCorrect: ..., pointsEarned: ..., pointsPossible: ..., answeredAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertQuizResponse(dataConnect, upsertQuizResponseVars);

console.log(data.quizResponse_upsert);

// Or, you can use the `Promise` API.
upsertQuizResponse(upsertQuizResponseVars).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_upsert);
});
```

### Using `UpsertQuizResponse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertQuizResponseRef, UpsertQuizResponseVariables } from '@impact26/dataconnect-sdk';

// The `UpsertQuizResponse` mutation requires an argument of type `UpsertQuizResponseVariables`:
const upsertQuizResponseVars: UpsertQuizResponseVariables = {
  attemptId: ..., 
  questionId: ..., 
  selectedLetters: ..., 
  isCorrect: ..., // optional
  pointsEarned: ..., // optional
  pointsPossible: ..., // optional
  answeredAt: ..., // optional
};

// Call the `upsertQuizResponseRef()` function to get a reference to the mutation.
const ref = upsertQuizResponseRef(upsertQuizResponseVars);
// Variables can be defined inline as well.
const ref = upsertQuizResponseRef({ attemptId: ..., questionId: ..., selectedLetters: ..., isCorrect: ..., pointsEarned: ..., pointsPossible: ..., answeredAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertQuizResponseRef(dataConnect, upsertQuizResponseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizResponse_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_upsert);
});
```

## CompleteQuizAttempt
You can execute the `CompleteQuizAttempt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
completeQuizAttempt(vars: CompleteQuizAttemptVariables): MutationPromise<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;

interface CompleteQuizAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteQuizAttemptVariables): MutationRef<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;
}
export const completeQuizAttemptRef: CompleteQuizAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeQuizAttempt(dc: DataConnect, vars: CompleteQuizAttemptVariables): MutationPromise<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;

interface CompleteQuizAttemptRef {
  ...
  (dc: DataConnect, vars: CompleteQuizAttemptVariables): MutationRef<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;
}
export const completeQuizAttemptRef: CompleteQuizAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeQuizAttemptRef:
```typescript
const name = completeQuizAttemptRef.operationName;
console.log(name);
```

### Variables
The `CompleteQuizAttempt` mutation requires an argument of type `CompleteQuizAttemptVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CompleteQuizAttemptVariables {
  id: UUIDString;
  scoreRaw: number;
  scoreMax: number;
  scorePct: number;
  passed: boolean;
  completedAt: DateString;
}
```
### Return Type
Recall that executing the `CompleteQuizAttempt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteQuizAttemptData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteQuizAttemptData {
  quizAttempt_update?: QuizAttempt_Key | null;
}
```
### Using `CompleteQuizAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeQuizAttempt, CompleteQuizAttemptVariables } from '@impact26/dataconnect-sdk';

// The `CompleteQuizAttempt` mutation requires an argument of type `CompleteQuizAttemptVariables`:
const completeQuizAttemptVars: CompleteQuizAttemptVariables = {
  id: ..., 
  scoreRaw: ..., 
  scoreMax: ..., 
  scorePct: ..., 
  passed: ..., 
  completedAt: ..., 
};

// Call the `completeQuizAttempt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeQuizAttempt(completeQuizAttemptVars);
// Variables can be defined inline as well.
const { data } = await completeQuizAttempt({ id: ..., scoreRaw: ..., scoreMax: ..., scorePct: ..., passed: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeQuizAttempt(dataConnect, completeQuizAttemptVars);

console.log(data.quizAttempt_update);

// Or, you can use the `Promise` API.
completeQuizAttempt(completeQuizAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_update);
});
```

### Using `CompleteQuizAttempt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeQuizAttemptRef, CompleteQuizAttemptVariables } from '@impact26/dataconnect-sdk';

// The `CompleteQuizAttempt` mutation requires an argument of type `CompleteQuizAttemptVariables`:
const completeQuizAttemptVars: CompleteQuizAttemptVariables = {
  id: ..., 
  scoreRaw: ..., 
  scoreMax: ..., 
  scorePct: ..., 
  passed: ..., 
  completedAt: ..., 
};

// Call the `completeQuizAttemptRef()` function to get a reference to the mutation.
const ref = completeQuizAttemptRef(completeQuizAttemptVars);
// Variables can be defined inline as well.
const ref = completeQuizAttemptRef({ id: ..., scoreRaw: ..., scoreMax: ..., scorePct: ..., passed: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeQuizAttemptRef(dataConnect, completeQuizAttemptVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizAttempt_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizAttempt_update);
});
```

## MarkAnsweredAt
You can execute the `MarkAnsweredAt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
markAnsweredAt(vars: MarkAnsweredAtVariables): MutationPromise<MarkAnsweredAtData, MarkAnsweredAtVariables>;

interface MarkAnsweredAtRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAnsweredAtVariables): MutationRef<MarkAnsweredAtData, MarkAnsweredAtVariables>;
}
export const markAnsweredAtRef: MarkAnsweredAtRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markAnsweredAt(dc: DataConnect, vars: MarkAnsweredAtVariables): MutationPromise<MarkAnsweredAtData, MarkAnsweredAtVariables>;

interface MarkAnsweredAtRef {
  ...
  (dc: DataConnect, vars: MarkAnsweredAtVariables): MutationRef<MarkAnsweredAtData, MarkAnsweredAtVariables>;
}
export const markAnsweredAtRef: MarkAnsweredAtRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markAnsweredAtRef:
```typescript
const name = markAnsweredAtRef.operationName;
console.log(name);
```

### Variables
The `MarkAnsweredAt` mutation requires an argument of type `MarkAnsweredAtVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkAnsweredAtVariables {
  attemptId: UUIDString;
  questionId: UUIDString;
  answeredAt: DateString;
}
```
### Return Type
Recall that executing the `MarkAnsweredAt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkAnsweredAtData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkAnsweredAtData {
  quizResponse_update?: QuizResponse_Key | null;
}
```
### Using `MarkAnsweredAt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markAnsweredAt, MarkAnsweredAtVariables } from '@impact26/dataconnect-sdk';

// The `MarkAnsweredAt` mutation requires an argument of type `MarkAnsweredAtVariables`:
const markAnsweredAtVars: MarkAnsweredAtVariables = {
  attemptId: ..., 
  questionId: ..., 
  answeredAt: ..., 
};

// Call the `markAnsweredAt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markAnsweredAt(markAnsweredAtVars);
// Variables can be defined inline as well.
const { data } = await markAnsweredAt({ attemptId: ..., questionId: ..., answeredAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markAnsweredAt(dataConnect, markAnsweredAtVars);

console.log(data.quizResponse_update);

// Or, you can use the `Promise` API.
markAnsweredAt(markAnsweredAtVars).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_update);
});
```

### Using `MarkAnsweredAt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markAnsweredAtRef, MarkAnsweredAtVariables } from '@impact26/dataconnect-sdk';

// The `MarkAnsweredAt` mutation requires an argument of type `MarkAnsweredAtVariables`:
const markAnsweredAtVars: MarkAnsweredAtVariables = {
  attemptId: ..., 
  questionId: ..., 
  answeredAt: ..., 
};

// Call the `markAnsweredAtRef()` function to get a reference to the mutation.
const ref = markAnsweredAtRef(markAnsweredAtVars);
// Variables can be defined inline as well.
const ref = markAnsweredAtRef({ attemptId: ..., questionId: ..., answeredAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markAnsweredAtRef(dataConnect, markAnsweredAtVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.quizResponse_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.quizResponse_update);
});
```

## CreateFormulaSection
You can execute the `CreateFormulaSection` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createFormulaSection(vars: CreateFormulaSectionVariables): MutationPromise<CreateFormulaSectionData, CreateFormulaSectionVariables>;

interface CreateFormulaSectionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFormulaSectionVariables): MutationRef<CreateFormulaSectionData, CreateFormulaSectionVariables>;
}
export const createFormulaSectionRef: CreateFormulaSectionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFormulaSection(dc: DataConnect, vars: CreateFormulaSectionVariables): MutationPromise<CreateFormulaSectionData, CreateFormulaSectionVariables>;

interface CreateFormulaSectionRef {
  ...
  (dc: DataConnect, vars: CreateFormulaSectionVariables): MutationRef<CreateFormulaSectionData, CreateFormulaSectionVariables>;
}
export const createFormulaSectionRef: CreateFormulaSectionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFormulaSectionRef:
```typescript
const name = createFormulaSectionRef.operationName;
console.log(name);
```

### Variables
The `CreateFormulaSection` mutation requires an argument of type `CreateFormulaSectionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFormulaSectionVariables {
  id: UUIDString;
  code: string;
  title: string;
  position: number;
}
```
### Return Type
Recall that executing the `CreateFormulaSection` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFormulaSectionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFormulaSectionData {
  formulaSection_insert: FormulaSection_Key;
}
```
### Using `CreateFormulaSection`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFormulaSection, CreateFormulaSectionVariables } from '@impact26/dataconnect-sdk';

// The `CreateFormulaSection` mutation requires an argument of type `CreateFormulaSectionVariables`:
const createFormulaSectionVars: CreateFormulaSectionVariables = {
  id: ..., 
  code: ..., 
  title: ..., 
  position: ..., 
};

// Call the `createFormulaSection()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFormulaSection(createFormulaSectionVars);
// Variables can be defined inline as well.
const { data } = await createFormulaSection({ id: ..., code: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFormulaSection(dataConnect, createFormulaSectionVars);

console.log(data.formulaSection_insert);

// Or, you can use the `Promise` API.
createFormulaSection(createFormulaSectionVars).then((response) => {
  const data = response.data;
  console.log(data.formulaSection_insert);
});
```

### Using `CreateFormulaSection`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFormulaSectionRef, CreateFormulaSectionVariables } from '@impact26/dataconnect-sdk';

// The `CreateFormulaSection` mutation requires an argument of type `CreateFormulaSectionVariables`:
const createFormulaSectionVars: CreateFormulaSectionVariables = {
  id: ..., 
  code: ..., 
  title: ..., 
  position: ..., 
};

// Call the `createFormulaSectionRef()` function to get a reference to the mutation.
const ref = createFormulaSectionRef(createFormulaSectionVars);
// Variables can be defined inline as well.
const ref = createFormulaSectionRef({ id: ..., code: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFormulaSectionRef(dataConnect, createFormulaSectionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.formulaSection_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.formulaSection_insert);
});
```

## CreateFormula
You can execute the `CreateFormula` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createFormula(vars: CreateFormulaVariables): MutationPromise<CreateFormulaData, CreateFormulaVariables>;

interface CreateFormulaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFormulaVariables): MutationRef<CreateFormulaData, CreateFormulaVariables>;
}
export const createFormulaRef: CreateFormulaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFormula(dc: DataConnect, vars: CreateFormulaVariables): MutationPromise<CreateFormulaData, CreateFormulaVariables>;

interface CreateFormulaRef {
  ...
  (dc: DataConnect, vars: CreateFormulaVariables): MutationRef<CreateFormulaData, CreateFormulaVariables>;
}
export const createFormulaRef: CreateFormulaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFormulaRef:
```typescript
const name = createFormulaRef.operationName;
console.log(name);
```

### Variables
The `CreateFormula` mutation requires an argument of type `CreateFormulaVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFormulaVariables {
  sectionId: UUIDString;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  position: number;
  calcMetaJson?: string | null;
  examplesJson?: string | null;
  symbolsJson?: string | null;
}
```
### Return Type
Recall that executing the `CreateFormula` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFormulaData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFormulaData {
  formula_insert: Formula_Key;
}
```
### Using `CreateFormula`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFormula, CreateFormulaVariables } from '@impact26/dataconnect-sdk';

// The `CreateFormula` mutation requires an argument of type `CreateFormulaVariables`:
const createFormulaVars: CreateFormulaVariables = {
  sectionId: ..., 
  code: ..., 
  name: ..., 
  expression: ..., 
  notes: ..., // optional
  position: ..., 
  calcMetaJson: ..., // optional
  examplesJson: ..., // optional
  symbolsJson: ..., // optional
};

// Call the `createFormula()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFormula(createFormulaVars);
// Variables can be defined inline as well.
const { data } = await createFormula({ sectionId: ..., code: ..., name: ..., expression: ..., notes: ..., position: ..., calcMetaJson: ..., examplesJson: ..., symbolsJson: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFormula(dataConnect, createFormulaVars);

console.log(data.formula_insert);

// Or, you can use the `Promise` API.
createFormula(createFormulaVars).then((response) => {
  const data = response.data;
  console.log(data.formula_insert);
});
```

### Using `CreateFormula`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFormulaRef, CreateFormulaVariables } from '@impact26/dataconnect-sdk';

// The `CreateFormula` mutation requires an argument of type `CreateFormulaVariables`:
const createFormulaVars: CreateFormulaVariables = {
  sectionId: ..., 
  code: ..., 
  name: ..., 
  expression: ..., 
  notes: ..., // optional
  position: ..., 
  calcMetaJson: ..., // optional
  examplesJson: ..., // optional
  symbolsJson: ..., // optional
};

// Call the `createFormulaRef()` function to get a reference to the mutation.
const ref = createFormulaRef(createFormulaVars);
// Variables can be defined inline as well.
const ref = createFormulaRef({ sectionId: ..., code: ..., name: ..., expression: ..., notes: ..., position: ..., calcMetaJson: ..., examplesJson: ..., symbolsJson: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFormulaRef(dataConnect, createFormulaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.formula_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.formula_insert);
});
```

## UpdateFormula
You can execute the `UpdateFormula` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateFormula(vars: UpdateFormulaVariables): MutationPromise<UpdateFormulaData, UpdateFormulaVariables>;

interface UpdateFormulaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFormulaVariables): MutationRef<UpdateFormulaData, UpdateFormulaVariables>;
}
export const updateFormulaRef: UpdateFormulaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateFormula(dc: DataConnect, vars: UpdateFormulaVariables): MutationPromise<UpdateFormulaData, UpdateFormulaVariables>;

interface UpdateFormulaRef {
  ...
  (dc: DataConnect, vars: UpdateFormulaVariables): MutationRef<UpdateFormulaData, UpdateFormulaVariables>;
}
export const updateFormulaRef: UpdateFormulaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateFormulaRef:
```typescript
const name = updateFormulaRef.operationName;
console.log(name);
```

### Variables
The `UpdateFormula` mutation requires an argument of type `UpdateFormulaVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateFormulaVariables {
  id: UUIDString;
  code?: string | null;
  name?: string | null;
  expression?: string | null;
  notes?: string | null;
  calcMetaJson?: string | null;
  examplesJson?: string | null;
  symbolsJson?: string | null;
  position?: number | null;
}
```
### Return Type
Recall that executing the `UpdateFormula` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateFormulaData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateFormulaData {
  formula_update?: Formula_Key | null;
}
```
### Using `UpdateFormula`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateFormula, UpdateFormulaVariables } from '@impact26/dataconnect-sdk';

// The `UpdateFormula` mutation requires an argument of type `UpdateFormulaVariables`:
const updateFormulaVars: UpdateFormulaVariables = {
  id: ..., 
  code: ..., // optional
  name: ..., // optional
  expression: ..., // optional
  notes: ..., // optional
  calcMetaJson: ..., // optional
  examplesJson: ..., // optional
  symbolsJson: ..., // optional
  position: ..., // optional
};

// Call the `updateFormula()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateFormula(updateFormulaVars);
// Variables can be defined inline as well.
const { data } = await updateFormula({ id: ..., code: ..., name: ..., expression: ..., notes: ..., calcMetaJson: ..., examplesJson: ..., symbolsJson: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateFormula(dataConnect, updateFormulaVars);

console.log(data.formula_update);

// Or, you can use the `Promise` API.
updateFormula(updateFormulaVars).then((response) => {
  const data = response.data;
  console.log(data.formula_update);
});
```

### Using `UpdateFormula`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateFormulaRef, UpdateFormulaVariables } from '@impact26/dataconnect-sdk';

// The `UpdateFormula` mutation requires an argument of type `UpdateFormulaVariables`:
const updateFormulaVars: UpdateFormulaVariables = {
  id: ..., 
  code: ..., // optional
  name: ..., // optional
  expression: ..., // optional
  notes: ..., // optional
  calcMetaJson: ..., // optional
  examplesJson: ..., // optional
  symbolsJson: ..., // optional
  position: ..., // optional
};

// Call the `updateFormulaRef()` function to get a reference to the mutation.
const ref = updateFormulaRef(updateFormulaVars);
// Variables can be defined inline as well.
const ref = updateFormulaRef({ id: ..., code: ..., name: ..., expression: ..., notes: ..., calcMetaJson: ..., examplesJson: ..., symbolsJson: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateFormulaRef(dataConnect, updateFormulaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.formula_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.formula_update);
});
```

## DeleteFormula
You can execute the `DeleteFormula` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteFormula(vars: DeleteFormulaVariables): MutationPromise<DeleteFormulaData, DeleteFormulaVariables>;

interface DeleteFormulaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFormulaVariables): MutationRef<DeleteFormulaData, DeleteFormulaVariables>;
}
export const deleteFormulaRef: DeleteFormulaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteFormula(dc: DataConnect, vars: DeleteFormulaVariables): MutationPromise<DeleteFormulaData, DeleteFormulaVariables>;

interface DeleteFormulaRef {
  ...
  (dc: DataConnect, vars: DeleteFormulaVariables): MutationRef<DeleteFormulaData, DeleteFormulaVariables>;
}
export const deleteFormulaRef: DeleteFormulaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteFormulaRef:
```typescript
const name = deleteFormulaRef.operationName;
console.log(name);
```

### Variables
The `DeleteFormula` mutation requires an argument of type `DeleteFormulaVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteFormulaVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteFormula` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteFormulaData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteFormulaData {
  formula_delete?: Formula_Key | null;
}
```
### Using `DeleteFormula`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteFormula, DeleteFormulaVariables } from '@impact26/dataconnect-sdk';

// The `DeleteFormula` mutation requires an argument of type `DeleteFormulaVariables`:
const deleteFormulaVars: DeleteFormulaVariables = {
  id: ..., 
};

// Call the `deleteFormula()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteFormula(deleteFormulaVars);
// Variables can be defined inline as well.
const { data } = await deleteFormula({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteFormula(dataConnect, deleteFormulaVars);

console.log(data.formula_delete);

// Or, you can use the `Promise` API.
deleteFormula(deleteFormulaVars).then((response) => {
  const data = response.data;
  console.log(data.formula_delete);
});
```

### Using `DeleteFormula`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteFormulaRef, DeleteFormulaVariables } from '@impact26/dataconnect-sdk';

// The `DeleteFormula` mutation requires an argument of type `DeleteFormulaVariables`:
const deleteFormulaVars: DeleteFormulaVariables = {
  id: ..., 
};

// Call the `deleteFormulaRef()` function to get a reference to the mutation.
const ref = deleteFormulaRef(deleteFormulaVars);
// Variables can be defined inline as well.
const ref = deleteFormulaRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteFormulaRef(dataConnect, deleteFormulaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.formula_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.formula_delete);
});
```

## UpdateFormulaSection
You can execute the `UpdateFormulaSection` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateFormulaSection(vars: UpdateFormulaSectionVariables): MutationPromise<UpdateFormulaSectionData, UpdateFormulaSectionVariables>;

interface UpdateFormulaSectionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFormulaSectionVariables): MutationRef<UpdateFormulaSectionData, UpdateFormulaSectionVariables>;
}
export const updateFormulaSectionRef: UpdateFormulaSectionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateFormulaSection(dc: DataConnect, vars: UpdateFormulaSectionVariables): MutationPromise<UpdateFormulaSectionData, UpdateFormulaSectionVariables>;

interface UpdateFormulaSectionRef {
  ...
  (dc: DataConnect, vars: UpdateFormulaSectionVariables): MutationRef<UpdateFormulaSectionData, UpdateFormulaSectionVariables>;
}
export const updateFormulaSectionRef: UpdateFormulaSectionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateFormulaSectionRef:
```typescript
const name = updateFormulaSectionRef.operationName;
console.log(name);
```

### Variables
The `UpdateFormulaSection` mutation requires an argument of type `UpdateFormulaSectionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateFormulaSectionVariables {
  id: UUIDString;
  code?: string | null;
  title?: string | null;
  position?: number | null;
}
```
### Return Type
Recall that executing the `UpdateFormulaSection` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateFormulaSectionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateFormulaSectionData {
  formulaSection_update?: FormulaSection_Key | null;
}
```
### Using `UpdateFormulaSection`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateFormulaSection, UpdateFormulaSectionVariables } from '@impact26/dataconnect-sdk';

// The `UpdateFormulaSection` mutation requires an argument of type `UpdateFormulaSectionVariables`:
const updateFormulaSectionVars: UpdateFormulaSectionVariables = {
  id: ..., 
  code: ..., // optional
  title: ..., // optional
  position: ..., // optional
};

// Call the `updateFormulaSection()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateFormulaSection(updateFormulaSectionVars);
// Variables can be defined inline as well.
const { data } = await updateFormulaSection({ id: ..., code: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateFormulaSection(dataConnect, updateFormulaSectionVars);

console.log(data.formulaSection_update);

// Or, you can use the `Promise` API.
updateFormulaSection(updateFormulaSectionVars).then((response) => {
  const data = response.data;
  console.log(data.formulaSection_update);
});
```

### Using `UpdateFormulaSection`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateFormulaSectionRef, UpdateFormulaSectionVariables } from '@impact26/dataconnect-sdk';

// The `UpdateFormulaSection` mutation requires an argument of type `UpdateFormulaSectionVariables`:
const updateFormulaSectionVars: UpdateFormulaSectionVariables = {
  id: ..., 
  code: ..., // optional
  title: ..., // optional
  position: ..., // optional
};

// Call the `updateFormulaSectionRef()` function to get a reference to the mutation.
const ref = updateFormulaSectionRef(updateFormulaSectionVars);
// Variables can be defined inline as well.
const ref = updateFormulaSectionRef({ id: ..., code: ..., title: ..., position: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateFormulaSectionRef(dataConnect, updateFormulaSectionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.formulaSection_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.formulaSection_update);
});
```

## DeleteFormulasForSection
You can execute the `DeleteFormulasForSection` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteFormulasForSection(vars: DeleteFormulasForSectionVariables): MutationPromise<DeleteFormulasForSectionData, DeleteFormulasForSectionVariables>;

interface DeleteFormulasForSectionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFormulasForSectionVariables): MutationRef<DeleteFormulasForSectionData, DeleteFormulasForSectionVariables>;
}
export const deleteFormulasForSectionRef: DeleteFormulasForSectionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteFormulasForSection(dc: DataConnect, vars: DeleteFormulasForSectionVariables): MutationPromise<DeleteFormulasForSectionData, DeleteFormulasForSectionVariables>;

interface DeleteFormulasForSectionRef {
  ...
  (dc: DataConnect, vars: DeleteFormulasForSectionVariables): MutationRef<DeleteFormulasForSectionData, DeleteFormulasForSectionVariables>;
}
export const deleteFormulasForSectionRef: DeleteFormulasForSectionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteFormulasForSectionRef:
```typescript
const name = deleteFormulasForSectionRef.operationName;
console.log(name);
```

### Variables
The `DeleteFormulasForSection` mutation requires an argument of type `DeleteFormulasForSectionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteFormulasForSectionVariables {
  sectionId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteFormulasForSection` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteFormulasForSectionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteFormulasForSectionData {
  formula_deleteMany: number;
}
```
### Using `DeleteFormulasForSection`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteFormulasForSection, DeleteFormulasForSectionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteFormulasForSection` mutation requires an argument of type `DeleteFormulasForSectionVariables`:
const deleteFormulasForSectionVars: DeleteFormulasForSectionVariables = {
  sectionId: ..., 
};

// Call the `deleteFormulasForSection()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteFormulasForSection(deleteFormulasForSectionVars);
// Variables can be defined inline as well.
const { data } = await deleteFormulasForSection({ sectionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteFormulasForSection(dataConnect, deleteFormulasForSectionVars);

console.log(data.formula_deleteMany);

// Or, you can use the `Promise` API.
deleteFormulasForSection(deleteFormulasForSectionVars).then((response) => {
  const data = response.data;
  console.log(data.formula_deleteMany);
});
```

### Using `DeleteFormulasForSection`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteFormulasForSectionRef, DeleteFormulasForSectionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteFormulasForSection` mutation requires an argument of type `DeleteFormulasForSectionVariables`:
const deleteFormulasForSectionVars: DeleteFormulasForSectionVariables = {
  sectionId: ..., 
};

// Call the `deleteFormulasForSectionRef()` function to get a reference to the mutation.
const ref = deleteFormulasForSectionRef(deleteFormulasForSectionVars);
// Variables can be defined inline as well.
const ref = deleteFormulasForSectionRef({ sectionId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteFormulasForSectionRef(dataConnect, deleteFormulasForSectionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.formula_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.formula_deleteMany);
});
```

## DeleteFormulaSection
You can execute the `DeleteFormulaSection` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteFormulaSection(vars: DeleteFormulaSectionVariables): MutationPromise<DeleteFormulaSectionData, DeleteFormulaSectionVariables>;

interface DeleteFormulaSectionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFormulaSectionVariables): MutationRef<DeleteFormulaSectionData, DeleteFormulaSectionVariables>;
}
export const deleteFormulaSectionRef: DeleteFormulaSectionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteFormulaSection(dc: DataConnect, vars: DeleteFormulaSectionVariables): MutationPromise<DeleteFormulaSectionData, DeleteFormulaSectionVariables>;

interface DeleteFormulaSectionRef {
  ...
  (dc: DataConnect, vars: DeleteFormulaSectionVariables): MutationRef<DeleteFormulaSectionData, DeleteFormulaSectionVariables>;
}
export const deleteFormulaSectionRef: DeleteFormulaSectionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteFormulaSectionRef:
```typescript
const name = deleteFormulaSectionRef.operationName;
console.log(name);
```

### Variables
The `DeleteFormulaSection` mutation requires an argument of type `DeleteFormulaSectionVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteFormulaSectionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteFormulaSection` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteFormulaSectionData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteFormulaSectionData {
  formulaSection_delete?: FormulaSection_Key | null;
}
```
### Using `DeleteFormulaSection`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteFormulaSection, DeleteFormulaSectionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteFormulaSection` mutation requires an argument of type `DeleteFormulaSectionVariables`:
const deleteFormulaSectionVars: DeleteFormulaSectionVariables = {
  id: ..., 
};

// Call the `deleteFormulaSection()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteFormulaSection(deleteFormulaSectionVars);
// Variables can be defined inline as well.
const { data } = await deleteFormulaSection({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteFormulaSection(dataConnect, deleteFormulaSectionVars);

console.log(data.formulaSection_delete);

// Or, you can use the `Promise` API.
deleteFormulaSection(deleteFormulaSectionVars).then((response) => {
  const data = response.data;
  console.log(data.formulaSection_delete);
});
```

### Using `DeleteFormulaSection`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteFormulaSectionRef, DeleteFormulaSectionVariables } from '@impact26/dataconnect-sdk';

// The `DeleteFormulaSection` mutation requires an argument of type `DeleteFormulaSectionVariables`:
const deleteFormulaSectionVars: DeleteFormulaSectionVariables = {
  id: ..., 
};

// Call the `deleteFormulaSectionRef()` function to get a reference to the mutation.
const ref = deleteFormulaSectionRef(deleteFormulaSectionVars);
// Variables can be defined inline as well.
const ref = deleteFormulaSectionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteFormulaSectionRef(dataConnect, deleteFormulaSectionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.formulaSection_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.formulaSection_delete);
});
```

## CreateContentSourceLink
You can execute the `CreateContentSourceLink` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createContentSourceLink(vars: CreateContentSourceLinkVariables): MutationPromise<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;

interface CreateContentSourceLinkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateContentSourceLinkVariables): MutationRef<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;
}
export const createContentSourceLinkRef: CreateContentSourceLinkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createContentSourceLink(dc: DataConnect, vars: CreateContentSourceLinkVariables): MutationPromise<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;

interface CreateContentSourceLinkRef {
  ...
  (dc: DataConnect, vars: CreateContentSourceLinkVariables): MutationRef<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;
}
export const createContentSourceLinkRef: CreateContentSourceLinkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createContentSourceLinkRef:
```typescript
const name = createContentSourceLinkRef.operationName;
console.log(name);
```

### Variables
The `CreateContentSourceLink` mutation requires an argument of type `CreateContentSourceLinkVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateContentSourceLinkVariables {
  id: UUIDString;
  sourceMaterialId: UUIDString;
  lessonId?: UUIDString | null;
  courseId?: UUIDString | null;
  questionId?: UUIDString | null;
  referenceLabel?: string | null;
}
```
### Return Type
Recall that executing the `CreateContentSourceLink` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateContentSourceLinkData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateContentSourceLinkData {
  contentSourceLink_insert: ContentSourceLink_Key;
}
```
### Using `CreateContentSourceLink`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createContentSourceLink, CreateContentSourceLinkVariables } from '@impact26/dataconnect-sdk';

// The `CreateContentSourceLink` mutation requires an argument of type `CreateContentSourceLinkVariables`:
const createContentSourceLinkVars: CreateContentSourceLinkVariables = {
  id: ..., 
  sourceMaterialId: ..., 
  lessonId: ..., // optional
  courseId: ..., // optional
  questionId: ..., // optional
  referenceLabel: ..., // optional
};

// Call the `createContentSourceLink()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createContentSourceLink(createContentSourceLinkVars);
// Variables can be defined inline as well.
const { data } = await createContentSourceLink({ id: ..., sourceMaterialId: ..., lessonId: ..., courseId: ..., questionId: ..., referenceLabel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createContentSourceLink(dataConnect, createContentSourceLinkVars);

console.log(data.contentSourceLink_insert);

// Or, you can use the `Promise` API.
createContentSourceLink(createContentSourceLinkVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_insert);
});
```

### Using `CreateContentSourceLink`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createContentSourceLinkRef, CreateContentSourceLinkVariables } from '@impact26/dataconnect-sdk';

// The `CreateContentSourceLink` mutation requires an argument of type `CreateContentSourceLinkVariables`:
const createContentSourceLinkVars: CreateContentSourceLinkVariables = {
  id: ..., 
  sourceMaterialId: ..., 
  lessonId: ..., // optional
  courseId: ..., // optional
  questionId: ..., // optional
  referenceLabel: ..., // optional
};

// Call the `createContentSourceLinkRef()` function to get a reference to the mutation.
const ref = createContentSourceLinkRef(createContentSourceLinkVars);
// Variables can be defined inline as well.
const ref = createContentSourceLinkRef({ id: ..., sourceMaterialId: ..., lessonId: ..., courseId: ..., questionId: ..., referenceLabel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createContentSourceLinkRef(dataConnect, createContentSourceLinkVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_insert);
});
```

## DeleteContentSourceLink
You can execute the `DeleteContentSourceLink` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteContentSourceLink(vars: DeleteContentSourceLinkVariables): MutationPromise<DeleteContentSourceLinkData, DeleteContentSourceLinkVariables>;

interface DeleteContentSourceLinkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteContentSourceLinkVariables): MutationRef<DeleteContentSourceLinkData, DeleteContentSourceLinkVariables>;
}
export const deleteContentSourceLinkRef: DeleteContentSourceLinkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteContentSourceLink(dc: DataConnect, vars: DeleteContentSourceLinkVariables): MutationPromise<DeleteContentSourceLinkData, DeleteContentSourceLinkVariables>;

interface DeleteContentSourceLinkRef {
  ...
  (dc: DataConnect, vars: DeleteContentSourceLinkVariables): MutationRef<DeleteContentSourceLinkData, DeleteContentSourceLinkVariables>;
}
export const deleteContentSourceLinkRef: DeleteContentSourceLinkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteContentSourceLinkRef:
```typescript
const name = deleteContentSourceLinkRef.operationName;
console.log(name);
```

### Variables
The `DeleteContentSourceLink` mutation requires an argument of type `DeleteContentSourceLinkVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteContentSourceLinkVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteContentSourceLink` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteContentSourceLinkData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteContentSourceLinkData {
  contentSourceLink_delete?: ContentSourceLink_Key | null;
}
```
### Using `DeleteContentSourceLink`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteContentSourceLink, DeleteContentSourceLinkVariables } from '@impact26/dataconnect-sdk';

// The `DeleteContentSourceLink` mutation requires an argument of type `DeleteContentSourceLinkVariables`:
const deleteContentSourceLinkVars: DeleteContentSourceLinkVariables = {
  id: ..., 
};

// Call the `deleteContentSourceLink()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteContentSourceLink(deleteContentSourceLinkVars);
// Variables can be defined inline as well.
const { data } = await deleteContentSourceLink({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteContentSourceLink(dataConnect, deleteContentSourceLinkVars);

console.log(data.contentSourceLink_delete);

// Or, you can use the `Promise` API.
deleteContentSourceLink(deleteContentSourceLinkVars).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_delete);
});
```

### Using `DeleteContentSourceLink`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteContentSourceLinkRef, DeleteContentSourceLinkVariables } from '@impact26/dataconnect-sdk';

// The `DeleteContentSourceLink` mutation requires an argument of type `DeleteContentSourceLinkVariables`:
const deleteContentSourceLinkVars: DeleteContentSourceLinkVariables = {
  id: ..., 
};

// Call the `deleteContentSourceLinkRef()` function to get a reference to the mutation.
const ref = deleteContentSourceLinkRef(deleteContentSourceLinkVars);
// Variables can be defined inline as well.
const ref = deleteContentSourceLinkRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteContentSourceLinkRef(dataConnect, deleteContentSourceLinkVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contentSourceLink_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contentSourceLink_delete);
});
```

## CreateGlossaryTerm
You can execute the `CreateGlossaryTerm` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createGlossaryTerm(vars: CreateGlossaryTermVariables): MutationPromise<CreateGlossaryTermData, CreateGlossaryTermVariables>;

interface CreateGlossaryTermRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGlossaryTermVariables): MutationRef<CreateGlossaryTermData, CreateGlossaryTermVariables>;
}
export const createGlossaryTermRef: CreateGlossaryTermRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createGlossaryTerm(dc: DataConnect, vars: CreateGlossaryTermVariables): MutationPromise<CreateGlossaryTermData, CreateGlossaryTermVariables>;

interface CreateGlossaryTermRef {
  ...
  (dc: DataConnect, vars: CreateGlossaryTermVariables): MutationRef<CreateGlossaryTermData, CreateGlossaryTermVariables>;
}
export const createGlossaryTermRef: CreateGlossaryTermRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createGlossaryTermRef:
```typescript
const name = createGlossaryTermRef.operationName;
console.log(name);
```

### Variables
The `CreateGlossaryTerm` mutation requires an argument of type `CreateGlossaryTermVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateGlossaryTermVariables {
  id: UUIDString;
  term: string;
  definition: string;
  fullDefinition?: string | null;
  domain?: string | null;
  category?: string | null;
  example?: string | null;
  relatedTerms?: string | null;
  isPublished: boolean;
  sourceDocument?: string | null;
  createdById?: string | null;
  updatedAt: DateString;
}
```
### Return Type
Recall that executing the `CreateGlossaryTerm` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateGlossaryTermData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateGlossaryTermData {
  glossaryTerm_insert: GlossaryTerm_Key;
}
```
### Using `CreateGlossaryTerm`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createGlossaryTerm, CreateGlossaryTermVariables } from '@impact26/dataconnect-sdk';

// The `CreateGlossaryTerm` mutation requires an argument of type `CreateGlossaryTermVariables`:
const createGlossaryTermVars: CreateGlossaryTermVariables = {
  id: ..., 
  term: ..., 
  definition: ..., 
  fullDefinition: ..., // optional
  domain: ..., // optional
  category: ..., // optional
  example: ..., // optional
  relatedTerms: ..., // optional
  isPublished: ..., 
  sourceDocument: ..., // optional
  createdById: ..., // optional
  updatedAt: ..., 
};

// Call the `createGlossaryTerm()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createGlossaryTerm(createGlossaryTermVars);
// Variables can be defined inline as well.
const { data } = await createGlossaryTerm({ id: ..., term: ..., definition: ..., fullDefinition: ..., domain: ..., category: ..., example: ..., relatedTerms: ..., isPublished: ..., sourceDocument: ..., createdById: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createGlossaryTerm(dataConnect, createGlossaryTermVars);

console.log(data.glossaryTerm_insert);

// Or, you can use the `Promise` API.
createGlossaryTerm(createGlossaryTermVars).then((response) => {
  const data = response.data;
  console.log(data.glossaryTerm_insert);
});
```

### Using `CreateGlossaryTerm`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createGlossaryTermRef, CreateGlossaryTermVariables } from '@impact26/dataconnect-sdk';

// The `CreateGlossaryTerm` mutation requires an argument of type `CreateGlossaryTermVariables`:
const createGlossaryTermVars: CreateGlossaryTermVariables = {
  id: ..., 
  term: ..., 
  definition: ..., 
  fullDefinition: ..., // optional
  domain: ..., // optional
  category: ..., // optional
  example: ..., // optional
  relatedTerms: ..., // optional
  isPublished: ..., 
  sourceDocument: ..., // optional
  createdById: ..., // optional
  updatedAt: ..., 
};

// Call the `createGlossaryTermRef()` function to get a reference to the mutation.
const ref = createGlossaryTermRef(createGlossaryTermVars);
// Variables can be defined inline as well.
const ref = createGlossaryTermRef({ id: ..., term: ..., definition: ..., fullDefinition: ..., domain: ..., category: ..., example: ..., relatedTerms: ..., isPublished: ..., sourceDocument: ..., createdById: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createGlossaryTermRef(dataConnect, createGlossaryTermVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.glossaryTerm_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryTerm_insert);
});
```

## UpdateGlossaryTerm
You can execute the `UpdateGlossaryTerm` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateGlossaryTerm(vars: UpdateGlossaryTermVariables): MutationPromise<UpdateGlossaryTermData, UpdateGlossaryTermVariables>;

interface UpdateGlossaryTermRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGlossaryTermVariables): MutationRef<UpdateGlossaryTermData, UpdateGlossaryTermVariables>;
}
export const updateGlossaryTermRef: UpdateGlossaryTermRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateGlossaryTerm(dc: DataConnect, vars: UpdateGlossaryTermVariables): MutationPromise<UpdateGlossaryTermData, UpdateGlossaryTermVariables>;

interface UpdateGlossaryTermRef {
  ...
  (dc: DataConnect, vars: UpdateGlossaryTermVariables): MutationRef<UpdateGlossaryTermData, UpdateGlossaryTermVariables>;
}
export const updateGlossaryTermRef: UpdateGlossaryTermRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateGlossaryTermRef:
```typescript
const name = updateGlossaryTermRef.operationName;
console.log(name);
```

### Variables
The `UpdateGlossaryTerm` mutation requires an argument of type `UpdateGlossaryTermVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateGlossaryTermVariables {
  id: UUIDString;
  term?: string | null;
  definition?: string | null;
  fullDefinition?: string | null;
  domain?: string | null;
  category?: string | null;
  example?: string | null;
  relatedTerms?: string | null;
  isPublished?: boolean | null;
  sourceDocument?: string | null;
  updatedAt: DateString;
}
```
### Return Type
Recall that executing the `UpdateGlossaryTerm` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateGlossaryTermData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateGlossaryTermData {
  glossaryTerm_update?: GlossaryTerm_Key | null;
}
```
### Using `UpdateGlossaryTerm`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateGlossaryTerm, UpdateGlossaryTermVariables } from '@impact26/dataconnect-sdk';

// The `UpdateGlossaryTerm` mutation requires an argument of type `UpdateGlossaryTermVariables`:
const updateGlossaryTermVars: UpdateGlossaryTermVariables = {
  id: ..., 
  term: ..., // optional
  definition: ..., // optional
  fullDefinition: ..., // optional
  domain: ..., // optional
  category: ..., // optional
  example: ..., // optional
  relatedTerms: ..., // optional
  isPublished: ..., // optional
  sourceDocument: ..., // optional
  updatedAt: ..., 
};

// Call the `updateGlossaryTerm()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateGlossaryTerm(updateGlossaryTermVars);
// Variables can be defined inline as well.
const { data } = await updateGlossaryTerm({ id: ..., term: ..., definition: ..., fullDefinition: ..., domain: ..., category: ..., example: ..., relatedTerms: ..., isPublished: ..., sourceDocument: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateGlossaryTerm(dataConnect, updateGlossaryTermVars);

console.log(data.glossaryTerm_update);

// Or, you can use the `Promise` API.
updateGlossaryTerm(updateGlossaryTermVars).then((response) => {
  const data = response.data;
  console.log(data.glossaryTerm_update);
});
```

### Using `UpdateGlossaryTerm`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateGlossaryTermRef, UpdateGlossaryTermVariables } from '@impact26/dataconnect-sdk';

// The `UpdateGlossaryTerm` mutation requires an argument of type `UpdateGlossaryTermVariables`:
const updateGlossaryTermVars: UpdateGlossaryTermVariables = {
  id: ..., 
  term: ..., // optional
  definition: ..., // optional
  fullDefinition: ..., // optional
  domain: ..., // optional
  category: ..., // optional
  example: ..., // optional
  relatedTerms: ..., // optional
  isPublished: ..., // optional
  sourceDocument: ..., // optional
  updatedAt: ..., 
};

// Call the `updateGlossaryTermRef()` function to get a reference to the mutation.
const ref = updateGlossaryTermRef(updateGlossaryTermVars);
// Variables can be defined inline as well.
const ref = updateGlossaryTermRef({ id: ..., term: ..., definition: ..., fullDefinition: ..., domain: ..., category: ..., example: ..., relatedTerms: ..., isPublished: ..., sourceDocument: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateGlossaryTermRef(dataConnect, updateGlossaryTermVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.glossaryTerm_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryTerm_update);
});
```

## DeleteGlossaryTerm
You can execute the `DeleteGlossaryTerm` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteGlossaryTerm(vars: DeleteGlossaryTermVariables): MutationPromise<DeleteGlossaryTermData, DeleteGlossaryTermVariables>;

interface DeleteGlossaryTermRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGlossaryTermVariables): MutationRef<DeleteGlossaryTermData, DeleteGlossaryTermVariables>;
}
export const deleteGlossaryTermRef: DeleteGlossaryTermRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteGlossaryTerm(dc: DataConnect, vars: DeleteGlossaryTermVariables): MutationPromise<DeleteGlossaryTermData, DeleteGlossaryTermVariables>;

interface DeleteGlossaryTermRef {
  ...
  (dc: DataConnect, vars: DeleteGlossaryTermVariables): MutationRef<DeleteGlossaryTermData, DeleteGlossaryTermVariables>;
}
export const deleteGlossaryTermRef: DeleteGlossaryTermRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteGlossaryTermRef:
```typescript
const name = deleteGlossaryTermRef.operationName;
console.log(name);
```

### Variables
The `DeleteGlossaryTerm` mutation requires an argument of type `DeleteGlossaryTermVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteGlossaryTermVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteGlossaryTerm` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteGlossaryTermData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteGlossaryTermData {
  glossaryTerm_delete?: GlossaryTerm_Key | null;
}
```
### Using `DeleteGlossaryTerm`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteGlossaryTerm, DeleteGlossaryTermVariables } from '@impact26/dataconnect-sdk';

// The `DeleteGlossaryTerm` mutation requires an argument of type `DeleteGlossaryTermVariables`:
const deleteGlossaryTermVars: DeleteGlossaryTermVariables = {
  id: ..., 
};

// Call the `deleteGlossaryTerm()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteGlossaryTerm(deleteGlossaryTermVars);
// Variables can be defined inline as well.
const { data } = await deleteGlossaryTerm({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteGlossaryTerm(dataConnect, deleteGlossaryTermVars);

console.log(data.glossaryTerm_delete);

// Or, you can use the `Promise` API.
deleteGlossaryTerm(deleteGlossaryTermVars).then((response) => {
  const data = response.data;
  console.log(data.glossaryTerm_delete);
});
```

### Using `DeleteGlossaryTerm`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteGlossaryTermRef, DeleteGlossaryTermVariables } from '@impact26/dataconnect-sdk';

// The `DeleteGlossaryTerm` mutation requires an argument of type `DeleteGlossaryTermVariables`:
const deleteGlossaryTermVars: DeleteGlossaryTermVariables = {
  id: ..., 
};

// Call the `deleteGlossaryTermRef()` function to get a reference to the mutation.
const ref = deleteGlossaryTermRef(deleteGlossaryTermVars);
// Variables can be defined inline as well.
const ref = deleteGlossaryTermRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteGlossaryTermRef(dataConnect, deleteGlossaryTermVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.glossaryTerm_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryTerm_delete);
});
```

## DeleteGlossaryNotesForTerm
You can execute the `DeleteGlossaryNotesForTerm` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteGlossaryNotesForTerm(vars: DeleteGlossaryNotesForTermVariables): MutationPromise<DeleteGlossaryNotesForTermData, DeleteGlossaryNotesForTermVariables>;

interface DeleteGlossaryNotesForTermRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGlossaryNotesForTermVariables): MutationRef<DeleteGlossaryNotesForTermData, DeleteGlossaryNotesForTermVariables>;
}
export const deleteGlossaryNotesForTermRef: DeleteGlossaryNotesForTermRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteGlossaryNotesForTerm(dc: DataConnect, vars: DeleteGlossaryNotesForTermVariables): MutationPromise<DeleteGlossaryNotesForTermData, DeleteGlossaryNotesForTermVariables>;

interface DeleteGlossaryNotesForTermRef {
  ...
  (dc: DataConnect, vars: DeleteGlossaryNotesForTermVariables): MutationRef<DeleteGlossaryNotesForTermData, DeleteGlossaryNotesForTermVariables>;
}
export const deleteGlossaryNotesForTermRef: DeleteGlossaryNotesForTermRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteGlossaryNotesForTermRef:
```typescript
const name = deleteGlossaryNotesForTermRef.operationName;
console.log(name);
```

### Variables
The `DeleteGlossaryNotesForTerm` mutation requires an argument of type `DeleteGlossaryNotesForTermVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteGlossaryNotesForTermVariables {
  termId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteGlossaryNotesForTerm` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteGlossaryNotesForTermData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteGlossaryNotesForTermData {
  glossaryNote_deleteMany: number;
}
```
### Using `DeleteGlossaryNotesForTerm`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteGlossaryNotesForTerm, DeleteGlossaryNotesForTermVariables } from '@impact26/dataconnect-sdk';

// The `DeleteGlossaryNotesForTerm` mutation requires an argument of type `DeleteGlossaryNotesForTermVariables`:
const deleteGlossaryNotesForTermVars: DeleteGlossaryNotesForTermVariables = {
  termId: ..., 
};

// Call the `deleteGlossaryNotesForTerm()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteGlossaryNotesForTerm(deleteGlossaryNotesForTermVars);
// Variables can be defined inline as well.
const { data } = await deleteGlossaryNotesForTerm({ termId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteGlossaryNotesForTerm(dataConnect, deleteGlossaryNotesForTermVars);

console.log(data.glossaryNote_deleteMany);

// Or, you can use the `Promise` API.
deleteGlossaryNotesForTerm(deleteGlossaryNotesForTermVars).then((response) => {
  const data = response.data;
  console.log(data.glossaryNote_deleteMany);
});
```

### Using `DeleteGlossaryNotesForTerm`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteGlossaryNotesForTermRef, DeleteGlossaryNotesForTermVariables } from '@impact26/dataconnect-sdk';

// The `DeleteGlossaryNotesForTerm` mutation requires an argument of type `DeleteGlossaryNotesForTermVariables`:
const deleteGlossaryNotesForTermVars: DeleteGlossaryNotesForTermVariables = {
  termId: ..., 
};

// Call the `deleteGlossaryNotesForTermRef()` function to get a reference to the mutation.
const ref = deleteGlossaryNotesForTermRef(deleteGlossaryNotesForTermVars);
// Variables can be defined inline as well.
const ref = deleteGlossaryNotesForTermRef({ termId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteGlossaryNotesForTermRef(dataConnect, deleteGlossaryNotesForTermVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.glossaryNote_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryNote_deleteMany);
});
```

## CreateGlossaryNote
You can execute the `CreateGlossaryNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createGlossaryNote(vars: CreateGlossaryNoteVariables): MutationPromise<CreateGlossaryNoteData, CreateGlossaryNoteVariables>;

interface CreateGlossaryNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGlossaryNoteVariables): MutationRef<CreateGlossaryNoteData, CreateGlossaryNoteVariables>;
}
export const createGlossaryNoteRef: CreateGlossaryNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createGlossaryNote(dc: DataConnect, vars: CreateGlossaryNoteVariables): MutationPromise<CreateGlossaryNoteData, CreateGlossaryNoteVariables>;

interface CreateGlossaryNoteRef {
  ...
  (dc: DataConnect, vars: CreateGlossaryNoteVariables): MutationRef<CreateGlossaryNoteData, CreateGlossaryNoteVariables>;
}
export const createGlossaryNoteRef: CreateGlossaryNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createGlossaryNoteRef:
```typescript
const name = createGlossaryNoteRef.operationName;
console.log(name);
```

### Variables
The `CreateGlossaryNote` mutation requires an argument of type `CreateGlossaryNoteVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateGlossaryNoteVariables {
  id: UUIDString;
  userId: string;
  termId: UUIDString;
  note: string;
  updatedAt: DateString;
}
```
### Return Type
Recall that executing the `CreateGlossaryNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateGlossaryNoteData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateGlossaryNoteData {
  glossaryNote_insert: GlossaryNote_Key;
}
```
### Using `CreateGlossaryNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createGlossaryNote, CreateGlossaryNoteVariables } from '@impact26/dataconnect-sdk';

// The `CreateGlossaryNote` mutation requires an argument of type `CreateGlossaryNoteVariables`:
const createGlossaryNoteVars: CreateGlossaryNoteVariables = {
  id: ..., 
  userId: ..., 
  termId: ..., 
  note: ..., 
  updatedAt: ..., 
};

// Call the `createGlossaryNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createGlossaryNote(createGlossaryNoteVars);
// Variables can be defined inline as well.
const { data } = await createGlossaryNote({ id: ..., userId: ..., termId: ..., note: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createGlossaryNote(dataConnect, createGlossaryNoteVars);

console.log(data.glossaryNote_insert);

// Or, you can use the `Promise` API.
createGlossaryNote(createGlossaryNoteVars).then((response) => {
  const data = response.data;
  console.log(data.glossaryNote_insert);
});
```

### Using `CreateGlossaryNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createGlossaryNoteRef, CreateGlossaryNoteVariables } from '@impact26/dataconnect-sdk';

// The `CreateGlossaryNote` mutation requires an argument of type `CreateGlossaryNoteVariables`:
const createGlossaryNoteVars: CreateGlossaryNoteVariables = {
  id: ..., 
  userId: ..., 
  termId: ..., 
  note: ..., 
  updatedAt: ..., 
};

// Call the `createGlossaryNoteRef()` function to get a reference to the mutation.
const ref = createGlossaryNoteRef(createGlossaryNoteVars);
// Variables can be defined inline as well.
const ref = createGlossaryNoteRef({ id: ..., userId: ..., termId: ..., note: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createGlossaryNoteRef(dataConnect, createGlossaryNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.glossaryNote_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryNote_insert);
});
```

## UpdateGlossaryNote
You can execute the `UpdateGlossaryNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateGlossaryNote(vars: UpdateGlossaryNoteVariables): MutationPromise<UpdateGlossaryNoteData, UpdateGlossaryNoteVariables>;

interface UpdateGlossaryNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGlossaryNoteVariables): MutationRef<UpdateGlossaryNoteData, UpdateGlossaryNoteVariables>;
}
export const updateGlossaryNoteRef: UpdateGlossaryNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateGlossaryNote(dc: DataConnect, vars: UpdateGlossaryNoteVariables): MutationPromise<UpdateGlossaryNoteData, UpdateGlossaryNoteVariables>;

interface UpdateGlossaryNoteRef {
  ...
  (dc: DataConnect, vars: UpdateGlossaryNoteVariables): MutationRef<UpdateGlossaryNoteData, UpdateGlossaryNoteVariables>;
}
export const updateGlossaryNoteRef: UpdateGlossaryNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateGlossaryNoteRef:
```typescript
const name = updateGlossaryNoteRef.operationName;
console.log(name);
```

### Variables
The `UpdateGlossaryNote` mutation requires an argument of type `UpdateGlossaryNoteVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateGlossaryNoteVariables {
  id: UUIDString;
  note: string;
  updatedAt: DateString;
}
```
### Return Type
Recall that executing the `UpdateGlossaryNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateGlossaryNoteData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateGlossaryNoteData {
  glossaryNote_update?: GlossaryNote_Key | null;
}
```
### Using `UpdateGlossaryNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateGlossaryNote, UpdateGlossaryNoteVariables } from '@impact26/dataconnect-sdk';

// The `UpdateGlossaryNote` mutation requires an argument of type `UpdateGlossaryNoteVariables`:
const updateGlossaryNoteVars: UpdateGlossaryNoteVariables = {
  id: ..., 
  note: ..., 
  updatedAt: ..., 
};

// Call the `updateGlossaryNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateGlossaryNote(updateGlossaryNoteVars);
// Variables can be defined inline as well.
const { data } = await updateGlossaryNote({ id: ..., note: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateGlossaryNote(dataConnect, updateGlossaryNoteVars);

console.log(data.glossaryNote_update);

// Or, you can use the `Promise` API.
updateGlossaryNote(updateGlossaryNoteVars).then((response) => {
  const data = response.data;
  console.log(data.glossaryNote_update);
});
```

### Using `UpdateGlossaryNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateGlossaryNoteRef, UpdateGlossaryNoteVariables } from '@impact26/dataconnect-sdk';

// The `UpdateGlossaryNote` mutation requires an argument of type `UpdateGlossaryNoteVariables`:
const updateGlossaryNoteVars: UpdateGlossaryNoteVariables = {
  id: ..., 
  note: ..., 
  updatedAt: ..., 
};

// Call the `updateGlossaryNoteRef()` function to get a reference to the mutation.
const ref = updateGlossaryNoteRef(updateGlossaryNoteVars);
// Variables can be defined inline as well.
const ref = updateGlossaryNoteRef({ id: ..., note: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateGlossaryNoteRef(dataConnect, updateGlossaryNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.glossaryNote_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryNote_update);
});
```

## DeleteGlossaryNote
You can execute the `DeleteGlossaryNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteGlossaryNote(vars: DeleteGlossaryNoteVariables): MutationPromise<DeleteGlossaryNoteData, DeleteGlossaryNoteVariables>;

interface DeleteGlossaryNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGlossaryNoteVariables): MutationRef<DeleteGlossaryNoteData, DeleteGlossaryNoteVariables>;
}
export const deleteGlossaryNoteRef: DeleteGlossaryNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteGlossaryNote(dc: DataConnect, vars: DeleteGlossaryNoteVariables): MutationPromise<DeleteGlossaryNoteData, DeleteGlossaryNoteVariables>;

interface DeleteGlossaryNoteRef {
  ...
  (dc: DataConnect, vars: DeleteGlossaryNoteVariables): MutationRef<DeleteGlossaryNoteData, DeleteGlossaryNoteVariables>;
}
export const deleteGlossaryNoteRef: DeleteGlossaryNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteGlossaryNoteRef:
```typescript
const name = deleteGlossaryNoteRef.operationName;
console.log(name);
```

### Variables
The `DeleteGlossaryNote` mutation requires an argument of type `DeleteGlossaryNoteVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteGlossaryNoteVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteGlossaryNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteGlossaryNoteData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteGlossaryNoteData {
  glossaryNote_delete?: GlossaryNote_Key | null;
}
```
### Using `DeleteGlossaryNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteGlossaryNote, DeleteGlossaryNoteVariables } from '@impact26/dataconnect-sdk';

// The `DeleteGlossaryNote` mutation requires an argument of type `DeleteGlossaryNoteVariables`:
const deleteGlossaryNoteVars: DeleteGlossaryNoteVariables = {
  id: ..., 
};

// Call the `deleteGlossaryNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteGlossaryNote(deleteGlossaryNoteVars);
// Variables can be defined inline as well.
const { data } = await deleteGlossaryNote({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteGlossaryNote(dataConnect, deleteGlossaryNoteVars);

console.log(data.glossaryNote_delete);

// Or, you can use the `Promise` API.
deleteGlossaryNote(deleteGlossaryNoteVars).then((response) => {
  const data = response.data;
  console.log(data.glossaryNote_delete);
});
```

### Using `DeleteGlossaryNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteGlossaryNoteRef, DeleteGlossaryNoteVariables } from '@impact26/dataconnect-sdk';

// The `DeleteGlossaryNote` mutation requires an argument of type `DeleteGlossaryNoteVariables`:
const deleteGlossaryNoteVars: DeleteGlossaryNoteVariables = {
  id: ..., 
};

// Call the `deleteGlossaryNoteRef()` function to get a reference to the mutation.
const ref = deleteGlossaryNoteRef(deleteGlossaryNoteVars);
// Variables can be defined inline as well.
const ref = deleteGlossaryNoteRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteGlossaryNoteRef(dataConnect, deleteGlossaryNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.glossaryNote_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.glossaryNote_delete);
});
```

## CreateLessonNote
You can execute the `CreateLessonNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createLessonNote(vars: CreateLessonNoteVariables): MutationPromise<CreateLessonNoteData, CreateLessonNoteVariables>;

interface CreateLessonNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLessonNoteVariables): MutationRef<CreateLessonNoteData, CreateLessonNoteVariables>;
}
export const createLessonNoteRef: CreateLessonNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLessonNote(dc: DataConnect, vars: CreateLessonNoteVariables): MutationPromise<CreateLessonNoteData, CreateLessonNoteVariables>;

interface CreateLessonNoteRef {
  ...
  (dc: DataConnect, vars: CreateLessonNoteVariables): MutationRef<CreateLessonNoteData, CreateLessonNoteVariables>;
}
export const createLessonNoteRef: CreateLessonNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLessonNoteRef:
```typescript
const name = createLessonNoteRef.operationName;
console.log(name);
```

### Variables
The `CreateLessonNote` mutation requires an argument of type `CreateLessonNoteVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateLessonNoteVariables {
  id: UUIDString;
  userId: string;
  lessonId?: UUIDString | null;
  lessonTitle?: string | null;
  content: string;
  updatedAt: DateString;
}
```
### Return Type
Recall that executing the `CreateLessonNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLessonNoteData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLessonNoteData {
  lessonNote_insert: LessonNote_Key;
}
```
### Using `CreateLessonNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLessonNote, CreateLessonNoteVariables } from '@impact26/dataconnect-sdk';

// The `CreateLessonNote` mutation requires an argument of type `CreateLessonNoteVariables`:
const createLessonNoteVars: CreateLessonNoteVariables = {
  id: ..., 
  userId: ..., 
  lessonId: ..., // optional
  lessonTitle: ..., // optional
  content: ..., 
  updatedAt: ..., 
};

// Call the `createLessonNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLessonNote(createLessonNoteVars);
// Variables can be defined inline as well.
const { data } = await createLessonNote({ id: ..., userId: ..., lessonId: ..., lessonTitle: ..., content: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLessonNote(dataConnect, createLessonNoteVars);

console.log(data.lessonNote_insert);

// Or, you can use the `Promise` API.
createLessonNote(createLessonNoteVars).then((response) => {
  const data = response.data;
  console.log(data.lessonNote_insert);
});
```

### Using `CreateLessonNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLessonNoteRef, CreateLessonNoteVariables } from '@impact26/dataconnect-sdk';

// The `CreateLessonNote` mutation requires an argument of type `CreateLessonNoteVariables`:
const createLessonNoteVars: CreateLessonNoteVariables = {
  id: ..., 
  userId: ..., 
  lessonId: ..., // optional
  lessonTitle: ..., // optional
  content: ..., 
  updatedAt: ..., 
};

// Call the `createLessonNoteRef()` function to get a reference to the mutation.
const ref = createLessonNoteRef(createLessonNoteVars);
// Variables can be defined inline as well.
const ref = createLessonNoteRef({ id: ..., userId: ..., lessonId: ..., lessonTitle: ..., content: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLessonNoteRef(dataConnect, createLessonNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lessonNote_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonNote_insert);
});
```

## UpdateLessonNote
You can execute the `UpdateLessonNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateLessonNote(vars: UpdateLessonNoteVariables): MutationPromise<UpdateLessonNoteData, UpdateLessonNoteVariables>;

interface UpdateLessonNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLessonNoteVariables): MutationRef<UpdateLessonNoteData, UpdateLessonNoteVariables>;
}
export const updateLessonNoteRef: UpdateLessonNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLessonNote(dc: DataConnect, vars: UpdateLessonNoteVariables): MutationPromise<UpdateLessonNoteData, UpdateLessonNoteVariables>;

interface UpdateLessonNoteRef {
  ...
  (dc: DataConnect, vars: UpdateLessonNoteVariables): MutationRef<UpdateLessonNoteData, UpdateLessonNoteVariables>;
}
export const updateLessonNoteRef: UpdateLessonNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLessonNoteRef:
```typescript
const name = updateLessonNoteRef.operationName;
console.log(name);
```

### Variables
The `UpdateLessonNote` mutation requires an argument of type `UpdateLessonNoteVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateLessonNoteVariables {
  id: UUIDString;
  lessonTitle?: string | null;
  content: string;
  updatedAt: DateString;
}
```
### Return Type
Recall that executing the `UpdateLessonNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLessonNoteData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLessonNoteData {
  lessonNote_update?: LessonNote_Key | null;
}
```
### Using `UpdateLessonNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLessonNote, UpdateLessonNoteVariables } from '@impact26/dataconnect-sdk';

// The `UpdateLessonNote` mutation requires an argument of type `UpdateLessonNoteVariables`:
const updateLessonNoteVars: UpdateLessonNoteVariables = {
  id: ..., 
  lessonTitle: ..., // optional
  content: ..., 
  updatedAt: ..., 
};

// Call the `updateLessonNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLessonNote(updateLessonNoteVars);
// Variables can be defined inline as well.
const { data } = await updateLessonNote({ id: ..., lessonTitle: ..., content: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLessonNote(dataConnect, updateLessonNoteVars);

console.log(data.lessonNote_update);

// Or, you can use the `Promise` API.
updateLessonNote(updateLessonNoteVars).then((response) => {
  const data = response.data;
  console.log(data.lessonNote_update);
});
```

### Using `UpdateLessonNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLessonNoteRef, UpdateLessonNoteVariables } from '@impact26/dataconnect-sdk';

// The `UpdateLessonNote` mutation requires an argument of type `UpdateLessonNoteVariables`:
const updateLessonNoteVars: UpdateLessonNoteVariables = {
  id: ..., 
  lessonTitle: ..., // optional
  content: ..., 
  updatedAt: ..., 
};

// Call the `updateLessonNoteRef()` function to get a reference to the mutation.
const ref = updateLessonNoteRef(updateLessonNoteVars);
// Variables can be defined inline as well.
const ref = updateLessonNoteRef({ id: ..., lessonTitle: ..., content: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLessonNoteRef(dataConnect, updateLessonNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lessonNote_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonNote_update);
});
```

## DeleteLessonNote
You can execute the `DeleteLessonNote` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteLessonNote(vars: DeleteLessonNoteVariables): MutationPromise<DeleteLessonNoteData, DeleteLessonNoteVariables>;

interface DeleteLessonNoteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLessonNoteVariables): MutationRef<DeleteLessonNoteData, DeleteLessonNoteVariables>;
}
export const deleteLessonNoteRef: DeleteLessonNoteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteLessonNote(dc: DataConnect, vars: DeleteLessonNoteVariables): MutationPromise<DeleteLessonNoteData, DeleteLessonNoteVariables>;

interface DeleteLessonNoteRef {
  ...
  (dc: DataConnect, vars: DeleteLessonNoteVariables): MutationRef<DeleteLessonNoteData, DeleteLessonNoteVariables>;
}
export const deleteLessonNoteRef: DeleteLessonNoteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteLessonNoteRef:
```typescript
const name = deleteLessonNoteRef.operationName;
console.log(name);
```

### Variables
The `DeleteLessonNote` mutation requires an argument of type `DeleteLessonNoteVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteLessonNoteVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteLessonNote` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteLessonNoteData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteLessonNoteData {
  lessonNote_delete?: LessonNote_Key | null;
}
```
### Using `DeleteLessonNote`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteLessonNote, DeleteLessonNoteVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLessonNote` mutation requires an argument of type `DeleteLessonNoteVariables`:
const deleteLessonNoteVars: DeleteLessonNoteVariables = {
  id: ..., 
};

// Call the `deleteLessonNote()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteLessonNote(deleteLessonNoteVars);
// Variables can be defined inline as well.
const { data } = await deleteLessonNote({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteLessonNote(dataConnect, deleteLessonNoteVars);

console.log(data.lessonNote_delete);

// Or, you can use the `Promise` API.
deleteLessonNote(deleteLessonNoteVars).then((response) => {
  const data = response.data;
  console.log(data.lessonNote_delete);
});
```

### Using `DeleteLessonNote`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteLessonNoteRef, DeleteLessonNoteVariables } from '@impact26/dataconnect-sdk';

// The `DeleteLessonNote` mutation requires an argument of type `DeleteLessonNoteVariables`:
const deleteLessonNoteVars: DeleteLessonNoteVariables = {
  id: ..., 
};

// Call the `deleteLessonNoteRef()` function to get a reference to the mutation.
const ref = deleteLessonNoteRef(deleteLessonNoteVars);
// Variables can be defined inline as well.
const ref = deleteLessonNoteRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteLessonNoteRef(dataConnect, deleteLessonNoteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.lessonNote_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.lessonNote_delete);
});
```

## UpsertUserFavorite
You can execute the `UpsertUserFavorite` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
upsertUserFavorite(vars: UpsertUserFavoriteVariables): MutationPromise<UpsertUserFavoriteData, UpsertUserFavoriteVariables>;

interface UpsertUserFavoriteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserFavoriteVariables): MutationRef<UpsertUserFavoriteData, UpsertUserFavoriteVariables>;
}
export const upsertUserFavoriteRef: UpsertUserFavoriteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUserFavorite(dc: DataConnect, vars: UpsertUserFavoriteVariables): MutationPromise<UpsertUserFavoriteData, UpsertUserFavoriteVariables>;

interface UpsertUserFavoriteRef {
  ...
  (dc: DataConnect, vars: UpsertUserFavoriteVariables): MutationRef<UpsertUserFavoriteData, UpsertUserFavoriteVariables>;
}
export const upsertUserFavoriteRef: UpsertUserFavoriteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserFavoriteRef:
```typescript
const name = upsertUserFavoriteRef.operationName;
console.log(name);
```

### Variables
The `UpsertUserFavorite` mutation requires an argument of type `UpsertUserFavoriteVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserFavoriteVariables {
  userId: string;
  itemType: string;
  itemId: string;
}
```
### Return Type
Recall that executing the `UpsertUserFavorite` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserFavoriteData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserFavoriteData {
  userFavorite_upsert: UserFavorite_Key;
}
```
### Using `UpsertUserFavorite`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserFavorite, UpsertUserFavoriteVariables } from '@impact26/dataconnect-sdk';

// The `UpsertUserFavorite` mutation requires an argument of type `UpsertUserFavoriteVariables`:
const upsertUserFavoriteVars: UpsertUserFavoriteVariables = {
  userId: ..., 
  itemType: ..., 
  itemId: ..., 
};

// Call the `upsertUserFavorite()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserFavorite(upsertUserFavoriteVars);
// Variables can be defined inline as well.
const { data } = await upsertUserFavorite({ userId: ..., itemType: ..., itemId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserFavorite(dataConnect, upsertUserFavoriteVars);

console.log(data.userFavorite_upsert);

// Or, you can use the `Promise` API.
upsertUserFavorite(upsertUserFavoriteVars).then((response) => {
  const data = response.data;
  console.log(data.userFavorite_upsert);
});
```

### Using `UpsertUserFavorite`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserFavoriteRef, UpsertUserFavoriteVariables } from '@impact26/dataconnect-sdk';

// The `UpsertUserFavorite` mutation requires an argument of type `UpsertUserFavoriteVariables`:
const upsertUserFavoriteVars: UpsertUserFavoriteVariables = {
  userId: ..., 
  itemType: ..., 
  itemId: ..., 
};

// Call the `upsertUserFavoriteRef()` function to get a reference to the mutation.
const ref = upsertUserFavoriteRef(upsertUserFavoriteVars);
// Variables can be defined inline as well.
const ref = upsertUserFavoriteRef({ userId: ..., itemType: ..., itemId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserFavoriteRef(dataConnect, upsertUserFavoriteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userFavorite_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userFavorite_upsert);
});
```

## DeleteUserFavorite
You can execute the `DeleteUserFavorite` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteUserFavorite(vars: DeleteUserFavoriteVariables): MutationPromise<DeleteUserFavoriteData, DeleteUserFavoriteVariables>;

interface DeleteUserFavoriteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserFavoriteVariables): MutationRef<DeleteUserFavoriteData, DeleteUserFavoriteVariables>;
}
export const deleteUserFavoriteRef: DeleteUserFavoriteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserFavorite(dc: DataConnect, vars: DeleteUserFavoriteVariables): MutationPromise<DeleteUserFavoriteData, DeleteUserFavoriteVariables>;

interface DeleteUserFavoriteRef {
  ...
  (dc: DataConnect, vars: DeleteUserFavoriteVariables): MutationRef<DeleteUserFavoriteData, DeleteUserFavoriteVariables>;
}
export const deleteUserFavoriteRef: DeleteUserFavoriteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserFavoriteRef:
```typescript
const name = deleteUserFavoriteRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserFavorite` mutation requires an argument of type `DeleteUserFavoriteVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserFavoriteVariables {
  userId: string;
  itemType: string;
  itemId: string;
}
```
### Return Type
Recall that executing the `DeleteUserFavorite` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserFavoriteData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserFavoriteData {
  userFavorite_delete?: UserFavorite_Key | null;
}
```
### Using `DeleteUserFavorite`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserFavorite, DeleteUserFavoriteVariables } from '@impact26/dataconnect-sdk';

// The `DeleteUserFavorite` mutation requires an argument of type `DeleteUserFavoriteVariables`:
const deleteUserFavoriteVars: DeleteUserFavoriteVariables = {
  userId: ..., 
  itemType: ..., 
  itemId: ..., 
};

// Call the `deleteUserFavorite()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserFavorite(deleteUserFavoriteVars);
// Variables can be defined inline as well.
const { data } = await deleteUserFavorite({ userId: ..., itemType: ..., itemId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserFavorite(dataConnect, deleteUserFavoriteVars);

console.log(data.userFavorite_delete);

// Or, you can use the `Promise` API.
deleteUserFavorite(deleteUserFavoriteVars).then((response) => {
  const data = response.data;
  console.log(data.userFavorite_delete);
});
```

### Using `DeleteUserFavorite`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserFavoriteRef, DeleteUserFavoriteVariables } from '@impact26/dataconnect-sdk';

// The `DeleteUserFavorite` mutation requires an argument of type `DeleteUserFavoriteVariables`:
const deleteUserFavoriteVars: DeleteUserFavoriteVariables = {
  userId: ..., 
  itemType: ..., 
  itemId: ..., 
};

// Call the `deleteUserFavoriteRef()` function to get a reference to the mutation.
const ref = deleteUserFavoriteRef(deleteUserFavoriteVars);
// Variables can be defined inline as well.
const ref = deleteUserFavoriteRef({ userId: ..., itemType: ..., itemId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserFavoriteRef(dataConnect, deleteUserFavoriteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userFavorite_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userFavorite_delete);
});
```

## CreateCustomDomain
You can execute the `CreateCustomDomain` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createCustomDomain(vars: CreateCustomDomainVariables): MutationPromise<CreateCustomDomainData, CreateCustomDomainVariables>;

interface CreateCustomDomainRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCustomDomainVariables): MutationRef<CreateCustomDomainData, CreateCustomDomainVariables>;
}
export const createCustomDomainRef: CreateCustomDomainRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCustomDomain(dc: DataConnect, vars: CreateCustomDomainVariables): MutationPromise<CreateCustomDomainData, CreateCustomDomainVariables>;

interface CreateCustomDomainRef {
  ...
  (dc: DataConnect, vars: CreateCustomDomainVariables): MutationRef<CreateCustomDomainData, CreateCustomDomainVariables>;
}
export const createCustomDomainRef: CreateCustomDomainRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCustomDomainRef:
```typescript
const name = createCustomDomainRef.operationName;
console.log(name);
```

### Variables
The `CreateCustomDomain` mutation requires an argument of type `CreateCustomDomainVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCustomDomainVariables {
  id: UUIDString;
  name: string;
  createdById?: string | null;
}
```
### Return Type
Recall that executing the `CreateCustomDomain` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCustomDomainData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCustomDomainData {
  customDomain_insert: CustomDomain_Key;
}
```
### Using `CreateCustomDomain`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCustomDomain, CreateCustomDomainVariables } from '@impact26/dataconnect-sdk';

// The `CreateCustomDomain` mutation requires an argument of type `CreateCustomDomainVariables`:
const createCustomDomainVars: CreateCustomDomainVariables = {
  id: ..., 
  name: ..., 
  createdById: ..., // optional
};

// Call the `createCustomDomain()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCustomDomain(createCustomDomainVars);
// Variables can be defined inline as well.
const { data } = await createCustomDomain({ id: ..., name: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCustomDomain(dataConnect, createCustomDomainVars);

console.log(data.customDomain_insert);

// Or, you can use the `Promise` API.
createCustomDomain(createCustomDomainVars).then((response) => {
  const data = response.data;
  console.log(data.customDomain_insert);
});
```

### Using `CreateCustomDomain`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCustomDomainRef, CreateCustomDomainVariables } from '@impact26/dataconnect-sdk';

// The `CreateCustomDomain` mutation requires an argument of type `CreateCustomDomainVariables`:
const createCustomDomainVars: CreateCustomDomainVariables = {
  id: ..., 
  name: ..., 
  createdById: ..., // optional
};

// Call the `createCustomDomainRef()` function to get a reference to the mutation.
const ref = createCustomDomainRef(createCustomDomainVars);
// Variables can be defined inline as well.
const ref = createCustomDomainRef({ id: ..., name: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCustomDomainRef(dataConnect, createCustomDomainVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.customDomain_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.customDomain_insert);
});
```

## CreateCohort
You can execute the `CreateCohort` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createCohort(vars: CreateCohortVariables): MutationPromise<CreateCohortData, CreateCohortVariables>;

interface CreateCohortRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCohortVariables): MutationRef<CreateCohortData, CreateCohortVariables>;
}
export const createCohortRef: CreateCohortRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCohort(dc: DataConnect, vars: CreateCohortVariables): MutationPromise<CreateCohortData, CreateCohortVariables>;

interface CreateCohortRef {
  ...
  (dc: DataConnect, vars: CreateCohortVariables): MutationRef<CreateCohortData, CreateCohortVariables>;
}
export const createCohortRef: CreateCohortRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCohortRef:
```typescript
const name = createCohortRef.operationName;
console.log(name);
```

### Variables
The `CreateCohort` mutation requires an argument of type `CreateCohortVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCohortVariables {
  id: UUIDString;
  name: string;
  description?: string | null;
  createdById: string;
}
```
### Return Type
Recall that executing the `CreateCohort` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCohortData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCohortData {
  cohort_insert: Cohort_Key;
}
```
### Using `CreateCohort`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCohort, CreateCohortVariables } from '@impact26/dataconnect-sdk';

// The `CreateCohort` mutation requires an argument of type `CreateCohortVariables`:
const createCohortVars: CreateCohortVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  createdById: ..., 
};

// Call the `createCohort()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCohort(createCohortVars);
// Variables can be defined inline as well.
const { data } = await createCohort({ id: ..., name: ..., description: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCohort(dataConnect, createCohortVars);

console.log(data.cohort_insert);

// Or, you can use the `Promise` API.
createCohort(createCohortVars).then((response) => {
  const data = response.data;
  console.log(data.cohort_insert);
});
```

### Using `CreateCohort`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCohortRef, CreateCohortVariables } from '@impact26/dataconnect-sdk';

// The `CreateCohort` mutation requires an argument of type `CreateCohortVariables`:
const createCohortVars: CreateCohortVariables = {
  id: ..., 
  name: ..., 
  description: ..., // optional
  createdById: ..., 
};

// Call the `createCohortRef()` function to get a reference to the mutation.
const ref = createCohortRef(createCohortVars);
// Variables can be defined inline as well.
const ref = createCohortRef({ id: ..., name: ..., description: ..., createdById: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCohortRef(dataConnect, createCohortVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cohort_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cohort_insert);
});
```

## UpdateCohort
You can execute the `UpdateCohort` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateCohort(vars: UpdateCohortVariables): MutationPromise<UpdateCohortData, UpdateCohortVariables>;

interface UpdateCohortRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCohortVariables): MutationRef<UpdateCohortData, UpdateCohortVariables>;
}
export const updateCohortRef: UpdateCohortRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCohort(dc: DataConnect, vars: UpdateCohortVariables): MutationPromise<UpdateCohortData, UpdateCohortVariables>;

interface UpdateCohortRef {
  ...
  (dc: DataConnect, vars: UpdateCohortVariables): MutationRef<UpdateCohortData, UpdateCohortVariables>;
}
export const updateCohortRef: UpdateCohortRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCohortRef:
```typescript
const name = updateCohortRef.operationName;
console.log(name);
```

### Variables
The `UpdateCohort` mutation requires an argument of type `UpdateCohortVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCohortVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  archivedAt?: DateString | null;
  updatedAt: DateString;
}
```
### Return Type
Recall that executing the `UpdateCohort` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCohortData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCohortData {
  cohort_update?: Cohort_Key | null;
}
```
### Using `UpdateCohort`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCohort, UpdateCohortVariables } from '@impact26/dataconnect-sdk';

// The `UpdateCohort` mutation requires an argument of type `UpdateCohortVariables`:
const updateCohortVars: UpdateCohortVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  archivedAt: ..., // optional
  updatedAt: ..., 
};

// Call the `updateCohort()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCohort(updateCohortVars);
// Variables can be defined inline as well.
const { data } = await updateCohort({ id: ..., name: ..., description: ..., archivedAt: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCohort(dataConnect, updateCohortVars);

console.log(data.cohort_update);

// Or, you can use the `Promise` API.
updateCohort(updateCohortVars).then((response) => {
  const data = response.data;
  console.log(data.cohort_update);
});
```

### Using `UpdateCohort`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCohortRef, UpdateCohortVariables } from '@impact26/dataconnect-sdk';

// The `UpdateCohort` mutation requires an argument of type `UpdateCohortVariables`:
const updateCohortVars: UpdateCohortVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  archivedAt: ..., // optional
  updatedAt: ..., 
};

// Call the `updateCohortRef()` function to get a reference to the mutation.
const ref = updateCohortRef(updateCohortVars);
// Variables can be defined inline as well.
const ref = updateCohortRef({ id: ..., name: ..., description: ..., archivedAt: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCohortRef(dataConnect, updateCohortVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cohort_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cohort_update);
});
```

## DeleteCohort
You can execute the `DeleteCohort` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteCohort(vars: DeleteCohortVariables): MutationPromise<DeleteCohortData, DeleteCohortVariables>;

interface DeleteCohortRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCohortVariables): MutationRef<DeleteCohortData, DeleteCohortVariables>;
}
export const deleteCohortRef: DeleteCohortRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCohort(dc: DataConnect, vars: DeleteCohortVariables): MutationPromise<DeleteCohortData, DeleteCohortVariables>;

interface DeleteCohortRef {
  ...
  (dc: DataConnect, vars: DeleteCohortVariables): MutationRef<DeleteCohortData, DeleteCohortVariables>;
}
export const deleteCohortRef: DeleteCohortRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCohortRef:
```typescript
const name = deleteCohortRef.operationName;
console.log(name);
```

### Variables
The `DeleteCohort` mutation requires an argument of type `DeleteCohortVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCohortVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCohort` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCohortData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCohortData {
  cohort_delete?: Cohort_Key | null;
}
```
### Using `DeleteCohort`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCohort, DeleteCohortVariables } from '@impact26/dataconnect-sdk';

// The `DeleteCohort` mutation requires an argument of type `DeleteCohortVariables`:
const deleteCohortVars: DeleteCohortVariables = {
  id: ..., 
};

// Call the `deleteCohort()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCohort(deleteCohortVars);
// Variables can be defined inline as well.
const { data } = await deleteCohort({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCohort(dataConnect, deleteCohortVars);

console.log(data.cohort_delete);

// Or, you can use the `Promise` API.
deleteCohort(deleteCohortVars).then((response) => {
  const data = response.data;
  console.log(data.cohort_delete);
});
```

### Using `DeleteCohort`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCohortRef, DeleteCohortVariables } from '@impact26/dataconnect-sdk';

// The `DeleteCohort` mutation requires an argument of type `DeleteCohortVariables`:
const deleteCohortVars: DeleteCohortVariables = {
  id: ..., 
};

// Call the `deleteCohortRef()` function to get a reference to the mutation.
const ref = deleteCohortRef(deleteCohortVars);
// Variables can be defined inline as well.
const ref = deleteCohortRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCohortRef(dataConnect, deleteCohortVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cohort_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cohort_delete);
});
```

## DeleteCohortMembershipsForCohort
You can execute the `DeleteCohortMembershipsForCohort` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteCohortMembershipsForCohort(vars: DeleteCohortMembershipsForCohortVariables): MutationPromise<DeleteCohortMembershipsForCohortData, DeleteCohortMembershipsForCohortVariables>;

interface DeleteCohortMembershipsForCohortRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCohortMembershipsForCohortVariables): MutationRef<DeleteCohortMembershipsForCohortData, DeleteCohortMembershipsForCohortVariables>;
}
export const deleteCohortMembershipsForCohortRef: DeleteCohortMembershipsForCohortRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCohortMembershipsForCohort(dc: DataConnect, vars: DeleteCohortMembershipsForCohortVariables): MutationPromise<DeleteCohortMembershipsForCohortData, DeleteCohortMembershipsForCohortVariables>;

interface DeleteCohortMembershipsForCohortRef {
  ...
  (dc: DataConnect, vars: DeleteCohortMembershipsForCohortVariables): MutationRef<DeleteCohortMembershipsForCohortData, DeleteCohortMembershipsForCohortVariables>;
}
export const deleteCohortMembershipsForCohortRef: DeleteCohortMembershipsForCohortRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCohortMembershipsForCohortRef:
```typescript
const name = deleteCohortMembershipsForCohortRef.operationName;
console.log(name);
```

### Variables
The `DeleteCohortMembershipsForCohort` mutation requires an argument of type `DeleteCohortMembershipsForCohortVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCohortMembershipsForCohortVariables {
  cohortId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCohortMembershipsForCohort` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCohortMembershipsForCohortData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCohortMembershipsForCohortData {
  cohortMembership_deleteMany: number;
}
```
### Using `DeleteCohortMembershipsForCohort`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCohortMembershipsForCohort, DeleteCohortMembershipsForCohortVariables } from '@impact26/dataconnect-sdk';

// The `DeleteCohortMembershipsForCohort` mutation requires an argument of type `DeleteCohortMembershipsForCohortVariables`:
const deleteCohortMembershipsForCohortVars: DeleteCohortMembershipsForCohortVariables = {
  cohortId: ..., 
};

// Call the `deleteCohortMembershipsForCohort()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCohortMembershipsForCohort(deleteCohortMembershipsForCohortVars);
// Variables can be defined inline as well.
const { data } = await deleteCohortMembershipsForCohort({ cohortId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCohortMembershipsForCohort(dataConnect, deleteCohortMembershipsForCohortVars);

console.log(data.cohortMembership_deleteMany);

// Or, you can use the `Promise` API.
deleteCohortMembershipsForCohort(deleteCohortMembershipsForCohortVars).then((response) => {
  const data = response.data;
  console.log(data.cohortMembership_deleteMany);
});
```

### Using `DeleteCohortMembershipsForCohort`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCohortMembershipsForCohortRef, DeleteCohortMembershipsForCohortVariables } from '@impact26/dataconnect-sdk';

// The `DeleteCohortMembershipsForCohort` mutation requires an argument of type `DeleteCohortMembershipsForCohortVariables`:
const deleteCohortMembershipsForCohortVars: DeleteCohortMembershipsForCohortVariables = {
  cohortId: ..., 
};

// Call the `deleteCohortMembershipsForCohortRef()` function to get a reference to the mutation.
const ref = deleteCohortMembershipsForCohortRef(deleteCohortMembershipsForCohortVars);
// Variables can be defined inline as well.
const ref = deleteCohortMembershipsForCohortRef({ cohortId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCohortMembershipsForCohortRef(dataConnect, deleteCohortMembershipsForCohortVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cohortMembership_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cohortMembership_deleteMany);
});
```

## DeleteCohortInstructorsForCohort
You can execute the `DeleteCohortInstructorsForCohort` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteCohortInstructorsForCohort(vars: DeleteCohortInstructorsForCohortVariables): MutationPromise<DeleteCohortInstructorsForCohortData, DeleteCohortInstructorsForCohortVariables>;

interface DeleteCohortInstructorsForCohortRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCohortInstructorsForCohortVariables): MutationRef<DeleteCohortInstructorsForCohortData, DeleteCohortInstructorsForCohortVariables>;
}
export const deleteCohortInstructorsForCohortRef: DeleteCohortInstructorsForCohortRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCohortInstructorsForCohort(dc: DataConnect, vars: DeleteCohortInstructorsForCohortVariables): MutationPromise<DeleteCohortInstructorsForCohortData, DeleteCohortInstructorsForCohortVariables>;

interface DeleteCohortInstructorsForCohortRef {
  ...
  (dc: DataConnect, vars: DeleteCohortInstructorsForCohortVariables): MutationRef<DeleteCohortInstructorsForCohortData, DeleteCohortInstructorsForCohortVariables>;
}
export const deleteCohortInstructorsForCohortRef: DeleteCohortInstructorsForCohortRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCohortInstructorsForCohortRef:
```typescript
const name = deleteCohortInstructorsForCohortRef.operationName;
console.log(name);
```

### Variables
The `DeleteCohortInstructorsForCohort` mutation requires an argument of type `DeleteCohortInstructorsForCohortVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCohortInstructorsForCohortVariables {
  cohortId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCohortInstructorsForCohort` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCohortInstructorsForCohortData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCohortInstructorsForCohortData {
  cohortInstructor_deleteMany: number;
}
```
### Using `DeleteCohortInstructorsForCohort`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCohortInstructorsForCohort, DeleteCohortInstructorsForCohortVariables } from '@impact26/dataconnect-sdk';

// The `DeleteCohortInstructorsForCohort` mutation requires an argument of type `DeleteCohortInstructorsForCohortVariables`:
const deleteCohortInstructorsForCohortVars: DeleteCohortInstructorsForCohortVariables = {
  cohortId: ..., 
};

// Call the `deleteCohortInstructorsForCohort()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCohortInstructorsForCohort(deleteCohortInstructorsForCohortVars);
// Variables can be defined inline as well.
const { data } = await deleteCohortInstructorsForCohort({ cohortId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCohortInstructorsForCohort(dataConnect, deleteCohortInstructorsForCohortVars);

console.log(data.cohortInstructor_deleteMany);

// Or, you can use the `Promise` API.
deleteCohortInstructorsForCohort(deleteCohortInstructorsForCohortVars).then((response) => {
  const data = response.data;
  console.log(data.cohortInstructor_deleteMany);
});
```

### Using `DeleteCohortInstructorsForCohort`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCohortInstructorsForCohortRef, DeleteCohortInstructorsForCohortVariables } from '@impact26/dataconnect-sdk';

// The `DeleteCohortInstructorsForCohort` mutation requires an argument of type `DeleteCohortInstructorsForCohortVariables`:
const deleteCohortInstructorsForCohortVars: DeleteCohortInstructorsForCohortVariables = {
  cohortId: ..., 
};

// Call the `deleteCohortInstructorsForCohortRef()` function to get a reference to the mutation.
const ref = deleteCohortInstructorsForCohortRef(deleteCohortInstructorsForCohortVars);
// Variables can be defined inline as well.
const ref = deleteCohortInstructorsForCohortRef({ cohortId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCohortInstructorsForCohortRef(dataConnect, deleteCohortInstructorsForCohortVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cohortInstructor_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cohortInstructor_deleteMany);
});
```

## AddCohortMembership
You can execute the `AddCohortMembership` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
addCohortMembership(vars: AddCohortMembershipVariables): MutationPromise<AddCohortMembershipData, AddCohortMembershipVariables>;

interface AddCohortMembershipRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCohortMembershipVariables): MutationRef<AddCohortMembershipData, AddCohortMembershipVariables>;
}
export const addCohortMembershipRef: AddCohortMembershipRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addCohortMembership(dc: DataConnect, vars: AddCohortMembershipVariables): MutationPromise<AddCohortMembershipData, AddCohortMembershipVariables>;

interface AddCohortMembershipRef {
  ...
  (dc: DataConnect, vars: AddCohortMembershipVariables): MutationRef<AddCohortMembershipData, AddCohortMembershipVariables>;
}
export const addCohortMembershipRef: AddCohortMembershipRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCohortMembershipRef:
```typescript
const name = addCohortMembershipRef.operationName;
console.log(name);
```

### Variables
The `AddCohortMembership` mutation requires an argument of type `AddCohortMembershipVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCohortMembershipVariables {
  cohortId: UUIDString;
  userId: string;
}
```
### Return Type
Recall that executing the `AddCohortMembership` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCohortMembershipData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCohortMembershipData {
  cohortMembership_upsert: CohortMembership_Key;
}
```
### Using `AddCohortMembership`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addCohortMembership, AddCohortMembershipVariables } from '@impact26/dataconnect-sdk';

// The `AddCohortMembership` mutation requires an argument of type `AddCohortMembershipVariables`:
const addCohortMembershipVars: AddCohortMembershipVariables = {
  cohortId: ..., 
  userId: ..., 
};

// Call the `addCohortMembership()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addCohortMembership(addCohortMembershipVars);
// Variables can be defined inline as well.
const { data } = await addCohortMembership({ cohortId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addCohortMembership(dataConnect, addCohortMembershipVars);

console.log(data.cohortMembership_upsert);

// Or, you can use the `Promise` API.
addCohortMembership(addCohortMembershipVars).then((response) => {
  const data = response.data;
  console.log(data.cohortMembership_upsert);
});
```

### Using `AddCohortMembership`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCohortMembershipRef, AddCohortMembershipVariables } from '@impact26/dataconnect-sdk';

// The `AddCohortMembership` mutation requires an argument of type `AddCohortMembershipVariables`:
const addCohortMembershipVars: AddCohortMembershipVariables = {
  cohortId: ..., 
  userId: ..., 
};

// Call the `addCohortMembershipRef()` function to get a reference to the mutation.
const ref = addCohortMembershipRef(addCohortMembershipVars);
// Variables can be defined inline as well.
const ref = addCohortMembershipRef({ cohortId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCohortMembershipRef(dataConnect, addCohortMembershipVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cohortMembership_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cohortMembership_upsert);
});
```

## RemoveCohortMembership
You can execute the `RemoveCohortMembership` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
removeCohortMembership(vars: RemoveCohortMembershipVariables): MutationPromise<RemoveCohortMembershipData, RemoveCohortMembershipVariables>;

interface RemoveCohortMembershipRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveCohortMembershipVariables): MutationRef<RemoveCohortMembershipData, RemoveCohortMembershipVariables>;
}
export const removeCohortMembershipRef: RemoveCohortMembershipRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeCohortMembership(dc: DataConnect, vars: RemoveCohortMembershipVariables): MutationPromise<RemoveCohortMembershipData, RemoveCohortMembershipVariables>;

interface RemoveCohortMembershipRef {
  ...
  (dc: DataConnect, vars: RemoveCohortMembershipVariables): MutationRef<RemoveCohortMembershipData, RemoveCohortMembershipVariables>;
}
export const removeCohortMembershipRef: RemoveCohortMembershipRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeCohortMembershipRef:
```typescript
const name = removeCohortMembershipRef.operationName;
console.log(name);
```

### Variables
The `RemoveCohortMembership` mutation requires an argument of type `RemoveCohortMembershipVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveCohortMembershipVariables {
  cohortId: UUIDString;
  userId: string;
}
```
### Return Type
Recall that executing the `RemoveCohortMembership` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveCohortMembershipData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveCohortMembershipData {
  cohortMembership_deleteMany: number;
}
```
### Using `RemoveCohortMembership`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeCohortMembership, RemoveCohortMembershipVariables } from '@impact26/dataconnect-sdk';

// The `RemoveCohortMembership` mutation requires an argument of type `RemoveCohortMembershipVariables`:
const removeCohortMembershipVars: RemoveCohortMembershipVariables = {
  cohortId: ..., 
  userId: ..., 
};

// Call the `removeCohortMembership()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeCohortMembership(removeCohortMembershipVars);
// Variables can be defined inline as well.
const { data } = await removeCohortMembership({ cohortId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeCohortMembership(dataConnect, removeCohortMembershipVars);

console.log(data.cohortMembership_deleteMany);

// Or, you can use the `Promise` API.
removeCohortMembership(removeCohortMembershipVars).then((response) => {
  const data = response.data;
  console.log(data.cohortMembership_deleteMany);
});
```

### Using `RemoveCohortMembership`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeCohortMembershipRef, RemoveCohortMembershipVariables } from '@impact26/dataconnect-sdk';

// The `RemoveCohortMembership` mutation requires an argument of type `RemoveCohortMembershipVariables`:
const removeCohortMembershipVars: RemoveCohortMembershipVariables = {
  cohortId: ..., 
  userId: ..., 
};

// Call the `removeCohortMembershipRef()` function to get a reference to the mutation.
const ref = removeCohortMembershipRef(removeCohortMembershipVars);
// Variables can be defined inline as well.
const ref = removeCohortMembershipRef({ cohortId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeCohortMembershipRef(dataConnect, removeCohortMembershipVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cohortMembership_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cohortMembership_deleteMany);
});
```

## AddCohortInstructor
You can execute the `AddCohortInstructor` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
addCohortInstructor(vars: AddCohortInstructorVariables): MutationPromise<AddCohortInstructorData, AddCohortInstructorVariables>;

interface AddCohortInstructorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCohortInstructorVariables): MutationRef<AddCohortInstructorData, AddCohortInstructorVariables>;
}
export const addCohortInstructorRef: AddCohortInstructorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addCohortInstructor(dc: DataConnect, vars: AddCohortInstructorVariables): MutationPromise<AddCohortInstructorData, AddCohortInstructorVariables>;

interface AddCohortInstructorRef {
  ...
  (dc: DataConnect, vars: AddCohortInstructorVariables): MutationRef<AddCohortInstructorData, AddCohortInstructorVariables>;
}
export const addCohortInstructorRef: AddCohortInstructorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCohortInstructorRef:
```typescript
const name = addCohortInstructorRef.operationName;
console.log(name);
```

### Variables
The `AddCohortInstructor` mutation requires an argument of type `AddCohortInstructorVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCohortInstructorVariables {
  cohortId: UUIDString;
  instructorId: string;
}
```
### Return Type
Recall that executing the `AddCohortInstructor` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCohortInstructorData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCohortInstructorData {
  cohortInstructor_upsert: CohortInstructor_Key;
}
```
### Using `AddCohortInstructor`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addCohortInstructor, AddCohortInstructorVariables } from '@impact26/dataconnect-sdk';

// The `AddCohortInstructor` mutation requires an argument of type `AddCohortInstructorVariables`:
const addCohortInstructorVars: AddCohortInstructorVariables = {
  cohortId: ..., 
  instructorId: ..., 
};

// Call the `addCohortInstructor()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addCohortInstructor(addCohortInstructorVars);
// Variables can be defined inline as well.
const { data } = await addCohortInstructor({ cohortId: ..., instructorId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addCohortInstructor(dataConnect, addCohortInstructorVars);

console.log(data.cohortInstructor_upsert);

// Or, you can use the `Promise` API.
addCohortInstructor(addCohortInstructorVars).then((response) => {
  const data = response.data;
  console.log(data.cohortInstructor_upsert);
});
```

### Using `AddCohortInstructor`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCohortInstructorRef, AddCohortInstructorVariables } from '@impact26/dataconnect-sdk';

// The `AddCohortInstructor` mutation requires an argument of type `AddCohortInstructorVariables`:
const addCohortInstructorVars: AddCohortInstructorVariables = {
  cohortId: ..., 
  instructorId: ..., 
};

// Call the `addCohortInstructorRef()` function to get a reference to the mutation.
const ref = addCohortInstructorRef(addCohortInstructorVars);
// Variables can be defined inline as well.
const ref = addCohortInstructorRef({ cohortId: ..., instructorId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCohortInstructorRef(dataConnect, addCohortInstructorVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cohortInstructor_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cohortInstructor_upsert);
});
```

## RemoveCohortInstructor
You can execute the `RemoveCohortInstructor` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
removeCohortInstructor(vars: RemoveCohortInstructorVariables): MutationPromise<RemoveCohortInstructorData, RemoveCohortInstructorVariables>;

interface RemoveCohortInstructorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveCohortInstructorVariables): MutationRef<RemoveCohortInstructorData, RemoveCohortInstructorVariables>;
}
export const removeCohortInstructorRef: RemoveCohortInstructorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeCohortInstructor(dc: DataConnect, vars: RemoveCohortInstructorVariables): MutationPromise<RemoveCohortInstructorData, RemoveCohortInstructorVariables>;

interface RemoveCohortInstructorRef {
  ...
  (dc: DataConnect, vars: RemoveCohortInstructorVariables): MutationRef<RemoveCohortInstructorData, RemoveCohortInstructorVariables>;
}
export const removeCohortInstructorRef: RemoveCohortInstructorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeCohortInstructorRef:
```typescript
const name = removeCohortInstructorRef.operationName;
console.log(name);
```

### Variables
The `RemoveCohortInstructor` mutation requires an argument of type `RemoveCohortInstructorVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveCohortInstructorVariables {
  cohortId: UUIDString;
  instructorId: string;
}
```
### Return Type
Recall that executing the `RemoveCohortInstructor` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveCohortInstructorData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveCohortInstructorData {
  cohortInstructor_deleteMany: number;
}
```
### Using `RemoveCohortInstructor`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeCohortInstructor, RemoveCohortInstructorVariables } from '@impact26/dataconnect-sdk';

// The `RemoveCohortInstructor` mutation requires an argument of type `RemoveCohortInstructorVariables`:
const removeCohortInstructorVars: RemoveCohortInstructorVariables = {
  cohortId: ..., 
  instructorId: ..., 
};

// Call the `removeCohortInstructor()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeCohortInstructor(removeCohortInstructorVars);
// Variables can be defined inline as well.
const { data } = await removeCohortInstructor({ cohortId: ..., instructorId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeCohortInstructor(dataConnect, removeCohortInstructorVars);

console.log(data.cohortInstructor_deleteMany);

// Or, you can use the `Promise` API.
removeCohortInstructor(removeCohortInstructorVars).then((response) => {
  const data = response.data;
  console.log(data.cohortInstructor_deleteMany);
});
```

### Using `RemoveCohortInstructor`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeCohortInstructorRef, RemoveCohortInstructorVariables } from '@impact26/dataconnect-sdk';

// The `RemoveCohortInstructor` mutation requires an argument of type `RemoveCohortInstructorVariables`:
const removeCohortInstructorVars: RemoveCohortInstructorVariables = {
  cohortId: ..., 
  instructorId: ..., 
};

// Call the `removeCohortInstructorRef()` function to get a reference to the mutation.
const ref = removeCohortInstructorRef(removeCohortInstructorVars);
// Variables can be defined inline as well.
const ref = removeCohortInstructorRef({ cohortId: ..., instructorId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeCohortInstructorRef(dataConnect, removeCohortInstructorVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.cohortInstructor_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.cohortInstructor_deleteMany);
});
```

