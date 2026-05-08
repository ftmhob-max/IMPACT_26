import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'impact26-connector',
  service: 'impact26-dataconnect',
  location: 'us-central1'
};
export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createUserRef(dcInstance, inputVars));
}

export const updateUserRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserRole', inputVars);
}
updateUserRoleRef.operationName = 'UpdateUserRole';

export function updateUserRole(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateUserRoleRef(dcInstance, inputVars));
}

export const createCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCourse', inputVars);
}
createCourseRef.operationName = 'CreateCourse';

export function createCourse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCourseRef(dcInstance, inputVars));
}

export const updateCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCourse', inputVars);
}
updateCourseRef.operationName = 'UpdateCourse';

export function updateCourse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCourseRef(dcInstance, inputVars));
}

export const createModuleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateModule', inputVars);
}
createModuleRef.operationName = 'CreateModule';

export function createModule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createModuleRef(dcInstance, inputVars));
}

export const updateModuleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateModule', inputVars);
}
updateModuleRef.operationName = 'UpdateModule';

export function updateModule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateModuleRef(dcInstance, inputVars));
}

export const createLessonVersionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLessonVersion', inputVars);
}
createLessonVersionRef.operationName = 'CreateLessonVersion';

export function createLessonVersion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createLessonVersionRef(dcInstance, inputVars));
}

export const createLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLesson', inputVars);
}
createLessonRef.operationName = 'CreateLesson';

export function createLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createLessonRef(dcInstance, inputVars));
}

export const updateLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLesson', inputVars);
}
updateLessonRef.operationName = 'UpdateLesson';

export function updateLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateLessonRef(dcInstance, inputVars));
}

export const deleteLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteLesson', inputVars);
}
deleteLessonRef.operationName = 'DeleteLesson';

export function deleteLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteLessonRef(dcInstance, inputVars));
}

export const deleteModuleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteModule', inputVars);
}
deleteModuleRef.operationName = 'DeleteModule';

export function deleteModule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteModuleRef(dcInstance, inputVars));
}

export const deleteLessonVersionsForLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteLessonVersionsForLesson', inputVars);
}
deleteLessonVersionsForLessonRef.operationName = 'DeleteLessonVersionsForLesson';

export function deleteLessonVersionsForLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteLessonVersionsForLessonRef(dcInstance, inputVars));
}

export const deleteSourceLinksForLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceLinksForLesson', inputVars);
}
deleteSourceLinksForLessonRef.operationName = 'DeleteSourceLinksForLesson';

export function deleteSourceLinksForLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSourceLinksForLessonRef(dcInstance, inputVars));
}

export const deleteSourceLinksForQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceLinksForQuestion', inputVars);
}
deleteSourceLinksForQuestionRef.operationName = 'DeleteSourceLinksForQuestion';

export function deleteSourceLinksForQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSourceLinksForQuestionRef(dcInstance, inputVars));
}

export const deleteSourceLinksForMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceLinksForMaterial', inputVars);
}
deleteSourceLinksForMaterialRef.operationName = 'DeleteSourceLinksForMaterial';

export function deleteSourceLinksForMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSourceLinksForMaterialRef(dcInstance, inputVars));
}

export const deleteUserLessonProgressForLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserLessonProgressForLesson', inputVars);
}
deleteUserLessonProgressForLessonRef.operationName = 'DeleteUserLessonProgressForLesson';

export function deleteUserLessonProgressForLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteUserLessonProgressForLessonRef(dcInstance, inputVars));
}

export const deleteIngestionJobsForMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteIngestionJobsForMaterial', inputVars);
}
deleteIngestionJobsForMaterialRef.operationName = 'DeleteIngestionJobsForMaterial';

export function deleteIngestionJobsForMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteIngestionJobsForMaterialRef(dcInstance, inputVars));
}

export const deleteSourceMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceMaterial', inputVars);
}
deleteSourceMaterialRef.operationName = 'DeleteSourceMaterial';

export function deleteSourceMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSourceMaterialRef(dcInstance, inputVars));
}

