import {onRequest} from 'firebase-functions/v2/https'
import puppeteer from 'puppeteer-chromium-resolver'

export const scrape = onRequest({
  // メモリは最低でも1GB推奨だがギリギリだと処理が中断することがあるため余裕を持たせておく
  memory: '2GiB',
}, async (req, res) => {
  // ローカルにインストールされたChromiumを解決する
  const stats = await puppeteer()
  // ブラウザを起動する
  const browser = await stats.puppeteer.launch({
    // Chromiumの実行パス
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
  // 新規ページを開く
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
