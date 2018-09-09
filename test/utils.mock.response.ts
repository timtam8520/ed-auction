export class MockResponse {
  httpStatus: number;
  payload: any;

  status(status: number): MockResponse {
    this.httpStatus = status;
    return this;
  }

  send(payload: any) {
    this.payload = payload;
    return this;
  }
}
