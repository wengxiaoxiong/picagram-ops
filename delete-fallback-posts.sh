#!/bin/bash
# 批量删除 fallback 帖子

POST_IDS=(
  cmnog7fox000704k0chxv27mu
  cmnog7fbb000504k0f7dy83t8
  cmnog7ez8000304k0c7gggxfg
  cmnog7efw000104k0vtkyyp3y
  cmnog2ttq000204l6r7f07tpe
  cmnog2mbr000104l6xsblqb94
  cmnog2eve000004l65s2cchzx
  cmnog28u3000104jl99j88e61
  cmnog2420000004jlbnymil3u
  cmno8xfje001z04l4hgai2f5v
  cmno8x5l4001s04l4obwamhcq
  cmno8wuxk001p04l4dzond3eg
  cmno8wjt2001g04l4n0fe353u
  cmno8wc2a001904l4gi3tvmi4
  cmno8w3c4001404l4nknxttqu
  cmno8vwds000v04l4e0trqwst
  cmno8vmdm000q04l4s419en5a
  cmno8vgmz000l04l4uzqaf3cz
  cmno8v961000g04l4v2iaxjr6
  cmno8uwiq000b04l4n0pqg08g
  cmno8ufu6000404l4oaygya1a
  cmno7pfoi000d04jpprym1ox1
  cmno7of6e000904jpzlwv5a6w
  cmno7of5x000804jp4va181z7
  cmno7neu7000404jp3vyoibf1
  cmnnuuixp001y04kyw6xpgpp0
  cmnnutn6n001m04ky66uiuuzz
  cmnnutn5y001l04kyizetrjmy
  cmnnusye1001h04kydg6s7lxw
  cmnnm7h1b000w04l57fsrgm5b
  cmnnm7gq3000u04l54yskrus0
  cmnnm7gef000s04l5jaqrwu4i
  cmnnk2co9000q04l5ri2qfcyj
  cmnnk2cd5000o04l54ihs0z8p
  cmnnk2c0x000m04l5uyxwe6ck
  cmnnk2bqy000k04l5bnv4w127
  cmnnk2bea000i04l5sfh2y7e5
  cmnnk2b2j000g04l5zovzu3fc
  cmnnixtmk000304l5rmid9e43
  cmnni7ukd001x04jvz2dh6a8q
  cmnni7the001u04jvr8njmf5t
  cmnni7oub001r04jv4i3o8l6o
  cmnni7mgv001o04jv93fx1b7e
  cmnni7lyq001l04jvoafahp4d
  cmnni7kwr001i04jv14dxk3u2
  cmnni7jyu001f04jvzndpwt45
  cmnni7e09001c04jvgl8r6l3j
  cmnni7blk001904jv719xhqrl
  cmnni74j5001004jvj4pwxcx5
  cmnnhz9xf000g04jvmkmpfd8m
  cmnnhyf8e000804jv5z5t3ls3
  cmnng9j8y000n04k3bdqdaibb
  cmnnf23cg001g04leg6wey5x9
  cmnnf197k000n04le75fc3m1i
  cmnjxfwsu002s04jo7hye42au
  cmn8lmq63001j04l4qkj990oq
  cmn8ljvvp001604l41z617u3y
  cmn8le4ic000i04l41te63afa
)

echo "🗑️ 开始删除 ${#POST_IDS[@]} 个 fallback 帖子..."
echo ""

SUCCESS=0
FAILED=0

for ID in "${POST_IDS[@]}"; do
  echo -n "删除 $ID... "
  if pgc post delete "$ID" --force 2>/dev/null; then
    echo "✅"
    ((SUCCESS++))
  else
    echo "❌"
    ((FAILED++))
  fi
  sleep 0.3
done

echo ""
echo "✅ 完成！成功: $SUCCESS, 失败: $FAILED"
