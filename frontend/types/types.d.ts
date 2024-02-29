interface EvalResult {
    confusion_matrix: number[];
    accuracy: number;
    loss: number;
}

interface EvalModelResponse {
    result: EvalResult;
    feedback: any;
}

interface EvalSandboxResponse {
    result: EvalResult;
}