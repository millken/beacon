/* 工业压缩机商城 · 图标库 + 产品数据 */

// ── line icons (24×24, stroke) ──
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3"/><path d="M16 4h3a1 1 0 0 1 1 1v3"/><path d="M20 16v3a1 1 0 0 1-1 1h-3"/><path d="M8 20H5a1 1 0 0 1-1-1v-3"/><line x1="3.5" y1="12" x2="20.5" y2="12"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  cart: '<path d="M3 4h2l2.2 11.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.78L20.5 8H6.2"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/>',
  clipboard: '<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><line x1="8.5" y1="10" x2="15.5" y2="10"/><line x1="8.5" y1="14" x2="15.5" y2="14"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  back: '<polyline points="15 6 9 12 15 18"/>',
  chev: '<polyline points="9 6 15 12 9 18"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  x: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  headset: '<path d="M5 13a7 7 0 0 1 14 0"/><path d="M3 14.5a2 2 0 0 1 2-2h1.2v6H5a2 2 0 0 1-2-2z"/><path d="M21 14.5a2 2 0 0 0-2-2h-1.2v6H19a2 2 0 0 0 2-2z"/><path d="M19 18.5a4 4 0 0 1-4 3h-2"/>',
  truck: '<rect x="2.5" y="6.5" width="11" height="9" rx="1"/><path d="M13.5 9.5h3.8l3.2 3.2v2.8h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
  shield: '<path d="M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><polyline points="9 12 11.5 14.5 16 9.5"/>',
  wrench: '<path d="M15.5 7.5a4 4 0 1 1-4.6-3.9 3 3 0 0 0 .6 4.3l-6.3 6.3a2 2 0 1 0 2.8 2.8l6.3-6.3a3 3 0 0 0 4.3.6 4 4 0 0 1-3.1-3.8z"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><polyline points="14 3 14 7 18 7"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/>',
  building: '<rect x="4" y="3" width="10" height="18" rx="1"/><path d="M14 8h6v13h-6"/><line x1="7" y1="7" x2="11" y2="7"/><line x1="7" y1="11" x2="11" y2="11"/><line x1="7" y1="15" x2="11" y2="15"/>',
  filter: '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="9" cy="7" r="2.3" fill="var(--m-bg)"/><circle cx="15" cy="12" r="2.3" fill="var(--m-bg)"/><circle cx="9" cy="17" r="2.3" fill="var(--m-bg)"/>',
  box: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5"/><line x1="12" y1="12" x2="12" y2="21"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><line x1="12" y1="18" x2="16" y2="11"/><circle cx="12" cy="18" r="1.4"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  snow: '<line x1="12" y1="3" x2="12" y2="21"/><line x1="4" y1="7.5" x2="20" y2="16.5"/><line x1="20" y1="7.5" x2="4" y2="16.5"/><path d="M12 3l-2.2 2.2M12 3l2.2 2.2M12 21l-2.2-2.2M12 21l2.2-2.2"/>',
  tank: '<rect x="6" y="4" width="12" height="16" rx="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="10" y1="20" x2="10" y2="22"/><line x1="14" y1="20" x2="14" y2="22"/>',
  tag: '<path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8" cy="8" r="1.4"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 9h13a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3"/><circle cx="16" cy="12.5" r="1"/>',
  share: '<circle cx="6" cy="12" r="2.4"/><circle cx="17" cy="6" r="2.4"/><circle cx="17" cy="18" r="2.4"/><line x1="8.1" y1="11" x2="14.9" y2="7"/><line x1="8.1" y1="13" x2="14.9" y2="17"/>',
  heart: '<path d="M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c-2 4.5-9 9-9 9z"/>',
  phone: '<path d="M5 3h3.2l1.6 4.4-2 1.4a12 12 0 0 0 5.4 5.4l1.4-2 4.4 1.6V21a1 1 0 0 1-1 1A17 17 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  edit: '<path d="M4 20h4L18.5 9.5l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
};

