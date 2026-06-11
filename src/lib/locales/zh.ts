export const zh = {
  nav: {
    auction: '拍卖',
    about: '关于我们',
    profile: '个人中心',
    contacts: '联系方式',
  },
  hero: {
    title: 'IT Auction Platform',
    subtitle: '参与在线拍卖的 <br /> 现代平台',
    detail: '实时出价竞拍',
    button: '查看拍卖',
  },
  lots: {
    title: '热门拍品',
    newTitle: '最新上架',
    viewAll: '查看全部',
    currentBid: '当前出价',
    bidsCount: '出价次数',
    timeLeft: '剩余时间',
    placeBid: '参与竞拍',
    searchPlaceholder: '搜索...',
    searchBtn: '搜索',
    showingProducts: '显示 {count} 个商品',
    sortBy: '排序方式',
    sortOptions: {
      featured: '推荐',
      priceLowHigh: '价格：从低到高',
      priceHighLow: '价格：从高到低',
      mostBids: '最多出价'
    },
    categories: {
      all: '所有拍品',
      laptops: '笔记本电脑',
      phones: '手机数码',
      accessories: '外设配件',
      other: '其他类型'
    },
    brands: {
      apple: '苹果 (Apple)',
      sony: '索尼 (Sony)',
      herman_miller: '赫曼米勒 (Herman Miller)',
      dell: '戴尔 (Dell)',
      generic: '其他品牌'
    },
    titles: {
      macbook: 'MacBook Pro M3 Max',
      iphone: 'Iphone 15 Pro Max 1Tb',
      ps5: '索尼 PlayStation 5 Pro',
      secret_box: '神秘 IT 盒子',
      chair: '赫曼米勒 Aeron 椅子',
      rack: '42U 服务器机柜'
    },
    descriptions: {
      macbook_desc: '适合专业人士的超强工作站笔记本。配备16英寸Liquid Retina XDR显示屏，M3 Max芯片，48GB内存和1TB固态硬盘。',
      iphone_desc: '苹果旗舰智能手机，采用钛金属机身，4800万像素强悍相机，1TB超大存储。全新未拆封。',
      ps5_desc: '最新版索尼 PlayStation 5 Pro 游戏主机。极致性能，支持光线追踪，内置2TB存储空间。',
      secret_box_desc: '专为IT从业人员准备的神秘盲盒，内含各种数码好物和极客配件。内容物将在最终揭晓。',
      chair_desc: '高端人体工学办公椅。完美腰部支撑，可调节扶手，高透气性 Pellicle 网面。',
      rack_desc: '42U立式通信网络机柜。结构坚固，玻璃前门，带锁侧面板。',
    },
    historyTitle: '竞拍出价记录',
    bidPlaceholder: '输入您的出价金额',
    successBid: '出价成功！',
    backToList: '返回列表',
    startingPrice: '起拍价',
    endTime: '结束时间',
    placeBidBtn: '确认出价',
    anonymousLabel: '匿名出价',
    you: '(您)'
  },
  faq: {
    title: '常见问题解答',
    items: [
      {
        q: '“初步拍卖”是什么意思？',
        a: '这意味着网站上的竞价过程仅用于确定出价最好的优胜者。出价不会对您产生即时的法律或财务义务。'
      },
      {
        q: '付款和送货如何运作？',
        a: '拍卖完成后，买卖双方私下直接协商付款和交货事宜。'
      },
      {
        q: '我可以取消我的出价吗？',
        a: '是的，因为出价不具有法律约束力，您可以在拍卖结束前撤回出价，或者在最终谈判中放弃交易。'
      },
      {
        q: '谁可以发布拍品？',
        a: '任何平台注册用户在验证其账户后都可以创建自己的拍卖。'
      },
      {
        q: '出价是匿名的吗？',
        a: '是的，所有出价都是匿名的。其他用户只会看到您自动生成的昵称。'
      }
    ]
  },
  auth: {
    signIn: '登录',
    signUp: '注册',
    name: '姓名（昵称）',
    phone: '电话（可选）',
    email: '电子邮件',
    password: '密码',
    submitLogin: '登录',
    submitRegister: '创建账号',
    loading: '处理中...',
    error: '发生错误'
  },
  footer: {
    copy: 'IT Auctions. 版权所有.',
    contacts: '联系方式',
    socials: '社交媒体',
    phoneLabel: '手机号码',
    emailLabel: '电子邮件',
    viber: 'Viber',
    telegram: 'Telegram'
  },
  notfound: {
    title: '页面未找到',
    desc: '看来这个拍品已经拍出，或者链接已失效。',
    button: '返回首页',
  },
  profile: {
    title: '个人中心',
    name: '姓名',
    email: '电子邮箱',
    phone: '电话号码',
    telegramStatus: 'Telegram 绑定状态',
    connected: '已绑定',
    notConnected: '未绑定',
    connectBtn: '绑定 Telegram',
    wonLotsTitle: '您赢得的拍品',
    noWonLots: '您目前没有赢得任何拍品。',
    loginRequired: '请登录后查看个人中心。',
    notSpecified: '未填写',
  },
  aboutPage: {
    title: '关于平台',
    subtitle: '了解我们的拍卖系统是如何运作的，以及如何参与',
    howItWorks: {
      title: '如何运作',
      steps: [
        {
          title: '注册',
          desc: '创建一个帐户即可参与拍卖。注册是免费的，只需几分钟。'
        },
        {
          title: '浏览拍品',
          desc: '在目录中浏览正在进行的拍品。您可以使用分类筛选和排序来找到您需要的物品。'
        },
        {
          title: '参与竞拍',
          desc: '对您喜欢的物品出价。所有的出价都是匿名的，其他用户只会看到您的昵称。'
        },
        {
          title: '胜出',
          desc: '如果在拍卖结束时您的出价最高，您就成为该拍卖的赢家。'
        }
      ]
    },
    rules: {
      title: '平台规则',
      items: [
        {
          title: '预选拍卖',
          desc: '我们的平台以预选拍卖的方式运作。这意味着获胜不会立即给您带来财务义务。'
        },
        {
          title: '匿名性',
          desc: '我们关心您的隐私。您的个人数据对其他竞拍者是隐藏的。'
        },
        {
          title: '付款与配送',
          desc: '在赢得拍卖后，管理员或卖家将联系您，商讨付款详情和方便的配送方式。'
        },
        {
          title: '安全性',
          desc: '每件拍品在发布前都会经过审核人员检查。我们保证描述与物品的实际状况相符。'
        }
      ]
    },
    cta: {
      title: '准备好进行第一次出价了吗？',
      button: '前往拍卖'
    }
  }
};
