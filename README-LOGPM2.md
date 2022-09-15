# A. Config pm2 log
1. Cài đặt PM2
``` bash 
npm install pm2@latest -g
```

2. Tạo file `ecosystem.config.js`
```json
module.exports = {
    apps: [{
        name: "<Tên app>", // Ví dụ: myapi
        script: "/opt/app/index.js", // Đường dẫn đến file JS
        exec_mode: "fork|cluster",
        instances: 1, // Chỉ định số thread khi chạy với cluster mode
        watch: ["/usr/src/app/dist"], // chỉ định thư mục sẽ theo dõi, khi thư mục có thay đổi thì app sẽ tự restart.

        log_date_format: "YYYY-MM-DD HH:mm Z",
        error_file: "/usr/src/app/logs/api-error.log", // Nếu không chỉ định thì log sẽ nằm trong thư mục $HOME/.pm2/logs/
        out_file:"/usr/src/app/logs/api-out.log" // Nếu không chỉ định thì log sẽ nằm trong thư mục $HOME/.pm2/logs/
    }]
}
```

3. Chạy app
``` bash
pm2 start /path/to/ecosystem.config.js
```

# B. Config log rotate
1. Cài đặt pm2-logrorate
``` bash
pm2 install pm2-logrotate
```

2. Command
- Thực hiện nén các rotate file 
``` bash
pm2 set pm2-logrotate:compress true
```

- Chỉ định thời điểm rotate
``` bash
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
```

- Chỉ định dung lượng tối đa mỗi file log
``` bash
pm2 set pm2-logrotate:max_size 50M
```

- Chỉ định số file log tối đa được giữ lại
``` bash
pm2 set pm2-logrotate:retain 100000
```