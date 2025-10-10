import { GetEmailPipe } from '../../shared/pipes/get-email.pipe';

describe('GetEmailPipe', () => {
  it('create an instance', () => {
    const pipe = new GetEmailPipe();
    expect(pipe).toBeTruthy();
  });
});
