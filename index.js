import {onRequest} from 'firebase-functions/v2/https'
import puppeteer from 'puppeteer-chromium-resolver'

export const scrape = onRequest({memory: '2GiB'}, async (req, res) => {
  const stats = await puppeteer()
  const browser = await stats.puppeteer.launch({
    executablePath: stats.executablePath,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
    ],
    // 古いヘッドレスモード（パフォーマンスがいい）
    headless: 'shell',
  })
  const page = await browser.newPage()

  // ページにアクセスする
  await page.goto('https://zenn.dev/takamoso', {waitUntil: 'domcontentloaded'})

  // ページタイトルを出力
  res.send(await page.title())

  // ブラウザを閉じる
  await browser.close()

  // レスポンスを返す
  res.end()
})
