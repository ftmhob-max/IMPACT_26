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

const deleteModuleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteModule', inputVars);
}
deleteModuleRef.operationName = 'DeleteModule';
exports.deleteModuleRef = deleteModuleRef;

exports.deleteModule = function deleteModule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteModuleRef(dcInstance, inputVars));
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

const deleteSourceLinksForQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceLinksForQuestion', inputVars);
}
deleteSourceLinksForQuestionRef.operationName = 'DeleteSourceLinksForQuestion';
exports.deleteSourceLinksForQuestionRef = deleteSourceLinksForQuestionRef;

exports.deleteSourceLinksForQuestion = function deleteSourceLinksForQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSourceLinksForQuestionRef(dcInstance, inputVars));
}
;

const deleteSourceLinksForMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceLinksForMaterial', inputVars);
}
deleteSourceLinksForMaterialRef.operationName = 'DeleteSourceLinksForMaterial';
exports.deleteSourceLinksForMaterialRef = deleteSourceLinksForMaterialRef;

exports.deleteSourceLinksForMaterial = function deleteSourceLinksForMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSourceLinksForMaterialRef(dcInstance, inputVars));
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

const deleteIngestionJobsForMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteIngestionJobsForMaterial', inputVars);
}
deleteIngestionJobsForMaterialRef.operationName = 'DeleteIngestionJobsForMaterial';
exports.deleteIngestionJobsForMaterialRef = deleteIngestionJobsForMaterialRef;

exports.deleteIngestionJobsForMaterial = function deleteIngestionJobsForMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteIngestionJobsForMaterialRef(dcInstance, inputVars));
}
;

const deleteSourceMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceMaterial', inputVars);
}
deleteSourceMaterialRef.operationName = 'DeleteSourceMaterial';
exports.deleteSourceMaterialRef = deleteSourceMaterialRef;

exports.deleteSourceMaterial = function deleteSourceMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSourceMaterialRef(dcInstance, inputVars));
}
;

const updateSourceMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSourceMaterial', inputVars);
}
updateSourceMaterialRef.operationName = 'UpdateSourceMaterial';
exports.updateSourceMaterialRef = updateSourceMaterialRef;

exports.updateSourceMaterial = function updateSourceMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateSourceMaterialRef(dcInstance, inputVars));
}
;

const updateSourceMaterialLibraryStateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSourceMaterialLibraryState', inputVars);
}
updateSourceMaterialLibraryStateRef.operationName = 'UpdateSourceMaterialLibraryState';
exports.updateSourceMaterialLibraryStateRef = updateSourceMaterialLibraryStateRef;

exports.updateSourceMaterialLibraryState = function updateSourceMaterialLibraryState(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateSourceMaterialLibraryStateRef(dcInstance, inputVars));
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

const createSourceMaterialFolderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSourceMaterialFolder', inputVars);
}
createSourceMaterialFolderRef.operationName = 'CreateSourceMaterialFolder';
exports.createSourceMaterialFolderRef = createSourceMaterialFolderRef;

exports.createSourceMaterialFolder = function createSourceMaterialFolder(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSourceMaterialFolderRef(dcInstance, inputVars));
}
;

const updateSourceMaterialFolderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSourceMaterialFolder', inputVars);
}
updateSourceMaterialFolderRef.operationName = 'UpdateSourceMaterialFolder';
exports.updateSourceMaterialFolderRef = updateSourceMaterialFolderRef;

exports.updateSourceMaterialFolder = function updateSourceMaterialFolder(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateSourceMaterialFolderRef(dcInstance, inputVars));
}
;

const deleteSourceMaterialFolderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSourceMaterialFolder', inputVars);
}
deleteSourceMaterialFolderRef.operationName = 'DeleteSourceMaterialFolder';
exports.deleteSourceMaterialFolderRef = deleteSourceMaterialFolderRef;

exports.deleteSourceMaterialFolder = function deleteSourceMaterialFolder(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSourceMaterialFolderRef(dcInstance, inputVars));
}
;

const createSourceMaterialTagRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSourceMaterialTag', inputVars);
}
createSourceMaterialTagRef.operationName = 'CreateSourceMaterialTag';
exports.createSourceMaterialTagRef = createSourceMaterialTagRef;

exports.createSourceMaterialTag = function createSourceMaterialTag(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSourceMaterialTagRef(dcInstance, inputVars));
}
;

const createSourceMaterialTagAssignmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSourceMaterialTagAssignment', inputVars);
}
createSourceMaterialTagAssignmentRef.operationName = 'CreateSourceMaterialTagAssignment';
exports.createSourceMaterialTagAssignmentRef = createSourceMaterialTagAssignmentRef;

exports.createSourceMaterialTagAssignment = function createSourceMaterialTagAssignment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSourceMaterialTagAssignmentRef(dcInstance, inputVars));
}
;

const deleteTagAssignmentsForMaterialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTagAssignmentsForMaterial', inputVars);
}
deleteTagAssignmentsForMaterialRef.operationName = 'DeleteTagAssignmentsForMaterial';
exports.deleteTagAssignmentsForMaterialRef = deleteTagAssignmentsForMaterialRef;

exports.deleteTagAssignmentsForMaterial = function deleteTagAssignmentsForMaterial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteTagAssignmentsForMaterialRef(dcInstance, inputVars));
}
;

const createSourceMaterialActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSourceMaterialActivity', inputVars);
}
createSourceMaterialActivityRef.operationName = 'CreateSourceMaterialActivity';
exports.createSourceMaterialActivityRef = createSourceMaterialActivityRef;

exports.createSourceMaterialActivity = function createSourceMaterialActivity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSourceMaterialActivityRef(dcInstance, inputVars));
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

const deleteAnswerChoicesForQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAnswerChoicesForQuestion', inputVars);
}
deleteAnswerChoicesForQuestionRef.operationName = 'DeleteAnswerChoicesForQuestion';
exports.deleteAnswerChoicesForQuestionRef = deleteAnswerChoicesForQuestionRef;

exports.deleteAnswerChoicesForQuestion = function deleteAnswerChoicesForQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAnswerChoicesForQuestionRef(dcInstance, inputVars));
}
;

const deleteQuizQuestionsForQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuizQuestionsForQuestion', inputVars);
}
deleteQuizQuestionsForQuestionRef.operationName = 'DeleteQuizQuestionsForQuestion';
exports.deleteQuizQuestionsForQuestionRef = deleteQuizQuestionsForQuestionRef;

exports.deleteQuizQuestionsForQuestion = function deleteQuizQuestionsForQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizQuestionsForQuestionRef(dcInstance, inputVars));
}
;

const deleteQuestionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuestion', inputVars);
}
deleteQuestionRef.operationName = 'DeleteQuestion';
exports.deleteQuestionRef = deleteQuestionRef;

exports.deleteQuestion = function deleteQuestion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuestionRef(dcInstance, inputVars));
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

const updateQuizCalculatorSettingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateQuizCalculatorSettings', inputVars);
}
updateQuizCalculatorSettingsRef.operationName = 'UpdateQuizCalculatorSettings';
exports.updateQuizCalculatorSettingsRef = updateQuizCalculatorSettingsRef;

exports.updateQuizCalculatorSettings = function updateQuizCalculatorSettings(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateQuizCalculatorSettingsRef(dcInstance, inputVars));
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

const deleteQuizQuestionsForQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuizQuestionsForQuiz', inputVars);
}
deleteQuizQuestionsForQuizRef.operationName = 'DeleteQuizQuestionsForQuiz';
exports.deleteQuizQuestionsForQuizRef = deleteQuizQuestionsForQuizRef;

exports.deleteQuizQuestionsForQuiz = function deleteQuizQuestionsForQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizQuestionsForQuizRef(dcInstance, inputVars));
}
;

const deleteQuizResponsesForQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuizResponsesForQuiz', inputVars);
}
deleteQuizResponsesForQuizRef.operationName = 'DeleteQuizResponsesForQuiz';
exports.deleteQuizResponsesForQuizRef = deleteQuizResponsesForQuizRef;

