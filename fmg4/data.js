// ======= 時間 =======
window.PAGE_INFO = { updatedAt: new Date().toLocaleString() };

// ======= 1) 品種樹狀細分（展示 + 用於樹/長條/餅/表格） =======
window.SPECIES_TREE = {
  草食: {
    兔子: ['Oryctolagus cuniculus'],
    天竺鼠: ['Cavia porcellus'],
    草食蜥蜴: ['Iguana iguana 等'],
    陸龜: ['蘇卡達 Centrochelys sulcata','星龜 Geochelone elegans','赫曼/希臘 Testudo spp.']
  },
  肉食: {
    蛇類: ['球蟒 Python regius','玉米蛇 Pantherophis guttatus','王蛇/奶蛇 Lampropeltis spp.']
  },
  節肢動物: {
    蝦子: ['米蝦 Neocaridina','水晶蝦 Caridina'],
    蜘蛛: ['狼蛛 Theraphosidae'],
    蠍子: ['帝王蠍 Pandinus','亞洲森林蠍 Heterometrus']
  },
  魚類: {
    鬥魚: ['Betta splendens'],
    銀龍魚: ['Osteoglossum bicirrhosum'],
    其他: ['孔雀魚','金魚','七彩神仙']
  },
  雜食: {
    守宮: ['豹紋守宮 Eublepharis macularius','冠紋守宮 Correlophus ciliatus'],
    蜥蜴: ['鬆獅蜥 Pogona vitticeps','藍舌蜥 Tiliqua spp.']
  }
};
// 給長條/餅圖的「物種數量」示範值（可改）
window.SPECIES_COUNTS = [
  { label:'草食', value: 8 },
  { label:'肉食（蛇）', value: 6 },
  { label:'節肢', value: 6 },
  { label:'魚類', value: 6 },
  { label:'雜食（守宮/蜥）', value: 6 }
];

// ======= 2) 特寵優勢（相對指標：數值越小越容易/越省） =======
window.ADVANTAGE_DATA = [
  { label:'守宮',    月支出: 1, 餵食頻率: 1, 空間需求: 1, 氣味管理: 1 },
  { label:'鬆獅蜥',  月支出: 2, 餵食頻率: 2, 空間需求: 2, 氣味管理: 1 },
  { label:'球蟒',    月支出: 2, 餵食頻率: 2, 空間需求: 2, 氣味管理: 1 },
  { label:'兔子',    月支出: 3, 餵食頻率: 3, 空間需求: 3, 氣味管理: 2 },
  { label:'貓',      月支出: 4, 餵食頻率: 4, 空間需求: 4, 氣味管理: 3 },
  { label:'狗',      月支出: 5, 餵食頻率: 5, 空間需求: 5, 氣味管理: 4 }
];

// ======= 3) 貓狗 vs 特寵：比較維度 =======
window.COMPARE_DATA = [
  { label:'狗',   月支出: 5, 時間成本: 5, 用品迭代: 4, 敏感體質風險: 3 },
  { label:'貓',   月支出: 4, 時間成本: 4, 用品迭代: 4, 敏感體質風險: 3 },
  { label:'守宮', 月支出: 1, 時間成本: 1, 用品迭代: 2, 敏感體質風險: 2 },
  { label:'鬆獅蜥', 月支出: 2, 時間成本: 2, 用品迭代: 3, 敏感體質風險: 2 },
  { label:'球蟒', 月支出: 2, 時間成本: 2, 用品迭代: 2, 敏感體質風險: 2 },
  { label:'陸龜', 月支出: 2, 時間成本: 2, 用品迭代: 2, 敏感體質風險: 2 }
];

// ======= 4) 趨勢（2018–2025 相對指數；示範值，1–100） =======
window.TREND_SERIES = {
  labels: ['2018','2019','2020','2021','2022','2023','2024','2025'],
  series: [
    { name:'守宮',    data:[30,35,42,55,70,78,85,90] },
    { name:'鬆獅蜥',  data:[28,33,40,52,60,68,74,80] },
    { name:'球蟒',    data:[25,31,38,50,58,64,70,76] },
    { name:'陸龜',    data:[20,24,28,33,38,45,50,55] },
    { name:'蛇（綜）', data:[18,22,27,31,36,42,48,54] }
  ]
};
window.TREND_SHARE = [
  { label:'守宮', value:28 }, { label:'鬆獅蜥', value:22 }, { label:'球蟒', value:18 },
  { label:'陸龜', value:16 }, { label:'蛇（綜）', value:16 }
];