export const createSourceMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSourceMaterial', inputVars);
}
createSourceMaterialRef.operationName = 'CreateSourceMaterial';

export function createSourceMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSourceMaterialRef(dcInstance, inputVars));
}

export const createIngestionJobRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateIngestionJob', inputVars);
}
createIngestionJobRef.operationName = 'CreateIngestionJob';

export function createIngestionJob(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createIngestionJobRef(dcInstance, inputVars));
}

export const createQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuestion', inputVars);
}
createQuestionRef.operationName = 'CreateQuestion';

export function createQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createQuestionRef(dcInstance, inputVars));
}

export const updateQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQuestion', inputVars);
}
updateQuestionRef.operationName = 'UpdateQuestion';

export function updateQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateQuestionRef(dcInstance, inputVars));
}

export const updateQuestionStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQuestionStatus', inputVars);
}
updateQuestionStatusRef.operationName = 'UpdateQuestionStatus';

export function updateQuestionStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateQuestionStatusRef(dcInstance, inputVars));
}

export const createAnswerChoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAnswerChoice', inputVars);
}
createAnswerChoiceRef.operationName = 'CreateAnswerChoice';

export function createAnswerChoice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAnswerChoiceRef(dcInstance, inputVars));
}

export const updateAnswerChoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAnswerChoice', inputVars);
}
updateAnswerChoiceRef.operationName = 'UpdateAnswerChoice';

export function updateAnswerChoice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateAnswerChoiceRef(dcInstance, inputVars));
}

export const deleteAnswerChoicesForQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAnswerChoicesForQuestion', inputVars);
}
deleteAnswerChoicesForQuestionRef.operationName = 'DeleteAnswerChoicesForQuestion';

export function deleteAnswerChoicesForQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAnswerChoicesForQuestionRef(dcInstance, inputVars));
}

export const deleteQuizQuestionsForQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuizQuestionsForQuestion', inputVars);
}
deleteQuizQuestionsForQuestionRef.operationName = 'DeleteQuizQuestionsForQuestion';

export function deleteQuizQuestionsForQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizQuestionsForQuestionRef(dcInstance, inputVars));
}

export const deleteQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuestion', inputVars);
}
deleteQuestionRef.operationName = 'DeleteQuestion';

export function deleteQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuestionRef(dcInstance, inputVars));
}

export const createQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuiz', inputVars);
}
createQuizRef.operationName = 'CreateQuiz';

export function createQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createQuizRef(dcInstance, inputVars));
}

export const addQuestionToQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddQuestionToQuiz', inputVars);
}
addQuestionToQuizRef.operationName = 'AddQuestionToQuiz';

export function addQuestionToQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addQuestionToQuizRef(dcInstance, inputVars));
}

export const updateQuizStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQuizStatus', inputVars);
}
updateQuizStatusRef.operationName = 'UpdateQuizStatus';

export function updateQuizStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateQuizStatusRef(dcInstance, inputVars));
}

export const deleteQuizQuestionsForQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuizQuestionsForQuiz', inputVars);
}
deleteQuizQuestionsForQuizRef.operationName = 'DeleteQuizQuestionsForQuiz';

export function deleteQuizQuestionsForQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizQuestionsForQuizRef(dcInstance, inputVars));
}

export const deleteQuizResponsesForQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuizResponsesForQuiz', inputVars);
}
deleteQuizResponsesForQuizRef.operationName = 'DeleteQuizResponsesForQuiz';

export function deleteQuizResponsesForQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizResponsesForQuizRef(dcInstance, inputVars));
}

export const deleteQuizAttemptsForQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuizAttemptsForQuiz', inputVars);
}
deleteQuizAttemptsForQuizRef.operationName = 'DeleteQuizAttemptsForQuiz';

export function deleteQuizAttemptsForQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizAttemptsForQuizRef(dcInstance, inputVars));
}

export const deleteQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuiz', inputVars);
}
deleteQuizRef.operationName = 'DeleteQuiz';

export function deleteQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizRef(dcInstance, inputVars));
}