exports.deleteQuizResponsesForQuiz = function deleteQuizResponsesForQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizResponsesForQuizRef(dcInstance, inputVars));
}
;

const deleteQuizAttemptsForQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuizAttemptsForQuiz', inputVars);
}
deleteQuizAttemptsForQuizRef.operationName = 'DeleteQuizAttemptsForQuiz';
exports.deleteQuizAttemptsForQuizRef = deleteQuizAttemptsForQuizRef;

exports.deleteQuizAttemptsForQuiz = function deleteQuizAttemptsForQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizAttemptsForQuizRef(dcInstance, inputVars));
}
;

const deleteQuizRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuiz', inputVars);
}
deleteQuizRef.operationName = 'DeleteQuiz';
exports.deleteQuizRef = deleteQuizRef;

exports.deleteQuiz = function deleteQuiz(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuizRef(dcInstance, inputVars));
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

const updateFormulaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateFormula', inputVars);
}
updateFormulaRef.operationName = 'UpdateFormula';
exports.updateFormulaRef = updateFormulaRef;

exports.updateFormula = function updateFormula(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateFormulaRef(dcInstance, inputVars));
}
;

const deleteFormulaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteFormula', inputVars);
}
deleteFormulaRef.operationName = 'DeleteFormula';
exports.deleteFormulaRef = deleteFormulaRef;

exports.deleteFormula = function deleteFormula(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteFormulaRef(dcInstance, inputVars));
}
;

const updateFormulaSectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateFormulaSection', inputVars);
}
updateFormulaSectionRef.operationName = 'UpdateFormulaSection';
exports.updateFormulaSectionRef = updateFormulaSectionRef;

exports.updateFormulaSection = function updateFormulaSection(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateFormulaSectionRef(dcInstance, inputVars));
}
;

const deleteFormulasForSectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteFormulasForSection', inputVars);
}
deleteFormulasForSectionRef.operationName = 'DeleteFormulasForSection';
exports.deleteFormulasForSectionRef = deleteFormulasForSectionRef;

exports.deleteFormulasForSection = function deleteFormulasForSection(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteFormulasForSectionRef(dcInstance, inputVars));
}
;

const deleteFormulaSectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteFormulaSection', inputVars);
}
deleteFormulaSectionRef.operationName = 'DeleteFormulaSection';
exports.deleteFormulaSectionRef = deleteFormulaSectionRef;

exports.deleteFormulaSection = function deleteFormulaSection(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteFormulaSectionRef(dcInstance, inputVars));
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

const deleteContentSourceLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteContentSourceLink', inputVars);
}
deleteContentSourceLinkRef.operationName = 'DeleteContentSourceLink';
exports.deleteContentSourceLinkRef = deleteContentSourceLinkRef;

exports.deleteContentSourceLink = function deleteContentSourceLink(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteContentSourceLinkRef(dcInstance, inputVars));
}
;

const createGlossaryTermRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateGlossaryTerm', inputVars);
}
createGlossaryTermRef.operationName = 'CreateGlossaryTerm';
exports.createGlossaryTermRef = createGlossaryTermRef;

exports.createGlossaryTerm = function createGlossaryTerm(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createGlossaryTermRef(dcInstance, inputVars));
}
;

const updateGlossaryTermRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGlossaryTerm', inputVars);
}
updateGlossaryTermRef.operationName = 'UpdateGlossaryTerm';
exports.updateGlossaryTermRef = updateGlossaryTermRef;

exports.updateGlossaryTerm = function updateGlossaryTerm(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateGlossaryTermRef(dcInstance, inputVars));
}
;

const deleteGlossaryTermRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteGlossaryTerm', inputVars);
}
deleteGlossaryTermRef.operationName = 'DeleteGlossaryTerm';
exports.deleteGlossaryTermRef = deleteGlossaryTermRef;

exports.deleteGlossaryTerm = function deleteGlossaryTerm(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteGlossaryTermRef(dcInstance, inputVars));
}
;

const deleteGlossaryNotesForTermRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteGlossaryNotesForTerm', inputVars);
}
deleteGlossaryNotesForTermRef.operationName = 'DeleteGlossaryNotesForTerm';
exports.deleteGlossaryNotesForTermRef = deleteGlossaryNotesForTermRef;

