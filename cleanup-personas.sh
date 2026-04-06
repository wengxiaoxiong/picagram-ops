#!/bin/bash
# Picagram Persona 清理脚本
# 删除重复的、测试用的、低质量的 persona

set -e

echo "🧹 开始清理 Persona..."
echo ""

# ============================================
# 要删除的 Persona IDs (基于分析)
# ============================================

# 1. 所有 "Lane" persona (测试/重复)
LANE_PERSONAS=(
  "cmnnhx27p000004jv75oi29o6"  # nova-lane-3
  "cmnng7yum000f04k37vmftvtr"  # nova-lane-2
  "cmnng4j89000804k3hppapfyb"  # test-lane
  "cmnnf20le001b04les31cv75f"  # create-wednesday-lane (重复)
  "cmnnf1yyl001904led6edbb5q"  # create-iron-lane (重复)
  "cmnnf1xaf001704le31kvzpn8"  # create-doraemon-lane (重复)
  "cmnnf1vnu001504le2gm1jfc3"  # create-rick-lane (重复)
  "cmnnf1u0u001304leaqkiv562"  # create-sherlock-lane (重复)
  "cmnnf1scu001104leteupbace"  # create-joker-lane (重复)
  "cmnnf1qq9000z04lehc4cou6b"  # create-batman-lane (重复)
  "cmnnf1p3g000x04le47035gh7"  # create-steve-lane (重复)
  "cmnnf1nge000t04ledymetnun"  # create-donald-lane (重复)
  "cmnnf1lsf000r04leef9qkh5t"  # create-elon-lane (重复)
  "cmnnezcys000g04legeo5cxj8"  # nova-lane
  "cmnmfccpy001104k0yg2ierny"  # create-persona-lane-29
  "cmnlcsazm000j04l1isnet5ia"  # create-persona-lane-28
  "cmni50wn9001604l4qn8l9nv3"  # create-persona-lane-27
  "cmnhs5yre000004ihoh8bzwu8"  # create-persona-lane-26
  "cmnfa56ni000k04l4cgzvbs9e"  # create-persona-lane-25
  "cmnexa8oo000c04l5cnnkopjd"  # create-persona-lane-24
  "cmndupbq0000z04kz6ehhe5v7"  # create-persona-lane-23
  "cmndhuf7v000004k0mlovok0g"  # create-persona-lane-22
  "cmnd4zfnj000c04ik6ity734y"  # create-persona-lane-21
  "cmncfcr1w000l04l5u2r5057l"  # create-persona-lane-20 (draft)
  "cmnc2ht8p000404l2weh44zcr"  # create-persona-lane-19 (draft)
  "cmnbpmdqo000004l7ri31o6s2"  # create-persona-lane-18 (draft)
  "cmnbcrf9v000004lbzvw5xf6n"  # create-persona-lane-17 (draft)
  "cmnazwfvq000w04k74qajogea"  # create-persona-lane-16 (draft)
  "cmnan1hjb000004lact33drtj"  # create-persona-lane-15 (draft)
)

# 2. 重复的 Mirror persona (保留 2-3 个最有创意的)
MIRROR_PERSONAS=(
  "cmnlpnczx000004jur6vtzark"  # mirror-maven-3
  "cmnkzwt17000k04jspjg9t9xj"  # mirror-mae
  "cmnkn1x0s000c04l7d3gwvqhk"  # mirror-echo-2
  "cmnj7m1u9000c04l5pj36w5ie"  # mirror-meredith
  "cmnh2gddc000l04l1wxeoog3i"  # mirror-mika
  "cmngpldea001d04lha3kvz4wo"  # mirror-empress
  "cmngcq9rz001604i5roeakfco"  # mirror-echo
  "cmnfzvgks001604jmxbgu7kt7"  # mirror-thief-mira
)

# 3. Draft 状态的低质量 persona
DRAFT_PERSONAS=(
  "cmnfn0hac000r04i3jeulkl2u"  # the-night-archivist (draft)
)

# 4. 重复的 Echo persona
ECHO_PERSONAS=(
  "cmnhfbc3h000004jo4qgqs1i6"  # echo-the-memory-merchant-3 (重复)
)

# 合并所有要删除的
ALL_TO_DELETE=("${LANE_PERSONAS[@]}" "${MIRROR_PERSONAS[@]}" "${DRAFT_PERSONAS[@]}" "${ECHO_PERSONAS[@]}")

echo "📋 计划删除 ${#ALL_TO_DELETE[@]} 个 persona:"
echo "   - Lane persona: ${#LANE_PERSONAS[@]} 个"
echo "   - Mirror persona: ${#MIRROR_PERSONAS[@]} 个"
echo "   - Draft persona: ${#DRAFT_PERSONAS[@]} 个"
echo "   - 其他重复: ${#ECHO_PERSONAS[@]} 个"
echo ""

# 统计
DELETED=0
FAILED=0

# 删除函数
delete_persona() {
  local id=$1
  local name=$2
  echo -n "  删除 $name ($id)... "
  
  # 使用 pgc CLI 删除 (假设有 delete 命令)
  # 如果没有，使用 API 调用
  if pgc persona delete "$id" 2>/dev/null; then
    echo "✅"
    ((DELETED++))
  else
    echo "❌ 失败"
    ((FAILED++))
  fi
}

# 执行删除
echo "🗑️ 开始删除..."
for id in "${ALL_TO_DELETE[@]}"; do
  delete_persona "$id" "persona"
done

echo ""
echo "✅ 清理完成!"
echo "   成功删除: $DELETED"
echo "   失败: $FAILED"
echo ""

# 显示剩余 persona 数量
echo "📊 剩余 persona 统计:"
pgc persona list 2>/dev/null | tail -1
