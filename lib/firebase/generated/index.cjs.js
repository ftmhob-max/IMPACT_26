const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'impact26-connector',
  service: 'impact26-dataconnect',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createUserRef(dcInstance, inputVars));
}
;

const updateUserRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserRole', inputVars);
}
updateUserRoleRef.operationName = 'UpdateUserRole';
exports.updateUserRoleRef = updateUserRoleRef;

exports.updateUserRole = function updateUserRole(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateUserRoleRef(dcInstance, inputVars));
}
;

const createCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCourse', inputVars);
}
createCourseRef.operationName = 'CreateCourse';
exports.createCourseRef = createCourseRef;

exports.createCourse = function createCourse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCourseRef(dcInstance, inputVars));
}
;

const updateCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCourse', inputVars);
}
updateCourseRef.operationName = 'UpdateCourse';
exports.updateCourseRef = updateCourseRef;

exports.updateCourse = function updateCourse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCourseRef(dcInstance, inputVars));
}
;

const createModuleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateModule', inputVars);
}
createModuleRef.operationName = 'CreateModule';
exports.createModuleRef = createModuleRef;

exports.createModule = function createModule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createModuleRef(dcInstance, inputVars));
}
;

const updateModuleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateModule', inputVars);
}
updateModuleRef.operationName = 'UpdateModule';
exports.updateModuleRef = updateModuleRef;

exports.updateModule = function updateModule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateModuleRef(dcInstance, inputVars));
}
;

const createLessonVersionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLessonVersion', inputVars);
}
createLessonVersionRef.operationName = 'CreateLessonVersion';
exports.createLessonVersionRef = createLessonVersionRef;

exports.createLessonVersion = function createLessonVersion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createLessonVersionRef(dcInstance, inputVars));
}
;

const createLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLesson', inputVars);
}
createLessonRef.operationName = 'CreateLesson';
exports.createLessonRef = createLessonRef;

exports.createLesson = function createLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createLessonRef(dcInstance, inputVars));
}
;

const updateLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLesson', inputVars);
}
updateLessonRef.operationName = 'UpdateLesson';
exports.updateLessonRef = updateLessonRef;

exports.updateLesson = function updateLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateLessonRef(dcInstance, inputVars));
}
;

const deleteLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteLesson', inputVars);
}
deleteLessonRef.operationName = 'DeleteLesson';
exports.deleteLessonRef = deleteLessonRef;

exports.deleteLesson = function deleteLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteLessonRef(dcInstance, inputVars));
}
;

const deleteLessonVersionsForLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteLessonVersionsForLesson', inputVars);
}
deleteLessonVersionsForLessonRef.operationName = 'DeleteLessonVersionsForLesson';
exports.deleteLessonVersionsForLessonRef = deleteLessonVersionsForLessonRef;

exports.deleteLessonVersionsForLesson = function deleteLessonVersionsForLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteLessonVersionsForLessonRef(dcInstance, inputVars));
}
;

const deleteSourceLinksForLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceLinksForLesson', inputVars);
}
deleteSourceLinksForLessonRef.operationName = 'DeleteSourceLinksForLesson';
exports.deleteSourceLinksForLessonRef = deleteSourceLinksForLessonRef;

exports.deleteSourceLinksForLesson = function deleteSourceLinksForLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSourceLinksForLessonRef(dcInstance, inputVars));
}
;

const deleteUserLessonProgressForLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserLessonProgressForLesson', inputVars);
}
deleteUserLessonProgressForLessonRef.operationName = 'DeleteUserLessonProgressForLesson';
exports.deleteUserLessonProgressForLessonRef = deleteUserLessonProgressForLessonRef;

exports.deleteUserLessonProgressForLesson = function deleteUserLessonProgressForLesson(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteUserLessonProgressForLessonRef(dcInstance, inputVars));
}
;

const createSourceMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSourceMaterial', inputVars);
}
createSourceMaterialRef.operationName = 'CreateSourceMaterial';
exports.createSourceMaterialRef = createSourceMaterialRef;

exports.createSourceMaterial = function createSourceMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSourceMaterialRef(dcInstance, inputVars));
}
;

const createIngestionJobRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateIngestionJob', inputVars);
}
createIngestionJobRef.operationName = 'CreateIngestionJob';
exports.createIngestionJobRef = createIngestionJobRef;

exports.createIngestionJob = function createIngestionJob(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createIngestionJobRef(dcInstance, inputVars));
}
;

const createQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuestion', inputVars);
}
createQuestionRef.operationName = 'CreateQuestion';
exports.createQuestionRef = createQuestionRef;

exports.createQuestion = function createQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createQuestionRef(dcInstance, inputVars));
}
;

const updateQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQuestion', inputVars);
}
updateQuestionRef.operationName = 'UpdateQuestion';
exports.updateQuestionRef = updateQuestionRef;

exports.updateQuestion = function updateQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateQuestionRef(dcInstance, inputVars));
}
;

const updateQuestionStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQuestionStatus', inputVars);
}
updateQuestionStatusRef.operationName = 'UpdateQuestionStatus';
exports.updateQuestionStatusRef = updateQuestionStatusRef;

exports.updateQuestionStatus = function updateQuestionStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateQuestionStatusRef(dcInstance, inputVars));
}
;

const createAnswerChoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAnswerChoice', inputVars);
}
createAnswerChoiceRef.operationName = 'CreateAnswerChoice';
exports.createAnswerChoiceRef = createAnswerChoiceRef;

exports.createAnswerChoice = function createAnswerChoice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAnswerChoiceRef(dcInstance, inputVars));
}
;

const updateAnswerChoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAnswerChoice', inputVars);
}
updateAnswerChoiceRef.operationName = 'UpdateAnswerChoice';
exports.updateAnswerChoiceRef = updateAnswerChoiceRef;

exports.updateAnswerChoice = function updateAnswerChoice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateAnswerChoiceRef(dcInstance, inputVars));
}
;

const createQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuiz', inputVars);
}
createQuizRef.operationName = 'CreateQuiz';
exports.createQuizRef = createQuizRef;

exports.createQuiz = function createQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createQuizRef(dcInstance, inputVars));
}
;

const addQuestionToQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddQuestionToQuiz', inputVars);
}
addQuestionToQuizRef.operationName = 'AddQuestionToQuiz';
exports.addQuestionToQuizRef = addQuestionToQuizRef;

exports.addQuestionToQuiz = function addQuestionToQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addQuestionToQuizRef(dcInstance, inputVars));
}
;

const updateQuizStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQuizStatus', inputVars);
}
updateQuizStatusRef.operationName = 'UpdateQuizStatus';
exports.updateQuizStatusRef = updateQuizStatusRef;

exports.updateQuizStatus = function updateQuizStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateQuizStatusRef(dcInstance, inputVars));
}
;

const enrollInCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'EnrollInCourse', inputVars);
}
enrollInCourseRef.operationName = 'EnrollInCourse';
exports.enrollInCourseRef = enrollInCourseRef;

exports.enrollInCourse = function enrollInCourse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(enrollInCourseRef(dcInstance, inputVars));
}
;

const upsertLessonProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertLessonProgress', inputVars);
}
upsertLessonProgressRef.operationName = 'UpsertLessonProgress';
exports.upsertLessonProgressRef = upsertLessonProgressRef;

exports.upsertLessonProgress = function upsertLessonProgress(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertLessonProgressRef(dcInstance, inputVars));
}
;

const createQuizAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuizAttempt', inputVars);
}
createQuizAttemptRef.operationName = 'CreateQuizAttempt';
exports.createQuizAttemptRef = createQuizAttemptRef;

exports.createQuizAttempt = function createQuizAttempt(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createQuizAttemptRef(dcInstance, inputVars));
}
;

const upsertQuizResponseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertQuizResponse', inputVars);
}
upsertQuizResponseRef.operationName = 'UpsertQuizResponse';
exports.upsertQuizResponseRef = upsertQuizResponseRef;

exports.upsertQuizResponse = function upsertQuizResponse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertQuizResponseRef(dcInstance, inputVars));
}
;

const completeQuizAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteQuizAttempt', inputVars);
}
completeQuizAttemptRef.operationName = 'CompleteQuizAttempt';
exports.completeQuizAttemptRef = completeQuizAttemptRef;

exports.completeQuizAttempt = function completeQuizAttempt(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(completeQuizAttemptRef(dcInstance, inputVars));
}
;

const markAnsweredAtRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkAnsweredAt', inputVars);
}
markAnsweredAtRef.operationName = 'MarkAnsweredAt';
exports.markAnsweredAtRef = markAnsweredAtRef;

exports.markAnsweredAt = function markAnsweredAt(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markAnsweredAtRef(dcInstance, inputVars));
}
;

const createFormulaSectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFormulaSection', inputVars);
}
createFormulaSectionRef.operationName = 'CreateFormulaSection';
exports.createFormulaSectionRef = createFormulaSectionRef;

exports.createFormulaSection = function createFormulaSection(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createFormulaSectionRef(dcInstance, inputVars));
}
;

const createFormulaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFormula', inputVars);
}
createFormulaRef.operationName = 'CreateFormula';
exports.createFormulaRef = createFormulaRef;

exports.createFormula = function createFormula(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createFormulaRef(dcInstance, inputVars));
}
;

const createContentSourceLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateContentSourceLink', inputVars);
}
createContentSourceLinkRef.operationName = 'CreateContentSourceLink';
exports.createContentSourceLinkRef = createContentSourceLinkRef;

exports.createContentSourceLink = function createContentSourceLink(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createContentSourceLinkRef(dcInstance, inputVars));
}
;

const listPublishedCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublishedCourses');
}
listPublishedCoursesRef.operationName = 'ListPublishedCourses';
exports.listPublishedCoursesRef = listPublishedCoursesRef;

exports.listPublishedCourses = function listPublishedCourses(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPublishedCoursesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getCourseBySlugRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCourseBySlug', inputVars);
}
getCourseBySlugRef.operationName = 'GetCourseBySlug';
exports.getCourseBySlugRef = getCourseBySlugRef;

exports.getCourseBySlug = function getCourseBySlug(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCourseBySlugRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLesson', inputVars);
}
getLessonRef.operationName = 'GetLesson';
exports.getLessonRef = getLessonRef;

exports.getLesson = function getLesson(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLessonRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getQuizQuestionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuizQuestions', inputVars);
}
getQuizQuestionsRef.operationName = 'GetQuizQuestions';
exports.getQuizQuestionsRef = getQuizQuestionsRef;

exports.getQuizQuestions = function getQuizQuestions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuizQuestionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getInProgressAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInProgressAttempt', inputVars);
}
getInProgressAttemptRef.operationName = 'GetInProgressAttempt';
exports.getInProgressAttemptRef = getInProgressAttemptRef;

exports.getInProgressAttempt = function getInProgressAttempt(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getInProgressAttemptRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getUserCourseProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserCourseProgress', inputVars);
}
getUserCourseProgressRef.operationName = 'GetUserCourseProgress';
exports.getUserCourseProgressRef = getUserCourseProgressRef;

exports.getUserCourseProgress = function getUserCourseProgress(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserCourseProgressRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLessonProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLessonProgress', inputVars);
}
getLessonProgressRef.operationName = 'GetLessonProgress';
exports.getLessonProgressRef = getLessonProgressRef;

exports.getLessonProgress = function getLessonProgress(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLessonProgressRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getUserCourseProgressFullRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserCourseProgressFull', inputVars);
}
getUserCourseProgressFullRef.operationName = 'GetUserCourseProgressFull';
exports.getUserCourseProgressFullRef = getUserCourseProgressFullRef;

exports.getUserCourseProgressFull = function getUserCourseProgressFull(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserCourseProgressFullRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getUserAttemptHistoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserAttemptHistory', inputVars);
}
getUserAttemptHistoryRef.operationName = 'GetUserAttemptHistory';
exports.getUserAttemptHistoryRef = getUserAttemptHistoryRef;

exports.getUserAttemptHistory = function getUserAttemptHistory(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserAttemptHistoryRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getAttemptResultsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttemptResults', inputVars);
}
getAttemptResultsRef.operationName = 'GetAttemptResults';
exports.getAttemptResultsRef = getAttemptResultsRef;

exports.getAttemptResults = function getAttemptResults(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttemptResultsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getFormulaSectionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFormulaSections');
}
getFormulaSectionsRef.operationName = 'GetFormulaSections';
exports.getFormulaSectionsRef = getFormulaSectionsRef;

exports.getFormulaSections = function getFormulaSections(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getFormulaSectionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getUserProgressDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserProgressDetails', inputVars);
}
getUserProgressDetailsRef.operationName = 'GetUserProgressDetails';
exports.getUserProgressDetailsRef = getUserProgressDetailsRef;

exports.getUserProgressDetails = function getUserProgressDetails(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserProgressDetailsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listAdminQuizzesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAdminQuizzes');
}
listAdminQuizzesRef.operationName = 'ListAdminQuizzes';
exports.listAdminQuizzesRef = listAdminQuizzesRef;

