import { ConsumerNgCliPage } from './app.po';

describe('consumer-ng-cli App', () => {
  let page: ConsumerNgCliPage;

  beforeEach(() => {
    page = new ConsumerNgCliPage();
  });

  it('should display message saying app works', async () => {
    page.navigateTo();
    expect(await page.getParagraphText()).toEqual('app works!');
  });
});
