# API 文档 (API Documentation)

## 概述 (Overview)

这是一个基于 Cloudflare Workers 的 Markdown 转换器 API，支持将多种文件格式转换为 Markdown 格式。

This is a Cloudflare Workers-based Markdown converter API that supports converting various file formats to Markdown.

## 认证 (Authentication)

所有 API 请求都需要通过 Cookie 进行身份验证（除非未设置密码）。

All API requests require authentication via Cookie (unless no password is set).

### 登录 (Login)

**端点 (Endpoint):** `POST /auth`

**请求体 (Request Body):**
```json
{
  "password": "your-password"
}
```

**响应 (Response):**
```json
{
  "success": true
}
```

**使用方法 (Usage):**
```bash
curl -X POST https://your-domain.com/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password"}' \
  -c cookies.txt
```

### 登出 (Logout)

**端点 (Endpoint):** `POST /logout`

**响应 (Response):**
```json
{
  "success": true
}
```

## 文件转换 API (File Conversion API)

### 标准转换 (Standard Conversion)

**端点 (Endpoint):** `POST /convert`

**请求头 (Headers):**
```
Cookie: auth=your-password
Content-Type: multipart/form-data
```

**请求体 (Request Body):**
- `files`: 文件数组 (支持多个文件) / File array (supports multiple files)

**支持的文件类型 (Supported File Types):**
- PDF 文档 (`.pdf`)
- 图片文件 (`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`)
- HTML 文档 (`.html`)
- XML 文档 (`.xml`)
- Microsoft Office 文档 (`.xlsx`, `.xlsm`, `.xlsb`, `.xls`, `.et`)
- OpenDocument 文档 (`.ods`)
- CSV 文件 (`.csv`)
- Apple Numbers 文档 (`.numbers`)

**响应格式 (Response Format):**
```json
{
  "markdowns": [
    {
      "name": "example.pdf",
      "markdown": "# Converted Markdown Content"
    }
  ]
}
```

**使用示例 (Usage Example):**
```bash
curl -X POST https://your-domain.com/convert \
  -H "Cookie: auth=your-password" \
  -F "files=@document.pdf" \
  -F "files=@image.png"
```

**JavaScript 示例 (JavaScript Example):**
```javascript
const formData = new FormData();
formData.append('files', fileInput.files[0]);
formData.append('files', fileInput.files[1]);

fetch('/convert', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => {
    console.log('Conversion results:', data.markdowns);
  });
```

### Cloudflare 原始 API (Cloudflare Raw API)

**端点 (Endpoint):** `POST /cf`

返回 Cloudflare Workers AI 的原始响应格式。

Returns the raw response format from Cloudflare Workers AI.

**请求格式 (Request Format):** 与 `/convert` 相同 (Same as `/convert`)

**响应格式 (Response Format):** 
参考 [Cloudflare 官方文档](https://developers.cloudflare.com/workers-ai/markdown-conversion/#tomarkdowndocumentresult-definition)

See [Cloudflare Official Documentation](https://developers.cloudflare.com/workers-ai/markdown-conversion/#tomarkdowndocumentresult-definition)

## 错误响应 (Error Responses)

### 400 Bad Request
```json
{
  "error": "请上传文件"
}
```

### 401 Unauthorized
```json
{
  "error": "请先登录"
}
```

### 500 Internal Server Error
```json
{
  "error": "转换过程中发生错误: [error message]"
}
```

## 环境变量 (Environment Variables)

- `PASSWORD`: (可选) 访问密码 / (Optional) Access password
  - 如果未设置，将允许所有请求 / If not set, all requests are allowed
  
- `AI`: Cloudflare Workers AI 绑定 / Cloudflare Workers AI binding
  
- `ASSETS`: Cloudflare Workers Assets 绑定 / Cloudflare Workers Assets binding

## 速率限制 (Rate Limits)

请参考 [Cloudflare Workers AI 定价页面](https://developers.cloudflare.com/workers-ai/platform/pricing/)

See [Cloudflare Workers AI Pricing Page](https://developers.cloudflare.com/workers-ai/platform/pricing/)

## 最佳实践 (Best Practices)

1. **批量处理 (Batch Processing):** 可以在单个请求中上传多个文件 / You can upload multiple files in a single request

2. **错误处理 (Error Handling):** 始终检查响应状态码和错误消息 / Always check response status codes and error messages

3. **文件大小 (File Size):** 注意 Cloudflare Workers 的请求大小限制 / Be aware of Cloudflare Workers request size limits

4. **密码安全 (Password Security):** 使用强密码并通过 HTTPS 传输 / Use strong passwords and transmit via HTTPS

## 示例应用 (Example Applications)

### Python 示例 (Python Example)

```python
import requests

# 登录
session = requests.Session()
session.post('https://your-domain.com/auth', json={'password': 'your-password'})

# 转换文件
with open('document.pdf', 'rb') as f:
    files = {'files': f}
    response = session.post('https://your-domain.com/convert', files=files)
    result = response.json()
    print(result['markdowns'][0]['markdown'])
```

### Node.js 示例 (Node.js Example)

```javascript
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

async function convertFile() {
  // 登录
  const authResponse = await fetch('https://your-domain.com/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'your-password' })
  });
  
  const cookies = authResponse.headers.get('set-cookie');
  
  // 转换文件
  const formData = new FormData();
  formData.append('files', fs.createReadStream('document.pdf'));
  
  const response = await fetch('https://your-domain.com/convert', {
    method: 'POST',
    headers: { Cookie: cookies },
    body: formData
  });
  
  const result = await response.json();
  console.log(result.markdowns[0].markdown);
}

convertFile();
```

## 技术支持 (Technical Support)

如有问题，请访问 [GitHub 仓库](https://github.com/BlueSkyXN/serverless-markdown-convertor) 提交 Issue。

For issues, please visit the [GitHub Repository](https://github.com/BlueSkyXN/serverless-markdown-convertor) and submit an issue.
