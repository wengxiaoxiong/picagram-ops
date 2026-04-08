# Code Server 配置信息

## 访问地址
https://code.bear-agent.com

## 登录密码
VSfFhlRwx405e6ZCadbxD9y409i/9LUc4bJD2mZMCuw=

## 配置文件位置
- Code Server: /root/.config/code-server/config.yaml
- Nginx: /etc/nginx/sites-available/code-server

## 服务管理
```bash
# 重启 code-server
systemctl restart code-server

# 重启 nginx
systemctl restart nginx

# 查看状态
systemctl status code-server
systemctl status nginx
```
