#!/bin/bash

# 数据库备份脚本
# 使用方法: ./scripts/backup.sh [development|production]

set -e

# 配置
ENVIRONMENT=${1:-development}
BACKUP_DIR="./database/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/zhizhi_health_${ENVIRONMENT}_${DATE}.sql"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 数据库配置 (根据环境变量或参数)
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

echo "开始备份数据库..."
echo "环境: $ENVIRONMENT"
echo "数据库: $DB_NAME"
echo "备份文件: $BACKUP_FILE"

# 执行备份
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --no-owner --no-privileges --verbose --format=custom \
    --file="$BACKUP_FILE"

# 压缩备份文件
gzip "$BACKUP_FILE"
COMPRESSED_FILE="${BACKUP_FILE}.gz"

echo "备份完成: $COMPRESSED_FILE"

# 清理旧备份 (保留最近30天)
echo "清理旧备份文件..."
find "$BACKUP_DIR" -name "zhizhi_health_${ENVIRONMENT}_*.sql.gz" -mtime +30 -delete

# 显示备份文件大小
BACKUP_SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
echo "备份文件大小: $BACKUP_SIZE"

# 验证备份文件
if gzip -t "$COMPRESSED_FILE"; then
    echo "备份文件验证成功"
else
    echo "备份文件验证失败"
    exit 1
fi

echo "备份脚本执行完成"

# 取消环境变量
unset PGPASSWORD