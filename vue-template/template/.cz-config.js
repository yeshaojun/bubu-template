// .cz-config.js
module.exports = {
  ...require('cz-emoji'),
  types: [
    { value: 'feat', name: 'feat:     🎉 添加新特性' },
    { value: 'fix', name: 'fix:      🐛 修复 bug' },
    { value: 'docs', name: 'docs:     📚 更新文档' },
    { value: 'style', name: 'style:    💄 代码格式（不影响功能的更改）' },
    { value: 'refactor', name: 'refactor: 🔨 重构代码' },
    { value: 'perf', name: 'perf:     ⚡ 性能优化' },
    { value: 'test', name: 'test:     🚨 添加测试' },
    { value: 'chore', name: 'chore:    🔧 构建过程或辅助工具的变动' },
    { value: 'ci', name: 'ci:       🚀 持续集成相关的更改' },
  ],
  messages: {
    type: '选择提交类型:',
    scope: '选择一个 scope (可选):',
    customScope: '请输入自定义 scope:',
    subject: '简要描述（60 个字符以内）:',
    body: '详细描述（可选）：',
    footer: '关联关闭的 issue（可选）：',
    confirmCommit: '确认提交信息?',
    breakingChanges: '列出重大变更模块(可选)',
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
};
