export const plugins = [
  {
    slug: 'cobbledex',
    name: 'CobbleDex',
    accent: 'cyan',
    icon: 'book',
    platform: 'Paper',
    version: '2.3.1',
    mc: '1.20.1 – 1.21.1',
    status: 'stable',
    downloads: '18.4k',
    updated: '2026-10-18',
    tagline: {
      zh: '把图鉴进度变成一条看得见的路',
      en: 'Turn dex progress into a visible path',
      th: 'เปลี่ยนความคืบหน้าระบบสารานุกรมให้มองเห็นได้'
    },
    desc: {
      zh: '捕捉即记录，按世代、属性、生态分区展示进度；阶段奖励自动发放，不再靠管理员手动统计。',
      en: 'Records every catch, shows progress by generation, type and biome, and rewards milestones automatically.',
      th: 'บันทึกการจับทุกครั้ง แสดงความคืบหน้าตามรุ่น ธาตุ และไบโอม พร้อมรางวัลอัตโนมัติ'
    },
    tags: ['图鉴', '捕捉', '排行榜', '奖励'],
    features: [
      { title: '捕捉即记录', text: '监听 Cobblemon 捕捉事件，写入 SQLite / MySQL，不依赖 NBT 扫描。' },
      { title: '分区进度', text: '按世代、属性、生态三个维度切分，玩家能看清还差哪一片。' },
      { title: '阶段奖励', text: '25% / 50% / 75% / 100% 四档，指令、物品、点券都能配。' },
      { title: '全服排行', text: '图鉴完成度排行，支持计分板与网页接口。' }
    ],
    install: [
      '把 CobbleDex-2.3.1.jar 放进 plugins/ 并重启服务端',
      '首次启动生成 config.yml 与 database.db',
      '在 config.yml 里选择存储方式（sqlite / mysql）',
      '执行 /dex reload 校验配置'
    ],
    commands: [
      { cmd: '/dex', desc: '打开自己的图鉴面板', perm: 'cobbledex.use' },
      { cmd: '/dex top', desc: '查看完成度排行', perm: 'cobbledex.use' },
      { cmd: '/dex reload', desc: '重载配置', perm: 'cobbledex.admin' },
      { cmd: '/dex give <玩家> <奖励>', desc: '手动补发阶段奖励', perm: 'cobbledex.admin' }
    ],
    config: `storage: sqlite          # sqlite | mysql
milestones:
  25:  ["give %player% poke_ball 32"]
  50:  ["points give %player% 500"]
  75:  ["give %player% rare_candy 10"]
  100: ["crate key %player% dex 1"]
leaderboard:
  enabled: true
  refresh-seconds: 120`,
    repo: 'https://github.com/zhbo/cobbledex'
  },
  {
    slug: 'shinyalert',
    name: 'ShinyAlert',
    accent: 'gold',
    icon: 'sparkles',
    platform: 'Both',
    version: '1.9.0',
    mc: '1.20.1 – 1.21.1',
    status: 'stable',
    downloads: '26.1k',
    updated: '2026-10-20',
    tagline: {
      zh: '闪光出现的那一秒，全服都该知道',
      en: 'When a shiny appears, everyone should know',
      th: 'เมื่อโผล่ตัวมันวาว ทั้งเซิร์ฟเวอร์ควรรู้'
    },
    desc: {
      zh: '闪光宝可梦捕捉 / 出现播报，支持 Discord Webhook、IV 展示、冷却与防刷屏。',
      en: 'Shiny spawn and catch broadcasts with Discord webhooks, IV display, cooldowns and anti-spam.',
      th: 'ประกาศการเกิด/จับตัวมันวาว พร้อม Discord webhook แสดง IV และกันสแปม'
    },
    tags: ['闪光', '播报', 'Webhook', '社交'],
    features: [
      { title: '双时机播报', text: '出现时一条、被捕捉时一条，可分别开关。' },
      { title: 'IV 与性格', text: '播报里带个体值区间与性格，避免刷屏也能看出价值。' },
      { title: 'Discord 推送', text: 'Webhook 支持嵌入卡片与缩略图。' },
      { title: '防刷屏', text: '按玩家 / 按物种设置冷却，连闪只播一次。' }
    ],
    install: [
      '放入 plugins/ 后重启，生成 config.yml',
      '填写 webhook.url（可留空只用游戏内播报）',
      '按需调整 cooldown 与 iv-range',
      '执行 /shiny test 预览播报格式'
    ],
    commands: [
      { cmd: '/shiny test', desc: '发送一条测试播报', perm: 'shinyalert.admin' },
      { cmd: '/shiny reload', desc: '重载配置', perm: 'shinyalert.admin' },
      { cmd: '/shiny mute', desc: '个人屏蔽播报', perm: 'shinyalert.use' }
    ],
    config: `broadcast:
  on-spawn: true
  on-catch: true
  cooldown-seconds: 30
  show-iv: true
discord:
  enabled: true
  url: "https://discord.com/api/webhooks/..."
  mention-everyone: false`,
    repo: 'https://github.com/zhbo/shinyalert'
  },
  {
    slug: 'raidcaller',
    name: 'RaidCaller',
    accent: 'purple',
    icon: 'swords',
    platform: 'Paper',
    version: '1.4.2',
    mc: '1.20.1 – 1.21.1',
    status: 'beta',
    downloads: '7.2k',
    updated: '2026-10-16',
    tagline: {
      zh: '把散人凑成一支能打的队',
      en: 'Turn strangers into a raid team',
      th: 'รวมผู้เล่นให้เป็นทีมเรด'
    },
    desc: {
      zh: '极巨团战一键召集：倒计时、报名、人数校验、自动开局，打完自动结算。',
      en: 'One-command raid assembly with countdown, sign-up, size checks and automatic payout.',
      th: 'รวมทีมเรดด้วยคำสั่งเดียว มีนับถอยหลัง ลงทะเบียน ตรวจจำนวน และจ่ายรางวัลอัตโนมัติ'
    },
    tags: ['团战', '组队', '倒计时', 'PVE'],
    features: [
      { title: '一键召集', text: '发起后全服弹窗，点击即可报名，无需加群。' },
      { title: '人数校验', text: '低于最小人数自动取消，避免开局即失败。' },
      { title: '自动开局', text: '倒计时结束自动传送到战场并生成巢穴。' },
      { title: '结算面板', text: '战斗结束展示伤害、捕捉、掉落。' }
    ],
    install: [
      '安装 Paper 1.20.1+ 与 Cobblemon 1.6+',
      '放入 jar，重启生成 raids.yml',
      '在 raids.yml 配置巢穴坐标与奖励表',
      '/raid reload 校验'
    ],
    commands: [
      { cmd: '/raid start <物种>', desc: '发起一场团战', perm: 'raidcaller.start' },
      { cmd: '/raid join', desc: '报名当前团战', perm: 'raidcaller.use' },
      { cmd: '/raid reload', desc: '重载配置', perm: 'raidcaller.admin' }
    ],
    config: `min-players: 4
countdown-seconds: 60
teleport-on-start: true
rewards:
  win: ["give %player% rare_candy 5"]
  catch: ["points give %player% 300"]`,
    repo: 'https://github.com/zhbo/raidcaller'
  },
  {
    slug: 'evtrainer',
    name: 'EVTrainer',
    accent: 'green',
    icon: 'dumbbell',
    platform: 'Fabric',
    version: '0.8.5',
    mc: '1.20.1',
    status: 'beta',
    downloads: '4.6k',
    updated: '2026-10-11',
    tagline: {
      zh: '努力值不该靠刷野外',
      en: 'EVs should not mean grinding the wild',
      th: 'ค่า EV ไม่ควรต้องไล่ตีมอนป่า'
    },
    desc: {
      zh: '在训练场里按属性刷努力值，设置上限与衰减，配速可视化。',
      en: 'Train EVs by stat in dedicated zones, with caps, decay and a visible pace meter.',
      th: 'ฝึก EV ตามค่าในโซนเฉพาะ กำหนดเพดาน การลดลง และแสดงความเร็ว'
    },
    tags: ['努力值', '训练场', '平衡'],
    features: [
      { title: '属性训练区', text: '六个属性各一块区域，进入即开始计时计点。' },
      { title: '上限与衰减', text: '单属性 252、总和 510，可配每日衰减防止挂机。' },
      { title: '配速面板', text: '实时显示每分钟获得量与预计完成时间。' }
    ],
    install: [
      '客户端与服务端都放入 Fabric 模组',
      '在 config/evtrainer.json 里定义训练区坐标',
      '重启后使用 /evtp <属性> 进入训练区'
    ],
    commands: [
      { cmd: '/evtp <stat>', desc: '传送到对应训练区', perm: 'evtrainer.use' },
      { cmd: '/ev reset', desc: '清空当前努力值', perm: 'evtrainer.use' },
      { cmd: '/ev reload', desc: '重载配置', perm: 'evtrainer.admin' }
    ],
    config: `{
  "capPerStat": 252,
  "capTotal": 510,
  "pointsPerMinute": 6,
  "decayPerDay": 0,
  "zones": { "speed": [128, 64, -320] }
}`,
    repo: 'https://github.com/zhbo/evtrainer'
  },
  {
    slug: 'ballforge',
    name: 'BallForge',
    accent: 'cyan',
    icon: 'circle-dot',
    platform: 'Paper',
    version: '3.0.0',
    mc: '1.20.1 – 1.21.1',
    status: 'stable',
    downloads: '12.8k',
    updated: '2026-10-09',
    tagline: {
      zh: '让精灵球回到经济循环里',
      en: 'Put Poké Balls back into the economy',
      th: 'ให้โปเกบอลกลับสู่วงจรเศรษฐกิจ'
    },
    desc: {
      zh: '自定义合成表、工厂产出与限购，球种按进度解锁，避免前期通货膨胀。',
      en: 'Custom recipes, factory output and purchase limits, with ball tiers unlocked by progress.',
      th: 'สูตรคราฟต์ โรงงานผลิต และจำกัดการซื้อ ปลดล็อกตามความคืบหน้า'
    },
    tags: ['经济', '合成', '精灵球'],
    features: [
      { title: '配方可视化', text: '游戏内 GUI 编辑合成表，保存即生效。' },
      { title: '进度解锁', text: '按图鉴完成度或权限解锁高级球。' },
      { title: '限购与冷却', text: '每人每日上限，防止脚本刷球。' }
    ],
    install: [
      '放入 plugins/ 并安装 Vault（可选）',
      '在 recipes.yml 定义配方或使用 GUI 编辑',
      '/ballforge reload 生效'
    ],
    commands: [
      { cmd: '/ballforge', desc: '打开合成界面', perm: 'ballforge.use' },
      { cmd: '/ballforge edit', desc: '编辑配方', perm: 'ballforge.admin' },
      { cmd: '/ballforge reload', desc: '重载', perm: 'ballforge.admin' }
    ],
    config: `economy: vault
daily-limit:
  poke_ball: 64
  ultra_ball: 16
unlock:
  ultra_ball: "dex>=50"`,
    repo: 'https://github.com/zhbo/ballforge'
  },
  {
    slug: 'biomespawn',
    name: 'BiomeSpawn',
    accent: 'purple',
    icon: 'trees',
    platform: 'Both',
    version: '1.2.7',
    mc: '1.20.1 – 1.21.1',
    status: 'stable',
    downloads: '9.3k',
    updated: '2026-10-05',
    tagline: {
      zh: '生态刷新该由地图决定，不是随机',
      en: 'Spawning should be decided by the map, not RNG',
      th: 'การเกิดควรถูกกำหนดโดยแผนที่ ไม่ใช่สุ่ม'
    },
    desc: {
      zh: '按生态、时间、天气控制刷新权重，支持区域禁刷与临时活动加成。',
      en: 'Control spawn weights by biome, time and weather, with region blacklists and event boosts.',
      th: 'ควบคุมน้ำหนักการเกิดตามไบโอม เวลา และอากาศ พร้อมแบล็กลิสต์และบูสต์อีเวนต์'
    },
    tags: ['刷新', '生态', '平衡'],
    features: [
      { title: '权重表', text: '每个生态一张权重表，支持继承与覆盖。' },
      { title: '条件刷新', text: '时间、天气、月相组合条件。' },
      { title: '区域禁刷', text: '用 WorldGuard 区域排除主城与活动场。' }
    ],
    install: [
      '放入 plugins/（Fabric 端放 mods/）',
      '编辑 spawns/*.yml，按生态分组',
      '/bspawn reload 应用'
    ],
    commands: [
      { cmd: '/bspawn reload', desc: '重载刷新表', perm: 'biomespawn.admin' },
      { cmd: '/bspawn check', desc: '查看当前区块权重', perm: 'biomespawn.admin' }
    ],
    config: `biomes:
  cherry_grove:
    pikachu: 12
    eevee: 8
  deep_dark:
    dreepy: 4
conditions:
  deep_dark: { time: night }`,
    repo: 'https://github.com/zhbo/biomespawn'
  }
]

export function getPlugin(slug) {
  return plugins.find((p) => p.slug === slug)
}

export const accents = {
  cyan: { text: 'text-neon', bg: 'bg-neon', ring: 'rgba(0,240,255,0.35)' },
  purple: { text: 'text-violet', bg: 'bg-violet', ring: 'rgba(168,85,247,0.35)' },
  gold: { text: 'text-gold', bg: 'bg-gold', ring: 'rgba(255,209,102,0.35)' },
  green: { text: 'text-jade', bg: 'bg-jade', ring: 'rgba(52,211,153,0.35)' }
}
