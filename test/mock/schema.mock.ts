export class SchemaMock {
  static asBuilderCall(calls: string[], mockReturn: jest.Mock<any, any>) {
    if (!calls.length) {
      return;
    }

    return this.mockBuilderCall(calls, mockReturn);
  }

  private static mockBuilderCall(
    list: string[],
    mockReturn: jest.Mock<any, any>,
    index = 0,
  ) {
    if (index === list.length) {
      return mockReturn;
    }

    return jest.fn().mockImplementationOnce(() => ({
      [list[index]]: this.mockBuilderCall(list, mockReturn, index + 1),
    }));
  }
}