export const enrollInCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'EnrollInCourse', inputVars);
}
enrollInCourseRef.operationName = 'EnrollInCourse';

export function enrollInCourse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(enrollInCourseRef(dcInstance, inputVars));
}

export const upsertLessonProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertLessonProgress', inputVars);
}
upsertLessonProgressRef.operationName = 'UpsertLessonProgress';

export function upsertLessonProgress(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertLessonProgressRef(dcInstance, inputVars));
}

export const createQuizAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuizAttempt', inputVars);
}
createQuizAttemptRef.operationName = 'CreateQuizAttempt';

export function createQuizAttempt(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createQuizAttemptRef(dcInstance, inputVars));
}

export const upsertQuizResponseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertQuizResponse', inputVars);
}
upsertQuizResponseRef.operationName = 'UpsertQuizResponse';

export function upsertQuizResponse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertQuizResponseRef(dcInstance, inputVars));
}

export const completeQuizAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteQuizAttempt', inputVars);
}
completeQuizAttemptRef.operationName = 'CompleteQuizAttempt';

export function completeQuizAttempt(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(completeQuizAttemptRef(dcInstance, inputVars));
}

export const markAnsweredAtRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkAnsweredAt', inputVars);
}
markAnsweredAtRef.operationName = 'MarkAnsweredAt';

export function markAnsweredAt(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markAnsweredAtRef(dcInstance, inputVars));
}

export const createFormulaSectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFormulaSection', inputVars);
}
createFormulaSectionRef.operationName = 'CreateFormulaSection';

export function createFormulaSection(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createFormulaSectionRef(dcInstance, inputVars));
}

export const createFormulaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFormula', inputVars);
}
createFormulaRef.operationName = 'CreateFormula';

export function createFormula(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createFormulaRef(dcInstance, inputVars));
}

export const deleteFormulasForSectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteFormulasForSection', inputVars);
}
deleteFormulasForSectionRef.operationName = 'DeleteFormulasForSection';

export function deleteFormulasForSection(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteFormulasForSectionRef(dcInstance, inputVars));
}

export const deleteFormulaSectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteFormulaSection', inputVars);
}
deleteFormulaSectionRef.operationName = 'DeleteFormulaSection';

export function deleteFormulaSection(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteFormulaSectionRef(dcInstance, inputVars));
}

export const createContentSourceLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateContentSourceLink', inputVars);
}
createContentSourceLinkRef.operationName = 'CreateContentSourceLink';

export function createContentSourceLink(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createContentSourceLinkRef(dcInstance, inputVars));
}

export const listPublishedCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublishedCourses');
}
listPublishedCoursesRef.operationName = 'ListPublishedCourses';

export function listPublishedCourses(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPublishedCoursesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getCourseBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCourseBySlug', inputVars);
}
getCourseBySlugRef.operationName = 'GetCourseBySlug';

export function getCourseBySlug(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCourseBySlugRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLesson', inputVars);
}
getLessonRef.operationName = 'GetLesson';

export function getLesson(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLessonRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getQuizQuestionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuizQuestions', inputVars);
}
getQuizQuestionsRef.operationName = 'GetQuizQuestions';

export function getQuizQuestions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuizQuestionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getInProgressAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInProgressAttempt', inputVars);
}
getInProgressAttemptRef.operationName = 'GetInProgressAttempt';

export function getInProgressAttempt(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getInProgressAttemptRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getUserCourseProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserCourseProgress', inputVars);
}
getUserCourseProgressRef.operationName = 'GetUserCourseProgress';

export function getUserCourseProgress(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserCourseProgressRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getLessonProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLessonProgress', inputVars);
}
getLessonProgressRef.operationName = 'GetLessonProgress';

export function getLessonProgress(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLessonProgressRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getUserCourseProgressFullRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserCourseProgressFull', inputVars);
}
getUserCourseProgressFullRef.operationName = 'GetUserCourseProgressFull';

export function getUserCourseProgressFull(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserCourseProgressFullRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getUserAttemptHistoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserAttemptHistory', inputVars);
}
getUserAttemptHistoryRef.operationName = 'GetUserAttemptHistory';

