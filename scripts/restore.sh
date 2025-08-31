#!/bin/bash

# 数据库恢复脚本
# 使用方法: ./scripts/restore.sh <backup_file.sql.gz> [development|production]

set -e

# 检查参数
if [ -z "$1" ]; then
    echo "错误: 请指定备份文件路径"
    echo "使用方法: ./scripts/restore.sh <backup_file.sql.gz> [development|production]"
    exit 1
fi

BACKUP_FILE="$1"
ENVIRONMENT=${2:-development}

# 检查备份文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    echo "错误: 备份文件不存在: $BACKUP_FILE"
    exit 1
fi

# 数据库配置
if [ "$ENVIRONMENT" = "production" ]; then
    DB_HOST="${PROD_DB_HOST:-localhost}"
    DB_PORT="${PROD_DB_PORT:-5432}"
    DB_NAME="${PROD_DB_NAME:-zhizhi_health}"
    DB_USER="${PROD_DB_USER:-postgres}"
    DB_PASSWORD="${PROD_DB_PASSWORD}"
else
    DB_HOST="${DEV_DB_HOST:-localhost}"
    DB_PORT="${DEV_DB_PORT:-5432}"
    DB_NAME="${DEV_DB_NAME:-zhizhi_health}"
    DB_USER="${DEV_DB_USER:-postgres}"
    DB_PASSWORD="${DEV_DB_PASSWORD:-postgres123}"
fi

# 设置PGPASSWORD环境变量
export PGPASSWORD="$DB_PASSWORD"

echo "开始恢复数据库..."
echo "环境: $ENVIRONMENT"
echo "数据库: $DB_NAME"
echo "备份文件: $BACKUP_FILE"

# 创建临时文件
TEMP_FILE="/tmp/restore_${DATE}.sql"

# 解压备份文件
echo "解压备份文件..."
gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"

# 创建数据库备份 (如果存在)
echo "创建当前数据库备份..."
./scripts/backup.sh "$ENVIRONMENT"

# 停止所有连接到数据库的应用程序 (可选)
# 这里可以添加停止应用的命令

# 恢复数据库
echo "恢复数据库..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$TEMP_FILE"

# 清理临时文件
rm -f "$TEMP_FILE"

# 重启应用程序 (可选)
# 这里可以添加重启应用的命令

echo "数据库恢复完成"

# 取消环境变量
unset PGPASSWORD