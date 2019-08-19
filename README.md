# Crawler ( crawl ¥JPY )

## 運作環境
* [Node.js v4.2+](https://nodejs.org/en/download/)

## 使用套件
[request](https://www.npmjs.com/package/request) 獲取整個網頁

[cheerio](https://www.npmjs.com/package/cheerio) 後端的 jQuery

[nodemailer](https://www.npmjs.com/package/nodemailer) 用來寄信

### 安裝
```
1. $ Git Clone
2. $ cd Crawler
3. $ node index.js
```

### 測試
```
無測試
```

### 說明

這是一支簡單的爬蟲，能爬一些基本網頁，修改 **url** 即可。

寄信部分 **user** 及 **pass** 改成自己的帳號密碼。
```
auth: {
    user: 'yourAccount@google.com', //Gmail Address
    pass: 'yourPassword'
}
```

記得使用前先到 **Google** 修改安全性。

#### 進入「登入和安全性」，勾選「允許安全性較低的應用程式」 設定處於啟用狀態，這一步驟一定要做，不然屆時就會回報錯誤。
