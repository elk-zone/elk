import { Http } from '../interfaces';

export const httpRequest = jest.fn();
export const httpGet = jest.fn();
export const httpPost = jest.fn();
export const httpPatch = jest.fn();
export const httpPut = jest.fn();
export const httpDelete = jest.fn();

export class HttpMockImpl implements Http {
  clear(): void {
    httpRequest.mockClear();
    httpGet.mockClear();
    httpPost.mockClear();
    httpPatch.mockClear();
    httpPut.mockClear();
    httpDelete.mockClear();
  }

  request = httpRequest;
  get = httpGet;
  post = httpPost;
  patch = httpPatch;
  put = httpPut;
  delete = httpDelete;
}
