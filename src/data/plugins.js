/* 插件仓库示例数据
   字段说明：
   - gameplay  卡片大标题（玩法），卡片名以「玩法（插件名）」呈现
   - desc      卡片第二行小字，具体玩法介绍
   - server    服务端标签，Paper / Fabric 可同时存在
   - mc        游戏版本，永远作为卡片第一个标签
   - tags      类型标签，一眼看出插件属于什么类型
   - github    展示用的仓库地址；示例阶段点击为占位
   - downloads 纯数字，便于排序与格式化 */

export const plugins = [
  {
    slug: 'cobbledex',
    name: 'CobbleDex',
    gameplay: { zh: '图鉴收集', en: 'Dex Collection' },
    tagline: {
      zh: '把图鉴进度变成一条看得见的路',
      en: 'Turn dex progress into a visible path'
    },
    desc: {
      zh: '捕捉即记录，按世代、属性、生态分区展示进度；阶段奖励自动发放，不再靠管理员手动统计。',
      en: 'Records every catch, shows progress by generation, type and biome, and rewards milestones automatically.'
    },
    server: ['Paper'],
    mc: '1.20.1 – 1.21.1',
    version: '2.3.1',
    status: 'stable',
    downloads: 18400,
    updated: '2026-10-18',
    author: 'ZHBO',
    github: 'github.com/zhbo/cobbledex',
    repo: 'https://github.com/zhbo/cobbledex',
    tags: {
      zh: ['图鉴', '捕捉', '排行榜', '奖励'],
      en: ['Dex', 'Catch', 'Leaderboard', 'Rewards']
    },
    features: [
      {
        title: { zh: '捕捉即记录', en: 'Logged on catch' },
        text: {
          zh: '监听 Cobblemon 捕捉事件并写入 SQLite / MySQL，不依赖 NBT 扫描。',
          en: 'Hooks Cobblemon catch events into SQLite or MySQL instead of scanning NBT.'
        }
      },
      {
        title: { zh: '分区进度', en: 'Segmented progress' },
        text: {
          zh: '按世代、属性、生态三个维度切分，玩家能看清还差哪一片。',
          en: 'Splits progress by generation, type and biome so players see what is missing.'
        }
      },
      {
        title: { zh: '阶段奖励', en: 'Milestone rewards' },
        text: {
          zh: '25% / 50% / 75% / 100% 四档自动发放，指令、物品、点券都能配。',
          en: 'Auto rewards at 25% / 50% / 75% / 100%, configurable per milestone.'
        }
      },
      {
        title: { zh: '全服排行', en: 'Server leaderboard' },
        text: {
          zh: '按图鉴完成度排行，支持计分板与网页接口。',
          en: 'Ranks players by dex completion with scoreboard and web API support.'
        }
      }
    ],
    install: {
      zh: [
        '把 CobbleDex-2.3.1.jar 放进 plugins/ 并重启服务端',
        '首次启动生成 config.yml 与 database.db',
        '在 config.yml 里选择存储方式（sqlite / mysql）',
        '执行 /dex reload 校验配置'
      ],
      en: [
        'Drop CobbleDex-2.3.1.jar into plugins/ and restart the server',
        'First boot creates config.yml and database.db',
        'Choose sqlite or mysql storage in config.yml',
        'Run /dex reload to verify the setup'
      ]
    },
    commands: [
      {
        cmd: '/dex',
        desc: { zh: '打开自己的图鉴面板', en: 'Open your dex panel' },
        perm: 'cobbledex.use'
      },
      {
        cmd: '/dex top',
        desc: { zh: '查看完成度排行', en: 'Show completion leaderboard' },
        perm: 'cobbledex.use'
      },
      {
        cmd: '/dex reload',
        desc: { zh: '重载配置', en: 'Reload configuration' },
        perm: 'cobbledex.admin'
      }
    ],
    config: `storage: sqlite          # sqlite | mysql
milestones:
  25:  ["give %player% poke_ball 32"]
  50:  ["points give %player% 500"]
  75:  ["give %player% rare_candy 10"]
  100: ["crate key %player% dex 1"]
leaderboard:
  enabled: true
  refresh-seconds: 120`
  },
  {
    slug: 'shinyalert',
    name: 'ShinyAlert',
    gameplay: { zh: '闪光播报', en: 'Shiny Alerts' },
    tagline: {
      zh: '闪光出现的那一秒，全服都该知道',
      en: 'When a shiny appears, everyone should know'
    },
    desc: {
      zh: '闪光宝可梦出现 / 捕捉双向播报，带 IV 展示、冷却防刷屏与 Discord Webhook 推送。',
      en: 'Shiny spawn and catch broadcasts with IV display, cooldowns and Discord webhook delivery.'
    },
    server: ['Paper', 'Fabric'],
    mc: '1.20.1 – 1.21.1',
    version: '1.9.0',
    status: 'stable',
    downloads: 26100,
    updated: '2026-10-20',
    author: 'ZHBO',
    github: 'github.com/zhbo/shinyalert',
    repo: 'https://github.com/zhbo/shinyalert',
    tags: {
      zh: ['闪光', '播报', 'Webhook', '社交'],
      en: ['Shiny', 'Broadcast', 'Webhook', 'Social']
    },
    features: [
      {
        title: { zh: '双时机播报', en: 'Two trigger points' },
        text: {
          zh: '出现时一条、被捕捉时一条，可分别开关。',
          en: 'One broadcast on spawn and one on catch, each toggleable.'
        }
      },
      {
        title: { zh: 'IV 与性格', en: 'IV and nature' },
        text: {
          zh: '播报里带个体值区间与性格，刷屏也能看出价值。',
          en: 'Shows IV ranges and nature so players can judge the catch at a glance.'
        }
      },
      {
        title: { zh: 'Discord 推送', en: 'Discord webhook' },
        text: {
          zh: 'Webhook 支持嵌入卡片与缩略图。',
          en: 'Webhook supports embed cards and thumbnails.'
        }
      },
      {
        title: { zh: '防刷屏', en: 'Anti-spam' },
        text: {
          zh: '按玩家 / 按物种设置冷却，连续闪光只播一次。',
          en: 'Per-player and per-species cooldowns collapse back-to-back shinies.'
        }
      }
    ],
    install: {
      zh: [
        '放入 plugins/ 后重启，生成 config.yml',
        '填写 webhook.url（可留空只用游戏内播报）',
        '按需调整 cooldown 与 iv-range',
        '执行 /shiny test 预览播报格式'
      ],
      en: [
        'Drop into plugins/ and restart to generate config.yml',
        'Fill in webhook.url (leave empty for in-game only)',
        'Tune cooldown and iv-range as needed',
        'Run /shiny test to preview the broadcast'
      ]
    },
    commands: [
      {
        cmd: '/shiny test',
        desc: { zh: '发送一条测试播报', en: 'Send a test broadcast' },
        perm: 'shinyalert.admin'
      },
      {
        cmd: '/shiny reload',
        desc: { zh: '重载配置', en: 'Reload configuration' },
        perm: 'shinyalert.admin'
      },
      {
        cmd: '/shiny mute',
        desc: { zh: '个人屏蔽播报', en: 'Mute broadcasts for yourself' },
        perm: 'shinyalert.use'
      }
    ],
    config: `broadcast:
  on-spawn: true
  on-catch: true
  cooldown-seconds: 30
  show-iv: true
discord:
  enabled: true
  url: "https://discord.com/api/webhooks/..."
  mention-everyone: false`
  },
  {
    slug: 'raidcaller',
    name: 'RaidCaller',
    gameplay: { zh: '团战召集', en: 'Raid Assembly' },
    tagline: {
      zh: '把散人凑成一支能打的队',
      en: 'Turn strangers into a raid team'
    },
    desc: {
      zh: '极巨团战一键召集：全服弹窗报名、人数校验、倒计时自动开局，打完自动结算。',
      en: 'One-command raid assembly with sign-up, size checks, countdown and automatic payout.'
    },
    server: ['Paper'],
    mc: '1.20.1 – 1.21.1',
    version: '1.4.2',
    status: 'beta',
    downloads: 7200,
    updated: '2026-10-16',
    author: 'ZHBO',
    github: 'github.com/zhbo/raidcaller',
    repo: 'https://github.com/zhbo/raidcaller',
    tags: {
      zh: ['团战', '组队', '倒计时', 'PVE'],
      en: ['Raid', 'Team', 'Countdown', 'PvE']
    },
    features: [
      {
        title: { zh: '一键召集', en: 'One-command call' },
        text: {
          zh: '发起后全服弹窗，点击即可报名，无需加群。',
          en: 'A server-wide prompt lets players join with one click.'
        }
      },
      {
        title: { zh: '人数校验', en: 'Size check' },
        text: {
          zh: '低于最小人数自动取消，避免开局即失败。',
          en: 'Cancels automatically below the minimum player count.'
        }
      },
      {
        title: { zh: '自动开局', en: 'Auto start' },
        text: {
          zh: '倒计时结束自动传送到战场并生成巢穴。',
          en: 'Teleports the team and spawns the den when the countdown ends.'
        }
      },
      {
        title: { zh: '结算面板', en: 'Result panel' },
        text: {
          zh: '战斗结束展示伤害、捕捉与掉落。',
          en: 'Shows damage, catches and drops after the raid.'
        }
      }
    ],
    install: {
      zh: [
        '安装 Paper 1.20.1+ 与 Cobblemon 1.6+',
        '放入 jar，重启生成 raids.yml',
        '在 raids.yml 配置巢穴坐标与奖励表',
        '执行 /raid reload 校验'
      ],
      en: [
        'Requires Paper 1.20.1+ and Cobblemon 1.6+',
        'Drop the jar in and restart to generate raids.yml',
        'Set den coordinates and rewards in raids.yml',
        'Run /raid reload to verify'
      ]
    },
    commands: [
      {
        cmd: '/raid start <species>',
        desc: { zh: '发起一场团战', en: 'Start a raid' },
        perm: 'raidcaller.start'
      },
      {
        cmd: '/raid join',
        desc: { zh: '报名当前团战', en: 'Join the current raid' },
        perm: 'raidcaller.use'
      },
      {
        cmd: '/raid reload',
        desc: { zh: '重载配置', en: 'Reload configuration' },
        perm: 'raidcaller.admin'
      }
    ],
    config: `min-players: 4
countdown-seconds: 60
teleport-on-start: true
rewards:
  win: ["give %player% rare_candy 5"]
  catch: ["points give %player% 300"]`
  },
  {
    slug: 'evtrainer',
    name: 'EVTrainer',
    gameplay: { zh: '努力值训练', en: 'EV Training' },
    tagline: {
      zh: '努力值不该靠刷野外',
      en: 'EVs should not mean grinding the wild'
    },
    desc: {
      zh: '在训练场里按属性刷努力值，设置上限与衰减，配速面板实时显示每分钟收益。',
      en: 'Train EVs by stat in dedicated zones, with caps, decay and a live pace meter.'
    },
    server: ['Fabric'],
    mc: '1.20.1',
    version: '0.8.5',
    status: 'beta',
    downloads: 4600,
    updated: '2026-10-11',
    author: 'ZHBO',
    github: 'github.com/zhbo/evtrainer',
    repo: 'https://github.com/zhbo/evtrainer',
    tags: {
      zh: ['努力值', '训练场', '平衡'],
      en: ['EV', 'Training', 'Balance']
    },
    features: [
      {
        title: { zh: '属性训练区', en: 'Stat zones' },
        text: {
          zh: '六个属性各一块区域，进入即开始计时计点。',
          en: 'Six stat zones that start tracking the moment you enter.'
        }
      },
      {
        title: { zh: '上限与衰减', en: 'Caps and decay' },
        text: {
          zh: '单属性 252、总和 510，可配每日衰减防止挂机。',
          en: '252 per stat, 510 total, with optional daily decay against AFK farming.'
        }
      },
      {
        title: { zh: '配速面板', en: 'Pace panel' },
        text: {
          zh: '实时显示每分钟获得量与预计完成时间。',
          en: 'Shows points per minute and estimated time to completion.'
        }
      }
    ],
    install: {
      zh: [
        '客户端与服务端都放入 Fabric 模组',
        '在 config/evtrainer.json 里定义训练区坐标',
        '重启后使用 /evtp <stat> 进入训练区'
      ],
      en: [
        'Install the Fabric mod on both client and server',
        'Define training zone coordinates in config/evtrainer.json',
        'Restart and use /evtp <stat> to enter a zone'
      ]
    },
    commands: [
      {
        cmd: '/evtp <stat>',
        desc: { zh: '传送到对应训练区', en: 'Teleport to a stat zone' },
        perm: 'evtrainer.use'
      },
      {
        cmd: '/ev reset',
        desc: { zh: '清空当前努力值', en: 'Reset current EVs' },
        perm: 'evtrainer.use'
      },
      {
        cmd: '/ev reload',
        desc: { zh: '重载配置', en: 'Reload configuration' },
        perm: 'evtrainer.admin'
      }
    ],
    config: `{
  "capPerStat": 252,
  "capTotal": 510,
  "pointsPerMinute": 6,
  "decayPerDay": 0,
  "zones": { "speed": [128, 64, -320] }
}`
  },
  {
    slug: 'ballforge',
    name: 'BallForge',
    gameplay: { zh: '精灵球合成', en: 'Ball Crafting' },
    tagline: {
      zh: '让精灵球回到经济循环里',
      en: 'Put Poké Balls back into the economy'
    },
    desc: {
      zh: '自定义合成表、工厂产出与限购，球种按图鉴进度解锁，避免前期通货膨胀。',
      en: 'Custom recipes, factory output and purchase limits, with ball tiers unlocked by progress.'
    },
    server: ['Paper'],
    mc: '1.20.1 – 1.21.1',
    version: '3.0.0',
    status: 'stable',
    downloads: 12800,
    updated: '2026-10-09',
    author: 'ZHBO',
    github: 'github.com/zhbo/ballforge',
    repo: 'https://github.com/zhbo/ballforge',
    tags: {
      zh: ['经济', '合成', '精灵球'],
      en: ['Economy', 'Crafting', 'Poké Ball']
    },
    features: [
      {
        title: { zh: '配方可视化', en: 'Visual recipes' },
        text: {
          zh: '游戏内 GUI 编辑合成表，保存即生效。',
          en: 'Edit recipes in an in-game GUI, applied on save.'
        }
      },
      {
        title: { zh: '进度解锁', en: 'Progress unlock' },
        text: {
          zh: '按图鉴完成度或权限解锁高级球。',
          en: 'Unlock advanced balls by dex completion or permission.'
        }
      },
      {
        title: { zh: '限购与冷却', en: 'Limits and cooldowns' },
        text: {
          zh: '每人每日上限，防止脚本刷球。',
          en: 'Per-player daily caps keep scripts from farming balls.'
        }
      }
    ],
    install: {
      zh: [
        '放入 plugins/ 并安装 Vault（可选）',
        '在 recipes.yml 定义配方或使用 GUI 编辑',
        '执行 /ballforge reload 生效'
      ],
      en: [
        'Drop into plugins/ and install Vault (optional)',
        'Define recipes in recipes.yml or use the GUI editor',
        'Run /ballforge reload to apply'
      ]
    },
    commands: [
      {
        cmd: '/ballforge',
        desc: { zh: '打开合成界面', en: 'Open the crafting GUI' },
        perm: 'ballforge.use'
      },
      {
        cmd: '/ballforge edit',
        desc: { zh: '编辑配方', en: 'Edit recipes' },
        perm: 'ballforge.admin'
      },
      {
        cmd: '/ballforge reload',
        desc: { zh: '重载配置', en: 'Reload configuration' },
        perm: 'ballforge.admin'
      }
    ],
    config: `economy: vault
daily-limit:
  poke_ball: 64
  ultra_ball: 16
unlock:
  ultra_ball: "dex>=50"`
  }
]

export function getPlugin(slug) {
  return plugins.find((p) => p.slug === slug)
}