// ── products (index = data-go-prod) ──
const PRODUCTS = [
  { id:0, cat:0, img:'螺杆机', title:'永磁变频螺杆空压机 75kW', model:'SC-75VF', brand:'鼎力机电 · 自营', price:128600, was:139000,
    power:'75 kW', air:'13.6 m³/min', pressure:'0.8 MPa', stock:12,
    tags:[['变频','accent'],['现货','stock'],['质保2年','ghost'],['上门安装','ghost']],
    specs:[['驱动方式','永磁变频 · 一级压缩'],['额定功率','75 kW (100 HP)'],['排气量','13.6 m³/min'],['排气压力','0.8 MPa'],['噪音','68 dB(A)'],['冷却方式','风冷'],['出口口径','DN50'],['重量','1180 kg'],['品牌','鼎力 DINGLI']] },
  { id:1, cat:0, img:'螺杆机', title:'工频螺杆空压机 37kW', model:'SC-37', brand:'鼎力机电 · 自营', price:42800, was:0,
    power:'37 kW', air:'6.2 m³/min', pressure:'0.8 MPa', stock:25,
    tags:[['现货','stock'],['包邮','ghost'],['质保2年','ghost']],
    specs:[['驱动方式','工频 · 一级压缩'],['额定功率','37 kW (50 HP)'],['排气量','6.2 m³/min'],['排气压力','0.8 MPa'],['噪音','65 dB(A)'],['冷却方式','风冷'],['重量','680 kg']] },
  { id:2, cat:1, img:'活塞机', title:'活塞式空压机 7.5kW', model:'PT-7.5', brand:'鼎力机电 · 自营', price:6980, was:7600,
    power:'7.5 kW', air:'0.9 m³/min', pressure:'0.8 MPa', stock:60,
    tags:[['现货','stock'],['包邮','ghost'],['闪购','promo']],
    specs:[['类型','往复活塞式'],['额定功率','7.5 kW (10 HP)'],['排气量','0.9 m³/min'],['排气压力','0.8 MPa'],['储气罐','300 L'],['噪音','78 dB(A)'],['重量','185 kg']] },
  { id:3, cat:2, img:'无油机', title:'无油涡旋空压机 11kW', model:'OF-11S', brand:'鼎力机电 · 自营', price:58000, was:0,
    power:'11 kW', air:'1.1 m³/min', pressure:'0.8 MPa', stock:8,
    tags:[['无油','accent'],['医药级','ghost'],['上门安装','ghost']],
    specs:[['类型','涡旋式 · 100% 无油'],['额定功率','11 kW'],['排气量','1.1 m³/min'],['排气压力','0.8 MPa'],['含油量','0 mg/m³ (Class 0)'],['噪音','62 dB(A)'],['适用','食品 / 医药 / 电子']] },
  { id:4, cat:4, img:'移动式', title:'柴油移动空压机 13m³', model:'MB-13D', brand:'鼎力机电 · 自营', price:186000, was:0,
    power:'129 kW', air:'13 m³/min', pressure:'1.3 MPa', stock:3,
    tags:[['工程机','accent'],['可询价','ghost']],
    specs:[['类型','柴油驱动 · 拖车式'],['发动机','康明斯 4 缸'],['排气量','13 m³/min'],['排气压力','1.3 MPa'],['油箱','120 L'],['适用','管道吹扫 / 喷砂 / 凿岩']] },
  { id:5, cat:5, img:'冷干机', title:'冷冻式干燥机 13.5m³', model:'RD-135', brand:'鼎力机电 · 自营', price:9800, was:0,
    power:'1.1 kW', air:'13.5 m³/min', pressure:'1.0 MPa', stock:30,
    tags:[['现货','stock'],['后处理','ghost'],['闪购','promo']],
    specs:[['类型','冷冻式压缩空气干燥机'],['处理量','13.5 m³/min'],['压力露点','2~10 ℃'],['工作压力','≤1.0 MPa'],['制冷剂','R134a'],['配套','75kW 螺杆机']] },
  { id:6, cat:3, img:'离心机', title:'离心式空压机 250kW', model:'CF-250', brand:'鼎力机电 · 自营', price:'ask', was:0,
    power:'250 kW', air:'42 m³/min', pressure:'0.8 MPa', stock:0,
    tags:[['大型机','accent'],['需选型','ghost'],['工程方案','ghost']],
    specs:[['类型','三级离心 · 无油'],['额定功率','250 kW'],['排气量','42 m³/min'],['排气压力','0.8 MPa'],['适用','大型连续供气工况'],['交付','定制 · 8~12 周']] },
  { id:7, cat:7, img:'储气罐', title:'储气罐 2.0m³ / 8bar', model:'AT-2008', brand:'北元配件 · 官方', price:4500, was:0,
    power:'—', air:'2.0 m³', pressure:'0.8 MPa', stock:40,
    tags:[['现货','stock'],['含证书','ghost'],['闪购','promo']],
    specs:[['容积','2.0 m³'],['设计压力','0.8 MPa (8 bar)'],['材质','Q345R 碳钢'],['法兰','DN50'],['证书','含压力容器证'],['表面','喷塑']] },
  { id:8, cat:8, img:'配件', title:'螺杆主机大修包 KIT-37', model:'KIT-37', brand:'北元配件 · 官方', price:3200, was:3600,
    power:'—', air:'—', pressure:'—', stock:50,
    tags:[['现货','stock'],['包邮','ghost'],['原厂','accent']],
    specs:[['适配','SC-37 / 同级 37kW 主机'],['含件','轴承组 · 油封 · 密封件'],['周期建议','运行 24000h 更换'],['原厂','原厂配件']] },
];