exports.deleteGlossaryNotesForTerm = function deleteGlossaryNotesForTerm(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteGlossaryNotesForTermRef(dcInstance, inputVars));
}
;

const createGlossaryNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateGlossaryNote', inputVars);
}
createGlossaryNoteRef.operationName = 'CreateGlossaryNote';
exports.createGlossaryNoteRef = createGlossaryNoteRef;

exports.createGlossaryNote = function createGlossaryNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createGlossaryNoteRef(dcInstance, inputVars));
}
;

const updateGlossaryNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateGlossaryNote', inputVars);
}
updateGlossaryNoteRef.operationName = 'UpdateGlossaryNote';
exports.updateGlossaryNoteRef = updateGlossaryNoteRef;

exports.updateGlossaryNote = function updateGlossaryNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateGlossaryNoteRef(dcInstance, inputVars));
}
;

const deleteGlossaryNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteGlossaryNote', inputVars);
}
deleteGlossaryNoteRef.operationName = 'DeleteGlossaryNote';
exports.deleteGlossaryNoteRef = deleteGlossaryNoteRef;

exports.deleteGlossaryNote = function deleteGlossaryNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteGlossaryNoteRef(dcInstance, inputVars));
}
;

const createLessonNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLessonNote', inputVars);
}
createLessonNoteRef.operationName = 'CreateLessonNote';
exports.createLessonNoteRef = createLessonNoteRef;

exports.createLessonNote = function createLessonNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createLessonNoteRef(dcInstance, inputVars));
}
;

const updateLessonNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLessonNote', inputVars);
}
updateLessonNoteRef.operationName = 'UpdateLessonNote';
exports.updateLessonNoteRef = updateLessonNoteRef;

exports.updateLessonNote = function updateLessonNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateLessonNoteRef(dcInstance, inputVars));
}
;

const deleteLessonNoteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteLessonNote', inputVars);
}
deleteLessonNoteRef.operationName = 'DeleteLessonNote';
exports.deleteLessonNoteRef = deleteLessonNoteRef;

exports.deleteLessonNote = function deleteLessonNote(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteLessonNoteRef(dcInstance, inputVars));
}
;

const upsertUserFavoriteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserFavorite', inputVars);
}
upsertUserFavoriteRef.operationName = 'UpsertUserFavorite';
exports.upsertUserFavoriteRef = upsertUserFavoriteRef;

exports.upsertUserFavorite = function upsertUserFavorite(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserFavoriteRef(dcInstance, inputVars));
}
;

const deleteUserFavoriteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserFavorite', inputVars);
}
deleteUserFavoriteRef.operationName = 'DeleteUserFavorite';
exports.deleteUserFavoriteRef = deleteUserFavoriteRef;

exports.deleteUserFavorite = function deleteUserFavorite(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteUserFavoriteRef(dcInstance, inputVars));
}
;

const createCustomDomainRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCustomDomain', inputVars);
}
createCustomDomainRef.operationName = 'CreateCustomDomain';
exports.createCustomDomainRef = createCustomDomainRef;

exports.createCustomDomain = function createCustomDomain(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCustomDomainRef(dcInstance, inputVars));
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

const getUserLessonProgressSummaryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserLessonProgressSummary', inputVars);
}
getUserLessonProgressSummaryRef.operationName = 'GetUserLessonProgressSummary';
exports.getUserLessonProgressSummaryRef = getUserLessonProgressSummaryRef;

exports.getUserLessonProgressSummary = function getUserLessonProgressSummary(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserLessonProgressSummaryRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
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

const adminListQuizQuestionUsageRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListQuizQuestionUsage');
}
adminListQuizQuestionUsageRef.operationName = 'AdminListQuizQuestionUsage';
exports.adminListQuizQuestionUsageRef = adminListQuizQuestionUsageRef;

exports.adminListQuizQuestionUsage = function adminListQuizQuestionUsage(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListQuizQuestionUsageRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
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

const adminListSourceMaterialsRichRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListSourceMaterialsRich');
}
adminListSourceMaterialsRichRef.operationName = 'AdminListSourceMaterialsRich';
exports.adminListSourceMaterialsRichRef = adminListSourceMaterialsRichRef;