exports.listAdminQuizzes = function listAdminQuizzes(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAdminQuizzesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getQuizQuestionCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuizQuestionCount', inputVars);
}
getQuizQuestionCountRef.operationName = 'GetQuizQuestionCount';
exports.getQuizQuestionCountRef = getQuizQuestionCountRef;

exports.getQuizQuestionCount = function getQuizQuestionCount(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuizQuestionCountRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getQuizQuestionsAdminRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuizQuestionsAdmin', inputVars);
}
getQuizQuestionsAdminRef.operationName = 'GetQuizQuestionsAdmin';
exports.getQuizQuestionsAdminRef = getQuizQuestionsAdminRef;

exports.getQuizQuestionsAdmin = function getQuizQuestionsAdmin(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuizQuestionsAdminRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getAttemptForEvaluationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttemptForEvaluation', inputVars);
}
getAttemptForEvaluationRef.operationName = 'GetAttemptForEvaluation';
exports.getAttemptForEvaluationRef = getAttemptForEvaluationRef;

exports.getAttemptForEvaluation = function getAttemptForEvaluation(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttemptForEvaluationRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getQuestionWithAnswersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuestionWithAnswers', inputVars);
}
getQuestionWithAnswersRef.operationName = 'GetQuestionWithAnswers';
exports.getQuestionWithAnswersRef = getQuestionWithAnswersRef;

exports.getQuestionWithAnswers = function getQuestionWithAnswers(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuestionWithAnswersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getQuizQuestionPointValueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetQuizQuestionPointValue', inputVars);
}
getQuizQuestionPointValueRef.operationName = 'GetQuizQuestionPointValue';
exports.getQuizQuestionPointValueRef = getQuizQuestionPointValueRef;

exports.getQuizQuestionPointValue = function getQuizQuestionPointValue(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getQuizQuestionPointValueRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getAttemptForCompletionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttemptForCompletion', inputVars);
}
getAttemptForCompletionRef.operationName = 'GetAttemptForCompletion';
exports.getAttemptForCompletionRef = getAttemptForCompletionRef;

exports.getAttemptForCompletion = function getAttemptForCompletion(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttemptForCompletionRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getAttemptOwnerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttemptOwner', inputVars);
}
getAttemptOwnerRef.operationName = 'GetAttemptOwner';
exports.getAttemptOwnerRef = getAttemptOwnerRef;

exports.getAttemptOwner = function getAttemptOwner(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttemptOwnerRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const adminListQuestionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListQuestions');
}
adminListQuestionsRef.operationName = 'AdminListQuestions';
exports.adminListQuestionsRef = adminListQuestionsRef;

exports.adminListQuestions = function adminListQuestions(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListQuestionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const adminListQuestionsPageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListQuestionsPage', inputVars);
}
adminListQuestionsPageRef.operationName = 'AdminListQuestionsPage';
exports.adminListQuestionsPageRef = adminListQuestionsPageRef;

exports.adminListQuestionsPage = function adminListQuestionsPage(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(adminListQuestionsPageRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const adminCountQuestionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminCountQuestions');
}
adminCountQuestionsRef.operationName = 'AdminCountQuestions';
exports.adminCountQuestionsRef = adminCountQuestionsRef;

exports.adminCountQuestions = function adminCountQuestions(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminCountQuestionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const adminListCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListCourses');
}
adminListCoursesRef.operationName = 'AdminListCourses';
exports.adminListCoursesRef = adminListCoursesRef;

exports.adminListCourses = function adminListCourses(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListCoursesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLessonVersionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLessonVersions', inputVars);
}
getLessonVersionsRef.operationName = 'GetLessonVersions';
exports.getLessonVersionsRef = getLessonVersionsRef;

exports.getLessonVersions = function getLessonVersions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLessonVersionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const adminListSourceMaterialsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListSourceMaterials');
}
adminListSourceMaterialsRef.operationName = 'AdminListSourceMaterials';
exports.adminListSourceMaterialsRef = adminListSourceMaterialsRef;

exports.adminListSourceMaterials = function adminListSourceMaterials(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListSourceMaterialsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const adminListUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListUsers');
}
adminListUsersRef.operationName = 'AdminListUsers';
exports.adminListUsersRef = adminListUsersRef;

exports.adminListUsers = function adminListUsers(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListUsersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const adminCohortStatsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminCohortStats');
}
adminCohortStatsRef.operationName = 'AdminCohortStats';
exports.adminCohortStatsRef = adminCohortStatsRef;

exports.adminCohortStats = function adminCohortStats(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminCohortStatsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
