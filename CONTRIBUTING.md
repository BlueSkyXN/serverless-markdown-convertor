# 贡献指南 (Contributing Guide)

感谢您对本项目的关注！我们欢迎各种形式的贡献。

Thank you for your interest in this project! We welcome contributions of all kinds.

## 开发环境设置 (Development Setup)

### 前置要求 (Prerequisites)

- Node.js 16+ 或更高版本 / Node.js 16+ or higher
- npm 或 pnpm 包管理器 / npm or pnpm package manager
- Cloudflare 账户 (用于部署) / Cloudflare account (for deployment)

### 安装步骤 (Installation Steps)

1. Fork 并克隆仓库 / Fork and clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/serverless-markdown-convertor.git
cd serverless-markdown-convertor
```

2. 安装依赖 / Install dependencies:
```bash
npm install
# 或 / or
pnpm install
```

3. 配置环境变量 / Configure environment variables:
```bash
# 创建 .dev.vars 文件 / Create .dev.vars file
echo "PASSWORD=your-dev-password" > .dev.vars
```

4. 启动开发服务器 / Start development server:
```bash
npm run dev
```

## 代码结构 (Code Structure)

```
src/
├── index.js       # 主入口，路由分发 / Main entry, routing
├── constants.js   # 常量定义 / Constants
├── auth.js        # 认证相关功能 / Authentication
├── converter.js   # 文件转换工具 / Conversion utilities
└── handlers.js    # 请求处理器 / Request handlers

public/
├── index.html     # 主页面 / Main page
└── login.html     # 登录页面 / Login page

test/
└── index.spec.js  # 测试文件 / Test file
```

## 编码规范 (Coding Standards)

### JavaScript 风格 (JavaScript Style)

- 使用 Tab 缩进 / Use tabs for indentation
- 使用单引号 / Use single quotes
- 添加分号 / Add semicolons
- 每行最多 140 字符 / Maximum 140 characters per line

配置文件: `.prettierrc` 和 `.editorconfig`

### 命名约定 (Naming Conventions)

- 函数和变量使用 camelCase / Use camelCase for functions and variables
- 常量使用 UPPER_SNAKE_CASE / Use UPPER_SNAKE_CASE for constants
- 类名使用 PascalCase / Use PascalCase for class names

### 注释规范 (Comment Standards)

- 使用 JSDoc 注释文档化公共函数 / Use JSDoc to document public functions
- 为复杂逻辑添加行内注释 / Add inline comments for complex logic
- 双语注释（中文/英文）优先 / Bilingual comments (Chinese/English) preferred

示例 (Example):
```javascript
/**
 * 验证文件类型
 * Validate file types
 * @param {File[]} files - 文件数组 / Array of files
 * @returns {Response|null} - 错误响应或 null / Error response or null
 */
export function validateFileTypes(files) {
  // 实现细节 / Implementation details
}
```

## 测试 (Testing)

### 运行测试 (Running Tests)

```bash
npm test
```

### 编写测试 (Writing Tests)

- 为新功能添加测试用例 / Add test cases for new features
- 确保现有测试通过 / Ensure existing tests pass
- 使用 Vitest 框架 / Use Vitest framework

示例 (Example):
```javascript
describe('功能描述 / Feature description', () => {
  it('应该做某事 / should do something', async () => {
    // 测试代码 / Test code
    expect(result).toBe(expected);
  });
});
```

## 提交规范 (Commit Standards)

### 提交信息格式 (Commit Message Format)

```
<type>: <description>

[optional body]