exports.adminListSourceMaterialsRich = function adminListSourceMaterialsRich(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListSourceMaterialsRichRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
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

const adminListSourceMaterialFoldersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListSourceMaterialFolders');
}
adminListSourceMaterialFoldersRef.operationName = 'AdminListSourceMaterialFolders';
exports.adminListSourceMaterialFoldersRef = adminListSourceMaterialFoldersRef;

exports.adminListSourceMaterialFolders = function adminListSourceMaterialFolders(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListSourceMaterialFoldersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const adminListSourceMaterialTagsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListSourceMaterialTags');
}
adminListSourceMaterialTagsRef.operationName = 'AdminListSourceMaterialTags';
exports.adminListSourceMaterialTagsRef = adminListSourceMaterialTagsRef;

exports.adminListSourceMaterialTags = function adminListSourceMaterialTags(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListSourceMaterialTagsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
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

const adminListGlossaryTermsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListGlossaryTerms');
}
adminListGlossaryTermsRef.operationName = 'AdminListGlossaryTerms';
exports.adminListGlossaryTermsRef = adminListGlossaryTermsRef;

exports.adminListGlossaryTerms = function adminListGlossaryTerms(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(adminListGlossaryTermsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listPublishedGlossaryTermsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublishedGlossaryTerms');
}
listPublishedGlossaryTermsRef.operationName = 'ListPublishedGlossaryTerms';
exports.listPublishedGlossaryTermsRef = listPublishedGlossaryTermsRef;

exports.listPublishedGlossaryTerms = function listPublishedGlossaryTerms(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPublishedGlossaryTermsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getGlossaryNotesForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetGlossaryNotesForUser', inputVars);
}
getGlossaryNotesForUserRef.operationName = 'GetGlossaryNotesForUser';
exports.getGlossaryNotesForUserRef = getGlossaryNotesForUserRef;

exports.getGlossaryNotesForUser = function getGlossaryNotesForUser(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGlossaryNotesForUserRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getGlossaryNoteForUserTermRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetGlossaryNoteForUserTerm', inputVars);
}
getGlossaryNoteForUserTermRef.operationName = 'GetGlossaryNoteForUserTerm';
exports.getGlossaryNoteForUserTermRef = getGlossaryNoteForUserTermRef;

exports.getGlossaryNoteForUserTerm = function getGlossaryNoteForUserTerm(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGlossaryNoteForUserTermRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLessonNotesForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLessonNotesForUser', inputVars);
}
getLessonNotesForUserRef.operationName = 'GetLessonNotesForUser';
exports.getLessonNotesForUserRef = getLessonNotesForUserRef;

exports.getLessonNotesForUser = function getLessonNotesForUser(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLessonNotesForUserRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLessonNoteForUserLessonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLessonNoteForUserLesson', inputVars);
}
getLessonNoteForUserLessonRef.operationName = 'GetLessonNoteForUserLesson';
exports.getLessonNoteForUserLessonRef = getLessonNoteForUserLessonRef;

exports.getLessonNoteForUserLesson = function getLessonNoteForUserLesson(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLessonNoteForUserLessonRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getUserFavoritesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserFavorites', inputVars);
}
getUserFavoritesRef.operationName = 'GetUserFavorites';
exports.getUserFavoritesRef = getUserFavoritesRef;

exports.getUserFavorites = function getUserFavorites(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserFavoritesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getUserFavoritesByTypeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserFavoritesByType', inputVars);
}
getUserFavoritesByTypeRef.operationName = 'GetUserFavoritesByType';
exports.getUserFavoritesByTypeRef = getUserFavoritesByTypeRef;

exports.getUserFavoritesByType = function getUserFavoritesByType(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserFavoritesByTypeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listCustomDomainsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCustomDomains');
}
listCustomDomainsRef.operationName = 'ListCustomDomains';
exports.listCustomDomainsRef = listCustomDomainsRef;

exports.listCustomDomains = function listCustomDomains(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listCustomDomainsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
