---
title: sails中正式环境的数据库迁移
date: 2017-07-24 22:35:30
tags: 
- sails
- orm
- jenkins
- mysqldiff
---

在我的上一篇文章 [sailsjs中的数据迁移方式] 中,在结尾处埋了一个坑.当时也说了是一个妥协方案.

今天正式按照上面的思路来说一下新的解决方案.


## 问题来源

在`sails`中,自带的`orm`系统[waterline]中会对数据的完整性进行检测.但是其中有一个缺点就是在检测的过程,可能会发生`数据丢失`的严重问题.所以官方也验证声明,一定不要在`prod环境`和`你十分在意的数据`情况下使用自动升级方式.具体原因查看文章 [sailsjs中的数据迁移方式].

## 解决方案

在 [sailsjs中的数据迁移方式] 中,想`鱼和熊掌兼得`.`鱼`就是`自动迁移`在没有专业数据库人员的情况下对数据库的操作非常方便,`熊掌`就是想在`自动升级`的过程中,保证数据库不会超时,一定保证不能丢数据.

下面就是实现步骤:

1. 在`测试环境`下,用`自动迁移`,更新数据结构
2. 把`测试环境`下的数据结构迁移到`正式环境`

## 具体操作

### mysqldiff

`数据结构的迁移`之前的时候算是孤陋寡闻,结果才有之前的妥协方案.现在有了神器`mysqldiff`.

#### 安装
```
sudo apt-get install mysql-utilities
```
#### 使用
```bash
mysqldiff --server1=root@host1 --server2=root@host2 --difftype=sql db1.table1:dbx.table3
```
结果如下:

```sql
# WARNING: Using a password on the command line interface can be insecure.
# server1 on rm-m5euj0nmzs741s611.mysql.rds.aliyuncs.com: ... connected.
# Comparing test_wacao_api.user to wacao_api.user                  [FAIL]
# Transformation for --changes-for=server2:
#

ALTER TABLE `db1`.`user`
  DROP PRIMARY KEY,
  DROP INDEX openid,
  DROP INDEX phone,
  DROP INDEX unionid,
  ADD PRIMARY KEY(`id`),
  ADD UNIQUE INDEX unionid (unionid),
  ADD UNIQUE INDEX phone (phone),
  ADD UNIQUE INDEX openid (openid);
```

#### 问题
在此期间碰到简单的问题:

1. 跳过id的自增数据值 `--skip-table-options`   
如果不添加此参数,假如测试数据20条,正式环境1条,系统会更改正式环境下的id从21开始,这个不是我们的需求,所以添加本参数
2. 顺序不同也会判定为不一样,导致需要重新修改   
   这个暂时没有找到解决方案.类似于上面的展示,判断出来的不同,其实是相同的,只是因为二者生成字段的顺序不同,导致需要进行修改.这个希望有人能教导解决办法
   
### mysqldiff的`nodejs`版本
上面第二个问题,让我十分不爽.毕竟每次都修改唯一索引的话,对我改动太大,时间也比较长.幸好搜到一个国人写的`nodejs`版本的`mysqldiff`.具体可以查看项目主页[github](https://github.com/LiveXY/mysqldiff).下面是核心代码展示,访问[代码](https://github.com/LiveXY/mysqldiff/blob/master/mysqldiff#L50)

```js
Promise.all([getTables(), getParameters(), getViews(), getDatas()]).then(allDesc).then(diff).then(function(v) {
			if (v.sqlUp && (program.diff == 'table' || !program.diff)) {
				console.log('-- Database db2 needs to update the table structure:');
				for(var k in v.sql) console.log(v.sql[k]);
			}
			if (v.procUp && (program.diff == 'procedure' || !program.diff)) {
				console.log('-- Database db2 need to update the stored procedure:');
				for(var k in v.proc) console.log(v.proc[k]);
			}
			if (v.funcUp && (program.diff == 'function' || !program.diff)) {
				console.log('-- Database db2 need to update the function:');
				for(var k in v.func) console.log(v.func[k]);
			}
			if (v.viewUp && (program.diff == 'view' || !program.diff)) {
				console.log('-- Database db2 needs to update the view:');
				for(var k in v.view) console.log(v.view[k]);
			}
			if (v.dataUp && program.diff && program.diff == 'data') {
				console.log('-- Database db2 needs to update the data:');
				for(var k in v.data) console.log(v.data[k]);
			}
			if (!v.sqlUp && !v.procUp && !v.funcUp && !v.viewUp && !v.dataUp)
				console.log('-- Is the latest, do not need to update!');
			exit();
		});
	}).catch(function(v){ });
```
使用结果如下:

```sql
-- Connecting to the database: db1 & db2 ...
-- Database db1: connection successful!
-- Database db2: connection success!
-- Getting table structure ...
-- Getting stored procedures and functions ...
-- Getting view ...
-- db1 get 18 tables!
-- db2 get 17 tables!
-- db1 & db2 merge 18 table structure!
-- db1 get 0 stored procedures and functions!
-- db2 get 0 stored procedures and functions!
-- db1 & db2 merge 0 stored procedures!
-- db1 & db2 merge 0 functions!
-- db1 get 0 views!
-- db2 get 0 views!
-- db1 & db2 merge 0 views!
-- Began to compare db1 & db2 differences ...
-- Database db2 needs to update the table structure:
CREATE TABLE `test_t` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `user` ADD COLUMN `test` varchar(200) DEFAULT NULL;
```

### 整个更新流程

通过部署过程,对数据库进行了自动迁移.那么就可以把`sails`中的`prod`环境下的迁移方式设置为`safe`

整个过程大体分为以下几步:
1. git拉取新代码
2. 进行数据库备份
3. 进行数据结构更新
4. pm2 重启

暂时使用本解决方案.如果发现问题,会及时更新.



[waterline]:(https://github.com/balderdashy/waterline)
[sailsjs中的数据迁移方式]:(https://stoneren.github.io/2017/07/21/sailsjs%E4%B8%AD%E7%9A%84%E6%95%B0%E6%8D%AE%E8%BF%81%E7%A7%BB%E6%96%B9%E5%BC%8F/)
[mysqldiff]:(https://dev.mysql.com/doc/mysql-utilities/1.5/en/mysqldiff.html)