export function getUserAttemptHistory(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserAttemptHistoryRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getAttemptResultsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttemptResults', inputVars);
}
getAttemptResultsRef.operationName = 'GetAttemptResults';

export function getAttemptResults(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttemptResultsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getFormulaSectionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFormulaSections');
}
getFormulaSectionsRef.operationName = 'GetFormulaSections';

export function getFormulaSections(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getFormulaSectionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getUserProgressDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserProgressDetails', inputVars);
}
getUserProgressDetailsRef.operationName = 'GetUserProgressDetails';

export function getUserProgressDetails(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserProgressDetailsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listAdminQuizzesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAdminQuizzes');
}
listAdminQuizzesRef.operationName = 'ListAdminQuizzes';

export function listAdminQuizzes(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAdminQuizzesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getQuizQuestionCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuizQuestionCount', inputVars);
}
getQuizQuestionCountRef.operationName = 'GetQuizQuestionCount';

export function getQuizQuestionCount(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuizQuestionCountRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getQuizQuestionsAdminRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuizQuestionsAdmin', inputVars);
}
getQuizQuestionsAdminRef.operationName = 'GetQuizQuestionsAdmin';

export function getQuizQuestionsAdmin(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuizQuestionsAdminRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getAttemptForEvaluationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttemptForEvaluation', inputVars);
}
getAttemptForEvaluationRef.operationName = 'GetAttemptForEvaluation';

export function getAttemptForEvaluation(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttemptForEvaluationRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getQuestionWithAnswersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuestionWithAnswers', inputVars);
}
getQuestionWithAnswersRef.operationName = 'GetQuestionWithAnswers';

export function getQuestionWithAnswers(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuestionWithAnswersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getQuizQuestionPointValueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuizQuestionPointValue', inputVars);
}
getQuizQuestionPointValueRef.operationName = 'GetQuizQuestionPointValue';

export function getQuizQuestionPointValue(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuizQuestionPointValueRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getAttemptForCompletionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttemptForCompletion', inputVars);
}
getAttemptForCompletionRef.operationName = 'GetAttemptForCompletion';

export function getAttemptForCompletion(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttemptForCompletionRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getAttemptOwnerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttemptOwner', inputVars);
}
getAttemptOwnerRef.operationName = 'GetAttemptOwner';

export function getAttemptOwner(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttemptOwnerRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const adminListQuestionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListQuestions');
}
adminListQuestionsRef.operationName = 'AdminListQuestions';

export function adminListQuestions(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListQuestionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const adminListQuestionsPageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListQuestionsPage', inputVars);
}
adminListQuestionsPageRef.operationName = 'AdminListQuestionsPage';

export function adminListQuestionsPage(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(adminListQuestionsPageRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const adminCountQuestionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminCountQuestions');
}
adminCountQuestionsRef.operationName = 'AdminCountQuestions';

export function adminCountQuestions(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminCountQuestionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const adminListQuizQuestionUsageRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListQuizQuestionUsage');
}
adminListQuizQuestionUsageRef.operationName = 'AdminListQuizQuestionUsage';

export function adminListQuizQuestionUsage(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListQuizQuestionUsageRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const adminListCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListCourses');
}
adminListCoursesRef.operationName = 'AdminListCourses';

export function adminListCourses(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListCoursesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getLessonVersionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLessonVersions', inputVars);
}
getLessonVersionsRef.operationName = 'GetLessonVersions';

export function getLessonVersions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLessonVersionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const adminListSourceMaterialsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListSourceMaterials');
}
adminListSourceMaterialsRef.operationName = 'AdminListSourceMaterials';

export function adminListSourceMaterials(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListSourceMaterialsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const adminListUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListUsers');
}
adminListUsersRef.operationName = 'AdminListUsers';

export function adminListUsers(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListUsersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const adminCohortStatsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminCohortStats');
}
adminCohortStatsRef.operationName = 'AdminCohortStats';

export function adminCohortStats(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminCohortStatsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