// products shown on home "整机推荐"
const HOME_LIST = [0,3,1,4];

// ── 收货地址(公司统一)── 
const ADDR = { name:'王工', phone:'138****6677', text:'上海市浦东新区张江高科技园区某某路 88 号 沪东机电 · 设备部' };

// ── 地址簿(可增删改) ──
let ADDRESSES = [
  { name:'王工', phone:'138****6677', region:'上海市 浦东新区', detail:'张江高科技园区某某路 88 号 沪东机电 · 设备部', tag:'公司', def:true },
  { name:'赵师傅', phone:'139****2210', region:'江苏省 苏州市 吴中区', detail:'胥口镇工业园 12 号厂房 · 收货口', tag:'工厂', def:false },
];

// ── 订单(index = data-go-order) ──
const ORDERS = [
  { no:'2406180931', status:'待付款', cls:'pay', supplier:'鼎力机电 · 自营',
    banner:'等待付款', bannerSub:'请在 24 小时内完成对公转账,逾期自动取消', addr:ADDR,
    items:[{img:'螺杆机',title:'永磁变频螺杆空压机 75kW SC-75VF',spec:'变频 · 0.8MPa · 380V',qty:1,price:128600}],
    goods:128600, freight:0, discount:400, paid:128200, pay:'对公转账 · 待支付', placed:'2024-06-18 09:31',
    timeline:[ {t:'订单已提交,等待付款。付款后鼎力机电将安排出库',time:'2024-06-18 09:31',tag:'待付款',active:true} ] },
  { no:'2406121144', status:'运输中', cls:'ship', supplier:'鼎力机电 · 自营',
    banner:'运输中', bannerSub:'预计 06-15 送达 · 安装工程师将提前联系您', addr:ADDR,
    items:[{img:'活塞机',title:'活塞式空压机 7.5kW PT-7.5',spec:'现货 · 0.8MPa · 380V',qty:2,price:6980}],
    goods:13960, freight:0, discount:0, paid:13960, pay:'对公转账 · 已支付', placed:'2024-06-12 11:44',
    carrier:'鼎力专运 · SF-重货 591001188', 
    timeline:[
      {t:'【上海中转场】快件已发出,下一站【浦东集散中心】',time:'06-14 08:20',tag:'运输中',active:true},
      {t:'【上海中转场】快件已到达',time:'06-13 22:10'},
      {t:'商品已出库 · 鼎力机电华东仓',time:'06-13 16:40'},
      {t:'仓库已完成拣货、打包与出厂检测',time:'06-13 10:05'},
      {t:'订单已支付,等待仓库处理',time:'06-12 11:50'},
      {t:'订单已提交',time:'06-12 11:44'},
    ] },
  { no:'2405290617', status:'已完成', cls:'done', supplier:'北元配件 · 官方',
    banner:'交易完成', bannerSub:'已于 05-31 签收 · 感谢您的信任,期待再次合作', addr:ADDR,
    items:[{img:'配件',title:'精密过滤器组 FT-076(三级)',spec:'包邮 · DN50',qty:2,price:1280}],
    goods:2560, freight:0, discount:0, paid:2560, pay:'在线支付 · 已支付', placed:'2024-05-29 06:17',
    carrier:'顺丰速运 · SF1234567890',
    timeline:[
      {t:'您的订单已签收,签收人:前台。感谢使用',time:'05-31 14:22',tag:'已签收',active:true},
      {t:'【浦东派送站】派件中,快递员 李师傅 138****2046',time:'05-31 09:10'},
      {t:'快件已到达【浦东派送站】',time:'05-31 07:30'},
      {t:'商品已出库',time:'05-30 18:00'},
      {t:'订单已支付',time:'05-29 06:20'},
    ] },
];
