#!/usr/bin/env node
/**
 * 截图 Picagram Feed
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureFeed() {
  console.log('🚀 启动浏览器...');
  
  const browser = await chromium.launch({
    headless: true,
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📱 访问 Picagram...');
    await page.goto('https://picagram.ai', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 截图
    const screenshotPath = '/tmp/picagram-feed.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });
    
    console.log(`✅ 截图已保存: ${screenshotPath}`);
    
    await browser.close();
    return screenshotPath;
  } catch (error) {
    console.error('❌ 截图失败:', error.message);
    await browser.close();
    throw error;
  }
}

captureFeed().catch(console.error);
