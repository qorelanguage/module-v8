import { forEach } from 'lodash';

export const responseHasCorrectStructure = (
  response: Record<string, unknown>,
  expectedStructure: Record<string, unknown>
): void => {
  if (!response) {
    expect(expectedStructure).toBeNull();

    return;
  }

  forEach(response, (_value, key) => {
    expect(expectedStructure).toHaveProperty(key);
  });
};

export const validateResponseProperties = (
  expectedType: Record<string, any>,
  actualResponse: Record<string, any>
) => {
  Object.keys(expectedType).forEach((key) => {
    expect(actualResponse).toHaveProperty(key);

    const expectedFieldType = expectedType[key]?.type || expectedType[key];
    const actualValue = actualResponse[key];

    if (
      (expectedFieldType === '*list' || expectedFieldType === 'list') &&
      Array.isArray(actualValue) &&
      actualValue.length > 0
    ) {
      const exampleItem = expectedType[key].example_value[0];
      validateResponseProperties(exampleItem, actualValue[0]);
    } else if (typeof expectedFieldType === 'object') {
      if (expectedType[key]?.example_value) {
        validateResponseProperties(expectedType[key].example_value[0], actualValue);
      } else {
        validateResponseProperties(expectedFieldType, actualValue);
      }
    }
  });
};
