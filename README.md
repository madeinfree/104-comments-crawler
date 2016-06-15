# 104 Comments Crawler

![104-comments-crawler](http://i.imgur.com/RNGmSIm.png)

幫助您快速查找 104 天～～眼通留言訊息，目前只支援 terminal 觀看。

# Installation

```
https://github.com/madeinfree/104-comments-crawler.git
```

# Setting

設定相關參數

1. 公司編號(compony_id) - 網址列 j 後方

2. 頁碼(page) - 依照公司網站上的頁碼

3. api job - API網址, 不直接提供

4. api comments - API網址, 不直接提供

https://www.104.com.tw/jobbank/custjob/index.php?r=cust&j=(公司編號)

http://www.104.com.tw/jobbank/custjob/index.php?j=624a43255e46406a30683b1d1d1d1d5f2443a363189j50

# config.json

```json
{
  "compony_id": "compony_id",
  "page": 1,
  "api": {
    "job": "job-api-url",
    "comments": "comments-api-url"
  }
}

```

# Use
```
npm start
```

# license

MIT
