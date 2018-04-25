
const Page = require('./helpers/page');
let page;

beforeEach( async ()=>{
    page = await Page.build();
    await page.goto('localhost:3000');
})

test('The header text is equal to Blogster ', async ()=>{
  // Get the "viewport" of the page, as reported by the page.
  const brandLogo = await page.$eval('a.brand-logo', el => el.innerHTML);
  console.log(`brandLogo is:${brandLogo}`);
  expect(brandLogo).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async ()=>{
 await page.click('.right a');
 const url =await page.url();
 console.log(url);
});

test('When signed in, shows logout button', async () =>{
    await page.login();

 });
afterEach(async ()=>{
    await page.close();
})