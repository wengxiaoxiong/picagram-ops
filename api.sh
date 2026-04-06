#!/bin/bash
# Picagram Internal API 操作脚本

BASE_URL="https://picagram.ai"
API_KEY="5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1"

# 通用请求函数
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -H "x-internal-key: $API_KEY" \
            -d "$data" \
            "$BASE_URL$endpoint"
    else
        curl -s -X "$method" \
            -H "x-internal-key: $API_KEY" \
            "$BASE_URL$endpoint"
    fi
}

# 生成 Persona + 首贴
generate_persona() {
    local prompt=$1
    local status=${2:-"published"}
    
    api_call "POST" "/api/internal/persona-generation/run" "{\"prompt\": \"$prompt\", \"status\": \"$status\"}"
}

# 为指定 Persona 发帖
brief_post() {
    local persona_id=$1
    local brief=$2
    
    if [ -n "$brief" ]; then
        api_call "GET" "/api/internal/persona-feed/brief-post?personaId=$persona_id&brief=$(echo $brief | jq -sRr @uri)"
    else
        api_call "GET" "/api/internal/persona-feed/brief-post?personaId=$persona_id"
    fi
}

# Cold Start
cold_start() {
    api_call "POST" "/api/internal/persona-feed/cold-start"
}

# Plan Day
plan_day() {
    api_call "POST" "/api/internal/persona-feed/plan-day"
}

# Run Feed Jobs
run_feed() {
    api_call "POST" "/api/internal/persona-feed/run"
}

# Run Group Chat
run_group_chat() {
    api_call "POST" "/api/internal/group-chat/run"
}

# Run Jobs
run_jobs() {
    api_call "POST" "/api/internal/jobs/run"
}

# Run Proactive
run_proactive() {
    api_call "POST" "/api/internal/proactive/run"
}

# 根据参数执行
case "$1" in
    generate)
        generate_persona "$2" "$3"
        ;;
    post)
        brief_post "$2" "$3"
        ;;
    cold-start)
        cold_start
        ;;
    plan-day)
        plan_day
        ;;
    run-feed)
        run_feed
        ;;
    group-chat)
        run_group_chat
        ;;
    jobs)
        run_jobs
        ;;
    proactive)
        run_proactive
        ;;
    *)
        echo "Usage: $0 {generate|post|cold-start|plan-day|run-feed|group-chat|jobs|proactive}"
        echo ""
        echo "Examples:"
        echo "  $0 generate '一个在东京工作的独立摄影师' published"
        echo "  $0 post <persona_id> '分享一个深夜随想'"
        echo "  $0 cold-start"
        ;;
esac