// ======= 5) 來源資料（文獻名稱＋網址） =======
window.SOURCES = [
  ['FEDIAF《Facts & Figures 2025》','https://europeanpetfood.org/wp-content/uploads/2025/06/FEDIAF-Facts-Figures-2025.pdf','歐洲 terraria 約 1,072.9 萬'],
  ['UK Pet Food（PFMA）','https://www.ukpetfood.org/resource/pfma-releases-latest-pet-population-data.html','英國爬蟲約 150 萬隻'],
  ['GlobalPETS（UK）','https://globalpetindustry.com/news/behind-rise-uks-reptile-pet-population/','英國爬蟲年增 +1.6%，物種拆解龜/蜥/蛇'],
  ['APPA 2024 Reptile Report','https://americanpetproducts.org/news/the-american-pet-products-association-appa-releases-2024-fish-and-reptile-owner-insight-report','多爬蟲戶上升；≥2 隻佔比提升'],
  ['APPA Blog 摘要','https://americanpetproducts.org/blog/what-you-need-to-know-about-appas-fish-reptile-report','美國 4% 家戶養爬蟲'],
  ['BoA Institute 2025','https://institute.bankofamerica.com/content/dam/economic-insights/us-pet-ownership.pdf','美國 9,400 萬家戶養寵'],
  ['Grand View Research：Exotic/Reptiles','https://www.grandviewresearch.com/horizon/statistics/exotic-pets-market/animal-type/reptiles/global','爬蟲市場 CAGR ~6.8%'],
  ['Lucintel Reptile Supplies','https://www.lucintel.com/reptile-pet-supply-market.aspx','用品 CAGR ~7.3%'],
  ['新華社 財經','https://www.xinhuanet.com/fortune/20250331/b7eb68c4236c419088d516b18c4e9056/c.html','「異寵」消費規模擴大（中）'],
  ['CBNData 淘系','https://www.cbndata.com/information/276403','爬寵類目多年高速增長'],
  ['Japan Reptiles Show / TV Osaka','https://www.tv-osaka.co.jp/event/reptiles2025/','展會規模化'],
  ['台北國際兩棲爬蟲盛典（FB）','https://www.facebook.com/61551393254305/posts/122150293034046441/','1.5 萬+ 參觀、150+ 品牌'],
  ['爬蟲趨勢（工商時報）','https://www.ctee.com.tw/news/20241017701432-431401','尤其不少年輕女性就偏愛爬蟲類甚至蛇，因此，業界產品開發也看準年輕人市場，開發泥條、肉乾等，飼主不用買蟑螂、蟋蟀餵養寵物，讓原本對爬蟲類卻步的族群也願意加入飼養行列。'],
  ['爬蟲季臺灣國際展','https://www.facebook.com/share/p/19Y6vChsgw/','（展覽FB官方）在自己居住的空間內飼養爬蟲也慢慢變成趨勢'],
  ['Reddit：爬蟲趨勢研究討論串','https://www.reddit.com/r/herpetology/comments/m6cuxz/new_research_study_reveals_past_current_and/?tl=zh-hant','最受歡迎物種：鬃獅蜥，其次是球蟒、豹紋守宮、玉米蛇和睫角守宮。'],
];

// ======= 6) Idea Pool（GPT 幫我想） =======
window.IDEA_POOL = [
  '守宮專用：耐熱益生菌＋電解質微包（換飼主/轉場組）',
  '鬆獅蜥幼年：高蛋白 gut-load 粉（鈣:D3 比控制）',
  '陸龜：高纖＋礦物吸收促進（有機酸鹽）',
  '球蟒：換飼/拒食期電解質 + B 群微包',
  '蝦類：脫殼礦物片（Ca/Mg/K）＋水質穩定劑同盒',
  '跨物種：UVB 管理小抄＋補鈣週期提示卡',
  '展會快閃：2×2 體驗包（單體 vs 組合）',
  '電商加購：活餌 gut-load 粉與鈣粉綁定',
  '動保友善：飼養 SOP 貼紙＋洗手提醒（沙門氏菌風險）',
  'KOL 合作：飼養箱整備挑戰（7 日打卡）'
];

// ======= 7) SWOT =======
window.SWOT = {
  S:['物種專用配方門檻高','展會/社群轉換效率好','長週期補充，黏性高'],
  W:['母盤小、需教育市場','資料分散、缺權威本地統計','跨物種法規標示複雜'],
  O:['APAC 爬蟲熱上升','用品與活餌帶動保健加購','跨境電商/展會擴張'],
  T:['不當飼養風險引發輿情','法規調整（進口/品種管制）','供應鏈單一原料風險']
};
