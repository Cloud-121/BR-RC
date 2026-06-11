interface FindJsonResult {
  startIndex: number;
  endIndex: number;
  jsonData: Record<string, unknown> | Record<string, unknown>[] | null;
}

export function findJsonInString(
  dataString: string,
  key: string,
  isDesiredValue?: (jsonData: Record<string, unknown> | Record<string, unknown>[]) => boolean,
): FindJsonResult {
  const prefix = `"${key}":`;
  let startPosition = 0;

  while (true) {
    let idx = dataString.indexOf(prefix, startPosition);
    if (idx === -1) {
      return { startIndex: -1, endIndex: -1, jsonData: null };
    }

    idx += prefix.length;
    const startIndex = idx;
    const startCharacter = dataString[startIndex];

    if (startCharacter === 'n' && dataString.slice(startIndex, startIndex + 4) === 'null') {
      return { startIndex, endIndex: startIndex + 3, jsonData: null };
    }

    if (startCharacter !== '{' && startCharacter !== '[') {
      throw new Error(`Invalid start character: ${startCharacter}`);
    }

    const endCharacter = startCharacter === '{' ? '}' : ']';
    let nestedLevel = 0;
    let isIndexInString = false;

    while (idx < dataString.length - 1) {
      idx++;
      if (dataString[idx] === '"' && dataString[idx - 1] !== '\\') {
        isIndexInString = !isIndexInString;
      } else if (dataString[idx] === endCharacter && !isIndexInString) {
        if (nestedLevel === 0) {
          break;
        }
        nestedLevel--;
      } else if (dataString[idx] === startCharacter && !isIndexInString) {
        nestedLevel++;
      }
    }

    const jsonDataString = dataString.slice(startIndex, idx + 1);
    const jsonData = JSON.parse(jsonDataString) as Record<string, unknown> | Record<string, unknown>[];

    if (!isDesiredValue || isDesiredValue(jsonData)) {
      return { startIndex, endIndex: idx, jsonData };
    }

    startPosition = idx;
  }
}
