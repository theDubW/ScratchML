interface EvalResult {
    confusion_matrix: number[];
    accuracy: number;
}

interface EvalModelResponse {
    result: EvalResult;
    feedback: any;
}