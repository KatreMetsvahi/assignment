export type ValueType = 'yes' | 'no';

export type CheckType = {
  description: string,
  id: string,
  priority: number,
  value?: ValueType
}

export function fetchChecks(): Promise<CheckType[]> {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        Math.random() <= 0.8
          ? resolve([
              {
                id: "aaa",
                priority: 10,
                description: "Face on the picture matches face on the document"
              },
              {
                id: "bbb",
                priority: 5,
                description: "Veriff supports presented document"
              },
              {
                id: "ccc",
                priority: 7,
                description: "Face is clearly visible"
              },
              {
                id: "ddd",
                priority: 3,
                description: "Document data is clearly visible"
              }
            ])
          : reject({ success: false }),
      500
    )
  );
}

type ResultType = {
  checkId: string,
  value: string
}

/**
 * @param {Object[]} results - The list of check results
 * @param {string} results[].checkId - Check id
 * @param {string} results[].value - Result value (yes / no)
 */
export function submitCheckResults(results: ResultType[]): Promise<ResultType[]> {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        Math.random() <= 0.8 ? resolve(results) : reject({ success: false }),
      500
    )
  );
}
