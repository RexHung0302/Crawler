var request = require("request");
var cheerio = require("cheerio");
var nodemailer = require('nodemailer');
const fs = require("fs");

// 抓取網頁內容並回傳到 body
var JPN_Crawler = function() {
    request({
        url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
        method: "GET"
    }, function(error, response, body) {
        if (error || !body) {
            return;
        } else {
            const $ = cheerio.load(body); // 載入 body
            const tr = $("tbody tr"); // 抓取每一行的 tr
            const result = []; // 建立一個儲存結果的容器
            const bankDate = $("#h1_small_id"); // 放台銀牌告匯率日期

            let JPY_cashSellExchange = null; // 用來放日幣現金匯率的
            let JPY_sightSellExchange = null; // 用來放日幣即期匯率的

            for (var i = 0; i < tr.length; i++) {
                const coinType = tr.eq(i).find('.hidden-phone.print_show').text().trim(); // 幣別
                const cashBuyExchange = tr.eq(i).children().eq(1).text(); // 現金匯率(銀行買入)
                const cashSellExchange = tr.eq(i).children().eq(2).text(); // 現金匯率(銀行賣出)
                const sightBuyExchange = tr.eq(i).children().eq(3).text(); // 即期匯率(銀行買入)
                const sightSellExchange = tr.eq(i).children().eq(4).text(); // 即期匯率(銀行賣出)
                const bankDateText = bankDate.text(); // 當日日期

                // 抓日圓
                if (coinType === '日圓 (JPY)') {
                    // 放進 JSON 檔
                    result.push(Object.assign({ bankDateText, coinType, cashBuyExchange, cashSellExchange, sightBuyExchange, sightSellExchange }));

                    // 更新日幣變數
                    JPY_cashSellExchange = cashSellExchange;
                    JPY_sightSellExchange = sightSellExchange;

                    console.log('現金匯率->', JPY_cashSellExchange, '即期匯率->', JPY_sightSellExchange)

                }


            }

            // 寄信的部分
            let date = new Date(); //獲取當前時刻與日期
            let year = date.getFullYear();
            let month = date.getMonth() + 1 < 10 ? `0${date.getMonth()}` : date.getMonth();;
            let day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
            let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            let m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            let s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

            let todayDate = `${year}:${month}:${day}`; //獲取當前日期
            let time = `${h}:${m}:${s}`; //獲取當前時間

            //印出時間與匯率
            // console.log('現在時間：' + time + '，日幣現金匯率為' + JPY_cashSellExchange);
            // console.log('現在時間：' + time + '，日幣即期匯率為' + JPY_sightSellExchange);

            //初始化寄信
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'yourAccount@google.com', //Gmail Address
                    pass: 'yourPassword'
                }
            });



            //如果匯率小於我們設定的就寄信
            if (JPY_cashSellExchange < 0.29 || JPY_sightSellExchange < 0.29) {

                var mailOptions = {
                    from: '"你的爬蟲小弟" <xxx@google.com>', //寄件者 
                    to: 'xxx@gmail.com', //收件者
                    subject: '該買日幣啦', //標題 
                    html: '<body><h4>日幣匯率：</h4><span>現在時間 -> </span><span>' + todayDate + ' | ' + time + '</span><br/><span>日幣現金匯率為 -> </span><span style="color:yellow;">' + JPY_cashSellExchange + '</b></span><br/><span>日幣現金匯率為 -> </span><span style="color:yellow;">' + JPY_cashSellExchange + '</b></span><br/><h5 href="https://rate.bot.com.tw/xrt?Lang=zh-TW">以上取自台灣銀行 <span style="font-size: 20px;">' + bankDate + '</span> 牌告匯率</h5></body>' //帶有 HTML 格式的內容
                };


                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        return console.log(error);
                    } else {
                        console.log('Message sent: ' + info.response); //寄信成功後印出訊息
                    }
                });
            }

            console.log(result);
            // 寫入 result.json 檔案
            fs.writeFileSync("result.json", JSON.stringify(result));

        }
    });
};

// 跑程式
JPN_Crawler();
// 兩十分鐘爬一次
setInterval(JPN_Crawler, 12000 * 10);