[optional footer]
```

### 类型 (Types)

- `feat`: 新功能 / New feature
- `fix`: 错误修复 / Bug fix
- `docs`: 文档变更 / Documentation changes
- `style`: 代码格式 / Code formatting
- `refactor`: 代码重构 / Code refactoring
- `test`: 测试相关 / Test related
- `chore`: 构建或工具变更 / Build or tooling changes

示例 (Examples):
```
feat: add support for DOCX files
fix: resolve authentication cookie issue
docs: update API documentation
refactor: split handlers into separate modules
```

## 提交 PR (Submitting Pull Requests)

### PR 检查清单 (PR Checklist)

- [ ] 代码遵循项目编码规范 / Code follows project coding standards
- [ ] 添加或更新了相关测试 / Added or updated relevant tests
- [ ] 所有测试通过 / All tests pass
- [ ] 更新了相关文档 / Updated relevant documentation
- [ ] PR 描述清晰说明了变更内容 / PR description clearly explains changes
- [ ] 提交信息遵循提交规范 / Commit messages follow commit standards

### PR 模板 (PR Template)

```markdown
## 变更说明 (Changes)
<!-- 描述你的变更 / Describe your changes -->

## 相关 Issue (Related Issues)
<!-- 关联的 Issue 编号 / Related issue numbers -->
Closes #123

## 测试 (Testing)
<!-- 如何测试这些变更 / How to test these changes -->

## 截图 (Screenshots)
<!-- 如果适用，添加截图 / Add screenshots if applicable -->
```

## 安全性 (Security)

### 报告安全问题 (Reporting Security Issues)

请勿在公开的 Issue 中报告安全漏洞。请通过以下方式联系维护者：

Do not report security vulnerabilities in public issues. Contact maintainers via:

- 发送邮件至维护者 / Email maintainers
- 使用 GitHub 安全顾问功能 / Use GitHub Security Advisories

### 安全最佳实践 (Security Best Practices)

- 不要在代码中硬编码密码或密钥 / Do not hardcode passwords or keys
- 使用环境变量存储敏感信息 / Use environment variables for sensitive data
- 验证所有用户输入 / Validate all user inputs
- 遵循最小权限原则 / Follow principle of least privilege

## 代码审查 (Code Review)

### 审查重点 (Review Focus)

1. **功能正确性** / Functionality correctness
2. **代码质量** / Code quality
3. **性能影响** / Performance impact
4. **安全性考虑** / Security considerations
5. **文档完整性** / Documentation completeness

### 审查流程 (Review Process)

1. 提交 PR 后自动触发 CI / CI automatically triggered after PR submission
2. 维护者进行代码审查 / Maintainers perform code review
3. 根据反馈进行修改 / Make changes based on feedback
4. 获得批准后合并 / Merge after approval

## 发布流程 (Release Process)

项目维护者负责版本发布：

Project maintainers handle version releases:

1. 更新版本号 / Update version number
2. 更新 CHANGELOG / Update CHANGELOG
3. 创建 Git tag / Create Git tag
4. 发布到 GitHub Releases / Publish to GitHub Releases

## 获取帮助 (Getting Help)

如有疑问，可以：

If you have questions:

- 查看现有文档 / Check existing documentation
- 搜索现有 Issues / Search existing issues
- 创建新的 Issue / Create a new issue
- 参与讨论 / Join discussions

## 行为准则 (Code of Conduct)

### 我们的承诺 (Our Pledge)

为了营造开放和友好的环境，我们承诺尊重所有贡献者。

To foster an open and welcoming environment, we pledge to respect all contributors.

### 我们的标准 (Our Standards)

积极行为包括 / Positive behaviors include:
- 使用友好和包容的语言 / Using welcoming and inclusive language
- 尊重不同的观点和经验 / Respecting differing viewpoints and experiences
- 优雅地接受建设性批评 / Gracefully accepting constructive criticism

不可接受的行为 / Unacceptable behaviors:
- 骚扰或侮辱性评论 / Harassment or insulting comments
- 发布他人私人信息 / Publishing others' private information
- 其他不专业的行为 / Other unprofessional conduct

## 许可证 (License)

通过贡献代码，您同意您的贡献将按照项目许可证进行许可。

By contributing, you agree that your contributions will be licensed under the project license.

---

再次感谢您的贡献！

Thank you again for your contribution!
